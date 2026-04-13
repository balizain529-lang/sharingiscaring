# B-Roll Automation — Remotion MVP + Supplementary Options

> Reference doc for the team. Remotion MVP build template for anyone who wants to start building, plus paid tools we can layer on for higher quality output.

---

## Part 1 — Remotion MVP Build Template

### What Is Remotion?
React-based framework for rendering videos programmatically. You define video compositions as React components, feed them data, and Remotion outputs MP4/WebM. Think of it as "React for video" — everything is code, version-controlled, and templatable.

### Architecture Overview

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐     ┌──────────┐
│  Raw Video   │────▶│  Claude (Script   │────▶│  Remotion        │────▶│  Final   │
│  + Transcript│     │  Analysis + JSON) │     │  (React Render)  │     │  MP4     │
└─────────────┘     └──────────────────┘     └─────────────────┘     └──────────┘
                            │                         ▲
                            │                         │
                            ▼                         │
                    ┌──────────────┐          ┌──────────────┐
                    │  B-Roll API   │─────────▶│  Downloaded   │
                    │  (Pexels/AI)  │          │  Clips        │
                    └──────────────┘          └──────────────┘
```

### Step-by-Step MVP

#### Step 1 — Project Setup
```bash
npx create-video@latest b-roll-automation
cd b-roll-automation
npm install
```

Key files you'll work with:
- `src/Root.tsx` — registers your compositions (video templates)
- `src/compositions/` — one folder per video type
- `src/data/` — JSON configs that Claude generates

#### Step 2 — Define Your Video Templates

Build 3 Remotion compositions matching your content types:

| Template | Content Type | Structure |
|----------|-------------|-----------|
| `FounderIntro` | Founder introduction videos | Talking head → name lower-third → B-roll cutaway → CTA |
| `TechWalkthrough` | Technical walkthroughs | Screen recording + talking head PiP → B-roll on transitions |
| `CaseStudy` | Case study / testimonial | Talking head → stat cards → B-roll → quote overlay → CTA |

Each template is a React component that reads a timeline JSON and renders accordingly.

#### Step 3 — Define the Composition JSON Schema

Claude will generate this JSON from a transcript. This is the contract between Claude and Remotion:

```json
{
  "meta": {
    "title": "Pre-Meeting Intelligence with Avalara",
    "template": "TechWalkthrough",
    "fps": 30,
    "durationInSeconds": 480
  },
  "segments": [
    {
      "type": "talking_head",
      "startSec": 0,
      "endSec": 15,
      "caption": "Let me show you how we prep for client calls..."
    },
    {
      "type": "broll_overlay",
      "startSec": 15,
      "endSec": 20,
      "query": "business meeting preparation",
      "source": "pexels",
      "transition": "crossfade",
      "caption": "...by pulling context from every touchpoint"
    },
    {
      "type": "text_card",
      "startSec": 20,
      "endSec": 24,
      "headline": "3x faster prep time",
      "subtext": "Across 200+ client meetings",
      "style": "stat"
    }
  ],
  "style": {
    "captionFont": "Inter",
    "captionPosition": "bottom",
    "brandColor": "#1a73e8",
    "logoPath": "./assets/logo.png"
  }
}
```

#### Step 4 — Claude Prompt for Transcript → JSON

Feed Claude the transcript and get back the composition JSON:

```
You are a video editor. Given the following transcript and video type,
output a Remotion composition JSON.

Rules:
- Insert B-roll overlays every 30-60 seconds of continuous talking head
- Keep B-roll segments 3-7 seconds each
- Add a text card for any stat, number, or key claim
- Use "pexels" as default source; flag segments where stock won't work
  (mark source as "ai_generate" with a detailed visual prompt)
- Add captions for every segment
- Match transitions to pacing (crossfade for slow, cut for fast)

Video type: [FounderIntro | TechWalkthrough | CaseStudy]
Transcript:
[paste transcript here]
```

#### Step 5 — B-Roll Fetching Script

A Node script that reads the composition JSON and downloads clips:

```
For each segment where type === "broll_overlay":
  if source === "pexels":
    → Hit Pexels Video API with the query field
    → Download top result to /public/broll/
  if source === "ai_generate":
    → Call Replicate (Hailuo 2.3) or Runway API with the prompt
    → Download generated clip to /public/broll/
```

Pexels API is free (rate-limited). No cost for stock B-roll.

#### Step 6 — Render

```bash
# Preview in browser
npx remotion studio

