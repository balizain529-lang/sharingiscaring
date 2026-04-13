---
pdf_options:
  format: Letter
  margin: 30mm 25mm
  headerTemplate: '<div></div>'
  footerTemplate: '<div style="font-size:8px;color:#888;width:100%;text-align:center;margin:0 auto;">TrueHorizon AI — B-Roll Automation — Confidential</div>'
  displayHeaderFooter: true
stylesheet: []
body_class: deck
---

<style>
  body { font-family: Inter, -apple-system, system-ui, sans-serif; color: #1a202c; line-height: 1.6; }
  h1 { color: #0E7490; font-size: 28px; border-bottom: 3px solid #0E7490; padding-bottom: 8px; }
  h2 { color: #0F1B2D; font-size: 22px; margin-top: 40px; page-break-before: always; }
  h2:first-of-type { page-break-before: avoid; }
  h3 { color: #0E7490; font-size: 16px; }
  table { border-collapse: collapse; width: 100%; margin: 16px 0; font-size: 13px; }
  th, td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }
  th { background: #0F1B2D; color: white; font-weight: 600; }
  tr:nth-child(even) { background: #f7fafc; }
  code { background: #f0f4f8; padding: 2px 6px; border-radius: 3px; font-size: 12px; }
  pre { background: #0F1B2D; color: #00D4FF; padding: 16px; border-radius: 8px; font-size: 11px; overflow-x: auto; }
  strong { color: #0F1B2D; }
  hr { border: none; border-top: 2px solid #e2e8f0; margin: 32px 0; }
  .page-break { page-break-after: always; }
</style>

# B-Roll Automation Pipeline
### TrueHorizon AI — Internal Technical Overview
### April 2026

---

## Slide 1: Remotion as Foundation

### Why Remotion over paid tools

**The problem:** We publish 3-4 videos/week. Our editor ghosted us. Paid tools (Descript $33/mo, OpusClip $29/mo, Storyblocks $30/mo) give us someone else's templates with zero customization.

**Remotion is React for video.** Every animation, every graphic, every transition is a React component. Our entire engineering team already knows the stack.

**Current state:**
- 10 parameterized scene components (scorecards, dashboards, pipelines, graphs, CTAs)
- 2 composition formats: Split-screen + Cutaway (team's preferred)
- JSON-driven: feed a config, get a video — no manual editing
- Scene registry pattern: adding a new visual = one React file

| | Paid Tools | Remotion |
|---|---|---|
| **Monthly cost** | $92-127/mo | $5-15/mo (API calls only) |
| **Customization** | Their templates | Our templates, infinite control |
| **Scalability** | Per-seat licensing | Runs anywhere, no limits |
| **Brand consistency** | Generic stock | Exact design system match |
| **Extendability** | Locked platform | Add any React component |
| **Team knows it** | New tool to learn | It's React — everyone knows it |

**10 scene types available today:**

| Category | Components |
|---|---|
| Credibility | Person Scorecard, Logo Endorsement |
| Data & Metrics | KPI Dashboard, Big Stat Reveal, Data Table |
| Process & Technical | Workflow Pipeline, Node Graph, Timeline Steps |
| Contrast & CTA | Comparison Split, CTA Comment |

---

## Slide 2: The Automation Pipeline

### Film → Drop → Done

The entire pipeline is orchestrated by n8n Cloud. The only manual step is filming.

**Step 1 — FILM** (manual, 60 seconds)
Record your short-form video. Screen Studio, phone, webcam — whatever.

**Step 2 — DROP** (automatic trigger)
Drop the MP4 into a Google Drive folder. The folder name determines the content type:
`/technical-walkthrough/`, `/case-study/`, or `/podcast/`

**Step 3 — TRANSCRIBE** (automatic, Whisper API)
OpenAI Whisper converts speech to timestamped text. Cost: $0.006/minute.

**Step 4 — GENERATE** (automatic, Claude API)
Claude reads the transcript, matches segments to scene templates, and outputs a complete scene config JSON. Cost: ~$0.03/video.

**Step 5 — DELIVER** (automatic)
Scene config saved to Google Drive. ClickUp review task created with scene breakdown.

**Step 6 — RENDER** (Phase 2, needs render server)
Remotion renders the final MP4 with animated B-roll overlaying the speaker video.

| Step | Tool | Cost | Status |
|---|---|---|---|
| Transcribe | OpenAI Whisper | $0.006/min | Live |
| Generate scenes | Claude API | ~$0.03/video | Live |
| Save config | Google Drive | Free | Live |
| Create task | ClickUp | Free | Live |
| Render MP4 | Remotion server | ~$0.10/video | Phase 2 |
| **Total per video** | | **~$0.14** | |

---

## Slide 3: Roadmap & Next Steps

### Three phases to full automation

**Phase 1 — COMPLETE**
- 10 animated scene components built in Remotion
- n8n workflows deployed: Google Drive watcher + Form intake
- Whisper auto-transcription from raw MP4
- Claude scene generation for 3 content types
- Cutaway format (full-screen speaker + graphics overlay)
- DynamicCutaway + DynamicShort compositions
- Scene JSON schema (contract between Claude and Remotion)

**Phase 2 — NEXT (needs render server, ~$5-10/mo)**
- Deploy render server on Railway or VPS
- n8n triggers Remotion render automatically
- Final MP4 lands in Google Drive ready for review
- One-button publish via existing Blotato integration
- **Gerald to help with deployment + infra**

**Phase 3 — FUTURE**
- New scene templates as needed (one React file each)
- Auto music overlay
- Thumbnail generation from scene config
- A/B test different B-roll styles per content type
- Connect to Instagram reel topic idea generator → fully automated short-form pipeline

### The vision

Film a 60-second video. Walk away. Get a polished short with animated B-roll in your Google Drive, a ClickUp task to review it, and one click to publish via Blotato.

**Total human effort: filming.**

### Cost comparison

| Approach | Monthly | Per Video | Quality |
|---|---|---|---|
| Freelance editor | $700-2,400 | $50-150 | Medium, unreliable |
| Paid tool stack (Option B) | $92 | ~$6 | Medium-High |
| **Our pipeline** | **$5-15** | **~$0.14** | **High, fully custom** |
