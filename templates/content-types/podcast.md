# Podcast — B-Roll Blueprint

**Content type:** Interview conversations, debates, panel discussions, guest features
**Typical duration:** 40–60s (short-form clips) / 18–25 min (full episode)
**Best for:** Two-person interviews, debates, thought leadership conversations, guest spotlights
**Reference build:** `Editor_Bot/Is_SaaS_Dead_Editor_Notes.md` (real podcast editing example)

---

## Scene Sequence

### Default Flow (4–6 scenes, 40–60s short-form)

Podcasts are **topic-driven, not narrative-driven**. Unlike technical walkthroughs or case studies, the conversation can jump between subjects. This blueprint provides a fixed opening and closing with a flexible middle.

| Phase | Scene | Template | Frames (@ 30fps) | Duration | Purpose |
|-------|-------|----------|-------------------|----------|---------|
| Open | Guest Intro | `person-scorecard` | 240–300 | 8–10s | Guest credentials + stat badges |
| Hook | Key Stat | `big-stat-reveal` | 180–240 | 6–8s | One shocking stat pulled from conversation |
| Middle | Topic Viz 1 | *varies* | 240–360 | 8–12s | Visualize the most important discussion topic |
| Middle | Topic Viz 2 | *varies* | 240–360 | 8–12s | Visualize the second key topic (if time allows) |
| Middle | Topic Viz 3 (optional) | *varies* | 240–360 | 8–12s | Third topic for longer clips |
| Close | Engagement | `cta-comment` | 180–240 | 6–8s | Drive comments, follows, engagement |

### Middle Scene Pool

Pick 2–3 from this pool based on what topics come up in the conversation:

| What's being discussed | Template | Example |
|---|---|---|
| A process or methodology | `workflow-pipeline` | "Here's how we evaluate new tools..." |
| Before vs after / old vs new | `comparison-split` | "SaaS used to... now with AI agents..." |
| Metrics, market data, costs | `kpi-dashboard` | "$5M Salesforce license" / "120B parameter models" |
| Companies, tools, or tech stack | `logo-endorsement` | Listing companies that use a technology |
| Implementation phases | `timeline-steps` | "Phase 1 was prototyping, phase 2 was..." |
| Architecture or system connections | `node-graph` | "The components connect like this..." |
| Ranked data or comparisons | `data-table` | "Top 5 enterprise AI tools by adoption" |

### Variations

**Short clip (30–40s):** Guest Intro → Hook Stat → 1 Topic Viz → CTA. Four scenes, tight pacing.

**Highlight reel (60–90s):** Guest Intro → Hook Stat → 3 Topic Viz scenes → CTA. Six scenes covering the best moments.

**Full episode B-roll:** Generate a B-roll scene for each major topic segment (typically 4–6 topics across 20+ minutes). Each topic gets its own scene triggered at the appropriate timestamp.

**Debate format:** Use `comparison-split` more heavily — left side = Speaker A's position, right side = Speaker B's position. Great for point/counterpoint moments.

**Without talking head:** Full-height scenes for audiogram-style content where podcast audio plays over animated graphics.

---

## Transcript Mapping Rules

Podcast transcripts are unstructured. Scan for these patterns:

| Speaker says... | Template | Notes |
|---|---|---|
| Guest introduces themselves / credentials discussed | `person-scorecard` | Always use for guest intro |
| Any specific number, dollar amount, or statistic | `big-stat-reveal` | Pull the most shocking one for the hook |
| "Here's how it works..." / describes a process | `workflow-pipeline` | Methodology or process explanation |
| "It used to be... now it's..." / contrasting approaches | `comparison-split` | Old way vs new way |
| Lists companies, tools, or technologies | `logo-endorsement` | "Salesforce, HubSpot, and Cursor..." |
| Mentions cost, market size, or performance metrics | `kpi-dashboard` | Multiple metrics in one scene |
| "Phase 1 was..." / describes a timeline | `timeline-steps` | Chronological events |
| "The interesting thing about [Company] is..." | `data-table` | Ranked comparisons |
| Host asks for engagement / outro | `cta-comment` | Closing CTA |

### Topic Detection for Unstructured Conversation

Unlike scripted content, podcast conversations often circle back to topics or make tangential jumps. When mapping:

1. **Identify the 3–5 strongest topics** — segments where the energy is highest or the insight is sharpest
2. **Pick the single best 30–60s window** for each topic — don't try to visualize every mention
3. **Prioritize "quotable moments"** — when a guest makes a punchy one-liner, that's your scene trigger
4. **Look for analogies and stories** — "It's like when they introduced the catapult..." is more engaging than abstract analysis

