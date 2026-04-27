# Node Graph

**Type:** Architecture / System
**Best for:** Showing how components connect — microservices, AI agents, tech stacks, org structures. Feels "technical" and impressive.

## Layout

```
┌─────────────────────────────┐
│ HEADER            ● DEPLOYED│
│ ──── green gradient line ───│
│                             │
│    ┌─────┐    ┌─────┐      │
│    │Node1├────┤Node2│      │  ← nodes at fixed x,y % positions
│    └──┬──┘    └──┬──┘      │
│       │          │          │
│    ┌──┴──┐    ┌──┴──┐      │  ← SVG edges draw in with dashoffset
│    │Node3├────┤Node4│      │    travelling dots along each edge
│    └─────┘    └─────┘      │
│                             │
│  ✓ Deployed   2.6M/s  11ms │  ← status bar at bottom
└─────────────────────────────┘
```

## Animations

1. **Frame 0:** Header fades in
2. **Frame 0-6:** Gradient underline draws left-to-right (width 0% → 100%)
3. **Frame 6-40:** Nodes pop in sequentially with scale spring (0.2 → 1.0), each with unique glow color
4. **Frame 10-40:** SVG edge lines draw in via stroke-dashoffset, matching node appearance order
5. **After edge draws:** Travelling dots move along each edge line continuously (loop every 30 frames), colored per-edge
6. **Node glow:** Each node border pulses gently (sin wave on boxShadow intensity, offset by node index for organic feel)
7. **Floating particles:** 15 teal particles drift in background
8. **Bottom status bar:** Fades in last, shows deployment metrics

## Node Definition

Each node has: label, x% position, y% position, border color, glow (boolean).

## Edge Definition

Each edge has: from node position, to node position, color, draw delay.

## Data Shape

```json
{
  "template": "node-graph",
  "header": "SYSTEM LIVE",
  "status": { "label": "DEPLOYED", "color": "green" },
  "nodes": [
    { "label": "NLP Engine", "x": 15, "y": 30, "color": "teal" },
    { "label": "SQL Pipeline", "x": 50, "y": 12, "color": "teal" },
    { "label": "Risk Scorer", "x": 85, "y": 30, "color": "orange" },
    { "label": "Intel Agent", "x": 28, "y": 68, "color": "teal" },
    { "label": "Dashboard", "x": 68, "y": 68, "color": "green" }
  ],
  "edges": [
    { "from": 0, "to": 1, "color": "teal" },
    { "from": 1, "to": 2, "color": "orange" },
    { "from": 0, "to": 3, "color": "teal" },
    { "from": 3, "to": 4, "color": "green" },
    { "from": 1, "to": 3, "color": "purple" }
  ],
  "statusBar": [
    { "icon": "✓", "text": "Deployed", "color": "green" },
    { "text": "2.6M/s", "color": "muted" },
    { "text": "11ms", "color": "teal" }
  ]
}
```

## Variations

- **3 nodes** — triangle layout, simpler
- **6+ nodes** — circular or grid arrangement
- **With labels on edges** — "auth", "data", "events" on connector lines
- **Animated build sequence** — nodes appear as if "deploying" one by one with checkmark
- **With icons** — set `icon: "mdi:cloud-cog"` on nodes to render Iconify icon next to label

## Background Video (REQUIRED)

```json
"backgroundVideo": { "query": "abstract network connections", "opacity": 0.22 }
```

**Suggested queries:** "abstract network connections", "geometric mesh nodes", "tech grid blueprint", "neural network animation", "circuit board glow"

## Polish Checklist

| Issue | Cause | Fix |
|---|---|---|
| Nodes feel sparse / abstract | Text-only labels at small sizes | Add `icon: "mdi:database"` (Iconify name) per node — renders SVG inline |
| Edges look static | Travelling dot only fires when `ep > 0.5` | Verify dot loop period is appropriate (default 30f); shorten for energetic feel |
| Hard to tell which node is "primary" | No visual hierarchy | Use `glow: true` on 1-2 hub nodes; vary colors purposefully (teal=processing, green=success, orange=risk) |
| Node positions look random | x/y picked without grid logic | Aim for symmetry — pairs at same y, hub nodes in center; sketch on paper first |
| Labels overflow the node box | Long names + small minWidth | Use 3-word max labels; abbreviate if needed (e.g., "ML" not "Machine Learning") |
| Particles distracting from nodes | Too many particles or too bright | Cap at 15, opacity ≤ 0.06, drift slowly (sin rate 0.025) |
