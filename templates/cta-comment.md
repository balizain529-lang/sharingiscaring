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

## Background Video (REQUIRED)

```json
"backgroundVideo": { "query": "phone scrolling close-up", "opacity": 0.20 }
```

**Suggested queries:** "phone scrolling close-up", "social media notification", "blue glow particles", "smartphone close-up", "neon tech glow"

Use slightly lower opacity (0.18-0.20) on CTA to keep keyword + cursor crisp.

## Polish Checklist

| Issue | Cause | Fix |
|---|---|---|
| Keyword too long for input pill | "PRE-MEETING-INTELLIGENCE" overflows | Cap keyword at 12 chars; use single word, all-caps |
| Cursor blinks too fast | Default 14-frame toggle | Slow to 18-20 frames for calmer feel |
| Avatar gradient distracts | Default orange gradient is loud | Use brand teal-blue gradient OR muted gray for less distraction |
| Action + keyword reads cluttered | Both lines are 46px weight 900 | Make action smaller (36px) and keyword larger (52-60px) — keyword is the verb-thing |
| Box pulses too aggressively | Default `glowPulse` rate at 0.1 | Slow to 0.06-0.08 for ambient feel; CTA should invite, not yell |
| Subtitle competes with keyword | Same color hierarchy | Keep subtitle muted (rgba(255,255,255,0.5), 18px) |
