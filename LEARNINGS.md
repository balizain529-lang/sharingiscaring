# B-Roll Learnings

Central reference for everything learned while building short-form B-roll with Remotion, the scene templates, and the `DynamicCutaway` composition. Append to this file after every session — keep one doc, not many.

**Scope:** templates, Remotion graphics generation, horizontal + vertical cutaway format, component layout and animation. n8n pipeline learnings live in [n8n-broll-pipeline-architecture.md](n8n-broll-pipeline-architecture.md); per-video edit notes live in their own docs.

---

## Core Design Principles

### Pacing — cutaways are CUT-aways, not takeovers

- Cutaways should be **6–12 seconds** each. A 17s static graphic is dead air, even with nice entrance animation.
- Speaker should return between cutaways for **6–9 seconds**. "Gaps" are the speaker on camera; they carry the narrative and break up visual load.
- **Open speaker-first** (first 5–7s): audience needs to see who's talking before the graphics start.
- **Close speaker-first** (last 10–15s+): classic podcast passback reads more human than a cutaway card for handoffs that lead into a deeper segment.
- Don't design cutaways to exactly match word-count timing blocks. Estimate beats, then adjust against real audio.

### Graphic density — avoid "dashboard-y" for creator content

- Multi-card KPI panels read as corporate/B2B. For creator-facing content, use **progressive reveal** patterns (`comparison-split` with items appearing one-by-one, `big-stat-reveal` with a single hero number).
- Reserve KPI dashboards for moments where the numbers ARE the content (performance, trust metrics, uptime).
- Illustrative numbers need to be **believable for the team**. "10M+ records" reads inflated for a small team; "50K+" reads right. Scale numbers to the business you actually are.
- Percentages near 100% need **tick clamping** (`tickRange: [-4, 0]`) — otherwise live tick can overflow to 100%+ or show confusing decimals.

### Motion — static after entrance is boring

Every scene component should have continuous motion after entrance animation settles. Patterns that work:

- **Value tick**: after count-up finishes, nudge displayed value by ±1–N within a configurable range (`tickRange`). Reads as "live data."
- **Breathe scale**: `Math.sin(frame * 0.07) * 0.01 + 1` on cards/nodes after entrance.
- **Float offset**: `Math.sin(frame * 0.05 + i) * 1.5` translateY on list items. Subtle drift.
- **Glow pulse**: `Math.sin(frame * 0.1) * 0.3 + 0.7` on box-shadow intensity.
- **Traveling dot** on dotted connector lines.

If a scene sits for 8+ seconds, the motion above is mandatory. If it's <6 seconds, just entrance animation is fine — the cutaway ends before it goes stale.

---

## Component / Layout Gotchas

### Scene components were designed for vertical 1080×1920

The original Jon Pierpoint scenes were built for vertical short-form. Reusing them at horizontal 1920×1080 exposes layout assumptions:

- **`padding` + `marginTop: auto`** patterns cluster content at the top with empty space below at horizontal aspect. Fix: add `justifyContent: center` to the root flex container and bump `gap`/`padding` values (~2× the vertical defaults).
- **Font sizes** designed for mobile-readable vertical are too small for horizontal. Roughly double them for landscape: headers 22→28, body 14→18, hero 64→180, comparison values 28→64.
- **Node/card padding** also needs scaling (`12px 18px` → `18px 26px`, `minWidth: 110` → `160`).

Rule of thumb: when adding a new scene to a horizontal composition, preview in Studio and adjust the component — don't just accept the vertical defaults.

### Scene component edge cases

| Component | Edge case | Fix |
|---|---|---|
| `ComparisonSplit` | `right.items = []` left orphan icon + reserved half-width | Hide entire right column when items empty; center left column |
| `BigStatReveal` | `value: 0` rendered a giant "0" | Skip hero number when `value === 0`; comparison-only mode |
| `KpiDashboard` | Percentage values near 100 ticked above 100 | Added `tickRange?: [number, number]` per-card |
| `WorkflowPipeline` | Title pinned via `marginTop: auto` clashed with vertical centering | Drop the title pin, use `justifyContent: center` + `gap` |

### DynamicCutaway quirks

- **Always set `background: #000`** on the root fill — gives a clean backdrop if the speaker video has letterbox/pillar bars.
- **Lower-third banners** live in `config.lowerThirds` (reusable array). Each entry: `{ name, title, from, durationInFrames }`. 15-frame fade-in, 24-frame fade-out, slide-up from 24px. Bottom-left position, teal accent bar, white text.
- **Text strip** is now conditional on `textStrip.labels.length > 0`. If a composition doesn't want a persistent bottom label, pass `labels: []`.
- **Zero peek-through rule**: adjacent cutaways must overlap by ≥16 frames to prevent speaker flashing between fades. Extend each cutaway's `durationInFrames` by 16f so it overlaps the next one's `from`.

