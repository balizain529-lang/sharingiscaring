# Technical Walkthrough — B-Roll Blueprint

**Content type:** Demos, tutorials, system walkthroughs — showing how something works
**Typical duration:** 45–60s (short-form) / 8–10 min (long-form)
**Best for:** Product demos, engineering deep-dives, "build with me" content, tool walkthroughs
**Reference build:** `compositions/jon-pierpoint/` (49.6s, 1490 frames)

---

## Scene Sequence

### Default Flow (5 scenes, 45–60s short-form)

| # | Scene | Template | Frames (@ 30fps) | Duration | Purpose |
|---|-------|----------|-------------------|----------|---------|
| 1 | Hook / Problem | `big-stat-reveal` or `kpi-dashboard` | 240–360 | 8–12s | Open with the problem scale — a shocking number or dashboard showing current state |
| 2 | Speaker Intro | `person-scorecard` | 240–300 | 8–10s | Introduce the engineer/architect doing the walkthrough |
| 3 | How It Works | `workflow-pipeline` | 300–420 | 10–14s | Step-by-step pipeline or agent chain showing the technical flow |
| 4 | Results / Data | `data-table` or `kpi-dashboard` | 300–420 | 10–14s | Show the data the system processes or the results it produces |
| 5 | Architecture + CTA | `node-graph` + `cta-comment` | 300–420 | 10–14s | System architecture view transitioning into engagement CTA |

### Variations

**Short-form (30–45s):** Drop Scene 4 (Results). Go Hook → Speaker → Workflow → Architecture+CTA.

**Long-form (60–90s):** Add a `comparison-split` scene between Hook and Speaker (old way vs new way), and a second `kpi-dashboard` or `data-table` after Results.

**Full-screen cutaway (no split-screen):** Use the cutaway pattern from `Pre_Meeting_Intel_Video/CUTAWAY_TEMPLATE.md`. Speaker video is full-screen with animated graphics overlaying it. See "Cutaway Format" section below.

**Without talking head:** Use all scenes at full 1920px height instead of 900px bottom panel. Good for standalone B-roll clips.

---

## Transcript Mapping Rules

Read the transcript and assign scenes based on what the speaker is saying:

| Speaker says... | Template | Notes |
|---|---|---|
| "Let me show you how..." / "Here's how it works" / "The workflow is..." | `workflow-pipeline` | Technical process being explained |
| "We process X records" / "Y requests per second" / "Z millisecond response" | `kpi-dashboard` or `big-stat-reveal` | Performance metrics or scale numbers |
| "Before we built this..." / "The old way was..." / "Manual process vs..." | `comparison-split` | Contrasting old/new approaches |
| "The system connects to..." / "These components talk to..." / "The architecture..." | `node-graph` | System components and connections |
| Screen share narration / tool demo moments | `data-table` | Data being shown on screen |
| Introduces themselves / credentials | `person-scorecard` | Name, title, key stats |
| "Comment [keyword]" / "Follow for more" / "Link in description" | `cta-comment` | Engagement call-to-action |
| Lists implementation phases / "First we did X, then Y" | `timeline-steps` | Phased build journey |
| Names tools, partners, or integrations | `logo-endorsement` | Tech stack or integration grid |

---

## Asset Checklist

### Required

- [ ] **Talking head video** (.mp4, H.264) — the engineer/architect presenting
- [ ] **Transcript with timestamps** — word-level timestamps preferred (from Descript or Whisper)
- [ ] **System/tool names** — for workflow-pipeline node labels (e.g., "Google Calendar", "HubSpot", "GPT-4o")
- [ ] **Key metrics** — 3–4 numbers for kpi-dashboard or big-stat-reveal (e.g., "2.7M records", "$722K revenue at risk")
- [ ] **Architecture components** — nodes and edges for node-graph (e.g., "NLP Engine → SQL Pipeline → Risk Scorer")

### Optional

- [ ] Screenshots of the tool/system being discussed (for ScreenFrame component overlays)
- [ ] Lottie icons for workflow nodes (search, funnel, shield, connection)
- [ ] Client/company logos if demonstrating partner work
- [ ] Before/after data for comparison-split

### Sourcing Guide

