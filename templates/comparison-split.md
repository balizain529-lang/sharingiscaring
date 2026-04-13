# Comparison Split

**Type:** Contrast / Before-After
**Best for:** Old way vs new way, competitor vs us, manual vs automated, before vs after. Creates visual tension.

## Layout

```
┌──────────────┬──────────────┐
│   BEFORE     │    AFTER     │  ← header labels
│              │              │
│  ❌ Manual   │  ✓ Automated │
│  ❌ 3 weeks  │  ✓ 11 seconds│  ← items with icons
│  ❌ 40% miss │  ✓ 99.2% hit │
│              │              │
│  dull red    │  bright green│  ← left side muted, right glows
│   tint       │    tint      │
└──────────────┴──────────────┘
```

## Animations

1. **Frame 0:** Vertical center divider draws top-to-bottom (height 0% → 100%)
2. **Frame 4-8:** "BEFORE" and "AFTER" headers fade in simultaneously
3. **Frame 10-40:** Left-side items reveal top-to-bottom (every 8 frames), slide in from left, ❌ icon pops
4. **Frame 16-46:** Right-side items reveal with same timing but slide from right, ✓ icon pops with green glow
5. **Right side glow:** Subtle green border glow on the right half, pulsing
6. **Left side dim:** Left half has slightly darker overlay to create contrast
7. **Frame 46+:** Right side "wins" — brief flash/pulse on the right column

## Data Shape

```json
{
  "template": "comparison-split",
  "left": {
    "header": "BEFORE",
    "color": "red",
    "icon": "❌",
    "items": ["Manual research", "3 weeks per report", "40% data gaps"]
  },
  "right": {
    "header": "AFTER",
    "color": "green",
    "icon": "✓",
    "items": ["Automated pipeline", "11 seconds", "99.2% coverage"]
  }
}
```

## Variations

- **With numbers** — each item has a big stat + label instead of text
- **Horizontal split** — top vs bottom instead of left vs right
- **3-column** — "Before / During / After" or "Competitor A / Us / Competitor B"
- **Animated transition** — left side shown first, then "swipes" to reveal right side
