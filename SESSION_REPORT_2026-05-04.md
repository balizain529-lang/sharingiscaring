# Session Report — DynamicOverlay + Match Review + Final Draft
### May 4, 2026

---

## Goal

Two parallel threads:
1. Build the **review step that checks Pexels b-roll matches what speaker is saying** (text + visual cross-check)
2. Build a **non-cutaway pattern** so the speaker stays visible the entire video — and produce a polished final cut as a recording demo asset

Plus six explicit revision passes from the user across the day (caption position, layouts, stats, scene durations, Pexels backgrounds).

---

## What Was Built

### 1. Render server — 4 new endpoints

[`render-server/index.js`](render-server/index.js) gained:
- **`POST /mix-audio`** — FFmpeg overlay of music track on rendered MP4 with configurable ducking
- **`POST /trim`** — auto-cut filler words + silence using Whisper word timestamps + FFmpeg silencedetect → select+aselect filters
- **`POST /review-match`** — per-scene check: slices transcript by frame range, sends to Claude (multimodal if videoUrl provided) for verdict (good/partial/mismatch) + suggested better Pexels query
- **`POST /apply-match-fixes`** — re-fetches Pexels with Claude's suggested queries, returns updated config

Dockerfile updated to install `ffmpeg`.

### 2. DynamicOverlay composition + 3 overlay components

The big "speaker stays visible" pattern. Speaker plays full-screen the entire runtime; graphics overlay in zones that don't cover the face.

| Component | Zone |
|---|---|
| [`LowerThirdOverlay`](b-roll-remotion/src/components/overlays/LowerThirdOverlay.tsx) | bottom 28%, full width — for person-scorecard, cta-comment, logo-endorsement, workflow-pipeline (compact strip) |
| [`HeroStatOverlay`](b-roll-remotion/src/components/overlays/HeroStatOverlay.tsx) | top-right corner, ~30% — for big-stat-reveal, kpi-dashboard |
| [`CaptionOverlay`](b-roll-remotion/src/components/overlays/CaptionOverlay.tsx) | center or left, top band — for comparison-split, big-stat-reveal alt |

Schema: added `scene.layout?: "lower-third" | "hero-stat-corner" | "caption-center" | "caption-left" | "fullscreen-cutaway"`. The fullscreen-cutaway option is the escape hatch — covers the speaker for a single scene when the diagram itself needs to be the focus.

### 3. n8n drive-watcher v6 — with match-review

[`n8n-workflows/drive-watcher-v6-with-match-review.json`](n8n-workflows/drive-watcher-v6-with-match-review.json) — 23 nodes. Adds 3 nodes between Pexels enrichment and render trigger:
1. Review Pexels Match (calls `/review-match`)
2. Poll Review Status (3-min wait loop)
3. Apply Match Fixes (calls `/apply-match-fixes` when mismatchCount > 0)

Whisper now requests word-level timestamps so the review-match endpoint can slice transcript by exact frame range.

ClickUp task includes match verdict + fix count.

### 4. JonPierpointVerticalV2 — vertical reference build

Walt Charles content adapted to DynamicCutaway with new defaults (Pexels backgrounds + Iconify icons + node-graph icons). Verifies the system works at 1080×1920.

Output: [`out/jon-pierpoint-vertical-v2.mp4`](b-roll-remotion/out/jon-pierpoint-vertical-v2.mp4) (46 MB vs. original `jon-pierpoint-r1.mp4` at 22 MB — confirmation Pexels backgrounds render).

### 5. YtScraperOverlay — the demo asset (final cut)

Built through 6 iterations over the session. Final version: **`out/yt-scraper-overlay-v6.mp4`** (105 MB, 89s, 1920×1080).

| Time | Scene | Layout | Notes |
|---|---|---|---|
| 0-7s | Speaker open | — | Milan name lower-third |
| 7-13s | Creator Trap | fullscreen-cutaway | Clock face Pexels bg |
| 13-24s | Speaker | — | |
| 24-30s | 4hr → 30min | caption-left | Card on left, speaker on right |
| 30-40s | Speaker | — | |
| 40-50s | Viral Outlier Pipeline | fullscreen-cutaway | Editor's workstation Pexels bg |
| 50-62s | Speaker | — | |
| 62-70s | 5K+ stat | hero-stat-corner | Topical YT scraping stat |
| 70-89s | Speaker close | — | |

Speaker visible ~59s of 89s runtime.

### 6. Bug fixes

- **WorkflowPipeline accentWord rendering**: previously rendered accentWord first then the rest of text — broke word order for any title where accent isn't the first word. Fixed with regex-based split (before / matched / after).
- **BigStatReveal autoSuffix**: providing `suffix: "+"` overrode the auto "K" abbreviation, rendering "5+" instead of "5K+". Fixed by using explicit `suffix: "K+"` in config.
- **Caption position**: initial `top: 20%` overlapped speaker's head at horizontal aspect. Fixed to `top: 4%` (center) and `top: 12%` (left variant).

### 7. Motion-presets refactor (already from earlier session, applied)

`BigStatReveal`, `KpiDashboard`, `WorkflowPipeline`, `ComparisonSplit` import `MOTION` constants from `data/motion-presets.ts`. `Math.sin` patterns and cubic ease-out centralized.