# Render to MP4
npx remotion render src/index.ts FounderIntro out/video.mp4
```

For batch rendering or cloud rendering, Remotion supports Lambda deployment.

### MVP Deliverables Checklist

- [ ] Remotion project initialized with 3 composition templates
- [ ] Composition JSON schema defined
- [ ] Claude prompt tested and producing valid JSON from real transcripts
- [ ] Pexels API integration fetching relevant clips
- [ ] One end-to-end video rendered (founder intro is simplest to start)
- [ ] Brand assets loaded (logo, colors, fonts)

### MVP Cost: $0/mo
Only costs are Claude usage (which we already have) and dev time to build.

---

## Part 2 — Paid Tools to Supplement / Augment

These layer ON TOP of the Remotion pipeline for higher quality output. Pick and choose based on need.

### For Better B-Roll (Replace or Supplement Pexels)

| Tool | What It Adds | Cost | When to Use |
|------|-------------|------|-------------|
| **Storyblocks** | Unlimited premium stock footage, larger/better library than Pexels | $30/mo | When Pexels clips feel generic or limited for your niche |
| **Artgrid** | Cinematic-quality stock, 4K, LOG color grading options | $25-40/mo | When production value matters (case studies, client-facing) |
| **Hailuo 2.3 via Replicate** | AI-generated custom clips, cheapest AI gen option | ~$0.28/clip | When no stock clip exists for the concept (abstract ideas, product visuals) |
| **Runway Gen-3 Turbo** | Higher-fidelity AI video gen, best prompt adherence | ~$0.50/clip | When Hailuo quality isn't enough, need specific scenes |

**Recommendation:** Start with Pexels (free). Add **Storyblocks ($30/mo)** first if stock quality is an issue. Add **Hailuo via Replicate** on a per-clip basis for custom AI B-roll only when stock doesn't cut it.

### For Short-Form Repurposing

| Tool | What It Adds | Cost | When to Use |
|------|-------------|------|-------------|
| **OpusClip Pro** | Auto-chops long-form into shorts with captions, hooks, B-roll | $29/mo | Fast turnaround on short-form without manual clipping |
| **CapCut Pro** | Quick manual short-form edits, trendy effects, auto-captions | $10/mo | One-off edits, platform-specific tweaks (TikTok, Reels) |

**Recommendation:** Remotion CAN render short-form too (just change the aspect ratio and duration in composition config). But **OpusClip ($29/mo)** is useful as a quick-and-dirty alternative when you don't need precise control — just feed it the long-form video and distribute what it produces.

### For Editing Without Code

| Tool | What It Adds | Cost | When to Use |
|------|-------------|------|-------------|
| **Descript Business** | Transcription-based editor, auto B-roll, team members can self-edit | $33/mo | When a non-technical team member needs to edit a video manually |

**Recommendation:** Keep this as a fallback for when someone needs to do a quick edit without touching code. Not a replacement for Remotion, but a safety net.

### For AI Avatars / Talking Heads (Future)

| Tool | What It Adds | Cost | When to Use |
|------|-------------|------|-------------|
| **HeyGen** | AI avatar clones, generate talking head without recording | $30+/mo | If you want to skip recording entirely for some content types |

**Recommendation:** Not needed now. Revisit if the team wants to scale content without more recording sessions.

---

## Part 3 — Suggested Spend Tiers

### Tier 0 — Free (MVP Only)
| Component | Cost |
|-----------|------|
| Remotion + Claude + Pexels API | **$0/mo** |

Good for: proving the pipeline works, producing the first few videos.

### Tier 1 — Light Spend ($30-60/mo)
| Component | Cost | Why |
|-----------|------|-----|
| Remotion + Claude + Pexels | $0 | Core pipeline |
| Storyblocks | $30 | Better stock B-roll |
| **Total** | **$30/mo** | |

Good for: consistent quality across all video types.

### Tier 2 — Quality Focused ($90-120/mo)
| Component | Cost | Why |
|-----------|------|-----|
| Remotion + Claude + Pexels | $0 | Core pipeline |
| Storyblocks | $30 | Premium stock |
| OpusClip Pro | $29 | Auto short-form |
| Hailuo clips (~50/mo) | ~$14 | Custom AI B-roll when needed |
| **Total** | **~$73/mo** | |

Good for: high-quality long-form + automated short-form distribution.

### Tier 3 — Premium ($120-160/mo)
| Component | Cost | Why |
|-----------|------|-----|
| Remotion + Claude + Pexels | $0 | Core pipeline |
| Storyblocks | $30 | Premium stock |
| OpusClip Pro | $29 | Auto short-form |
| Descript Business | $33 | Manual editing fallback |
| Runway/Hailuo budget | ~$30 | Custom AI B-roll at scale |
| **Total** | **~$122/mo** | |

Good for: maximum flexibility — programmatic + manual + AI-generated, covering every scenario.

---

## Part 4 — How These Fit Together

```
                    ┌──────────────────────────────┐
                    │     REMOTION PIPELINE          │
                    │     (Core — always runs)       │
                    │                                │
  Transcript ──────▶│  Claude → JSON → Render → MP4  │
                    │         ▲                      │
                    │         │ B-Roll clips          │
                    └─────────┼──────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
        ┌─────▼─────┐  ┌─────▼─────┐  ┌──────▼──────┐
        │  Pexels    │  │ Storyblocks│  │ Hailuo/     │
        │  (Free)    │  │ ($30/mo)   │  │ Runway      │
        │            │  │            │  │ (per-clip)  │
        └────────────┘  └────────────┘  └─────────────┘
              │
              │  Long-form MP4 output
              ▼
        ┌────────────┐
        │  OpusClip   │──────▶ Auto-generated shorts
        │  ($29/mo)   │
        └────────────┘
```

---

## Quick Start for Mallika

1. **Install Remotion:** `npx create-video@latest b-roll-automation`
2. **Build the `FounderIntro` template first** — simplest structure (talking head + 3-4 B-roll cutaways + name card + CTA)
3. **Test the Claude prompt** — paste a real founder intro transcript, get the JSON back, validate it renders
4. **Wire up Pexels API** — free, gets you 80% of the way on B-roll
5. **Render one real video end-to-end** — compare quality vs. what editor H was producing
6. **Decide on supplements** — if stock B-roll feels weak, add Storyblocks. If you need custom visuals, try Hailuo via Replicate

The whole MVP should be buildable in a focused session. Everything after that is polish and adding paid layers for quality.
