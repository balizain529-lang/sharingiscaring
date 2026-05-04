# Alternative Tools Research

**Date:** May 4, 2026
**Context:** User asked how HyperFrames + video-use compare to what we built, and what it would take to wire them into the n8n pipeline.

---

## TL;DR

| Tool | What it is | Overlaps with us | Worth integrating? |
|---|---|---|---|
| **HyperFrames** (HeyGen) | HTML → MP4 framework | Direct alternative to **Remotion** | Maybe — if you prefer HTML over React. Otherwise stick with Remotion. |
| **video-use** (browser-use) | AI-agent video editor (cuts fillers, color grades, subtitles, generates overlays) | Direct alternative/upgrade to our **`/trim` endpoint** + does color grading + subtitles we don't have | **Strong yes** — it solves the auto-edit step we haven't fully solved, AND it generates overlays via Remotion or HyperFrames (so it slots ON TOP of what we built) |

---

## HyperFrames

**Repo:** https://github.com/heygen-com/hyperframes
**License:** Apache 2.0 — fully open source, no per-render fees
**Language:** TypeScript (~97%)
**Maintainer:** HeyGen (the AI avatar company)

### What it does
HTML → MP4. You write standard HTML/CSS with special data attributes for timing/layering, the framework uses Puppeteer (headless Chrome) to capture frames and FFmpeg to encode the MP4.

### How it compares to Remotion

| | Remotion | HyperFrames |
|---|---|---|
| Markup | React components | HTML + data attributes |
| Renderer | Headless Chrome (built-in) | Puppeteer (headless Chrome) |
| Encoder | Built-in (uses FFmpeg internally) | FFmpeg |
| Studio preview | `npx remotion studio` | Browser-based studio editor |
| Embeddable player | Yes | Yes |
| AI-agent integration | Manual | First-class — ships with Claude Code / Cursor / Gemini CLI skills |
| License | Free for individuals/small teams; commercial license for >$1M revenue | Apache 2.0 — commercial use at any scale, no fee |
| Ecosystem | Larger (more components, examples, recipes) | Newer (released 2025) |