---

## Asset Checklist

### Required

- [ ] **Podcast recording** (.mp4, H.264) — video of the conversation (Riverside, Zoom, or studio)
- [ ] **Transcript with timestamps** — critical for unstructured conversations (Descript recommended)
- [ ] **Guest name, title, company** — for person-scorecard
- [ ] **2–3 stat badges for guest** — credentials that establish authority (e.g., "10 Years in AI", "$50M Raised", "3x Founder")
- [ ] **2–3 key stats mentioned** — numbers pulled from conversation for big-stat-reveal and kpi-dashboard

### Optional

- [ ] Guest headshot (for person-scorecard with-photo variation)
- [ ] Company logos mentioned in conversation (for logo-endorsement)
- [ ] Topic keywords for text strip labels
- [ ] Episode title / show branding for intro card

### Sourcing Guide

| Asset Type | Source |
|---|---|
| Podcast video | Riverside (preferred), Zoom, StreamYard, or studio |
| Transcript | Descript auto-transcription (includes word-level timestamps) |
| Guest info | LinkedIn profile, guest bio, pre-interview brief |
| Logos | Company websites or brand asset pages |
| Stock footage | Rarely needed for podcasts — graphics cover it |

---

## Pacing Rules

Podcast content requires aggressive pacing cleanup before B-roll is applied. These rules come from real production experience:

### Audio Cleanup (Before B-Roll)
- **Remove all silences > 1.5 seconds** — flat audio waves between sentences get cut
- **Remove filler chains** — "Yeah, I mean, I think... I think it's..." → keep just the meat of the sentence
- **Clean overlapping agreements** — when one speaker says "Yeah... exactly... right..." in the background, lower their audio or cut entirely
- **Fix stutters** — "I... I wanted" → "I wanted"
- **Tighten transitions** — cut interviewer setup questions to essentials

### Visual Pacing
- **Punch-in every 20–30 seconds** if using a single camera angle — subtle zoom (1.0 → 1.05 scale) prevents visual fatigue
- **Scene changes align to topic shifts** — don't change the B-roll scene mid-thought
- **Keep high-energy segments tight** — don't cut passion, but ensure space between sentences is air-tight
- **Reserve last 15–20 seconds** for YouTube end screen cards

---

## Production Workflow

### Step 1 — Gather Inputs
Collect podcast recording, transcript, and guest details.

### Step 2 — Transcript Analysis
This is the most important step for podcasts. Read the full transcript and:
- **Mark the hook** — find the single most compelling 15–30s moment (often an analogy, a surprising stat, or a controversial take)
- **Identify 3–5 topic segments** — major discussion topics with approximate timestamps
- **Flag quotable moments** — one-liners worth putting on screen as text overlays
- **Mark pacing issues** — dead air, filler chains, stutters (for audio cleanup)

### Step 3 — Scene Assignment
Assign a template to each topic segment. The hook moment becomes Scene 2 (Key Stat). For short-form clips, pick only the 2–3 best topics:
```
Scene 1 (0–270):    person-scorecard — "Tyler, AI Infrastructure Lead"
Scene 2 (270–480):  big-stat-reveal — "$5M Salesforce License"
Scene 3 (480–810):  comparison-split — "Traditional SaaS" vs "AI Agent Stack"
Scene 4 (810–1080): kpi-dashboard — "120B Parameters", "25 Min Bug Fix", "90% Cost Reduction"
Scene 5 (1080–1350): workflow-pipeline — "How Cursor Agent works"
Scene 6 (1350–1530): cta-comment — "Comment IS SAAS DEAD"
```

### Step 4 — Build Composition
Copy the scaffold:
```
cp -r _scaffolds/podcast/ compositions/[episode-name]/
```

Update TopPanel with podcast video, BottomPanel with scene components and timing.

### Step 5 — Asset Integration
Place video in `public/[project-name]/`, add any guest photos or logos.

### Step 6 — Review and Render
```bash
npx remotion studio  # preview
npx remotion render [CompositionId] out/[filename].mp4
```

**Review checklist:**
- [ ] Guest intro scene matches when the guest actually introduces themselves
- [ ] Hook stat is the single most compelling number from the conversation
- [ ] Middle scenes match the topics being discussed (not generic filler)
- [ ] Scene transitions align to natural topic shifts (not mid-sentence)
- [ ] Text strip labels reflect the current discussion topic
- [ ] Audio pacing has been cleaned up (no dead air, no filler chains)
- [ ] Text is readable at mobile resolution (min 28px)

