# Workflow Pipeline

**Type:** Process / Technical
**Best for:** Showing how a system works step-by-step. Agents, pipelines, data flows, API chains.

## Layout

```
┌─────────────────────────────┐
│ HEADER               ● ACTIVE│
│                             │
│ ┌──────┐ --- ┌──────┐ --- ┌──────┐ │  ← row of nodes with dotted connectors
│ │Node 1│     │Node 2│     │Node 3│ │
│ └──────┘     └──────┘     └──────┘ │
│                             │
│      2.7M          11s      │  ← big counting stats with glow
│   records       response    │
│                             │
│     AGENTIC OPERATING       │  ← title, accent word in green
│        SYSTEM               │
└─────────────────────────────┘
```

## Animations

1. **Frame 0:** Header slides down with opacity
2. **Frame 4-20:** Nodes pop in left-to-right with scale spring (0.3 → 1.0)
3. **Frame 10-22:** Dotted connector lines appear between nodes, travelling dot moves along each line continuously (loop every 24 frames)
4. **Highlighted nodes:** Glowing border pulses (sin wave boxShadow intensity), colored per-node
5. **Frame 40+:** Stats count up from 0 with ease-out cubic, text shadow glows, gentle float (sin wave ±3px)
6. **Frame 54+:** Title scales in, accent word has text-shadow glow
7. **Scan line:** Subtle horizontal teal line sweeps top-to-bottom continuously

## Dotted Connector

- 1.5px dashed line at 40-60% opacity
- 8px travelling dot, same color as connector, with boxShadow glow
- Loops every 24 frames

## Data Shape

```json
{
  "template": "workflow-pipeline",
  "header": "EP² Workflow",
  "status": { "label": "ACTIVE", "color": "green" },
  "rows": [
    {
      "nodes": [
        { "label": "Trigger", "sub": "User Query", "glow": false },
        { "label": "SQL Agent", "sub": "NLP → SQL", "glow": true, "color": "teal" },
        { "label": "Database", "sub": "2.7M Records", "glow": false }
      ]
    }
  ],
  "stats": [
    { "value": "2.7M", "label": "records queried", "color": "green" },
    { "value": "11s", "label": "response time", "color": "teal" }
  ],
  "title": {
    "text": "AGENTIC OPERATING SYSTEM",
    "accentWord": "AGENTIC",
    "accentColor": "green"
  }
}
```

## Variations

- **2 rows of nodes** — top row feeds into bottom row (like current EP² Workflow)
- **Single row** — simpler 3-5 node horizontal chain
- **Vertical flow** — nodes stack top-to-bottom with downward connectors
- **With icons** — emoji or Lottie inside each node box
