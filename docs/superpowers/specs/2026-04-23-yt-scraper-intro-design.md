# YT Scraper Intro — B-Roll Cutaway Design

**Date:** 2026-04-23
**Content type:** Technical walkthrough intro (cold-open before Deepanker's deep-dive)
**Source:** `New Vid 2/YT Scraper Intro.mp4` (1920×1080, 60fps, 89.016s, H.264)
**Speaker:** Zain (Co-Founder, True Horizon)
**Deliverable:** Full-screen cutaway B-roll using existing `DynamicCutaway` composition

---

## Format decision

- **Full-screen cutaway** (not split-screen). Confirmed by team preference recorded in memory and the blueprint recommendation for "punchy intros."
- Source video plays full-frame 1920×1080; animated graphics overlay it at key moments.
- Classic passback ending: speaker stays on camera for the "Take it away, Deepanker" handoff. No cutaway card for Deepanker.

## Composition

| Property | Value |
|---|---|
| Composition ID | `YtScraperIntro` |
| Dimensions | 1920 × 1080 (horizontal) |
| FPS | 30 (video is 60fps; Remotion `OffthreadVideo` handles the downsample) |
| Total duration | 2,670 frames (89s) |
| Component | `DynamicCutaway` (existing) |
| Talking-head source | `public/yt-scraper/intro.mp4` |

## Scene sequence — Approach 1 (Balanced, 4 cutaways)

| Phase | Frames | Seconds | Scene |
|---|---|---|---|
| Opening (speaker) | 0 – 180 | 0:00 – 0:06 | On camera |
| Cutaway 1 | 180 – 676 | 0:06 – 0:23 | `kpi-dashboard` — "The Creator Trap" |
| Cutaway 2 | 660 – 1216 | 0:22 – 0:41 | `comparison-split` — Research vs Automation |
| Cutaway 3 | 1200 – 1726 | 0:40 – 0:58 | `workflow-pipeline` — Viral Outlier Pipeline |
| Cutaway 4 | 1710 – 2160 | 0:57 – 1:12 | `kpi-dashboard` — Enterprise Trust |
| Closing (speaker) | 2160 – 2670 | 1:12 – 1:29 | On camera (thesis + handoff) |

**Overlap rule:** Each cutaway's duration is extended by 16 frames so it overlaps with the next. This prevents speaker peek-through during the 8-frame fade transitions handled by `DynamicCutaway`.

## Scene data

### Scene 1 — The Creator Trap (`kpi-dashboard`)

```json
{
  "type": "kpi-dashboard",
  "from": 180,
  "durationInFrames": 496,
  "data": {
    "header": "The Creator Trap",
    "status": "REALITY",
    "cards": [
      { "label": "Videos Watched / Week", "value": 1200, "suffix": "+", "color": "#FF4444" },
      { "label": "Trends Actually Caught", "value": 3, "color": "#FF4444" },
      { "label": "Hours Wasted", "value": 14, "suffix": " hrs", "color": "#FF8C00" }
    ],
    "sparkline": true
  }
}
```

Numbers are illustrative — represent the pain, not claims about specific creators.

### Scene 2 — Research vs Automation (`comparison-split`)

```json
{
  "type": "comparison-split",
  "from": 660,
  "durationInFrames": 556,
  "data": {
    "left": {
      "header": "MANUAL RESEARCH",
      "color": "#FF4444",
      "icon": "cross",
      "items": [
        "Scroll YouTube for hours",
        "Guess what's trending",
        "Miss the wave every time",
        "Less time to actually film"
      ]
    },
    "right": {
      "header": "WITH TRUE HORIZON",
      "color": "#00FF88",
      "icon": "check",
      "items": [
        "AI agents run 24/7",
        "Spot viral outliers early",
        "Know WHY they're working",
        "More time on camera"
      ]
    }
  }
}
```

### Scene 3 — Viral Outlier Pipeline (`workflow-pipeline`)

```json
{
  "type": "workflow-pipeline",
  "from": 1200,
  "durationInFrames": 526,
  "data": {
    "header": "Viral Outlier Pipeline",
    "status": "ACTIVE",
    "title": { "text": "VIRAL OUTLIER PIPELINE", "accentWord": "VIRAL" },
    "rows": [
      [
        { "label": "YouTube API", "sub": "Intake" },
        { "label": "Niche Filter", "sub": "Your Topic" },
        { "label": "Apify Scraper", "sub": "Extract", "glow": true }
      ],
      [
        { "label": "Transcript + Thumb", "sub": "Parse" },
        { "label": "LLM Analysis", "sub": "Claude", "glow": true },
        { "label": "Outlier Ranked", "sub": "Scored" }
      ]
    ],
    "stats": [
      { "label": "Channels Monitored", "value": "2,400+" },
      { "label": "Analyzed / Day", "value": "10K" }
    ]
  }
}
```

Stats are illustrative. Swap in real operating numbers before production.

### Scene 4 — Enterprise Trust (`kpi-dashboard`)

```json
{
  "type": "kpi-dashboard",
  "from": 1710,
  "durationInFrames": 450,
  "data": {
    "header": "Enterprise-Grade Foundation",
    "status": "LIVE",
    "cards": [
      { "label": "Uptime", "value": 99, "suffix": ".9%", "color": "#00FF88" },
      { "label": "Workflows Shipped", "value": 50, "suffix": "+", "color": "#00D4FF" },
      { "label": "Records Processed", "value": 10, "suffix": "M+", "color": "#00D4FF" }
    ],
    "sparkline": true
  }
}
```

Placeholder values — swap for real numbers before publishing. "99.9% uptime" should be a claim you're comfortable making publicly.

## Text-strip labels

Persistent bottom-center teal-bordered band, updates as the sequence progresses:

| From frame | Label |
|---|---|
| 0 | THE CREATOR TRAP |
| 660 | RESEARCH vs AUTOMATION |
| 1200 | VIRAL OUTLIER PIPELINE |
| 1710 | ENTERPRISE-GRADE |
| 2160 | HANDOFF |

## Implementation steps

1. Relax `BRollConfig.meta` `width`/`height` types from literal `1080`/`1920` to `number` so the schema supports both vertical and horizontal.
2. Copy source MP4 from `New Vid 2/YT Scraper Intro.mp4` to `b-roll-remotion/public/yt-scraper/intro.mp4`.
3. Register a new `<Composition id="YtScraperIntro">` in [Root.tsx](../../../b-roll-remotion/src/Root.tsx) using `DynamicCutaway` as the component, 1920×1080, with the config above as `defaultProps`.
4. Preview in Remotion Studio to confirm timing against the audio.
5. Render: `npx remotion render YtScraperIntro out/yt-scraper-intro.mp4`.

## Out of scope

- Word-level timestamp alignment via Whisper. Current frame boundaries are estimated from word counts against 89s. Offered as a follow-up if visual-audio sync feels off on first render.
- Deepanker handoff card (rejected in favor of classic passback).
- Real client logos for the credibility scene (rejected in favor of trust-metric KPIs).
- Any cutaways for the final "Take it away" passback.