| Asset Type | Source |
|---|---|
| Talking head | Record in landscape, webcam or studio |
| Transcript | Descript (auto-transcription) or Whisper API |
| Screenshots | Screen capture during tool walkthrough |
| Lottie icons | LottieFiles.com or `public/lottie/` existing library |
| Stock footage (rare) | Pexels API (free) or Storyblocks ($30/mo) |

---

## Production Workflow

### Step 1 — Gather Inputs
Collect talking head video, transcript, and technical content (tool names, metrics, architecture diagram).

### Step 2 — Transcript Analysis
Read through the transcript. Mark each segment with the template it maps to using the rules above. Note frame timestamps:
```
frame = seconds × 30
```

### Step 3 — Scene Assignment
Fill in the scene sequence table with your specific content:
```
Scene 1 (0–360):    big-stat-reveal — "$20M problem" hook
Scene 2 (360–600):  person-scorecard — "Walt Charles III, 7x CPO"
Scene 3 (600–900):  workflow-pipeline — "Calendar → CRM → Enrichment → AI → Gmail"
Scene 4 (900–1200): data-table — "Revenue at Risk by Supplier"
Scene 5 (1200–1490): node-graph + cta-comment — system architecture → "Comment PROCUREMENT"
```

### Step 4 — Build Composition
Copy the scaffold from `compositions/_scaffolds/technical-walkthrough/` into a new folder:
```
cp -r _scaffolds/technical-walkthrough/ compositions/[project-name]/
```

Update `TopPanel.tsx` with your talking head video path. Update `BottomPanel.tsx` with your scene components and frame timing. Build individual scene files using the scene templates.

### Step 5 — Asset Integration
- Place talking head video in `public/[project-name]/`
- Place any screenshots, logos, or Lottie files in `public/[project-name]/`
- Update `staticFile()` references in components

### Step 6 — Review and Render
```bash
npx remotion studio  # preview in browser, check timing against audio
npx remotion render [CompositionId] out/[filename].mp4
```

**Review checklist:**
- [ ] Each scene matches what the speaker is saying at that moment
- [ ] Scene transitions don't happen mid-sentence
- [ ] Text is readable at mobile resolution (min 28px)
- [ ] Bottom panel background is `#0B1222` (no black gaps)
- [ ] TextStrip label updates at each scene change

---

## Cutaway Format (Full-Screen Alternative)

For punchy intros or standalone clips, use full-screen cutaways instead of split-screen. The speaker's video plays full-screen, and animated graphics overlay it at key moments.

### Layer Stack
```
1. BASE: Speaker video (full-screen, always playing, audio source)
2. CUTAWAYS: Full-screen graphics that cover the speaker
3. OVERLAYS: Semi-transparent elements on top of speaker
4. PERSISTENT: Lower-third, captions
```

### Cutaway Types (from CUTAWAY_TEMPLATE.md)

| Type | Component | Use When |
|---|---|---|
| Card Reveal | Items appear as speaker names them, then strike through | Speaker lists problems, features, or steps |
| Impact Card | Full-screen text transformation (phrase A → phrase B) | Speaker delivers a key one-liner or thesis |
| Countdown + Word Reveal | Timer counting down + words appearing sequentially | Speaker mentions a time constraint |
| Pipeline | Horizontal chain of nodes with arrows | Speaker describes a process or workflow |
| Flow Diagram | Nodes with animated SVG paths and flowing dots | Speaker describes a system with inputs → processing → output |
| Text Overlay | Semi-transparent text over speaker video | Reinforce a phrase while keeping speaker visible |

### Zero Peek-Through Rule (Critical)

The speaker must NEVER flash on screen between cutaways. Every cutaway has 8-frame fade-in/fade-out built in.

**Fix:** Overlap adjacent cutaways by 16+ frames:
```
CutawayA: from={X} duration={D1} → ends at X+D1
CutawayB: from={Y} duration={D2} → starts at Y
Overlap: (X+D1) - Y >= 16? ✓ or extend D1
```

