# Logo Endorsement

**Type:** Social Proof / Trust
**Best for:** Showing client logos, partner brands, tech stack icons, or "trusted by" grids. Instant credibility.

## Layout

```
┌─────────────────────────────┐
│                             │
│       TRUSTED BY            │  ← header, muted, spaced
│   ── teal underline ──      │
│                             │
│  ┌────┐  ┌────┐  ┌────┐   │
│  │Logo│  │Logo│  │Logo│   │  ← row 1 (or grid)
│  └────┘  └────┘  └────┘   │
│  ┌────┐  ┌────┐  ┌────┐   │
│  │Logo│  │Logo│  │Logo│   │  ← row 2
│  └────┘  └────┘  └────┘   │
│                             │
│     6 Fortune 500 clients   │  ← summary stat
└─────────────────────────────┘
```

## Animations

1. **Frame 0:** Header fades in with underline drawing from center
2. **Frame 8-40:** Logo boxes pop in one at a time (staggered by 4-6 frames), scale spring 0.5 → 1.0
3. **Logo glow:** Each box has a subtle border glow that pulses offset by index
4. **Frame after all logos:** Summary stat fades up from bottom

## Without Logo Images

When actual logo files aren't available, render text-based logo placeholders:
- Company name in bold white, 18-20px
- Inside a dark card with subtle teal border
- Works just as well visually

## Data Shape

```json
{
  "template": "logo-endorsement",
  "header": "TRUSTED BY",
  "logos": [
    { "name": "Microsoft", "image": "logos/microsoft.png" },
    { "name": "Deloitte", "image": "logos/deloitte.png" },
    { "name": "JPMorgan", "text": "JPMorgan" },
    { "name": "Accenture", "text": "Accenture" },
    { "name": "KPMG", "text": "KPMG" },
    { "name": "Oracle", "text": "Oracle" }
  ],
  "summary": "6 Fortune 500 clients",
  "layout": "grid-3x2"
}
```

## Layout Options

- `"grid-3x2"` — 3 columns, 2 rows
- `"grid-2x2"` — 2 columns, 2 rows (for 4 logos)
- `"row"` — single horizontal row (for 3-4 logos)
- `"scroll"` — logos slide left-to-right continuously (marquee style)

## Variations

- **Tech stack** — "BUILT WITH" + framework/tool logos
- **As seen in** — "FEATURED IN" + media outlet logos
- **Partner grid** — "INTEGRATION PARTNERS" + API logos
- **With ratings** — stars or score beneath each logo
