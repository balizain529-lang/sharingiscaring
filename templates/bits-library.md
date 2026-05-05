# `remotion-bits` — Animation Building Blocks

`remotion-bits` is installed as an npm dependency in [b-roll-remotion/](../b-roll-remotion/). MIT licensed, ~313 stars, free.

**Import from anywhere:**

```tsx
import {
  TypeWriter,
  AnimatedText,
  AnimatedCounter,
  Particles,
  Spawner,
  Behavior,
  Scene3D,
  Step,
  Element3D,
  StaggeredMotion,
  GradientTransition,
  MatrixRain,
  CodeBlock,
  useViewportRect,
} from "remotion-bits";
```

Live reference render: [`out/bits-showcase.mp4`](../b-roll-remotion/out/bits-showcase.mp4) — open this when picking a bit.
Live preview: `npx remotion studio` → composition `BitsShowcase`.

---

## When to reach for a bit

| Need | Bit | Why |
|---|---|---|
| Type out a string with a cursor | `TypeWriter` | CLI sims, terminal scenes, "we built X..." reveals |
| Animate text in/out, glitch effects, character split | `AnimatedText` | Title cards, CTA stings, kinetic transitions |
| Count up to a number with custom prefix/suffix | `AnimatedCounter` | Replaces hand-rolled count-up logic in `BigStatReveal` and `KpiDashboard` |
| Particle effects (fireflies, snow, fountain, grid) | `Particles` + `Spawner` + `Behavior` | Backgrounds, celebrations, ambient depth |
| Camera-based 3D scene with step transitions | `Scene3D` + `Step` + `Element3D` | Architecture diagrams in 3D, presentation flyovers |
| Stagger child entrances (top-down, center-out, etc.) | `StaggeredMotion` | List reveals, card stacks, timeline phases |
| Smooth gradient transitions (Oklch perceptual color) | `GradientTransition` | Background color sweeps, mood shifts |
| Matrix-style falling code rain | `MatrixRain` | Hacker / data-flowing vibe |
| Syntax-highlighted animated code reveal | `CodeBlock` | Code-on-screen scenes for technical content |

---

## How to use bits inside our existing templates

The bits are **drop-in replacements or additions** — they don't require reworking the scene config schema. Use them inside any scene component.

### Example 1 — replace count-up logic in `BigStatReveal`

Today `BigStatReveal.tsx` has hand-rolled count-up math (`Math.round(eased * data.value)`). It can be replaced with:

```tsx
import { AnimatedCounter } from "remotion-bits";

<AnimatedCounter
  transition={{ values: [0, data.value], duration: 50, ease: "out-cubic" }}
  prefix={data.prefix}
  postfix={data.suffix}
  style={{ fontSize: 240, fontWeight: 900, color: data.color }}
/>
```

Same visual result, fewer lines, consistent across the project.

### Example 2 — add particle background to a `kpi-dashboard` scene

```tsx
import { Particles, Spawner, Behavior, useViewportRect, StaggeredMotion } from "remotion-bits";

const KpiDashboardWithFireflies = () => {
  const rect = useViewportRect();
  return (
    <>
      <Particles>
        <Spawner rate={0.3} max={60} area={{ width: rect.width, height: rect.height }}
                 position={{ x: rect.width / 2, y: rect.height / 2 }}
                 lifespan={100} velocity={{ x: 0.4, y: 0.4, varianceX: 1, varianceY: 1 }}>
          <StaggeredMotion transition={{ opacity: [0, 1, 0] }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%",
                          backgroundColor: "#00FF88", boxShadow: "0 0 16px 6px #00FF8999" }} />
          </StaggeredMotion>
        </Spawner>
        <Behavior wiggle={{ magnitude: 2, frequency: 0.1 }} wiggleVariance={1} />
      </Particles>
      <KpiDashboard data={data} />
    </>
  );
};
```

Drops a deterministic firefly layer behind any scene without touching the scene component itself.

### Example 3 — kinetic title with `AnimatedText` glitch

```tsx
<AnimatedText
  transition={{
    opacity: [0, 1],
    duration: 30,
    split: "character",
    splitStagger: 1.5,
    glitch: [1, 0],
  }}
  style={{ fontSize: 96, fontWeight: 900, color: "#00D4FF" }}
>
  OUTLIER FOUND
</AnimatedText>
```

Pairs naturally with `cta-comment` or as an opening hook frame.

---

## When NOT to use bits

- Don't replace working scene components wholesale — bits are component-level building blocks, not scene-level templates. Our 10 scenes (workflow-pipeline, kpi-dashboard, etc.) are the unit of composition; bits live *inside* them.
- The `Scene3D` system is powerful but heavyweight (pulls in `three`). Only use when 3D is the point — don't use for 2D motion that springs already handle.
- Nothing in here replaces our `motion-presets.ts` — the bits handle their own internal timing. Keep using `MOTION` for our own components.

---

## Updating

```bash
cd b-roll-remotion
npm install remotion-bits@latest --legacy-peer-deps
```

The `--legacy-peer-deps` flag is needed because remotion-bits declares React 18 as a peer dependency and we run React 19 (fully back-compatible).

`culori` must be explicitly installed — remotion-bits uses it at runtime but ships it as a devDependency. Already in our [package.json](../b-roll-remotion/package.json).

---

## Source reference

Original repo cloned at [`external-references/remotion-bits/`](../external-references/remotion-bits/) for browsing. The 46 example bits live at `external-references/remotion-bits/docs/src/bits/examples/` — copy patterns from there when building custom variants.

Deep dive write-up: [`external-references/README.md`](../external-references/README.md#deep-dive-2--remotion-bits).
