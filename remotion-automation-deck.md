# B-Roll Automation — Internal Deck

---

## Slide 1: Remotion as Foundation

### Why Remotion over paid tools

**The problem:** We publish 3-4 videos/week. Our editor ghosted us. Paid tools (Descript $33/mo, OpusClip $29/mo, Storyblocks $30/mo) give us someone else's templates with zero customization.

**Remotion is React for video.** Every animation, every graphic, every transition is a React component. Our entire engineering team already knows the stack.

```
Current state:
- 10 parameterized scene components (scorecards, dashboards, pipelines, graphs, CTAs)
- 2 composition formats: Split-screen (DynamicShort) + Cutaway (DynamicCutaway)
- JSON-driven: feed a config, get a video. No manual editing.
- Scene registry pattern: adding a new visual = one React file
```

| | Paid Tools | Remotion |
|---|---|---|
| Monthly cost | $92-127/mo | $5-15/mo (API calls only) |
| Customization | Their templates | Our templates, infinite control |
| Scalability | Per-seat licensing | Runs anywhere, no limits |
| Brand consistency | Generic stock | Exact design system match |
| Extendability | Locked platform | Add any React component |

---

## Slide 2: The Automation Pipeline

### Film → Drop → Done

```
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  FILM   │ →  │  DROP    │ →  │TRANSCRIBE│ →  │ GENERATE │ →  │  RENDER  │
│ 60s vid │    │ to Drive │    │ Whisper  │    │ Claude   │    │ Remotion │
│         │    │ folder   │    │ $0.006/m │    │ ~$0.03   │    │ auto MP4 │
└─────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
  Manual         Automatic        Automatic       Automatic       Automatic
                    │                                                 │
                    └── n8n orchestrates everything ──────────────────┘
                                                                      │
                                                              ┌───────▼──────┐
                                                              │   DELIVER    │
                                                              │ Drive + task │
                                                              │  → review    │
                                                              │  → publish   │
                                                              └──────────────┘
```

**What's live today on n8n Cloud:**
- Google Drive watcher — drop MP4 or transcript into subfolder
- Auto-transcription via Whisper (OpenAI) with timestamps
- Claude generates scene config matched to what speaker says
- Config saved to Drive + ClickUp review task created
- Content type auto-detected from folder: `/technical-walkthrough/`, `/case-study/`, `/podcast/`

**Cost per video: ~$0.04** (Whisper transcription + Claude API call)

---

## Slide 3: What We Build Next

### Three phases to full automation

**Phase 1 — NOW (done)**
- 10 animated scene components in Remotion
- n8n workflows: Drive watcher + Form intake
- Whisper auto-transcription
- Claude scene generation (3 content types)
- Cutaway format (team's preferred style)

**Phase 2 — NEXT (needs render server, ~$5-10/mo)**
- Deploy render server (Railway or VPS)
- n8n triggers render automatically after scene generation
- Final MP4 lands in Google Drive ready for review
- One-button publish via Blotato

**Phase 3 — FUTURE**
- New scene templates as needed (just add a React component)
- Music auto-overlay
- Thumbnail generation from scene data
- A/B testing different B-roll styles
- Connect to Instagram reel topic ideas → auto-generate short-form content

### The vision
Film a 60-second video. Walk away. Get a polished short with animated B-roll in your Drive, a ClickUp task to review it, and one click to publish. Total human effort: filming.
