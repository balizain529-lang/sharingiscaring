# KPI Dashboard

**Type:** Data / Authority
**Best for:** Showing metrics, stats, or KPIs that reinforce credibility. "Here's the scale of what we're dealing with."

## Layout

```
┌─────────────────────────────┐
│ HEADER LABEL         ● LIVE │
│                             │
│ ┌────────┐┌────────┐┌──────┐│
│ │ $2.4B  ││ 3,847  ││ 80.4 ││  ← 3 stat cards, values count up
│ │ +12%   ││ -2.1%  ││ HIGH ││
│ └────────┘└────────┘└──────┘│
│                             │
│ ┌─── SPARKLINE CHART ──────┐│  ← draws left-to-right
│ └──────────────────────────┘│
│                             │
│ ┌─── FLOW / PILLS ────────┐│  ← optional bottom row
│ └──────────────────────────┘│
│                             │
│     THE $20,000,000         │  ← title card, centered
│       PROBLEM               │
└─────────────────────────────┘
```

## Animations

1. **Frame 0:** Header fades in from top
2. **Frame 4-18:** Stat cards slide up staggered (every 4-6 frames), values count up from 0 with ease-out cubic over 45 frames
3. **Frame 14+:** After count-up settles, values "tick" with ±3 jitter to simulate live data
4. **Frame 14-20:** Sparkline draws left-to-right with stroke-dashoffset, gradient fill reveals below via clip-path
5. **Frame 24-38:** Flow pills pop in one by one with scale spring, arrows pulse between them
6. **Frame 40+:** Title card scales in (0.9 → 1.0), accent color shimmers via hue rotation

## Live Dot

Pulsing green dot (sin wave opacity 0.6-1.0) next to "LIVE" label.

## Data Shape

```json
{
  "template": "kpi-dashboard",
  "header": "SUPPLY CHAIN",
  "cards": [
    { "label": "Total Spend", "prefix": "$", "value": 24, "suffix": "B", "sub": "+12%", "subColor": "green" },
    { "label": "Suppliers", "value": 3847, "sub": "-2.1%", "subColor": "red" },
    { "label": "Risk Score", "value": 804, "sub": "HIGH", "subColor": "orange", "decimals": true }
  ],
  "sparkline": true,
  "flow": ["Raw Materials", "Manufacturing", "Distribution"],
  "title": { "line1": "THE $20,000,000", "line2": "PROBLEM", "accentWord": "$20,000,000" }
}
```

## Variations

- **2 cards** — wider, more prominent
- **4 cards** — 2x2 grid
- **No sparkline** — just cards + title
- **No flow row** — cards + sparkline + title
- **Bar chart** instead of sparkline (vertical bars with staggered height animation)

## Background Video (REQUIRED)

```json
"backgroundVideo": { "query": "abstract data visualization", "opacity": 0.22 }
```

**Suggested queries:** "abstract data visualization", "blue particle animation", "tech network nodes", "futuristic dashboard glow", "data center servers"

## Polish Checklist

| Issue | Cause | Fix |
|---|---|---|
| Percentages tick above 100% | `value: 99` with default ±1 tickRange | Set `tickRange: [-3, 0]` per-card OR use `defaultTickRange()` from `motion-presets.ts` |
| Numbers feel inflated for small team | "2.7M records" reads pretentious | Scale to actual business — "50K+" or "12K active users" reads honest |
| Cards static after count-up | Settled too quickly, no live tick | Component now adds settled tick + breathe scale (`MOTION.continuous.breathe`) |
| Dashboard reads "B2B/corporate" | Multi-card grid signals enterprise | For creator content, use `big-stat-reveal` (single hero number) instead |
| Cards too small at horizontal | Default `padding: 18px 14px` was vertical-sized | Use `padding: 24px 18px` and `fontSize: 52` for values at 1920×1080 |
| Sparkline draws too fast | Default damping makes draw feel rushed | Use `MOTION.spring.settle` (damping 30) for slower deliberate draw |
