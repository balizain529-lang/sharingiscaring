const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { exec, execFile } = require("child_process");
const { promisify } = require("util");
const os = require("os");

const execP = promisify(exec);
const execFileP = promisify(execFile);

const app = express();
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 3100;
const API_KEY = process.env.RENDER_API_KEY || "dev-key";
const REMOTION_PROJECT = path.resolve(__dirname, "../b-roll-remotion");
const OUTPUT_DIR = path.resolve(__dirname, "out");
const TMP_DIR = path.resolve(__dirname, "tmp");
const FFMPEG = process.env.FFMPEG_PATH || "ffmpeg";
const FFPROBE = process.env.FFPROBE_PATH || "ffprobe";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const renders = new Map();
const jobs = new Map(); // mix/trim/review jobs

[OUTPUT_DIR, TMP_DIR].forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// ─── Auth ────────────────────────────────────────────────────────────
function auth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token !== API_KEY && API_KEY !== "dev-key") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// ─── Helpers ─────────────────────────────────────────────────────────

async function downloadToTemp(url, ext = ".bin") {
  const filePath = path.join(TMP_DIR, `${crypto.randomUUID()}${ext}`);
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Download failed (${r.status}) for ${url}`);
  const buf = Buffer.from(await r.arrayBuffer());
  fs.writeFileSync(filePath, buf);
  return filePath;
}

async function runFFmpeg(args) {
  const { stdout, stderr } = await execFileP(FFMPEG, args, { maxBuffer: 50 * 1024 * 1024 });
  return { stdout, stderr };
}

async function getDuration(videoPath) {
  const { stdout } = await execFileP(FFPROBE, [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    videoPath,
  ]);
  return parseFloat(stdout.trim());
}

// ─── Health ──────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", renders: renders.size, jobs: jobs.size });
});

// ─── Render endpoint (existing) ──────────────────────────────────────
app.post("/render", auth, async (req, res) => {
  const { compositionId = "DynamicShort", inputProps, outputFormat = "mp4" } = req.body;
  if (!inputProps?.config) return res.status(400).json({ error: "Missing inputProps.config" });

  const renderId = crypto.randomUUID();
  const outputPath = path.join(OUTPUT_DIR, `${renderId}.${outputFormat}`);

  renders.set(renderId, { status: "bundling", progress: 0, compositionId, outputPath, startedAt: new Date().toISOString() });

  renderInBackground(renderId, compositionId, inputProps, outputPath).catch((err) => {
    renders.set(renderId, { ...renders.get(renderId), status: "error", error: err.message });
  });

  res.json({ renderId, statusUrl: `/status/${renderId}`, downloadUrl: `/download/${renderId}` });
});

app.get("/status/:id", (req, res) => {
  const render = renders.get(req.params.id) || jobs.get(req.params.id);
  if (!render) return res.status(404).json({ error: "Not found" });
  res.json(render);
});

app.get("/download/:id", (req, res) => {
  const render = renders.get(req.params.id) || jobs.get(req.params.id);
  if (!render) return res.status(404).json({ error: "Not found" });
  if (render.status !== "complete") return res.status(202).json({ status: render.status, message: "Not ready yet" });
  if (!fs.existsSync(render.outputPath)) return res.status(404).json({ error: "File not found" });
  res.download(render.outputPath);
});

app.get("/renders", auth, (req, res) => {
  const all = [];
  renders.forEach((v, k) => all.push({ id: k, type: "render", ...v }));
  jobs.forEach((v, k) => all.push({ id: k, ...v }));
  res.json(all);
});

// ─── Task 2: Music Mix Endpoint ──────────────────────────────────────
// POST /mix-audio { videoUrl, audioUrl, audioVolume?, ducking? }
app.post("/mix-audio", auth, async (req, res) => {
  const { videoUrl, audioUrl, audioVolume = 0.18, ducking = true } = req.body;
  if (!videoUrl || !audioUrl) return res.status(400).json({ error: "videoUrl and audioUrl required" });

  const jobId = crypto.randomUUID();
  const outputPath = path.join(OUTPUT_DIR, `${jobId}-mixed.mp4`);
  jobs.set(jobId, { type: "mix", status: "downloading", outputPath, startedAt: new Date().toISOString() });

  mixAudioInBackground(jobId, videoUrl, audioUrl, audioVolume, ducking, outputPath).catch((err) => {
    jobs.set(jobId, { ...jobs.get(jobId), status: "error", error: err.message });
  });

  res.json({ jobId, statusUrl: `/status/${jobId}`, downloadUrl: `/download/${jobId}` });
});

async function mixAudioInBackground(jobId, videoUrl, audioUrl, audioVolume, ducking, outputPath) {
  const update = (f) => jobs.set(jobId, { ...jobs.get(jobId), ...f });
  try {
    update({ status: "downloading" });
    const videoFile = await downloadToTemp(videoUrl, ".mp4");
    const audioFile = await downloadToTemp(audioUrl, ".mp3");

    update({ status: "mixing" });
    // If ducking enabled: speaker audio at 1.0, music at audioVolume, mixed
    // If ducking disabled (no speaker audio expected): just overlay music
    const filterComplex = ducking
      ? `[0:a]volume=1.0[a0];[1:a]volume=${audioVolume}[a1];[a0][a1]amix=inputs=2:duration=first:dropout_transition=0[aout]`
      : `[1:a]volume=${audioVolume}[aout]`;

    await runFFmpeg([
      "-y",
      "-i", videoFile,
      "-i", audioFile,
      "-filter_complex", filterComplex,
      "-map", "0:v",
      "-map", "[aout]",
      "-c:v", "copy",
      "-shortest",
      outputPath,
    ]);

    const stats = fs.statSync(outputPath);
    update({ status: "complete", completedAt: new Date().toISOString(), fileSizeMB: (stats.size / 1024 / 1024).toFixed(1) });

    fs.unlinkSync(videoFile);
    fs.unlinkSync(audioFile);
  } catch (err) {
    update({ status: "error", error: err.message });
    throw err;
  }
}

// ─── Task 3: Auto-Trim Endpoint ──────────────────────────────────────
// POST /trim { videoUrl, words: [{word, start, end}], options? }
// options: { fillerWords?: string[], silenceMinSec?: number, paddingSec?: number }
app.post("/trim", auth, async (req, res) => {
  const { videoUrl, words = [], options = {} } = req.body;
  if (!videoUrl) return res.status(400).json({ error: "videoUrl required" });

  const jobId = crypto.randomUUID();
  const outputPath = path.join(OUTPUT_DIR, `${jobId}-trimmed.mp4`);
  jobs.set(jobId, { type: "trim", status: "downloading", outputPath, startedAt: new Date().toISOString() });

  trimInBackground(jobId, videoUrl, words, options, outputPath).catch((err) => {
    jobs.set(jobId, { ...jobs.get(jobId), status: "error", error: err.message });
  });

  res.json({ jobId, statusUrl: `/status/${jobId}`, downloadUrl: `/download/${jobId}` });
});

async function trimInBackground(jobId, videoUrl, words, options, outputPath) {
  const update = (f) => jobs.set(jobId, { ...jobs.get(jobId), ...f });
  const FILLER_WORDS = (options.fillerWords ?? ["um", "uh", "mm", "er", "ah", "uhm", "hmm"]).map((w) => w.toLowerCase());
  const SILENCE_MIN = options.silenceMinSec ?? 1.5;
  const PADDING = options.paddingSec ?? 0.05; // small pad around cuts to avoid mid-syllable

  try {
    update({ status: "downloading" });
    const videoFile = await downloadToTemp(videoUrl, ".mp4");
    const totalDuration = await getDuration(videoFile);

    // Step 1: detect silences via ffmpeg silencedetect
    update({ status: "analyzing" });
    const { stderr } = await runFFmpeg([
      "-i", videoFile,
      "-af", `silencedetect=noise=-30dB:d=${SILENCE_MIN}`,
      "-f", "null",
      "-",
    ]).catch((e) => ({ stderr: e.stderr || "" }));

    const silenceRanges = [];
    const silenceStartRe = /silence_start: ([\d.]+)/g;
    const silenceEndRe = /silence_end: ([\d.]+)/g;
    let m, starts = [], ends = [];
    while ((m = silenceStartRe.exec(stderr)) !== null) starts.push(parseFloat(m[1]));
    while ((m = silenceEndRe.exec(stderr)) !== null) ends.push(parseFloat(m[1]));
    for (let i = 0; i < Math.min(starts.length, ends.length); i++) {
      silenceRanges.push({ start: starts[i] + PADDING, end: ends[i] - PADDING, reason: "silence" });
    }

    // Step 2: filler word ranges
    const fillerRanges = words
      .filter((w) => w.word && FILLER_WORDS.includes(w.word.toLowerCase().replace(/[.,!?]/g, "")))
      .map((w) => ({ start: Math.max(0, w.start - PADDING), end: w.end + PADDING, reason: "filler", word: w.word }));

    // Step 3: combine + sort + merge overlapping
    const removeRanges = [...silenceRanges, ...fillerRanges].sort((a, b) => a.start - b.start);
    const merged = [];
    for (const r of removeRanges) {
      const last = merged[merged.length - 1];
      if (last && r.start <= last.end + 0.1) {
        last.end = Math.max(last.end, r.end);
        last.reason = last.reason + "+" + r.reason;
      } else {
        merged.push({ ...r });
      }
    }

    // Step 4: build keep ranges (inverse)
    const keepRanges = [];
    let cursor = 0;
    for (const r of merged) {
      if (r.start > cursor) keepRanges.push({ start: cursor, end: r.start });
      cursor = r.end;
    }
    if (cursor < totalDuration) keepRanges.push({ start: cursor, end: totalDuration });

    if (keepRanges.length === 0) throw new Error("Trim would remove entire video");

    update({ status: "trimming", removeCount: merged.length, keepCount: keepRanges.length });

    // Step 5: build select filter for video + audio
    const videoSelect = keepRanges.map((r) => `between(t,${r.start},${r.end})`).join("+");
    const audioSelect = videoSelect;

    await runFFmpeg([
      "-y",
      "-i", videoFile,
      "-vf", `select='${videoSelect}',setpts=N/FRAME_RATE/TB`,
      "-af", `aselect='${audioSelect}',asetpts=N/SR/TB`,
      "-c:v", "libx264",
      "-c:a", "aac",
      "-preset", "fast",
      outputPath,
    ]);

    const finalDuration = await getDuration(outputPath);
    const stats = fs.statSync(outputPath);
    update({
      status: "complete",
      completedAt: new Date().toISOString(),
      fileSizeMB: (stats.size / 1024 / 1024).toFixed(1),
      originalSeconds: totalDuration.toFixed(2),
      finalSeconds: finalDuration.toFixed(2),
      removedSeconds: (totalDuration - finalDuration).toFixed(2),
      cutsApplied: merged.length,
    });

    fs.unlinkSync(videoFile);
  } catch (err) {
    update({ status: "error", error: err.message });
    throw err;
  }
}

// ─── Task 5: B-Roll / Transcript Match Review ────────────────────────
// POST /review-match { config, transcript, videoUrl?, words? }
// Per-scene check: does the chosen Pexels clip match what the speaker is saying?
//   - transcript: full transcript text (or Whisper segments with timestamps)
//   - words: optional Whisper word-level timestamps (more precise scene-segment slicing)
//   - videoUrl: optional — if provided, also pulls frame mid-scene for visual cross-check
// Returns per-scene match verdict + suggested better Pexels query if mismatched.
app.post("/review-match", auth, async (req, res) => {
  const { config, transcript, words, videoUrl } = req.body;
  if (!config?.scenes) return res.status(400).json({ error: "config.scenes required" });
  if (!transcript && !words) return res.status(400).json({ error: "transcript or words[] required" });
  if (!OPENROUTER_API_KEY) return res.status(503).json({ error: "OPENROUTER_API_KEY not configured" });

  const jobId = crypto.randomUUID();
  jobs.set(jobId, { type: "review-match", status: "starting", startedAt: new Date().toISOString() });

  reviewMatchInBackground(jobId, config, transcript, words, videoUrl).catch((err) => {
    jobs.set(jobId, { ...jobs.get(jobId), status: "error", error: err.message });
  });

  res.json({ jobId, statusUrl: `/status/${jobId}` });
});

/**
 * Slice transcript text for a given time window.
 * Prefers word-level timestamps if available; falls back to substring of full transcript by ratio.
 */
function transcriptForWindow(transcript, words, startSec, endSec) {
  if (Array.isArray(words) && words.length > 0) {
    return words
      .filter((w) => w.end >= startSec && w.start <= endSec)
      .map((w) => w.word)
      .join(" ")
      .trim();
  }
  if (!transcript) return "";
  // Fallback: assume transcript covers full video; slice proportionally.
  // Caller should provide totalDuration via config metadata if known.
  return transcript; // Best-effort — caller should pass words for accuracy.
}

async function reviewMatchInBackground(jobId, config, transcript, words, videoUrl) {
  const update = (f) => jobs.set(jobId, { ...jobs.get(jobId), ...f });
  try {
    const fps = config.meta?.fps ?? 30;
    const frames = [];
    let videoFile = null;

    if (videoUrl) {
      update({ status: "downloading video for frame extraction" });
      videoFile = await downloadToTemp(videoUrl, ".mp4");

      update({ status: "extracting frames" });
      for (let i = 0; i < config.scenes.length; i++) {
        const scene = config.scenes[i];
        const midSec = (scene.from + Math.floor(scene.durationInFrames / 2)) / fps;
        const framePath = path.join(TMP_DIR, `${jobId}-frame-${i}.jpg`);
        await runFFmpeg(["-y", "-ss", String(midSec), "-i", videoFile, "-vframes", "1", "-q:v", "3", framePath]);
        const buf = fs.readFileSync(framePath);
        frames[i] = { base64: buf.toString("base64"), framePath };
      }
    }

    update({ status: "building per-scene context" });
    const sceneContexts = config.scenes.map((scene, i) => {
      const startSec = scene.from / fps;
      const endSec = (scene.from + scene.durationInFrames) / fps;
      const segment = transcriptForWindow(transcript, words, startSec, endSec);
      return {
        index: i,
        type: scene.type,
        startSec: startSec.toFixed(2),
        endSec: endSec.toFixed(2),
        durationSec: ((endSec - startSec)).toFixed(2),
        spokenContent: segment,
        backgroundVideo: scene.backgroundVideo
          ? { query: scene.backgroundVideo.query, url: scene.backgroundVideo.url, opacity: scene.backgroundVideo.opacity }
          : null,
        sceneData: scene.data,
      };
    });

    update({ status: "asking claude per-scene" });

    const systemPrompt = `You review whether a Pexels stock background clip MATCHES what a speaker is saying during a specific scene of a B-roll video.

For each scene you receive:
- The speaker's spoken words during that scene's time window
- The Pexels search query that was used to find a background clip
- The scene type (e.g., "workflow-pipeline", "big-stat-reveal", "comparison-split")
- Optionally: a frame from the rendered video showing the actual visual

Your job — per scene — return a verdict on whether the background MATCHES the spoken content:
- "good" — background reinforces or complements what's being said
- "partial" — tangentially related; not wrong but not strong
- "mismatch" — background is unrelated to spoken content; should be replaced

If "partial" or "mismatch", suggest a better Pexels query (2-4 words, topical to the spoken content). The query should describe a visual concept that would reinforce the words being spoken.

Be specific and actionable. Examples of good queries: "creator filming vertical phone", "data center rack server", "stressed person at desk laptop", "growth chart graph rising", "podcast microphone close-up".

Avoid generic queries like "abstract particles" unless the speaker is talking about something abstract.

Output ONLY this JSON:
{
  "scenes": [
    {
      "sceneIndex": <n>,
      "match": "good" | "partial" | "mismatch",
      "reasoning": "<one sentence>",
      "suggestedQuery": "<2-4 word query>" | null
    }
  ],
  "overallVerdict": "<one sentence summary, e.g. 'All scenes match' or 'Scene 2 and 4 need replacement'>",
  "mismatchCount": <number>
}`;

    // Build multi-modal user message (frames per scene if videoUrl provided)
    const userContentParts = [];
    for (let i = 0; i < sceneContexts.length; i++) {
      const ctx = sceneContexts[i];
      userContentParts.push({
        type: "text",
        text: `=== Scene ${i} (${ctx.type}, ${ctx.startSec}s–${ctx.endSec}s) ===
Spoken: "${ctx.spokenContent || "(no transcript segment available)"}"
Pexels query used: "${ctx.backgroundVideo?.query || "(none — no background)"}"
Background URL: ${ctx.backgroundVideo?.url ? "populated" : "missing"}
Scene foreground content: ${JSON.stringify(ctx.sceneData).substring(0, 200)}...`,
      });
      if (frames[i]) {
        userContentParts.push({
          type: "image_url",
          image_url: { url: `data:image/jpeg;base64,${frames[i].base64}` },
        });
      }
    }

    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/balizain529-lang/sharingiscaring",
        "X-Title": "B-Roll Match Review",
      },
      body: JSON.stringify({
        model: "anthropic/claude-sonnet-4",
        max_tokens: 4000,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContentParts },
        ],
      }),
    });

    if (!r.ok) throw new Error(`OpenRouter error ${r.status}: ${await r.text()}`);
    const data = await r.json();
    const text = data.choices?.[0]?.message?.content || "";

    let critique;
    try {
      critique = JSON.parse(text);
    } catch (e) {
      const m = text.match(/\{[\s\S]*\}/);
      if (m) critique = JSON.parse(m[0]);
      else critique = { error: "Failed to parse critique", raw: text };
    }

    // Cleanup
    frames.forEach((f) => f && fs.existsSync(f.framePath) && fs.unlinkSync(f.framePath));
    if (videoFile) fs.unlinkSync(videoFile);

    update({
      status: "complete",
      completedAt: new Date().toISOString(),
      sceneCount: sceneContexts.length,
      visualReview: !!videoUrl,
      critique,
    });
  } catch (err) {
    update({ status: "error", error: err.message });
    throw err;
  }
}

// ─── /apply-match-fixes — re-fetch Pexels for mismatched scenes ──────
// POST /apply-match-fixes { config, suggestions: [{sceneIndex, suggestedQuery}] }
// Returns: updated config with new Pexels URLs for the corrected scenes.
app.post("/apply-match-fixes", auth, async (req, res) => {
  const { config, suggestions } = req.body;
  if (!config?.scenes || !Array.isArray(suggestions)) {
    return res.status(400).json({ error: "config.scenes and suggestions[] required" });
  }
  const PEXELS_KEY = process.env.PEXELS_API_KEY;
  if (!PEXELS_KEY) return res.status(503).json({ error: "PEXELS_API_KEY not configured" });

  const updated = JSON.parse(JSON.stringify(config));
  const replaced = [];

  for (const s of suggestions) {
    const scene = updated.scenes[s.sceneIndex];
    if (!scene || !s.suggestedQuery) continue;
    try {
      const r = await fetch(
        `https://api.pexels.com/videos/search?query=${encodeURIComponent(s.suggestedQuery)}&per_page=3&orientation=landscape`,
        { headers: { Authorization: PEXELS_KEY } }
      );
      if (!r.ok) continue;
      const d = await r.json();
      const v = d.videos?.[0];
      const f = v?.video_files?.find((f) => f.quality === "hd" && f.width >= 1280) || v?.video_files?.[0];
      if (f?.link) {
        scene.backgroundVideo = {
          ...(scene.backgroundVideo || {}),
          query: s.suggestedQuery,
          url: f.link,
          source: "pexels",
        };
        replaced.push({ sceneIndex: s.sceneIndex, query: s.suggestedQuery, url: f.link });
      }
    } catch (e) { /* skip on failure */ }
  }

  res.json({ config: updated, replaced, replacedCount: replaced.length });
});

