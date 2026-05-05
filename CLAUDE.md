# B-Roll Automation — Project Guide

## What This Project Does

Generates animated b-roll graphics for split-screen short-form videos (TikTok, Reels, Shorts) using Remotion. A talking-head video plays in the top panel while animated data visualizations, scorecards, and CTAs play in the bottom panel — synced to the script.

---

## Project Structure

```
B Roll Automation/
├── CLAUDE.md                          ← YOU ARE HERE
├── split-screen-video-production-guide.md  ← layout rules, safe zones, panel specs
├── templates/                         ← reusable scene pattern library
│   ├── README.md                      ← index + design system reference
│   ├── person-scorecard.md            ← speaker intro cards
│   ├── kpi-dashboard.md               ← stat cards with live-ticking values
│   ├── big-stat-reveal.md             ← massive hook numbers
│   ├── data-table.md                  ← ranked data tables with scanning highlight
│   ├── workflow-pipeline.md           ← agent/data flow diagrams
│   ├── node-graph.md                  ← architecture connection diagrams
│   ├── timeline-steps.md              ← phased implementation journeys
│   ├── comparison-split.md            ← before/after contrasts
│   ├── logo-endorsement.md            ← trusted-by / tech stack grids
│   └── cta-comment.md                 ← engagement CTAs with fake UI
├── b-roll-remotion/                   ← Remotion project (the code)
│   ├── src/
│   │   ├── Root.tsx                   ← composition registry
│   │   ├── components/                ← reusable animated components
│   │   ├── compositions/
│   │   │   ├── conclusion/            ← TrueHorizon takeaway sequence
│   │   │   ├── screens/               ← EP Squared screenshot b-roll
│   │   │   └── jon-pierpoint/         ← Jon Pierpoint short-form (reference build)
│   │   └── data/                      ← brand config, content data
│   ├── public/                        ← static assets (videos, images, lottie)
│   └── out/                           ← rendered MP4 outputs
└── Jon Pierpoint Short Form Clip/     ← source footage
```

---

## How to Build a New Short-Form Video

### Step 1 — Gather Inputs

You need:
1. **Talking head video** — `.mp4` or `.mov` (if `.mov`, transcode to H.264 first)
2. **Full transcript with timestamps** — who speaks, when, and what they say
3. **Any reference screenshots** — for visual style inspiration (optional)

### Step 2 — Map Script to Templates

Read the transcript and assign a template from `templates/` to each segment:

| What speaker says | Template |
|---|---|
| Introduces a person / credentials | `person-scorecard` |
| States a big number or problem | `big-stat-reveal` or `kpi-dashboard` |
| Explains how something works | `workflow-pipeline` |
| Shows results or data | `data-table` |
| Describes system architecture | `node-graph` |
| Compares old vs new | `comparison-split` |
| Lists clients or partners | `logo-endorsement` |
| Describes a journey or phases | `timeline-steps` |
| Asks for engagement | `cta-comment` |

### Step 3 — Build the Composition

Create a new folder under `b-roll-remotion/src/compositions/[project-name]/` with:
- One scene file per template (e.g., `Scene1_Scorecard.tsx`)
- `TopPanel.tsx` — talking head video
- `BottomPanel.tsx` — sequences the scenes with frame timing
- `TextStrip.tsx` — divider label that changes per scene
- `[ProjectName]Short.tsx` — main composition wiring it all together

### Step 4 — Register and Render

1. Add the composition to `Root.tsx`
2. Preview: `cd b-roll-remotion && npx remotion studio`
3. Render: `npx remotion render [CompositionId] out/[filename].mp4`

---

## Content-Type Blueprints

For common video formats, use the content-type blueprints instead of doing Step 2 from scratch:

| Video Format | Blueprint | Remotion Scaffold |
|---|---|---|
| Technical Walkthrough | `templates/content-types/technical-walkthrough.md` | `compositions/_scaffolds/technical-walkthrough/` |
| Case Study | `templates/content-types/case-study.md` | `compositions/_scaffolds/case-study/` |
| Podcast | `templates/content-types/podcast.md` | `compositions/_scaffolds/podcast/` |

Each blueprint defines the recommended scene sequence, timing, transcript mapping rules, asset checklist, and production workflow. Remotion scaffolds provide starter composition files — copy a scaffold folder to start a new build.

See `templates/content-types/README.md` for the full index and decision matrix.

---

## Split-Screen Layout Rules

Refer to `split-screen-video-production-guide.md` for full spec. Key rules:

- **Resolution:** 1080 × 1920 (vertical 9:16)
- **FPS:** 30
- **Top panel:** Talking head, height ~1020px (53% of frame)
- **Bottom panel:** B-roll graphics, height ~900px, background `#0B1222`
- **Text strip:** Overlays the divider seam between panels, teal borders
- **Panels must touch** — no gap between top and bottom
- **Min font size:** 28px (for platform readability)

---

## Design System

All scenes use these defaults (defined in `templates/README.md`):

| Property | Value |
|---|---|
| Background | `#0B1222` |
| Card bg | `#111E30` |
| Border | `rgba(255,255,255,0.08)` |
| Teal | `#00D4FF` |
| Green | `#00FF88` |
| Red | `#FF4444` |
| Orange | `#FF8C00` |
| Purple | `#8B5CF6` |
| Font | Inter, system-ui, sans-serif |
| Animation | Spring physics via Remotion `spring()` |

---

## Animation Patterns Used

| Pattern | How | Used For |
|---|---|---|
| **Spring entrance** | `spring()` + `interpolate()` on translateY/scale/opacity | All element entrances |
| **Count-up** | Ease-out cubic over 35-50 frames | Stat values ($722K, 2.7M, etc.) |
| **Live tick** | Sin-wave jitter (±3) after count-up settles | Simulating live data |
| **Stroke draw** | `strokeDasharray` + `strokeDashoffset` spring | Sparklines, connector lines |
| **Travelling dot** | Dot position loops along line (modulo frame) | Data flow visualization |
| **Pulsing glow** | `sin(frame * rate) * range + base` on boxShadow/textShadow | Active elements, status dots |
| **Scan line** | Horizontal teal line, position = `(frame * speed) % height` | Data processing feel |
| **Floating particles** | Fixed array, positions drift via sin waves per particle | Background depth |
| **Shimmer** | Hue rotation via `hsl()` with sin-wave offset | Accent numbers, CTAs |
| **Row highlight scan** | Active row index cycles via `Math.floor(frame / interval) % count` | Table data scanning |
| **Clip-path reveal** | `clipPath: inset(0 X% 0 0)` animated | Text/chart progressive reveal |

For lower-level animation primitives (typewriters, particles, 3D scenes, glitch text, animated counters), the [`remotion-bits`](https://www.npmjs.com/package/remotion-bits) package is installed in `b-roll-remotion` and importable from any composition. See [`templates/bits-library.md`](templates/bits-library.md) for the catalog and integration examples.

---

## Video Transcoding

If the source video is `.mov` (common from Mac/iPhone):

```bash
ffmpeg -y -i input.mov -c:v libx264 -preset fast -crf 18 -c:a aac -b:a 192k -movflags +faststart output.mp4
```

Remotion's `<OffthreadVideo>` works with H.264 MP4. ProRes/HEVC `.mov` files will timeout during render.

ffmpeg location (installed via winget): `C:\Users\zainb\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1-full_build\bin\ffmpeg.exe`

---

## Key Dependencies

- `remotion` v4.0.443
- `@remotion/noise` — Perlin noise for particle backgrounds
- `@remotion/lottie` — Lottie animation support
- `@remotion/paths`, `@remotion/shapes` — SVG utilities
- `lottie-web` — Lottie renderer
- React 19, TypeScript 6

---

## Common Commands

```bash
# Start Remotion Studio (preview in browser)
cd b-roll-remotion && npx remotion studio

# Render a specific composition
npx remotion render [CompositionId] out/[filename].mp4

# List all compositions
npx remotion compositions
```

---

## Reference Builds

### Jon Pierpoint Short (`compositions/jon-pierpoint/`)
- **Duration:** 49.6s / 1490 frames
- **Split:** 53% top / 47% bottom (1020px / 900px)
- **Scenes:** Person Scorecard → Workflow Pipeline → Data Table → Node Graph + CTA
- **Output:** `out/jon-pierpoint-r1.mp4`

### EP Squared Screenshots (`compositions/screens/`)
- **Duration:** 16s / 480 frames
- **Format:** Horizontal 1920×1080
- **Scenes:** Ask AI screen reveal → Executive Dashboard with KPI callouts
- **Output:** `out/screens-broll.mp4`

### Conclusion B-Roll (`compositions/conclusion/`)
- **Duration:** 15s (sequential) or 13s (grid)
- **Format:** Horizontal 1920×1080
- **Scenes:** 4 takeaway cards → end card CTA
- **Output:** `conclusion-broll-final.mp4`, `conclusion-grid-final.mp4`