---

## Remotion Render Gotchas

### Paths and `staticFile()`

`OffthreadVideo` won't resolve bare paths like `"yt-scraper/intro.mp4"` — they 404 against the webpack bundle at render time. Two options:

- Wrap with `staticFile("yt-scraper/intro.mp4")` — for files in `public/`
- Pass a full URL `http://...` — for remote assets from the n8n pipeline

`DynamicCutaway` now has a `resolveVideoSrc()` helper that does the right thing: pass-through for full URLs, `staticFile()` wrap for bare paths. Configs can use whichever form matches the source.

### Source video requirements

- **`.mov` files** (Mac/iPhone native): transcode to H.264 MP4 first. ProRes/HEVC in `.mov` times out during Remotion render.
- **60fps sources** play fine at a 30fps composition — Remotion handles the downsample via `OffthreadVideo`.
- **Full path to local ffmpeg:** `C:\Users\zainb\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1-full_build\bin\ffmpeg.exe`
- **"moov atom not found"** from ffprobe usually means the file is still being copied, not actually corrupt. Retry after the copy completes.

### Schema vs. register block

`BRollConfig.meta.width` and `height` were originally typed as literal `1080`/`1920` — couldn't register a horizontal composition without TS errors. Relaxed to `number`. The render dimensions come from the `<Composition width={...} height={...}>` registration, not from config; `meta.width`/`height` is just metadata for downstream tooling.

---

## Workflow Principles

- **Approve design on paper before rendering.** Each render takes 2–8 minutes. Don't round-trip through renders for decisions that can be nailed on paper — format choice, scene sequence, data, timing.
- **Ship a rough first cut, then iterate.** 3–4 render rounds per video is normal. Capture critique in specific terms ("numbers too high," "dead air in scene 2") so the next iteration is targeted.
- **Whisper for cue-point alignment is optional.** For 60–90s intros, estimating beats from word counts + the speaker's timestamp markers ([00:00:00], [00:01:00]) gets close enough. Run Whisper when the first render's cue alignment feels off, not as a default.
- **Spec doc per new video** at `docs/superpowers/specs/YYYY-MM-DD-<name>-design.md`. Captures scene sequence, data, decisions, rejected options. Lives alongside the composition.

---

## Reusable Patterns (added during sessions)

- `LowerThirdBanner` in `DynamicCutaway` — speaker name card, driven by `config.lowerThirds[]`. Multiple can fire in one video.
- `resolveVideoSrc()` helper in `DynamicCutaway` — transparent local/remote URL handling.
- `tickRange?: [number, number]` on KPI cards — clamps the post-count-up live tick.
- Empty `textStrip.labels: []` — hide persistent bottom label for this composition only.

---

## Session Log

Newest first. Each session entry: what was built, what went wrong, what was learned, and commit refs. Keep entries tight — this is a reference, not a journal.

### 2026-04-26 — Pexels Backgrounds + Production Defaults

**What was built:**
- Production defaults baked into all 10 scene templates + 3 content blueprints + 3 system prompts: every scene now includes `backgroundVideo.query` by default
- Per-scene-type Pexels query banks added to prompt files
- DynamicCutaway updated: provides solid `#0B1222` base + optional Pexels video at low opacity, scene component renders on top with transparent root
- All 10 scene components had `background: BG` removed from root container (so backgrounds can show through)

**What went wrong / learned (CRITICAL):**

The first attempt (`yt-scraper-intro-v3.mp4`) added `backgroundVideo` URLs in the config, DynamicCutaway rendered the OffthreadVideo at z-index 0, but **the user couldn't see any backgrounds.** File size was identical to v2 (75 MB) — same as the no-background version.

