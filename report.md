# B-Roll Automation Report

## Context

Team is publishing 3-4 videos/week (founder intros, technical walkthroughs, case studies, short-form clips). Current editor (H) is slow and unreliable. Goal: reduce dependency on external editors by automating B-roll generation and insertion.

---

## Tool Landscape

### Tier 1 — AI-Powered Video Editors (Auto B-Roll Insertion)

| Tool | What It Does | Best For |
|------|-------------|----------|
| **Descript** | Transcription-based editor. Auto B-roll feature matches stock clips to transcript keywords. Drag-and-drop timeline. | Long-form editing + auto B-roll overlay |
| **OpusClip** | Takes long-form video, auto-generates short-form clips with captions, B-roll, and hooks. | Repurposing long-form into shorts |
| **CapCut Pro** | Free/cheap editor with auto-captions, effects, templates. AI B-roll matching in newer versions. | Budget-friendly, quick short-form edits |
| **InVideo AI** | Prompt-to-video. Describe what you want, it assembles stock clips, narration, text. | Generating explainer/promo videos from scratch |
| **Pictory** | Script/blog-to-video. Matches stock B-roll to text blocks automatically. | Turning written content into video |
| **Veed.io** | Browser-based editor with auto-subtitles, stock B-roll library, templates. | Quick web-based editing |

### Tier 2 — AI Video Generation (Custom B-Roll Clips)

| Tool | What It Does | Best For |
|------|-------------|----------|
| **Runway Gen-3** | Text/image-to-video. Generate 5-10s custom clips from prompts. | Custom B-roll that doesn't exist in stock |
| **Pika Labs** | Similar to Runway, text-to-video generation. | Quick concept clips |
| **Kling AI** | High-quality AI video generation, longer clips possible. | Longer custom B-roll segments |
| **Sora (OpenAI)** | Text-to-video, high fidelity. | Premium custom B-roll |
| **HeyGen** | AI avatar videos. Clone yourself or use stock avatars. | Presenter/talking head alternatives |

### Tier 3 — Stock Footage Libraries

| Tool | What It Does | Best For |
|------|-------------|----------|
| **Storyblocks** | Unlimited downloads on subscription. Large library. | Bulk B-roll needs on a budget |
| **Artgrid** | Cinematic stock footage, unlimited downloads. | Higher-end production value |
| **Pexels / Pixabay** | Free stock footage. Decent for generic B-roll. | Zero-budget filler clips |

### Tier 4 — DIY Automation (Claude + FFmpeg)

Use Claude Code to build a scripted pipeline:
1. Feed transcript/script to Claude
2. Claude identifies B-roll moments and suggests clips (keywords, descriptions)
3. Script pulls from stock library API (Pexels API is free) or triggers AI generation
4. FFmpeg assembles the final video (overlay B-roll on talking head, add captions)

**Pros:** Fully customizable, no per-video cost after setup, scales infinitely.
**Cons:** Requires upfront dev time, quality depends on pipeline tuning.

---

## Recommendation for Our Use Case

**Primary need:** 3-4 videos/week, mostly talking-head + B-roll overlays, plus short-form cuts.

### Recommended Stack (Best Bang for Buck)

1. **Descript** (core editor) — auto-transcription, auto B-roll from stock, easy timeline editing. Team members can self-edit.
2. **OpusClip** (short-form) — auto-chop long-form into shorts with B-roll and captions for distribution.
3. **Pexels API + Claude Code** (automation layer) — free stock B-roll pulled programmatically, Claude suggests clip keywords from script.

### Why This Stack
- Descript replaces the human editor for 80% of the work
- OpusClip handles the short-form repurposing automatically
- Free stock + AI suggestions keep per-video cost near zero for B-roll sourcing
- No dependency on a single slow editor — anyone on the team can produce

### What to Skip (For Now)
- **Runway/Sora/Kling** — AI-generated video is impressive but expensive per-clip and inconsistent. Better as a supplement, not a primary B-roll source.
- **Synthesia/HeyGen** — avatar tools are great for training videos but not our content style.
- **InVideo/Pictory** — good for zero-effort content, but quality may not match our brand.
