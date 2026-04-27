# Session Report — Production Defaults + Pexels Backgrounds
### April 26, 2026

---

## Goal

Two things drove this session:
1. **Adapt the n8n workflows** for the new dedicated company host (OpenRouter for Claude, Groq for Whisper, render server polling).
2. **Fix the "low production quality" of Remotion output** by adding real Pexels stock backgrounds behind every scene.

---

## What Was Built

### 1. n8n Workflow v4 — Production (full end-to-end pipeline)

**File:** [`n8n-workflows/drive-watcher-v4-production.json`](n8n-workflows/drive-watcher-v4-production.json) — 20 nodes

**Flow:** Drop MP4 → Groq Whisper → OpenRouter Claude → Brandfetch logos → Pexels stock → Save config to Drive → Trigger render server → Poll until complete → Download MP4 → Upload MP4 to Drive → Create ClickUp task

**Key changes from v3:**
- Anthropic API → **OpenRouter** (`https://openrouter.ai/api/v1/chat/completions`, model `anthropic/claude-sonnet-4`, system prompt moves into messages array)
- OpenAI Whisper → **Groq Whisper** (`https://api.groq.com/openai/v1/audio/transcriptions`, model `whisper-large-v3-turbo`)
- Added render server steps: trigger render → poll status → download MP4 → upload to Drive

### 2. n8n Workflow v3 — Form Intake (OpenRouter)

**File:** [`n8n-workflows/form-intake-v3-openrouter.json`](n8n-workflows/form-intake-v3-openrouter.json) — 7 nodes

Updated the manual form intake to use OpenRouter instead of direct Anthropic. Backup workflow for one-off scene JSON generation without video upload.

### 3. v5 Clean — Import-Fix for n8n UI

**File:** [`n8n-workflows/drive-watcher-v5-clean.json`](n8n-workflows/drive-watcher-v5-clean.json)

The v4 wouldn't import via n8n UI ("Could not find property option" error). Root cause: Switch node v3 schema mismatch + Merge v3 `combinationMode` rename. Fix: replaced Switch with IF v2.2 (binary branching), downgraded Merge to v2.1 with `mode: "append"`. This is the version to import to the company host.

### 4. Pexels Backgrounds — The Big Production-Quality Fix

**The bug:** v3 render added `backgroundVideo` URLs in the config. DynamicCutaway rendered the OffthreadVideo at z-index 0. But every scene component had `background: BG` (`#0B1222`) on its root `<div>` — the solid fill covered the Pexels video underneath. v3 was 75 MB (same as v2 with no backgrounds) — confirmation the videos were rendered but invisible.

**The fix (across 11 files):**
- Removed `background: BG` from all 10 scene components (`PersonScorecard.tsx`, `BigStatReveal.tsx`, `KpiDashboard.tsx`, `WorkflowPipeline.tsx`, `DataTable.tsx`, `NodeGraph.tsx`, `TimelineSteps.tsx`, `ComparisonSplit.tsx`, `LogoEndorsement.tsx`, `CtaComment.tsx`)
- Updated [`DynamicCutaway.tsx`](b-roll-remotion/src/compositions/dynamic/DynamicCutaway.tsx) to provide the base layer:
  - Layer 0: solid `#0B1222` (always — covers speaker)
  - Layer 1: Pexels video at `bgOpacity` (default 0.22)
  - Layer 2: scene foreground graphics on transparent root
- Bumped default `bgOpacity` from 0.15 → 0.25 for visibility