---

## Example Scene Data

```json
{
  "contentType": "podcast",
  "title": "Is SaaS Dead? AI Agents Debate",
  "fps": 30,
  "totalFrames": 1530,
  "scenes": [
    {
      "scene": 1,
      "template": "person-scorecard",
      "from": 0,
      "duration": 270,
      "label": "Tyler · AI Infrastructure",
      "data": {
        "name": "Tyler",
        "title": "AI Infrastructure Lead",
        "badges": [
          { "value": "10+", "label": "Years in AI" },
          { "value": "120B", "label": "Parameter Models" },
          { "value": "Gov + Enterprise", "label": "Clients" }
        ]
      }
    },
    {
      "scene": 2,
      "template": "big-stat-reveal",
      "from": 270,
      "duration": 210,
      "label": "The $5M Question",
      "data": {
        "prefix": "$",
        "value": 5000000,
        "format": "abbreviated",
        "color": "#FF4444",
        "subtitle": "Annual Salesforce license — replaced by a vibe-coded app"
      }
    },
    {
      "scene": 3,
      "template": "comparison-split",
      "from": 480,
      "duration": 330,
      "label": "SaaS vs AI Agents",
      "data": {
        "left": {
          "header": "TRADITIONAL SAAS",
          "color": "#FF4444",
          "icon": "cross",
          "items": [
            "$5M annual licenses",
            "6-month implementation",
            "Rigid workflows",
            "Vendor lock-in"
          ]
        },
        "right": {
          "header": "AI AGENT STACK",
          "color": "#00FF88",
          "icon": "check",
          "items": [
            "Near-zero marginal cost",
            "25-minute bug fixes",
            "Adaptive workflows",
            "Open source models"
          ]
        }
      }
    },
    {
      "scene": 4,
      "template": "kpi-dashboard",
      "from": 810,
      "duration": 270,
      "label": "The Numbers",
      "data": {
        "header": "AI Agent Impact",
        "cards": [
          { "label": "Bug Fix Time", "value": 25, "suffix": "min", "color": "#00FF88" },
          { "label": "Cost Reduction", "value": 90, "suffix": "%", "color": "#00D4FF" },
          { "label": "OSS Model Size", "value": 120, "suffix": "B", "color": "#8B5CF6" }
        ]
      }
    },
    {
      "scene": 5,
      "template": "workflow-pipeline",
      "from": 1080,
      "duration": 270,
      "label": "How Cursor Agent Works",
      "data": {
        "header": "Cursor Agent Workflow",
        "status": "ACTIVE",
        "rows": [
          [
            { "label": "Developer", "sub": "Assigns Task" },
            { "label": "Cursor Agent", "sub": "Analyzes Code", "glow": true },
            { "label": "Fix Applied", "sub": "Auto-Commit" }
          ]
        ],
        "stats": [
          { "label": "Time to Fix", "value": "25 min" },
          { "label": "Human Intervention", "value": "0" }
        ]
      }
    },
    {
      "scene": 6,
      "template": "cta-comment",
      "from": 1350,
      "duration": 180,
      "label": "Join the Debate",
      "data": {
        "action": "COMMENT",
        "keyword": "SAAS IS DEAD",
        "subtitle": "Do you agree? Drop your take below"
      }
    }
  ]
}
```

---

## Short-Form Clip Extraction

For podcast episodes, you'll often extract multiple short-form clips from a single long recording. Each clip gets its own B-roll treatment:

1. **Identify 3–5 clip-worthy moments** from the full transcript (hook moments, hot takes, surprising stats)
2. **For each clip:** Apply this blueprint independently — Guest Intro → Hook → 1–2 Topic Scenes → CTA
3. **Reuse the guest person-scorecard** across all clips (same credentials)
4. **Vary the CTA keyword** per clip to track which performs best

---

## Reference Builds

| Build | Location | Type | Notes |
|---|---|---|---|
| Is SaaS Dead Editor Notes | `Editor_Bot/Is_SaaS_Dead_Editor_Notes.md` | Editor guide | Real podcast with section map + pacing rules |
| EP2 Demo Editor Notes | `Editor_Bot/EP2_Demo_Editor_Notes.md` | Editor guide | Demo format (similar overlay patterns) |
| Jon Pierpoint Short | `compositions/jon-pierpoint/` | Remotion build | Scene sequencing pattern (reusable) |
