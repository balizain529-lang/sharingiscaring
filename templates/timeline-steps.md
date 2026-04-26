# Timeline Steps

**Type:** Process / Story
**Best for:** Explaining a journey, build process, implementation phases, or chronological events. "Here's how we got here."

## Layout

```
┌─────────────────────────────┐
│ HEADER                      │
│                             │
│  ① ─── Step 1 label        │
│  │     subtitle             │
│  ② ─── Step 2 label        │  ← vertical timeline with numbered
│  │     subtitle             │    circles and connecting lines
│  ③ ─── Step 3 label        │
│  │     subtitle             │
│  ④ ─── Step 4 label        │
│        subtitle             │
│                             │
│     ── progress bar ──      │  ← optional completion indicator
└─────────────────────────────┘
```

## Animations

1. **Frame 0:** Header fades in
2. **Frame 6+:** Steps reveal one at a time (every 12-15 frames):
   - Number circle pops with scale spring (0 → 1.0)
   - Vertical connector line draws downward (height 0 → 100%)
   - Label slides in from left (translateX -16 → 0)
   - Subtitle fades in 4 frames after label
3. **Active step:** Current step's number circle has a pulsing glow ring
4. **Completed steps:** Number circle gets a green checkmark overlay
5. **Frame after all steps:** Optional progress bar fills to match completion %

## Data Shape

```json
{
  "template": "timeline-steps",
  "header": "IMPLEMENTATION",
  "steps": [
    { "label": "Requirements gathered", "subtitle": "2 week sprint", "status": "complete" },
    { "label": "NLP pipeline built", "subtitle": "Custom fine-tuning", "status": "complete" },
    { "label": "Dashboard deployed", "subtitle": "Real-time scoring", "status": "active" },
    { "label": "Client handoff", "subtitle": "Training + docs", "status": "pending" }
  ],
  "progress": 75
}
```

## Status Colors

- `complete` → green circle + checkmark
- `active` → teal circle + pulsing glow ring
- `pending` → dim gray circle, muted text

## Variations

- **Horizontal timeline** — steps laid out left-to-right with horizontal connector
- **With durations** — "2 weeks", "3 days" shown between steps
- **Milestone markers** — diamonds instead of circles for key milestones
- **Animated progress** — steps light up in sequence like a loading sequence

## Polish Checklist

| Issue | Cause | Fix |
|---|---|---|
| Steps reveal too slowly | Default 12-15f interval drags for 6s cutaway | Use 8-10 frames between steps; speeds the build |
| All steps the same | No status differentiation | Mark some `complete` (✓ green), one `active` (pulsing teal), rest `pending` (muted) |
| Connector lines look thin/weak | Default 2px width disappears at horizontal | Bump to 3px and add subtle gradient (start color → end color) |
| Active step doesn't stand out | Pulsing glow too subtle | Increase glow to `boxShadow: 0 0 ${16 * glow}px ${TEAL}` |
| Subtitles distract from labels | Same weight as labels | Keep subtitle muted (rgba 0.4 opacity, smaller font) |
| Progress bar duplicates step status | Both convey completion | Skip progress bar OR show progress only if no `active` step |
