# External Remotion References

Cloned May 4, 2026. **None of these are dependencies of our project** — they're standalone repos kept here for browsing and inspiration. Each is a shallow clone (latest commit only).

These folders are gitignored — they don't ship with our project. Only this README is tracked.

```bash
# Re-fetch any of them at the latest version
cd external-references/<folder>
git pull

# Update all at once
cd external-references
for d in */; do (cd "$d" && git pull); done
```

---

## 16 Repos at a Glance

### Official Remotion (`remotion-dev` org) — 12 cloned

| Folder | What it is | Useful for |
|---|---|---|
| `template-tiktok/` | Whisper-driven TikTok captions | Caption styling for short-form |
| `template-render-server/` | Reference Express render server | Compare patterns vs. our `render-server/` |
| `recorder/` | "Video production for developers" | Comprehensive in-house alternative |
| `remotion-skills/` | Claude Code agent skills for Remotion | **Install into `~/.claude/skills/`** |
| `template-music-visualization/` | Music-driven animation | Beat-reactive scenes |
| `template-code-hike/` | Beautiful code snippet animations | Technical content, code reveals |
| `github-unwrapped/` | Year-in-review style data video | Data-driven Remotion patterns |
| `template-three/` | React Three Fiber + Remotion (3D) | 3D content (architecture diagrams in 3D) |
| `template-prompt-to-motion-graphics-saas/` | Prompt-driven motion graphics SaaS | Reference for our Claude → JSON → render pattern |
| `codex-plugin/` | OpenAI Codex agent plugin | Comparison to our Claude API integration |
| `template-next-app-dir-tailwind/` | Next.js + Tailwind + Remotion | If we ever want a web UI for the pipeline |
| `template-skia/` | React Native Skia + Remotion | Cross-platform / mobile rendering |

### Community

| Folder | Stars | What it is |
|---|---|---|
| `OpenMontage/` | **3.4k** | Agentic video production system (13 pipelines, 113 tools) — see deep dive below |
| `remotion-bits/` | 313 | Reusable Remotion building blocks (MIT) — see deep dive below |
| `react-video-editor/` | 1.6k | CapCut-style web editor on Remotion |

---

## Deep Dive #1 — OpenMontage

**License:** GNU AGPLv3 (strong copyleft — derivatives + network deployments must also be open-source). ⚠️ This is a structural constraint if we want commercial flexibility. **Architectural patterns are gold; the code itself we can study but can't directly copy without contagious licensing.**

### Architecture
**Instruction-driven, agent-first.** Zero orchestration logic in code — the AI agent itself reads YAML manifests + Markdown skills and orchestrates everything. Python only provides tools and persistence.

**Three-layer knowledge stack:**
- Layer 1 (`tools/tool_registry.py`): tool inventory, cost, status
- Layer 2 (`skills/`): how OpenMontage uses tools (conventions, quality gates, schemas)
- Layer 3 (`.agents/skills/`): generic tech knowledge (API references, prompting best practices)

### 13 Pipelines (`skills/pipelines/`)
animated-explainer, animation, avatar-spokesperson, cinematic, clip-factory, documentary-montage, hybrid, localization-dub, podcast-repurpose, screen-demo, talking-head, character-animation, framework-smoke

Each pipeline runs the same shape: `research → proposal → script → scene_plan → assets → edit → compose → publish`. Each stage has a "director skill" markdown file teaching the agent exactly how to execute it.

### 113 Python tools across 8 capability families
- **Video gen** (13): Kling, Runway, Veo 3, Grok, MiniMax, HeyGen, WAN, Hunyuan, CogVideo, LTX, etc.
- **Image gen** (10): FLUX, Imagen 4, DALL-E, Recraft, Stable Diffusion, etc.
- **TTS** (4): ElevenLabs, Google TTS (700+ voices), OpenAI, Piper (free local)
- **Music**: Suno, ElevenLabs Music, ElevenLabs SFX
- **Analysis**: WhisperX (word-level), Scene Detect, CLIP/BLIP-2 video understanding
- **Enhancement**: Upscale, BG Remove, Face Restore, Color Grade, Subtitle Gen
- **Avatar**: SadTalker, MuseTalk, Wav2Lip
- **Composition**: Remotion, HyperFrames, FFmpeg

### Selector pattern (key insight)
Tools like `tts_selector`, `video_selector`, `image_selector` auto-discover providers from the registry at runtime. Adding a new image provider → all selectors automatically see it. **This is the elegant scalability pattern for our Pexels/Pixabay/AI fallback chain.**

### What to port (architectural ideas only — not code)
1. **Three-layer knowledge architecture** — separate tool discovery, project conventions, generic tech knowledge
2. **Selector pattern** — auto-discover providers (we hard-code Pexels → Pixabay; could be registry-driven)
3. **Director skills per stage** — formalize each n8n pipeline stage (transcribe-director, generate-director, enrich-director, render-director) as markdown skill files Claude reads
4. **Decision audit trail** — log every creative choice (provider, fallback, override) with confidence scores
5. **Pre-compose validation** — delivery promise enforcement, slideshow risk scoring before render
6. **Scored provider selection** — rank tools across 7 dimensions (task fit 30%, quality 20%, control 15%, reliability 15%, cost 10%, latency 5%, continuity 5%)
7. **Reference-video analysis** — paste a YouTube Short, system analyzes pacing/scenes/style, produces grounded variants