### Timing Rules
- **First 5–10 seconds:** Speaker on screen (audience needs to see who's talking)
- **Last 5–10 seconds:** Speaker on screen (natural for handoffs/CTAs)
- **Between:** Graphics. Only return to speaker if there's a long stretch without visual content
- **Every graphic must match what the speaker is saying at that exact moment**

---

## Example Scene Data

```json
{
  "contentType": "technical-walkthrough",
  "title": "Pre-Meeting Intelligence System",
  "fps": 30,
  "totalFrames": 1490,
  "scenes": [
    {
      "scene": 1,
      "template": "kpi-dashboard",
      "from": 0,
      "duration": 360,
      "label": "The Problem",
      "data": {
        "header": "Meeting Prep Today",
        "cards": [
          { "label": "Avg Prep Time", "value": 58, "suffix": "min", "color": "#FF4444" },
          { "label": "Data Sources", "value": 4, "suffix": "+", "color": "#FF8C00" },
          { "label": "Manual Steps", "value": 12, "color": "#FF4444" }
        ]
      }
    },
    {
      "scene": 2,
      "template": "person-scorecard",
      "from": 360,
      "duration": 240,
      "label": "Zain · True Horizon",
      "data": {
        "name": "Zain Bukhari",
        "title": "Co-Founder, True Horizon AI",
        "badges": [
          { "value": "AI", "label": "Systems" },
          { "value": "n8n", "label": "Automation" },
          { "value": "50+", "label": "Workflows Built" }
        ]
      }
    },
    {
      "scene": 3,
      "template": "workflow-pipeline",
      "from": 600,
      "duration": 360,
      "label": "Intelligence Pipeline",
      "data": {
        "header": "Pre-Meeting Intelligence",
        "status": "ACTIVE",
        "rows": [
          [
            { "label": "Calendar", "sub": "Trigger" },
            { "label": "CRM Lookup", "sub": "HubSpot" },
            { "label": "Enrichment", "sub": "Apollo.io", "glow": true }
          ],
          [
            { "label": "Normalize", "sub": "Data Clean" },
            { "label": "AI Agent", "sub": "GPT-4o", "glow": true },
            { "label": "Gmail", "sub": "Deliver" }
          ]
        ],
        "stats": [
          { "label": "Records Processed", "value": "2.7M" },
          { "label": "Response Time", "value": "<3s" }
        ]
      }
    },
    {
      "scene": 4,
      "template": "data-table",
      "from": 960,
      "duration": 300,
      "label": "Meeting Briefs Generated",
      "data": {
        "header": "Recent Briefs",
        "heroStat": { "label": "Briefs Generated", "value": 847, "color": "#00D4FF" },
        "table": {
          "columns": ["Contact", "Company", "Source", "Status"],
          "rows": [
            { "cells": ["Sarah Chen", "TechCorp", "CRM", "Delivered"], "color": "#00FF88" },
            { "cells": ["James Wilson", "DataFlow", "Enriched", "Delivered"], "color": "#00FF88" },
            { "cells": ["Priya Patel", "CloudBase", "Net-New", "Pending"], "color": "#FF8C00" }
          ]
        }
      }
    },
    {
      "scene": 5,
      "template": "node-graph+cta-comment",
      "from": 1260,
      "duration": 230,
      "label": "System Architecture",
      "data": {
        "nodeGraph": {
          "nodes": [
            { "label": "NLP Engine", "x": 20, "y": 25, "color": "#00D4FF" },
            { "label": "SQL Pipeline", "x": 50, "y": 15, "color": "#8B5CF6" },
            { "label": "Risk Scorer", "x": 80, "y": 25, "color": "#FF8C00" },
            { "label": "Intel Agent", "x": 35, "y": 60, "color": "#00FF88", "glow": true },
            { "label": "Dashboard", "x": 65, "y": 60, "color": "#00D4FF" }
          ],
          "edges": [
            { "from": 0, "to": 3 }, { "from": 1, "to": 3 },
            { "from": 2, "to": 4 }, { "from": 3, "to": 4 }
          ]
        },
        "cta": {
          "action": "COMMENT",
          "keyword": "AUTOMATION"
        }
      }
    }
  ]
}
```

---

## Reference Builds

| Build | Location | Duration | Format | Notes |
|---|---|---|---|---|
| Jon Pierpoint Short | `compositions/jon-pierpoint/` | 49.6s (1490f) | Vertical 1080x1920 | Scorecard → Workflow → DataTable → NodeGraph+CTA |
| Founder Intro Cutaway | `Pre_Meeting_Intel_Video/founder-intro/` | 61s | Horizontal 1920x1080 | Full-screen cutaway pattern (6 animated scenes) |
| Pre-Meeting Intel Script | `Pre_Meeting_Intel_Video/SCRIPT_v2_humanized.md` | 8–10 min | Long-form reference | Demo-first structure, conversational tone |
