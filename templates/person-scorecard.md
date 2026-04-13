# Person Scorecard

**Type:** Authority / Credibility
**Best for:** Introducing a speaker, guest, client, or expert. Shows name, title, and 2-4 stat badges.

## Layout

```
┌─────────────────────────────┐
│     ── teal divider ──      │
│                             │
│      PERSON NAME            │  ← 46-52px, white, weight 900
│      TITLE / ROLE           │  ← 20-22px, teal, spaced
│                             │
│     ── teal divider ──      │
│                             │
│  ┌──────┐ ┌──────┐ ┌──────┐ │
│  │  7   │ │$100B+│ │ 25+  │ │  ← stat badges, 36-42px
│  │Fort. │ │Spend │ │Years │ │
│  └──────┘ └──────┘ └──────┘ │
│                             │
│ ┌─── NAME ──── TAG ───────┐ │  ← bottom strip, black bg
│ └──────────────────────────┘ │
└─────────────────────────────┘
```

## Animations

1. **Frame 0:** Teal divider draws from center outward
2. **Frame 4-6:** Name scales in (0.85 → 1.0) with spring
3. **Frame 10-14:** Title slides in from left with opacity
4. **Frame 16-20:** Second divider draws
5. **Frame 22-34:** Stat badges pop in one by one with scale spring (0.4 → 1.0), then float gently (sin wave, 3px)
6. **Frame 42+:** Bottom strip scales in from center (0.8 → 1.0) with glowing border

## Floating Particles

20 particles, teal, radius 2-4px, opacity 0.04-0.12, drifting slowly via sin waves.

## Data Shape

```json
{
  "template": "person-scorecard",
  "name": "WALT CHARLES III",
  "title": "CHIEF PROCUREMENT OFFICER",
  "badges": [
    { "value": "7", "label": "Fortune 500s" },
    { "value": "$100B+", "label": "Spend Managed" },
    { "value": "25+", "label": "Years Exp." }
  ],
  "strip": { "left": "WALT CHARLES", "right": "7x CPO", "rightColor": "#00FF88" }
}
```

## Variations

- **2 badges** — wider badges, centered
- **4 badges** — 2x2 grid instead of row
- **No strip** — clean ending, badges are the last element
- **With photo** — circular headshot above the name (future)
