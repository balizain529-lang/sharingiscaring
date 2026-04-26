# Big Stat Reveal

**Type:** Hook / Impact
**Best for:** Opening hooks, shocking numbers, before/after comparisons. One or two massive numbers that grab attention.

## Layout

```
┌─────────────────────────────┐
│                             │
│                             │
│         $20,000,000         │  ← massive number, 60-72px, centered
│                             │
│      revenue at risk        │  ← subtitle, 20-24px, muted
│                             │
│    ── accent underline ──   │
│                             │
│    Before: $2    After: $20M│  ← optional comparison row
│                             │
└─────────────────────────────┘
```

## Animations

1. **Frame 0-8:** Background subtly brightens (BG opacity shift)
2. **Frame 4:** Number counts up from 0 → target with ease-out cubic (40-50 frames), font size 60-72px
3. **Number glow:** Pulsing textShadow on the number (sin wave), color shimmers via hue rotation (±15 degrees)
4. **Frame 20+:** Subtitle fades up (translateY 16 → 0)
5. **Frame 28+:** Accent underline draws from center outward
6. **Frame 36+:** Optional comparison row fades in — "before" in muted, "after" in accent color
7. **Particles:** 10-12 sparse particles floating for depth

## Data Shape

```json
{
  "template": "big-stat-reveal",
  "value": 20000000,
  "prefix": "$",
  "format": "abbreviated",
  "color": "green",
  "subtitle": "revenue at risk",
  "comparison": {
    "before": { "label": "Before", "value": "$2" },
    "after": { "label": "After", "value": "$20M" }
  }
}
```

## Format Options

- `"abbreviated"` — $20M, $2.4B
- `"full"` — $20,000,000
- `"compact"` — 20M
- `"percentage"` — 340%

## Variations

- **Two stats side by side** — split left/right with a divider
- **Stat + icon** — Lottie animation or emoji above the number
- **Countdown** — number counts DOWN (good for "reduced from X to Y")
- **With context line** — "That's more than the GDP of..." beneath subtitle

## Polish Checklist

| Issue | Cause | Fix |
|---|---|---|
| Giant "0" rendered | `value: 0` for comparison-only mode | Component now skips hero number when `value === 0` |
| Number reads as inflated | "10M+ records" for a small team | Scale numbers to actual business — "50K+" reads honest |
| Number too small at horizontal | Default `fontSize: 64` was sized for vertical | Use 180 for hero at 1920×1080 |
| Subtitle wraps awkwardly | Long subtitle, narrow `maxWidth` | Bump `maxWidth: 1200` for horizontal; keep ≤90 chars |
| Comparison row too cramped | Default gap 24px feels tight at horizontal | Use `gap: 48`, `fontSize: 64` for values |
| Hero number static after count-up | No continuous motion | Pulsing `textShadow` runs via `MOTION.continuous.glowPulse` |
