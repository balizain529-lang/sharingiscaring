# Session Report — Asset Enhancement + Refinement Layer
### April 25, 2026

---

## Goal

Address two distinct gaps in the B-Roll pipeline:

1. **Visual richness** — components had text-only nodes, empty `imageUrl` fields, solid `#0B1222` backgrounds. User asked what online resources / MCPs the headless render server could access.
2. **First-pass quality** — every video took 3-4 render rounds to refine. Common issues kept getting re-discovered. User asked for templates/guides that help refine low-quality first-pass animations.

---

## What Was Built

### Tier 1 — Free Asset Sources (no paid AI generation)

| Source | What it adds | Cost | Status |
|---|---|---|---|
| **Iconify** | 275K icons for workflow-pipeline + node-graph nodes | Free, no API key | Wired into components |
| **Brandfetch** | Auto-populated logos in LogoEndorsement | Free 500K req/mo | n8n enrichment node |
| **Pexels** | Stock video backgrounds for cutaways | Free 200/hr | n8n enrichment node |
| **Pixabay** | Stock video fallback when Pexels misses | Free 100/min | n8n enrichment node |
| **Mixkit / Coverr** | Curated stock video (no API needed) | Free direct URLs | Documented as fallback |
| **Unsplash** | Stock photos when video isn't right | Free 50/hr | Documented |
| **LottieFiles API** | Expand the 4-Lottie library | Free | Documented for future |

**Explicitly skipped:** FAL.ai / Replicate / paid AI video generation (per user direction).

### Tier 2 — Animation Refinement Layer

The bigger insight: codify the LEARNINGS.md "what went wrong / learned" entries into reusable infrastructure so first-pass renders get better, faster.

1. **Motion preset library** ([b-roll-remotion/src/data/motion-presets.ts](b-roll-remotion/src/data/motion-presets.ts)) — centralized animation constants. `MOTION.spring`, `MOTION.continuous` (breathe/glowPulse/floatY/travelDot/hueShift), `MOTION.pacing` (cutawayMinFrames/MaxFrames/overlap), `defaultTickRange()` helper.

2. **Per-scene Polish Checklists** — added to all 10 [templates/*.md](templates/) files. Each is an issue → fix table mapping documented gotchas to concrete fixes.

3. **Refinement references doc** — new [templates/refinement-references.md](templates/refinement-references.md) — pointers to consult when first render feels off (pacing, motion, layout, edge cases, asset gaps).

4. **First-pass diagnostic checklists** — added to all 3 [prompts/*.txt](prompts/) files. Claude walks through the checklist before outputting JSON; flags or auto-corrects issues like duration too short, percentages overflowing, empty comparison sides.

---

## Files Changed

### Code (5 files)
- [`b-roll-remotion/src/data/schema.ts`](b-roll-remotion/src/data/schema.ts) — added `icon?`, `backgroundVideo?`, `_polishNotes?` fields
- [`b-roll-remotion/src/data/motion-presets.ts`](b-roll-remotion/src/data/motion-presets.ts) — NEW, motion constants library
- [`b-roll-remotion/src/components/scenes/WorkflowPipeline.tsx`](b-roll-remotion/src/components/scenes/WorkflowPipeline.tsx) — Iconify icon rendering on nodes
- [`b-roll-remotion/src/components/scenes/NodeGraph.tsx`](b-roll-remotion/src/components/scenes/NodeGraph.tsx) — Iconify icon rendering on nodes
- [`b-roll-remotion/src/compositions/dynamic/DynamicCutaway.tsx`](b-roll-remotion/src/compositions/dynamic/DynamicCutaway.tsx) — backgroundVideo layer in CutawayOverlay

### Documentation (12 files)
- All 10 `templates/*.md` files — added Polish Checklist section
- [`templates/refinement-references.md`](templates/refinement-references.md) — NEW, curated refinement guide
- All 3 `prompts/*.txt` files — added Asset Enrichment Hints + First-Pass Diagnostic

### n8n (1 file)
- [`n8n-workflows/drive-watcher-v3-enriched.json`](n8n-workflows/drive-watcher-v3-enriched.json) — NEW, adds Brandfetch + tiered stock footage enrichment between scene generation and Drive save

---

## Architecture Pattern (clean separation preserved)

```
Claude (in n8n) generates scene JSON with hints
    ↓ (Iconify names, brand names, stock queries)
n8n enriches the config
    ↓ (Brandfetch fills imageUrl, Pexels/Pixabay fills backgroundVideo.url)
Remotion render server reads enriched config
    ↓ (components fetch icons inline; URLs already populated)
MP4 output
```

Refinement happens at **build-time, not render-time** — checklists guide Claude and human reviewer. Render just executes.

---

## Verification

- `npx remotion compositions` — all **19 compositions bundle successfully** (no regressions to YtScraperIntro, JonPierpointShort, or any existing work)
- `npx tsc --noEmit` — clean compile (only pre-existing moduleResolution deprecation warning)

---

## Required Env Variables (for company n8n instance)

When the company instance imports `drive-watcher-v3-enriched.json`, these need to be set:

| Variable | Purpose | Free tier |
|---|---|---|
| `ANTHROPIC_API_KEY` | Claude scene generation | Pay-as-you-go |
| `OPENAI_API_KEY` | Whisper transcription | $0.006/min |
| `BRANDFETCH_API_KEY` | Logo lookup | 500K req/mo free |
| `PEXELS_API_KEY` | Stock video | 200/hr free |
| `PIXABAY_API_KEY` | Stock video fallback | 100/min free |
| `CLICKUP_LIST_ID` | Review task creation | n/a |

---

## Cost Per Video (unchanged)

- Whisper transcription: ~$0.01 (60s video)
- Claude API: ~$0.03
- Brandfetch / Pexels / Pixabay / Iconify: $0
- **Total: ~$0.04 per video** (rendering still done locally / via render server when deployed)

---

## What's Not in This Session

- No deploy to personal n8n instance (workflow JSON saved as file for company import later)
- No render server deployment (still pending Tyler's hosting decision)
- No music/audio overlay (deferred — requires FFmpeg post-processing)
- No motion-presets refactor of existing scene components (mechanical, deferred)

---

## Next Session Pickup

1. **When company n8n is provisioned:** Import `drive-watcher-v3-enriched.json`, set env vars, configure folder triggers.
2. **When render server hosting is decided:** Deploy the existing `render-server/` code to chosen platform.
3. **Optional:** Refactor scene components to use `motion-presets.ts` (cosmetic — consolidates inline `Math.sin` patterns into reusable functions).
