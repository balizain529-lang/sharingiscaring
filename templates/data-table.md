# Data Table

**Type:** Evidence / Detail
**Best for:** Showing specific records, supplier lists, risk assessments, comparison data. Reinforces claims with visible proof.

## Layout

```
┌─────────────────────────────┐
│ HEADER                ● LIVE│
│                             │
│ ┌── HERO STAT CARD ────────┐│
│ │ REVENUE AT RISK          ││
│ │ $722K  (counting up)     ││  ← big number with glow
│ │ subtitle text            ││
│ │ ████████░░░░ progress bar││
│ └──────────────────────────┘│
│                             │
│ ┌── TABLE ─────────────────┐│
│ │ SECTION HEADER      teal ││
│ │ Col1    Col2    Col3     ││
│ │ Row 1 ──────────── val   ││  ← rows slide in from left
│ │ Row 2 ──────────── val   ││
│ │ Row 3 ──────────── val   ││  ← scanning highlight sweeps
│ │ Row 4 ──────────── val   ││
│ │ Row 5 ──────────── val   ││
│ └──────────────────────────┘│
│                             │
│     REAL-TIME               │  ← title with colored words
│   REVENUE AT RISK           │
└─────────────────────────────┘
```

## Animations

1. **Frame 0:** Header fades in
2. **Frame 4-6:** Hero stat card scales in (0.85 → 1.0)
3. **Frame 6-40:** Big number counts up from $0 → target with ease-out cubic, pulsing glow (sin wave on textShadow)
4. **Frame 14+:** Progress bar fills left-to-right with gradient (orange → red), subtle boxShadow
5. **Frame 18+:** Table card fades in
6. **Frame 24-60:** Rows slide in from left one at a time (every 8 frames), translateX -20 → 0
7. **Frame 50+:** Scanning row highlight — cycles through rows (every 14 frames), active row gets colored left-border indicator bar (3px, boxShadow glow) and subtle bg tint
8. **Scan line:** Teal horizontal line sweeps down the table continuously
9. **Frame 65+:** Title scales in, accent words shimmer (hue rotation on green, textShadow on red)

## Data Shape

```json
{
  "template": "data-table",
  "header": "EP² Dashboard",
  "heroStat": {
    "label": "REVENUE AT RISK",
    "value": 722,
    "prefix": "$",
    "suffix": "K",
    "color": "green",
    "subtitle": "identified across 2.7M records"
  },
  "table": {
    "sectionHeader": "SUPPLIER INTELLIGENCE",
    "columns": ["Supplier", "Risk", "Exposure"],
    "rows": [
      { "cells": ["Acme Corp", "HIGH", "$144K"], "color": "red" },
      { "cells": ["Global Mfg", "MED", "$91K"], "color": "orange" },
      { "cells": ["TechParts Inc", "HIGH", "$213K"], "color": "red" },
      { "cells": ["MetalWorks", "LOW", "$32K"], "color": "green" },
      { "cells": ["ChemSupply", "HIGH", "$246K"], "color": "red" }
    ]
  },
  "title": {
    "line1": "REAL-TIME",
    "line2": [
      { "text": "REVENUE", "color": "green" },
      { "text": " AT ", "color": "white" },
      { "text": "RISK", "color": "red" }
    ]
  }
}
```

## Variations

- **No hero stat** — table takes full height, bigger rows
- **2-column table** — simpler, name + value
- **Color-coded rows** — entire row bg tinted by risk/status level
- **With sparklines** — mini inline charts in the last column per row

## Background Video (REQUIRED)

```json
"backgroundVideo": { "query": "data center servers", "opacity": 0.18 }
```

**Suggested queries:** "data center servers", "monitors dashboard tech", "spreadsheet scrolling", "abstract data visualization", "tech office workspace"

Use lower opacity (0.15-0.20) for data-table since the table itself has a lot of detail to read.

## Polish Checklist

| Issue | Cause | Fix |
|---|---|---|
| Rows too cramped | Default `padding: 8px 4px` per row | Use `padding: 12px 8px` at horizontal aspect |
| Active-row scan too fast | 14-frame interval feels frantic | Bump to 18-20 frames per row for calmer scan |
| All rows same color | No risk/severity hierarchy | Use `row.color` per row (red=high, orange=med, green=low) |
| Hero stat number static | No glow after count-up settles | Component adds pulsing `textShadow` via `MOTION.continuous.glowPulse` |
| Table feels like a spreadsheet | Default styling reads "data dump" | Add scanning highlight + `TableScan` overlay; one row should always feel "live" |
| Numbers + columns don't align | Default `justify-content: flex-start` on text | First column flex-1 left-aligned; numeric columns fixed width, right-aligned |