---

## Files Changed

### Code (10 files)
- `b-roll-remotion/src/data/schema.ts` — added `layout` field with 5 enum options
- `b-roll-remotion/src/data/motion-presets.ts` — used by refactored scenes
- `b-roll-remotion/src/components/scenes/WorkflowPipeline.tsx` — accentWord positioning fix + motion-presets
- `b-roll-remotion/src/components/scenes/BigStatReveal.tsx` — motion-presets
- `b-roll-remotion/src/components/scenes/KpiDashboard.tsx` — motion-presets
- `b-roll-remotion/src/components/scenes/ComparisonSplit.tsx` — motion-presets
- `b-roll-remotion/src/components/overlays/LowerThirdOverlay.tsx` — NEW
- `b-roll-remotion/src/components/overlays/HeroStatOverlay.tsx` — NEW
- `b-roll-remotion/src/components/overlays/CaptionOverlay.tsx` — NEW (with center/left variants)
- `b-roll-remotion/src/compositions/dynamic/DynamicOverlay.tsx` — NEW
- `b-roll-remotion/src/Root.tsx` — registered `YtScraperOverlay`, `JonPierpointVerticalV2`

### Render server (2 files)
- `render-server/index.js` — added `/mix-audio`, `/trim`, `/review-match`, `/apply-match-fixes`
- `render-server/Dockerfile` — added ffmpeg

### n8n workflows (1 new)
- `n8n-workflows/drive-watcher-v6-with-match-review.json` — full pipeline with QA loop

### Docs (3 files)
- `LEARNINGS.md` — appended 2026-05-04 session entry covering DynamicOverlay pattern, caption positioning rule, file-size explanation
- Memory: `project_overlay_pattern.md` (when to use Cutaway vs Overlay vs Short)
- `SESSION_REPORT_2026-05-04.md` — this file

### Renders
- `out/yt-scraper-overlay.mp4` — first overlay attempt
- `out/yt-scraper-overlay-v2.mp4` — caption position fix
- `out/yt-scraper-overlay-v3.mp4` — pipeline as fullscreen-cutaway
- `out/yt-scraper-overlay-v4.mp4` — title order + 5K+ fix
- `out/yt-scraper-overlay-v5.mp4` — clock cutaway / caption-left / editor workstation bg
- **`out/yt-scraper-overlay-v6.mp4`** — final, with -2s on each cutaway
- `out/jon-pierpoint-vertical-v2.mp4` — vertical reference build

---

## Three Composition Patterns (the team now has)

| Pattern | Use case |
|---|---|
| **`DynamicOverlay`** | Viral / creator content. Speaker visible 100%. Graphics overlay in zones. |
| **`DynamicCutaway`** | B2B technical content. Bold full-screen graphics with Pexels backgrounds. Speaker covered during cutaways. |
| **`DynamicShort`** | Split-screen vertical. Talking head top, B-roll graphics bottom. Original pattern. |

All three drive from the same scene config schema. Per-scene `layout` field overrides defaults in `DynamicOverlay`. The same n8n pipeline + Pexels match-review work for all three.

---

## What's Still Pending

### Critical (blocks full automation, both with admin)
1. Render server deployment to dedicated host
2. Groq + Brandfetch + Pexels + Pixabay API keys configured on company n8n
3. `RENDER_API_URL` + `RENDER_API_KEY` set after deploy

### High value (after critical pieces)
4. Music auto-mix in pipeline — `/mix-audio` endpoint exists, just needs music source (Pixabay Music with API key, or pre-stored bank in render server)
5. Auto-trim integration in pipeline — `/trim` endpoint exists, needs to be added as a step in the n8n flow
6. Visual cross-check post-render — `/review-match` already supports videoUrl; add a second call after MP4 is rendered

### Nice-to-have
7. ElevenLabs swap (better word-level transcription accuracy) — currently Groq Whisper is fine
8. HyperFrames evaluation (alternative motion graphics tool) — see analysis in next session
9. Browser-use/video-use evaluation — see analysis

---

## GitHub State

- Latest commit: `58c0ece` — "Tighten cutaway durations"
- 26 commits in the May 4 session
- Repo: https://github.com/balizain529-lang/sharingiscaring

---

## Cost Per Video (current architecture)

| Step | Tool | Cost |
|---|---|---|
| Transcription | Groq Whisper | ~$0.004/min |
| Scene generation | OpenRouter Claude | ~$0.03 |
| **Match review (NEW)** | **OpenRouter Claude (vision)** | **~$0.05** |
| Brandfetch / Pexels / Pixabay / Iconify | All free | $0 |
| Rendering | Self-hosted | $0 |
| **Total per video** | | **~$0.09** |

Up from $0.04 baseline (added the vision review step). Still well under $0.10/video. Open source / free tools doing 95% of the work.

---

## To Brief Claude in Next Session

> "Read SESSION_REPORT_2026-05-04.md in my B_Roll project — pick up from there.
> Final demo asset is `out/yt-scraper-overlay-v6.mp4`. Three composition patterns now exist (DynamicOverlay / DynamicCutaway / DynamicShort). Render server has /mix-audio, /trim, /review-match, /apply-match-fixes. Critical blocker: render server still needs to be deployed."