### Entry points
- AI coding assistants (Claude Code, Cursor, Copilot, Codex, Windsurf) read CLAUDE.md / CURSOR.md / etc.
- CLI via agent invocation
- Python render scripts (`render_demo.py`)
- **No native n8n integration** — agent IS the orchestrator

### Bottom line
OpenMontage is the closest thing to what we're building. AGPLv3 prevents direct copying. But the **instruction-driven architecture, selector pattern, and governance layer** are worth adopting as design principles. Effort: 1-2 weeks to refactor our pipeline using these patterns.

---

## Deep Dive #2 — remotion-bits

**License:** MIT. Free, no commercial restrictions. ✅ Can copy components directly into our project.

### What's in the box
**11 core components/hooks:**
AnimatedText, AnimatedCounter, MatrixRain, GradientTransition, StaggeredMotion, ParticleSystem, Scene3D, TypeWriter, CodeBlock, ScrollingImages, useViewportRect

**46 finished example "bits"** — standalone React components, fully data-driven, organized by category:

| Category | Count | Highlights |
|---|---|---|
| Text Animation | 8 | FadeIn, CharByChar, WordByWord, GlitchIn, GlitchCycle, MatrixRain |
| Counters | 2 | BasicCounter, CounterConfetti |
| Code | 2 | BasicCodeBlock, TypingCodeBlock |
| Gradients | 3 | Linear, Radial, Conic |
| Particles | 5 | Fireflies, Fountain, Grid, Snow, Scrolling |
| 3D Scenes | 10 | KenBurns, Carousel, CubeNavigation, CursorFlyover, FlyingThroughWords, Terminal3D |
| Stagger/Motion | 10 | CardStack, EasingsVisualizer, FractureReassemble, GridStagger, ListReveal, MosaicReframe |
| Typewriter | 4 | Basic, CLISimulation, MultiTextTypewriter, VariableSpeedTypewriter |

### Top 5 to port into our scene library

1. **Scene3D system** — Camera-based presentation flows with step transitions. Fills the gap our 2D dashboards have. Impress.js-style 3D navigation. Path: `docs/src/bits/scene-3d/`
2. **GlitchCycle + GlitchIn** — Cyberpunk-style text transitions. Pairs with our `cta-comment` for kinetic energy.
3. **ParticleSystem + Fireflies** — Full deterministic particle engine. More flexible than our hardcoded particle backgrounds. Use for celebrations + ambient backgrounds.
4. **TypeWriter (4 variants)** — Reusable across CLI sims, multi-text, variable speed. Code-on-screen scenes get a major upgrade.
5. **Transform3D utility** — Chainable 3D API with matrix operations + quaternion interpolation. Foundation for any custom 3D work.

### Other notable patterns to learn from
- **Perceptual color interpolation** via Oklch (using `culori` library) — smoother gradients than RGB
- **Quaternion-based rotation** — smooth 3D rotations without gimbal lock
- **Deterministic particles** — seeded randomness so renders are reproducible
- **Stagger directional timing** — top-down, center-out, line-by-line — baked into `StaggeredMotion`

### How to port
Each bit at `docs/src/bits/examples/**/*.tsx` is **standalone**. Cherry-pick:
1. Copy the bit file (e.g., `bit-3d-basic.tsx`)
2. Copy its dependencies (utility files like `transform3d.ts`, hooks like `useViewportRect`)
3. Drop into `b-roll-remotion/src/components/scenes/` or a new `bits/` folder
4. Adapt the data shape to our schema if needed

Alternative: use `npx jsrepo add <bit-name>` (their official installer).

### Bottom line
**Direct value, low risk.** MIT license, modular components, zero dependencies on the rest of remotion-bits. Start with Scene3D + GlitchText + TypeWriter — that's a one-day project for a meaningful expansion of our scene library.

---

## Recommended Next Actions

**This week:**
1. Install `remotion-skills/` into `~/.claude/skills/` for native Remotion authoring help in Claude Code
2. Read `template-render-server/` and diff against our `render-server/index.js` — note any patterns we're missing
3. Browse `OpenMontage/skills/pipelines/talking-head/` and `clip-factory/` — closest matches to our use case

**Next sprint:**
4. Port Scene3D + GlitchText + TypeWriter from remotion-bits into our scene library
5. Write a "director skill" markdown file per stage of our pipeline (transcribe, generate, enrich, render) — capture learnings for the agent

**Evaluate / decide:**
6. AGPLv3 ruling on OpenMontage — can we adopt code, or only ideas? (Likely ideas only.)
7. Whether `react-video-editor` is worth using or just an interesting reference (currently we don't use it; web UI is not in our roadmap)

---

## Note about earlier list

In an earlier conversation I mentioned several repos that don't actually exist:
- `remotion-dev/showcase` — there's no GitHub repo, the showcase lives at [remotion.dev/showcase](https://www.remotion.dev/showcase) as a website
- `remotion-dev/dataflow` — fabricated
- `alexkubica/remotion-templates` — fabricated
- `MrFoxPro/remotion-blender-plugin` — fabricated

The 16 repos in this folder are all real and verified. Apologies for the confusion.
