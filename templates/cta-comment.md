# CTA Comment

**Type:** Call-to-Action / Engagement
**Best for:** Final scene. Drives comments, follows, link clicks. Simulates the social platform UI to make the action obvious.

## Layout

```
┌─────────────────────────────┐
│                             │
│          COMMENT            │  ← 42-46px, white, weight 900
│       "KEYWORD"             │  ← 42-46px, green, with glow
│                             │
│  ┌──────────────────────┐   │
│  │ 🟠  KEYWORD|         →│  │  ← fake comment input box
│  └──────────────────────┘   │
│                             │
└─────────────────────────────┘
```

## Animations

1. **Frame 0:** "COMMENT" scales in (0.85 → 1.0) with spring
2. **Frame 4-6:** Keyword scales in with green glow, pulsing textShadow (sin wave)
3. **Frame 10+:** Fake comment input slides up with opacity
4. **Blinking cursor:** 2px teal bar after the keyword text, blinks every 14 frames
5. **Input glow:** Box border and shadow pulse gently (sin wave on boxShadow and border opacity)
6. **Avatar circle:** Gradient circle (orange tones) on the left of the input
7. **Arrow:** Teal "→" on the right, with textShadow glow

## Data Shape

```json
{
  "template": "cta-comment",
  "action": "COMMENT",
  "keyword": "PROCUREMENT",
  "subtitle": "I'll send you the full breakdown",
  "inputStyle": "rounded"
}
```

## Variations

- **Link CTA** — "LINK IN BIO" with a URL preview card instead of comment input
- **Follow CTA** — "FOLLOW FOR MORE" with a fake follow button that animates a click
- **DM CTA** — "DM ME 'BUILD'" with a fake DM bubble
- **Multi-keyword** — "Comment PROCUREMENT or AUTOMATION" with both words glowing
- **With subtitle** — adds a muted line below the keyword ("I'll send you the full 10-min breakdown")
