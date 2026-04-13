const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const app = express();
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 3100;
const API_KEY = process.env.RENDER_API_KEY || "dev-key";
const REMOTION_PROJECT = path.resolve(__dirname, "../b-roll-remotion");
const OUTPUT_DIR = path.resolve(__dirname, "out");

// In-memory render status tracking
const renders = new Map();

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Auth middleware
function auth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token !== API_KEY && API_KEY !== "dev-key") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", renders: renders.size });
});

// Trigger a render
app.post("/render", auth, async (req, res) => {
  const { compositionId = "DynamicShort", inputProps, outputFormat = "mp4" } = req.body;

  if (!inputProps?.config) {
    return res.status(400).json({ error: "Missing inputProps.config" });
  }

  const renderId = crypto.randomUUID();
  const outputPath = path.join(OUTPUT_DIR, `${renderId}.${outputFormat}`);

  renders.set(renderId, {
    status: "bundling",
    progress: 0,
    compositionId,
    outputPath,
    startedAt: new Date().toISOString(),
  });

  // Start render in background
  renderInBackground(renderId, compositionId, inputProps, outputPath).catch((err) => {
    renders.set(renderId, {
      ...renders.get(renderId),
      status: "error",
      error: err.message,
    });
  });

  res.json({
    renderId,
    statusUrl: `/status/${renderId}`,
    downloadUrl: `/download/${renderId}`,
  });
});

// Check render status
app.get("/status/:id", (req, res) => {
  const render = renders.get(req.params.id);
  if (!render) return res.status(404).json({ error: "Render not found" });
  res.json(render);
});

// Download rendered file
app.get("/download/:id", (req, res) => {
  const render = renders.get(req.params.id);
  if (!render) return res.status(404).json({ error: "Render not found" });
  if (render.status !== "complete") return res.status(202).json({ status: render.status, message: "Not ready yet" });
  if (!fs.existsSync(render.outputPath)) return res.status(404).json({ error: "File not found" });
  res.download(render.outputPath);
});

// List all renders
app.get("/renders", auth, (req, res) => {
  const all = [];
  renders.forEach((v, k) => all.push({ id: k, ...v }));
  res.json(all);
});

async function renderInBackground(renderId, compositionId, inputProps, outputPath) {
  // Lazy-load Remotion to avoid startup cost
  const { bundle } = require("@remotion/bundler");
  const { renderMedia, selectComposition } = require("@remotion/renderer");

  // Update status
  const update = (fields) => renders.set(renderId, { ...renders.get(renderId), ...fields });

  try {
    // Step 1: Bundle
    update({ status: "bundling", progress: 0 });
    const bundleLocation = await bundle({
      entryPoint: path.join(REMOTION_PROJECT, "src/index.ts"),
      webpackOverride: (config) => config,
    });

    // Step 2: Select composition
    update({ status: "preparing", progress: 10 });
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: compositionId,
      inputProps,
    });

    // Step 3: Render
    update({ status: "rendering", progress: 15 });
    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: outputPath,
      inputProps,
      onProgress: ({ progress }) => {
        update({ status: "rendering", progress: Math.round(15 + progress * 85) });
      },
    });

    // Step 4: Complete
    const stats = fs.statSync(outputPath);
    update({
      status: "complete",
      progress: 100,
      completedAt: new Date().toISOString(),
      fileSize: stats.size,
      fileSizeMB: (stats.size / 1024 / 1024).toFixed(1),
    });

    console.log(`Render ${renderId} complete: ${outputPath} (${(stats.size / 1024 / 1024).toFixed(1)} MB)`);
  } catch (err) {
    update({ status: "error", error: err.message });
    console.error(`Render ${renderId} failed:`, err.message);
    throw err;
  }
}

app.listen(PORT, () => {
  console.log(`B-Roll Render Server running on port ${PORT}`);
  console.log(`  POST /render     — trigger a render`);
  console.log(`  GET  /status/:id — check render status`);
  console.log(`  GET  /download/:id — download rendered MP4`);
  console.log(`  GET  /health     — health check`);
});