// ─── Render (existing implementation) ────────────────────────────────
async function renderInBackground(renderId, compositionId, inputProps, outputPath) {
  const { bundle } = require("@remotion/bundler");
  const { renderMedia, selectComposition } = require("@remotion/renderer");
  const update = (f) => renders.set(renderId, { ...renders.get(renderId), ...f });

  try {
    update({ status: "bundling", progress: 0 });
    const bundleLocation = await bundle({
      entryPoint: path.join(REMOTION_PROJECT, "src/index.ts"),
      webpackOverride: (config) => config,
    });

    update({ status: "preparing", progress: 10 });
    const composition = await selectComposition({ serveUrl: bundleLocation, id: compositionId, inputProps });

    update({ status: "rendering", progress: 15 });
    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: outputPath,
      inputProps,
      onProgress: ({ progress }) => update({ status: "rendering", progress: Math.round(15 + progress * 85) }),
    });

    const stats = fs.statSync(outputPath);
    update({
      status: "complete",
      progress: 100,
      completedAt: new Date().toISOString(),
      fileSize: stats.size,
      fileSizeMB: (stats.size / 1024 / 1024).toFixed(1),
    });
  } catch (err) {
    update({ status: "error", error: err.message });
    throw err;
  }
}

app.listen(PORT, () => {
  console.log(`B-Roll Render Server running on port ${PORT}`);
  console.log(`  POST /render             — render Remotion composition to MP4`);
  console.log(`  POST /mix-audio          — overlay music track on video`);
  console.log(`  POST /trim               — auto-trim filler words + dead space`);
  console.log(`  POST /review-match       — per-scene check: does Pexels b-roll match transcript?`);
  console.log(`  POST /apply-match-fixes  — re-fetch Pexels for scenes Claude flagged as mismatch`);
  console.log(`  GET  /status/:id         — check job status`);
  console.log(`  GET  /download/:id       — download output`);
  console.log(`  GET  /health             — health check`);
});
