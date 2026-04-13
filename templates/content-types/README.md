# Content-Type Blueprints

Scene templates in `templates/` are individual building blocks (person-scorecard, kpi-dashboard, etc.). These **content-type blueprints** are recipes — they tell you which templates to use, in what order, with what assets, for a specific kind of video.

---

## Quick Decision Matrix

| What are you making? | Blueprint | Typical Duration | Key Templates |
|---|---|---|---|
| Demo, tutorial, system walkthrough | [Technical Walkthrough](technical-walkthrough.md) | 45–60s (short) / 8–10 min (long) | big-stat-reveal, person-scorecard, workflow-pipeline, data-table, node-graph |
| Client success story, interview | [Case Study](case-study.md) | 50–70s (short) / 8–12 min (long) | big-stat-reveal, person-scorecard, comparison-split, timeline-steps, kpi-dashboard, logo-endorsement |
| Interview, debate, conversation | [Podcast](podcast.md) | 40–60s (short) / 18–25 min (long) | person-scorecard, big-stat-reveal, topic-dependent middle scenes, cta-comment |

---

## How to Use a Blueprint

### Step 1 — Pick the blueprint matching your content type

### Step 2 — Gather assets using the blueprint's checklist
Each blueprint lists exactly what you need before building: talking head video, transcript, metrics, logos, etc.

### Step 3 — Map your transcript to scenes
Each blueprint has transcript mapping rules — phrases and patterns that indicate which scene template to use. Read your transcript and assign scenes.

### Step 4 — Copy the Remotion scaffold
Starter composition files live at `b-roll-remotion/src/compositions/_scaffolds/`. Copy the matching folder into a new project folder under `compositions/`.

### Step 5 — Fill in scene data and timing
Use transcript timestamps to set frame ranges for each `<Sequence>`. Fill in data (names, metrics, labels) from your content.

### Step 6 — Preview and render
```bash
cd b-roll-remotion && npx remotion studio   # preview
npx remotion render [CompositionId] out/[filename].mp4  # render
```

---

## Architecture

```
templates/
├── content-types/           ← YOU ARE HERE (recipes)
│   ├── README.md
│   ├── technical-walkthrough.md
│   ├── case-study.md
│   └── podcast.md
├── person-scorecard.md      ← scene templates (building blocks)
├── kpi-dashboard.md
├── big-stat-reveal.md
├── data-table.md
├── workflow-pipeline.md
├── node-graph.md
├── timeline-steps.md
├── comparison-split.md
├── logo-endorsement.md
└── cta-comment.md

b-roll-remotion/src/compositions/
├── _scaffolds/              ← starter code for each content type
│   ├── technical-walkthrough/
│   ├── case-study/
│   └── podcast/
├── jon-pierpoint/           ← reference build (technical walkthrough)
├── conclusion/
└── screens/
```

---

## Shared Design System

All blueprints inherit the same design system defined in `templates/README.md`:

- Background: `#0B1222` | Card bg: `#111E30`
- Accents: Teal `#00D4FF`, Green `#00FF88`, Red `#FF4444`, Orange `#FF8C00`, Purple `#8B5CF6`
- Font: Inter, system-ui, sans-serif
- Animation: Spring physics via Remotion `spring()`
- Layout: 1080 x 1920 (vertical 9:16), 30 fps, top panel 1020px, bottom panel 900px

See `split-screen-video-production-guide.md` for full safe zone and layout specs.
