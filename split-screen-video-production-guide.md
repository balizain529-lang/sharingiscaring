# Split-Screen Short-Form Video — Production Guide

Everything needed to create a split-screen (talking head + b-roll) short-form vertical video using Remotion.

---

## 1. Video Specifications

| Property | Value |
|---|---|
| Resolution | 1080 x 1920 (vertical 9:16) |
| Frame Rate | 30 fps |
| Format | Split-screen — top panel (talking head), bottom panel (b-roll) |
| Divider | Panels meet at center (y = 960), no gap. Text strip overlays the divider. |
| Background (bottom panel) | `#0B1222` to prevent black letterboxing |

---

## 2. Safe Zones

All content must respect these margins to avoid being clipped by platform UI (notch, navigation bar, engagement buttons).

| Zone | Value |
|---|---|
| Top | 150px |
| Bottom | 170px |
| Left / Right | 60px |
| Minimum font size | 28px |

B-roll components must internally enforce `paddingTop: 150`, `paddingLeft: 60`, `paddingRight: 60`.

---

## 3. Project Structure

```
short-form-video/
  └── [PROJECT_NAME]/
        ├── src/
        │   ├── Composition.tsx       # Main Remotion composition
        │   ├── TopPanel.tsx          # Talking head panel
        │   ├── BottomPanel.tsx       # B-roll / animated panel
        │   ├── TextStrip.tsx         # Overlay text strip at divider
        │   ├── Captions.tsx          # Auto-generated captions
        │   └── assets/              # Videos, images, logos
        ├── public/
        │   ├── transcript.json       # Corrected transcript for captions
        │   └── audio.mp3            # Voiceover audio
        ├── remotion.config.ts
        └── package.json
```

---

## 4. Production Workflow

### Step 1 — Script
Write the full script first. Include:
- Hook (first 2-3 seconds)
- Key talking points / scenes
- CTA (call to action)
- Estimated duration

**Wait for approval before writing any code.**

### Step 2 — Record / Source Footage
- **Top panel:** Talking head video (webcam or professional)
- **Bottom panel:** B-roll footage, screen recordings, or animated graphics

### Step 3 — Audio & Transcript
- Record or generate voiceover (Edge TTS for AI-generated option)
- Generate transcript JSON from the audio
- **Post-process transcript** for brand name corrections (e.g., "snow flake" → "Snowflake")

### Step 4 — Build in Remotion
- Assemble composition with top/bottom panels
- Add text strip overlay at the divider
- Wire up captions from transcript
- Add spring animations / transitions as needed

### Step 5 — Review & Render
- Preview in Remotion Studio
- Check safe zones, caption overflow, panel alignment
- Render final output

---

## 5. Panel Layout Rules

```
┌──────────────────┐
│                  │  ← 150px top safe zone
│   TALKING HEAD   │
│   (top panel)    │
│                  │
├──── y = 960 ─────┤  ← Text strip overlays here
│                  │
│   B-ROLL PANEL   │
│  (bottom panel)  │
│                  │  ← 170px bottom safe zone
└──────────────────┘
     60px margins
```

- Panels MUST touch at center (`y = 960`) — **no gap**
- Text strip sits on top of the divider line
- CTA text in one place only — never duplicate between panel and text strip

---

## 6. Caption Rules

| Rule | Detail |
|---|---|
| Word window | 6 words max visible at a time |
| Background | Pill-style background behind text |
| Overflow | `overflow: hidden`, `wordBreak` enabled — captions must NEVER overflow |
| Placement | Within bottom safe zone margins |

---

## 7. Video Trimming

Use Remotion's `trimBefore` / `trimAfter` (in frames) on the `<Video>` component.

**Do NOT use `startFrom`** — it does not behave the same way for trimming clips.

```tsx
<Video src={clip} trimBefore={30} trimAfter={150} />
```

---

## 8. Styling Reference

```tsx
// Bottom panel background
style={{ background: '#0B1222' }}

// B-roll safe zone padding
style={{
  paddingTop: 150,
  paddingLeft: 60,
  paddingRight: 60,
}}

// Minimum font size
style={{ fontSize: 28 }} // absolute minimum
```

---

## 9. Common Pitfalls

- **Gap between panels** — always set top panel to end exactly at `y = 960`
- **Caption overflow** — test with long words; always enforce `overflow: hidden`
- **Duplicate CTA** — pick either the panel or the text strip, not both
- **Black letterboxing** — set bottom panel background to `#0B1222`
- **Wrong trim method** — use `trimBefore`/`trimAfter`, never `startFrom`
- **Uncorrected transcripts** — always fix brand names before building captions

---

## 10. Checklist Before Render

- [ ] Script approved
- [ ] Top panel video trimmed and positioned
- [ ] Bottom panel content within safe zones
- [ ] Panels meet at y=960, no gap
- [ ] Text strip overlay in place (no duplicate CTA)
- [ ] Captions: 6-word window, pill bg, no overflow
- [ ] Transcript post-processed for brand names
- [ ] Background color set on bottom panel (`#0B1222`)
- [ ] All fonts ≥ 28px
- [ ] Margins: 150px top, 170px bottom, 60px sides
- [ ] Final preview reviewed in Remotion Studio