**Root cause:** every scene component (`WorkflowPipeline.tsx`, `BigStatReveal.tsx`, etc.) had `background: BG` (#0B1222) on its root `<div>`. That solid fill covered the OffthreadVideo layer underneath, so the video rendered but was completely hidden.

**Fix:** moved the `#0B1222` base layer from each scene component into `DynamicCutaway`'s `CutawayOverlay`. Scene components now have transparent roots; DynamicCutaway provides:
- Layer 0: solid `#0B1222` (always present, so cutaway covers speaker)
- Layer 1: Pexels video at `bgOpacity` (default 0.22)
- Layer 2: scene foreground graphics

Result: v4 jumped to 107 MB (vs 75 MB) — confirmation that real footage is now in the output.

**Rule for future scene components:**
- Scene components MUST have transparent root containers
- The composition (DynamicCutaway / DynamicShort) provides the background layer
- This lets `backgroundVideo` work for any scene type without per-component refactoring

**New defaults in the templates:**
- Every scene template MD now has a "Background Video (REQUIRED)" section with suggested Pexels queries
- Prompts instruct Claude to ALWAYS include `backgroundVideo.query` (not optional)
- Per-scene-type query banks documented in `prompts/*.txt`

**Production-quality stack (current):**
- Pexels stock at low opacity behind every scene (free)
- Iconify icons on technical nodes (free)
- Brandfetch logos in LogoEndorsement (free 500K/mo)
- Single hero stat (`big-stat-reveal`) replaces multi-card `kpi-dashboard` for short-form (less corporate feel)

---

### 2026-04-23 — YT Scraper Intro

**Video:** [New Vid 2/YT Scraper Intro.mp4](New%20Vid%202/YT%20Scraper%20Intro.mp4) (89s horizontal, speaker: Milan)
**Output:** [b-roll-remotion/out/yt-scraper-intro.mp4](b-roll-remotion/out/yt-scraper-intro.mp4)
**Spec:** [docs/superpowers/specs/2026-04-23-yt-scraper-intro-design.md](docs/superpowers/specs/2026-04-23-yt-scraper-intro-design.md)
**Commits:** `df933e5` (spec), `dc681be` (build)

**Built:**
- `YtScraperIntro` composition: 2,670 frames @ 30fps, horizontal 1920×1080, driven by `DynamicCutaway` with inline config
- 4 cutaways: `comparison-split` (hook) → `big-stat-reveal` with comparison (pain) → `workflow-pipeline` (centerpiece) → `kpi-dashboard` (trust)
- Milan lower-third banner at frames 45–210

**What went wrong / learned:**
- **Round 1 — everything too slow, too dense.** 4 cutaways at 17s each with static sparklines = dead air. User called out dashboard-y feel, static after entrance, and pipeline compression at top of frame.
- **Round 2 — component layout issues surfaced.** Schema was typed to vertical-only; `staticFile()` wasn't wrapping local paths; horizontal fonts were too small. Multiple scene components needed font/padding scaling.
- **Round 3 — edge cases.** `ComparisonSplit` with empty right column showed an orphan red X. `BigStatReveal` with `value: 0` showed a giant "0". Added conditional renders for both.
- **Round 4 — remove text strip.** Persistent bottom label read as cluttered. Made the layer conditional on labels length > 0.

**New reusable infrastructure:**
- `LowerThirdBanner` component + `config.lowerThirds` array
- Per-card `tickRange` for KPI cards
- `resolveVideoSrc()` video path helper
- Horizontal-adapted versions of 4 scene components

---

### 2026-04-13 — B-Roll Automation Pipeline Build

**Summary:** Built the full automation system — 10 JSON-driven scene components, 3 content-type blueprints, `DynamicCutaway` + `DynamicShort` compositions, 2 n8n workflows (Form Intake, Drive Watcher), Claude system prompts per content type, Express render server scaffold.
**Commits:** `9f5db55` (pipeline build), `4817c0f` (session report)
**Full report:** [SESSION_REPORT_2026-04-13.md](SESSION_REPORT_2026-04-13.md)

**Key decisions that still hold:**
1. Cutaway > split-screen for short-form (team vote)
2. n8n Cloud needs HTTP render API (can't call local CLI)
3. JSON-driven compositions over per-video `.tsx` files
4. Google Drive as file hub, ClickUp for review gates, Whisper for transcription ($0.006/min)
5. Scene JSON schema in `data/schema.ts` is the contract between Claude and Remotion

**Per-video cost:** ~$0.14 (vs. $50–150 freelance editor).

---

## Commit Reference (templates + Remotion scope)

| Hash | Date | What |
|---|---|---|
| `dc681be` | 2026-04-23 | YT Scraper Intro build — horizontal cutaway, Milan banner, component fixes |
| `df933e5` | 2026-04-23 | YT Scraper Intro design spec |
| `4817c0f` | 2026-04-13 | April 13 session report |
| `9f5db55` | 2026-04-13 | B-Roll automation pipeline — Remotion + n8n + Claude API |
| `8745704` | initial | Repo init |

Run `git log --oneline --all -- b-roll-remotion/ templates/` to see the full filtered history.