**Result:** v4 jumped to **107 MB** (vs v3's 75 MB). Real footage visible behind every cutaway. User confirmed: "this is fantastic. Exactly what I'd want to use as a default for B-roll."

### 5. Production Defaults Baked into All Templates

So every future render gets backgrounds + icons by default:

- **3 prompt files** (`prompts/*.txt`) — now require `backgroundVideo.query` on every scene + include curated Pexels query banks per scene type
- **10 scene template MDs** (`templates/*.md`) — each has a "Background Video (REQUIRED)" section with suggested queries
- **3 content type blueprints** (`templates/content-types/*.md`) — call out backgrounds + Iconify icons + Brandfetch as standard production defaults

### 6. LEARNINGS.md — Transparent-Scene Rule

Added a 2026-04-26 session entry capturing the lesson:
- **Rule for future scene components:** root containers MUST be transparent. Composition (DynamicCutaway / DynamicShort) provides the background layer. This lets `backgroundVideo` work for any scene type without per-component refactoring.

### 7. YT Scraper Intro — Iconify Icons + Hero Stat

Updated the [`YtScraperIntro` config in `Root.tsx`](b-roll-remotion/src/Root.tsx#L188):
- Added Iconify icons to all 6 workflow-pipeline nodes (`mdi:youtube`, `mdi:filter-variant`, `mdi:web-box`, `mdi:script-text-outline`, `mdi:brain`, `mdi:trophy-variant`)
- Replaced final scene's `kpi-dashboard` (multi-card "dashboard-y") with `big-stat-reveal` (single hero "99%") per LEARNINGS.md guidance
- Added `backgroundVideo` to all 4 cutaway scenes with real Pexels URLs

---

## Files Changed

### Code (13 files)
- `b-roll-remotion/src/Root.tsx` — YtScraperIntro config updated with icons + bg + hero stat
- `b-roll-remotion/src/compositions/dynamic/DynamicCutaway.tsx` — base layer + video layer + scene graphics
- All 10 `b-roll-remotion/src/components/scenes/*.tsx` — removed solid bg from root

### n8n Workflows (3 new files)
- `n8n-workflows/drive-watcher-v4-production.json` — full pipeline with render server polling
- `n8n-workflows/drive-watcher-v5-clean.json` — UI-import-friendly version (IF instead of Switch)
- `n8n-workflows/form-intake-v3-openrouter.json` — manual form intake with OpenRouter

### Documentation (17 files)
- All 10 `templates/*.md` — Background Video section + suggested queries
- All 3 `templates/content-types/*.md` — Production Defaults callout
- All 3 `prompts/*.txt` — required backgroundVideo + per-scene-type query banks
- `LEARNINGS.md` — 2026-04-26 session entry

### Renders (3 new files in `b-roll-remotion/out/`)
- `yt-scraper-intro-v2.mp4` (75 MB) — icons + hero stat, no backgrounds
- `yt-scraper-intro-v3.mp4` (75 MB) — buggy: backgrounds rendered but invisible (covered by scene bg)
- `yt-scraper-intro-v4.mp4` (107 MB) — fixed: real Pexels footage visible behind all scenes

---

## Verification

- All 19 Remotion compositions bundle successfully
- TypeScript compiles cleanly (only pre-existing moduleResolution deprecation)
- v4 render confirmed visually correct: backgrounds, icons, hero stat all visible

---

## What's NOT Done — For Next Session

### Critical (blocks full automation)
1. **Render server deployment** — code at `render-server/` is ready (Express + Dockerfile). Pending admin/Tyler decision on hosting (the dedicated company host has spare capacity per admin's note).
2. **Groq API key** — pending admin add to n8n Cloud variables on the new host.
3. **Brandfetch + Pexels API keys** — pending admin add. Once added, n8n auto-fills `imageUrl` (logos) and `backgroundVideo.url` (stock footage) instead of requiring local URLs.
4. **`RENDER_API_URL` + `RENDER_API_KEY`** — set after render server deploys.

### High value (after critical pieces)
5. **Test the v5 workflow on the company n8n host** — once credentials are in, do a real end-to-end run with a transcript drop.
6. **Apply the same Pexels + Iconify treatment to the Jon Pierpoint vertical reference** — confirm the pattern works at vertical 1080×1920 too.
7. **Add music** — find a CC0 source the render server can hotlink, OR have the render server allow uploading a track per render. FFmpeg one-liner already documented in last session.

### Nice-to-have
8. Vision API self-review pass (~$0.05/video) — render → Claude reviews sample frames → flags issues → optional re-render with adjusted config.
9. Refactor scene components to use `motion-presets.ts` (mechanical, no behavior change).
10. Run more scene types through the new pipeline to validate Iconify icons render correctly across `node-graph` (we tested workflow-pipeline; node-graph not yet visually verified).

---

## Quick Pickup for Next Session

```bash
# See all 4 versions side-by-side
cd "c:\Users\zainb\Downloads\Work_Projects\TH_Video_Production\B_Roll\b-roll-remotion\out"
explorer .

# Re-render YtScraperIntro after any tweaks
cd ..
npx remotion render YtScraperIntro out/yt-scraper-intro-v5.mp4

# Check current Remotion compositions
npx remotion compositions

# Pull latest changes if you've worked from another machine
cd "c:\Users\zainb\Downloads\Work_Projects\TH_Video_Production\B_Roll"
git pull
```

**To brief Claude in a new session:**
> "Read SESSION_REPORT_2026-04-26.md in my B_Roll project — pick up from there. The big news: Pexels backgrounds are now baked into all templates as default, the YT Scraper render at v4 looks like real production quality. Critical pending: render server deployment + Groq/Brandfetch/Pexels keys on company n8n host."

---

## Memory Updates

Save these for future sessions:
- **Default style for B-roll output:** Pexels stock at 0.18-0.25 opacity behind every scene. User explicitly confirmed this as the production default.
- **Architectural rule:** scene components must have transparent root containers. The composition wrapper provides the base layer.
- **The "dashboard-y" trap:** for short-form, prefer `big-stat-reveal` (single hero) over `kpi-dashboard` (multi-card grid). Multi-card panels read corporate.

---

## Cost Per Video (current state)

| Step | Tool | Cost |
|---|---|---|
| Transcription | Groq Whisper | ~$0.004/min |
| Scene generation | OpenRouter Claude | ~$0.03 |
| Brandfetch / Pexels / Iconify | All free | $0 |
| Rendering | Render server | $0 (free hosting on dedicated host) |
| **Total per video** | | **~$0.04** |

vs $50-150 freelance editor. Same as last session, no cost change.

---

## GitHub State

- Latest commit: `6322ff0` — "Pexels backgrounds + production defaults across all templates"
- Repo: https://github.com/balizain529-lang/sharingiscaring
- 30 files changed in this session, 609 insertions, 41 deletions

---

## Tech Stack — What We Have vs Don't Have

User-referenced stack for content automation. State as of April 26, 2026:

| Tool | Purpose | Status | Notes |
|---|---|---|---|
| **Claude Code** | Orchestrator | ✓ HAVE | Active coordination layer for all B-roll work |
| **ElevenLabs** | Word-level timestamps | ✗ DON'T HAVE | Currently using **Groq Whisper** (and previously OpenAI Whisper) for segment-level timestamps. ElevenLabs STT would give finer word-level accuracy if needed |
| **FFmpeg** | Trim fillers, retakes, dead space | ⚠ PARTIAL | Installed and used for `.mov` → `.mp4` transcoding + (planned) music mixing. **NOT yet wired up** for auto-trimming filler words / retakes — that's still manual in Descript |
| **HyperFrames** | Motion graphics | ✗ DON'T HAVE | Currently using **Remotion** (custom React-based). HyperFrames is an alternative motion graphics tool worth evaluating as a complement or replacement |

### Gaps to close (if moving to the full aspirational stack)

1. **Swap Whisper → ElevenLabs** for transcription if word-level precision matters (e.g., for sub-frame caption timing or precise filler-word detection). Trade-off: ElevenLabs STT is more expensive than Groq Whisper.
2. **Build FFmpeg auto-trim node** in n8n: takes Whisper/ElevenLabs word timestamps + filler word list (`um`, `uh`, `like`, repeated takes) → outputs cut list → FFmpeg concat. Would eliminate the manual Descript step.
3. **Evaluate HyperFrames** vs Remotion: would they replace our scene library or augment it? Remotion is React-native and matches our team's stack; HyperFrames may have premium pre-built motion design that beats our custom components for viral content.