### When to consider switching
- If your team prefers HTML/CSS over React for video templates
- If you anticipate hitting Remotion's commercial license threshold
- If you want first-class agent-driven authoring (this is HeyGen's bet)

### When to stay on Remotion
- You already have 21 compositions + 10 parameterized scene components built. Migration cost is real.
- Your team writes React anyway (TrueHorizon does)
- Remotion's ecosystem is bigger right now

### n8n integration path
**Same pattern as our Remotion render server.** HyperFrames is self-hosted only — no managed API. You'd:
1. Build a thin HTTP wrapper around HyperFrames CLI (similar to what we did at `render-server/index.js`)
2. Endpoint: `POST /render` accepts HTML content + assets, returns MP4
3. n8n calls it via HTTP node, polls status, downloads MP4
4. Effort: ~half day to build the wrapper + Dockerfile

**Effort to switch entirely:** ~3-5 days to port our 10 scene components to HTML templates, retest the YT scraper composition, redeploy. Probably not worth it given Remotion is working.

---

## video-use

**Repo:** https://github.com/browser-use/video-use
**License:** Open source (Apache or MIT — confirm in repo)
**Language:** Python (~76%) + HTML (~23%) + Shell
**Maintainer:** browser-use (the team behind Browser Use, an AI agent for browsers)

### What it does
**This is essentially what we've been trying to build for the auto-edit step.** AI-agent driven video editor that:
- Cuts filler words ("umm", "uh", false starts) — does what our `/trim` endpoint aims at
- Removes dead space between takes
- Applies color grading
- Adds audio fades at every edit point
- Burns customizable subtitles
- **Generates animation overlays via HyperFrames, Remotion, Manim, or PIL** — so it slots ON TOP of our Remotion stack
- Self-evaluates rendered output before delivery

### How it works (architecturally clever)
- **Reads transcripts, not video frames.** Uses ElevenLabs Scribe for word-level timestamps + speaker identification.
- Generates visual composites on-demand based on what the speaker is saying.
- This avoids the token cost of frame-dumping (which is what naive "send video to Claude" approaches do).

### Why this matters for us
- It uses **ElevenLabs Scribe** — exactly the tool from our aspirational tech stack we hadn't wired up yet
- It **calls Remotion** as one of its overlay backends — meaning our existing Remotion compositions would still be used
- Its filler-word cutting is what we built `/trim` for — but this version is more mature (color grade + fades + subtitles in one shot)

### How it compares to what we built

| Capability | Our pipeline | video-use |
|---|---|---|
| Word-level transcription | Groq Whisper | ElevenLabs Scribe (more accurate) |
| Filler word trim | `/trim` endpoint (FFmpeg, basic) | Built-in, more polished |
| Dead space cutting | Yes | Yes |
| Color grading | No | Yes |
| Audio fades on cuts | No | Yes |
| Subtitle burning | No | Yes |
| B-roll generation | Remotion via Claude → JSON config | Calls Remotion / HyperFrames / Manim / PIL |
| Self-evaluation | `/review-match` (we built it) | Has its own |
| Workflow trigger | Drop into Drive → n8n | Drop into folder → chat with agent |

**video-use is more end-to-end than our pipeline for the editing layer.** Our piece is stronger on n8n orchestration + Pexels enrichment + scene config schema. They're complementary.

### n8n integration path

This is harder than HyperFrames because video-use is **agent-driven**, not API-driven. Three options:

**Option 1: Wrap as HTTP service (1-2 days)**
- Build an Express server inside the video-use repo that exposes a single endpoint: `POST /edit { videoUrl, instructions }`
- Internally invokes the Claude Code / Codex / Hermes agent CLI with the video and prompt
- n8n calls this endpoint, polls for completion, downloads `final.mp4`

**Option 2: Cron + folder watcher (simplest, no code)**
- Run video-use on a schedule (every N minutes)
- It already watches a folder and processes whatever's dropped in
- n8n's Drive watcher already drops MP4 to a folder; just point video-use at the same folder
- Two systems coexisting, lightly coupled

**Option 3: Replace n8n's `/trim` step with a video-use call**
- Adapt video-use into a self-contained CLI you can SSH-invoke from n8n via SSH node
- Or expose just the trim/cut module as a service (the rest of video-use does color/subtitle/etc. which is bonus)

### Strong recommendation
Try Option 1 (HTTP wrapper) since it gives n8n a clean integration. Test on the YT scraper video — drop the talking head into video-use, see what comes out. If the auto-trim quality beats our `/trim` endpoint, swap the pipeline step.

---

## Similar GitHub Projects Worth Knowing

These are alternatives or complements to what we built:

### Programmatic video frameworks (alternatives to Remotion)
- [`HyperFrames`](https://github.com/heygen-com/hyperframes) — covered above
- [`Motion Canvas`](https://github.com/motion-canvas/motion-canvas) — TypeScript animation framework, code-driven, more for technical/educational content
- [`Manim`](https://github.com/3b1b/manim) — Python, math/educational animations, made famous by 3Blue1Brown
- [`Editly`](https://github.com/mifi/editly) — Node.js video composition by JSON config, FFmpeg-based, simpler than Remotion

### Auto-editing / filler removal (alternatives to our `/trim`)
- [`auto-editor`](https://github.com/WyattBlue/auto-editor) — Python CLI, well-established, cuts silence/repeated takes. No subtitles/color grading.
- [`video-use`](https://github.com/browser-use/video-use) — covered above
- [`MoviePy`](https://github.com/Zulko/moviepy) — Python video editing library, lower-level building block

### Word-level transcription (alternatives to Groq Whisper)
- [`whisper-timestamped`](https://github.com/linto-ai/whisper-timestamped) — Whisper fork with word-level timestamps, self-hosted
- [`faster-whisper`](https://github.com/SYSTRAN/faster-whisper) — CTranslate2 reimplementation, much faster than OpenAI Whisper
- [`WhisperX`](https://github.com/m-bain/whisperX) — Whisper + word alignment + speaker diarization
- ElevenLabs Scribe (used by video-use) — paid service, very accurate

### Stock asset APIs (we already use)
- Pexels — used
- Pixabay — used
- Brandfetch — used
- Iconify — used
- [`mediastock`](https://github.com/mediastock-api/mediastock) — wrapper for multiple stock APIs

### AI video generation (we explicitly skipped, per user direction)
- Replicate (Hailuo, Kling, etc.) — pay-per-clip
- Runway Gen-3 — pay-per-clip
- Pika Labs — pay-per-clip
- HeyGen avatars — paid
- Sora (OpenAI) — paid

---

## What I'd Build Next (if pursuing this thread)

**Highest-value experiment for your use case:**
1. Stand up `video-use` as a service alongside the render server on the dedicated host (1-2 days)
2. Replace the current `/trim` endpoint call in the n8n flow with a video-use call
3. video-use will produce a more polished MP4: filler-cut + color graded + subtitles burned
4. Then our existing Remotion pipeline (Pexels enrichment + scene generation + render) layers graphics on top of that

**Result:** the n8n flow becomes:
```
Drop MP4 → Whisper transcribe → Claude scene config → Pexels enrich → Match review →
video-use auto-edit (filler cut + color + subtitles) →
Remotion render (overlay graphics) → final MP4 → ClickUp
```

Cost stays similar (~$0.10/video) since video-use uses ElevenLabs (paid, but we already considered it). Output quality jumps significantly.

**Lowest-risk experiment:**
Just install video-use locally, run it manually on the YT scraper raw footage (before our pipeline), see what the output quality looks like. If it's noticeably better than our manual editing in Descript, then commit to the deeper integration.
