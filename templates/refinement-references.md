# Refinement References

Curated pointers for when a first-pass render feels off. Not a comprehensive guide — a short list of what to consult when something specific is wrong.

---

## When something feels off, look here first

### Pacing feels slow / dead air

- [LEARNINGS.md → "Pacing — cutaways are CUT-aways, not takeovers"](../LEARNINGS.md) — project's own documented pacing rules
- Each cutaway: **6–12 seconds** (`MOTION.pacing.cutawayMinFrames`/`cutawayMaxFrames`)
- Speaker between cutaways: **6–9 seconds**
- Open speaker-first 5–7s, close speaker-first 10–15s+
- [Remotion Recipes](https://www.remotion.dev/recipes) — official patterns for `<Sequence>`, transitions, timing

### Motion feels flat / corporate / static

- [LEARNINGS.md → "Motion — static after entrance is boring"](../LEARNINGS.md)
- Use the helpers in [motion-presets.ts](../b-roll-remotion/src/data/motion-presets.ts):
  - `MOTION.continuous.breathe` — subtle scale "breathing" on cards
  - `MOTION.continuous.glowPulse` — pulsing glow on shadows
  - `MOTION.continuous.floatY` — gentle drift on list items
  - `MOTION.continuous.travelDot` — moving dot along connectors
- [Easings.net](https://easings.net) — visual easing curve picker. Project default is cubic ease-out.
- [Material Motion Guidelines](https://m3.material.io/styles/motion) — timing tokens (50ms incremental, 200-300ms standard duration)

### Layout broken at non-default aspect ratio

- [LEARNINGS.md → "Scene components were designed for vertical 1080×1920"](../LEARNINGS.md)
- Rule of thumb: **2× the vertical defaults** for horizontal:
  - Padding: `24px 36px` → `48px 64px`
  - Headers: 22px → 28px
  - Body: 14-15px → 18px
  - Hero numbers: 64px → 180px
  - Comparison values: 28px → 64px
- Never just accept defaults — preview in Studio at the target aspect

### Numbers feel inflated / fake

- [LEARNINGS.md → "Illustrative numbers need to be believable"](../LEARNINGS.md)
- Scale to your actual business. "10M+ records" reads as B2B-pretentious for a small team.
- Percentages near 100: apply `tickRange` clamping (use `defaultTickRange()` helper from `motion-presets.ts`)

### Edge cases (empty side, zero values, etc.)

- [LEARNINGS.md → "Component edge case table"](../LEARNINGS.md)
- Known fixes:
  - `ComparisonSplit` with `right.items: []` → component now centers left column
  - `BigStatReveal` with `value: 0` → component skips hero number, renders comparison only
  - `KpiDashboard` percentage near 100 → use `tickRange: [-3, 0]`

### Icons / logos / backgrounds missing or weak

- **Icons:** Use [Iconify](https://api.iconify.design) names like `"mdi:database"`, `"ri:brain-line"`, `"lucide:cpu"` in `WorkflowPipeline` node items and `NodeGraph` nodes. 275K free icons, no API key. Browse at [icones.js.org](https://icones.js.org).
- **Logos:** Brandfetch enrichment in n8n auto-fills `imageUrl` from company `name`. If logos render as text, enrichment didn't run.
- **Backgrounds:** Add `backgroundVideo: { query: "data center" }` to a scene; n8n falls through Pexels → Pixabay → Mixkit → Coverr until one returns a result.

---

## Reference compositions — "what good looks like"

Look at these before designing a new video:

| Composition | Path | Format | What to copy |
|---|---|---|---|
| Jon Pierpoint Short | [`compositions/jon-pierpoint/`](../b-roll-remotion/src/compositions/jon-pierpoint/) | Vertical 1080×1920 | Scene sequencing, vertical pacing reference |
| YT Scraper Intro | [`out/yt-scraper-intro.mp4`](../b-roll-remotion/out/) | Horizontal 1920×1080 | 4-cutaway pattern, lower-third, horizontal scaling |
| EP² Screen B-roll | [`compositions/screens/`](../b-roll-remotion/src/compositions/screens/) | Horizontal | Screenshot-driven cutaway with KPI callouts |

External:
- [Remotion Showcase](https://www.remotion.dev/showcase) — community examples of what's possible
- [Motion Canvas Lab](https://motioncanvas.io) — alternative tool, but their examples are great motion design references

---

## External APIs in use (asset enrichment)

These are called from n8n workflows or Remotion components. All are free at our usage level.

| API | What | Free tier | Where it's used |
|---|---|---|---|
| [Iconify](https://api.iconify.design) | 275K icons | Unlimited | `WorkflowPipeline`, `NodeGraph` (inline `<img>`) |
| [Brandfetch](https://brandfetch.com/developers) | Company logos | 500K req/mo | n8n enrichment node for `LogoEndorsement` |
| [Pexels](https://www.pexels.com/api/) | Stock video/photo | 200/hr, 20K/mo | n8n enrichment for `backgroundVideo.url` |
| [Pixabay](https://pixabay.com/api/docs/) | Stock video/photo | 100 req/min | Pexels fallback |
| [Mixkit](https://mixkit.co) | Curated stock video | Direct URLs | Pexels fallback (no API needed) |
| [Coverr](https://coverr.co) | Curated stock video | Direct URLs | Pexels fallback (no API needed) |
| [Unsplash](https://unsplash.com/developers) | Stock photos only | 50 req/hr | Photo backgrounds when video isn't needed |
| [LottieFiles](https://developers.lottiefiles.com) | Animations | Free | Optional Lottie expansion |
| [OpenAI Whisper](https://platform.openai.com) | Transcription | Pay-as-you-go ($0.006/min) | n8n Drive Watcher transcribes MP4 → text |
| [Anthropic Claude](https://console.anthropic.com) | Scene generation | Pay-as-you-go (~$0.03/video) | n8n calls Claude with system prompt + transcript |

---

## How Claude should use this doc

When generating scene JSON, Claude should consult:
1. **Per-template Polish Checklist** in `templates/<template-name>.md` — issue → fix table per scene type
2. **LEARNINGS.md** — project-specific patterns (cutaway pacing, horizontal vs vertical, edge cases)
3. **This file (refinement-references.md)** — when an issue category isn't covered above

Before outputting JSON, walk through the first-pass diagnostic checklist in each prompt file (`prompts/*.txt`).
