# Case Study — B-Roll Blueprint

**Content type:** Client success stories, interview-based testimonials, results showcases
**Typical duration:** 50–70s (short-form) / 8–12 min (long-form)
**Best for:** Client interviews, partnership announcements, ROI showcases, before/after transformations
**Reference build:** `Editor_Bot/TEMPLATE_Case_Study_Editor_Notes.md` (6-section editor template)

---

## Production Defaults (REQUIRED on every scene)

1. **`backgroundVideo`** — Pexels stock at 0.18-0.25 opacity behind every scene. Solid backgrounds make case studies feel like generic SaaS testimonials. Real footage adds the "premium client showcase" feel.
2. **Brandfetch logos** — In `LogoEndorsement` scenes, set company `name` only — n8n auto-fills `imageUrl` from Brandfetch. Real client logos > text fallbacks for trust signals.
3. **Iconify icons** — On any technical scenes (`workflow-pipeline`, `node-graph`).

Per-scene Pexels query examples in [prompts/case-study.txt](../../prompts/case-study.txt).

---

## Scene Sequence

### Default Flow (6 scenes, 50–70s short-form)

| # | Scene | Template | Frames (@ 30fps) | Duration | Purpose |
|---|-------|----------|-------------------|----------|---------|
| 1 | Hook Stat | `big-stat-reveal` | 180–300 | 6–10s | Lead with the headline result — "$2M saved", "340% increase", "7x CPO" |
| 2 | Client Intro | `person-scorecard` | 240–300 | 8–10s | Client name, title, company, key credential badges |
| 3 | The Challenge | `comparison-split` or `kpi-dashboard` | 240–360 | 8–12s | Before-state — what the problem looked like |
| 4 | The Solution | `timeline-steps` or `workflow-pipeline` | 300–420 | 10–14s | Implementation journey or solution architecture |
| 5 | The Results | `kpi-dashboard` + `data-table` | 300–420 | 10–14s | After-state metrics, detailed results data |
| 6 | Trust + CTA | `logo-endorsement` + `cta-comment` | 240–360 | 8–12s | Social proof grid → engagement CTA |

### Maps to Editor Template (6-Section Structure)

This scene sequence maps directly to the case study editor template used across TrueHorizon videos:

| Editor Section | B-Roll Scene | Template |
|---|---|---|
| Section 0 — HOOK (Cold Open) | Scene 1: Hook Stat | `big-stat-reveal` |
| Section 1 — Title Card + Intro | Scene 2: Client Intro | `person-scorecard` |
| Section 2 — The Problem | Scene 3: The Challenge | `comparison-split` or `kpi-dashboard` |
| Section 3 — The Solution | Scene 4: The Solution | `timeline-steps` or `workflow-pipeline` |
| Section 4 — Testimonial | Scene 5: The Results | `kpi-dashboard` + `data-table` |
| Section 5/6 — Future + Referral | Scene 6: Trust + CTA | `logo-endorsement` + `cta-comment` |

### Variations

**Short-form (30–45s):** Drop Scene 4 (Solution). Go Hook → Client → Challenge → Results → CTA.

**Long-form (60–90s):** Add a second `kpi-dashboard` for before vs. after metrics side by side. Add `logo-endorsement` with other clients for social proof before the CTA.

**Partnership announcement:** Replace Scene 4 with `logo-endorsement` showing the two partner logos + key partnership stats. Add a quote card overlay.

**Without talking head:** Full-height scenes (1920px). Good for standalone case study reels where the interview audio plays over graphics.

---

## Transcript Mapping Rules

Case study interviews follow a predictable narrative arc. Map transcript segments:

| Speaker says... | Template | Notes |
|---|---|---|
| A dramatic scenario / crisis moment / "At 1:12 AM..." | `big-stat-reveal` | Hook material — use as Scene 1 |
| Name, title, "I'm the CPO at..." / credentials | `person-scorecard` | Client intro with stat badges |
| "We were spending X hours..." / "The old process..." / "Before this..." | `comparison-split` | Left side = before state (red/muted) |
| "We had X suppliers..." / "Managing $Y in spend..." | `kpi-dashboard` | Scale/complexity metrics |
| "We implemented..." / "Over 3 months..." / "Phase 1 was..." | `timeline-steps` | Implementation phases with status indicators |
| "The system does X → Y → Z" / "The workflow..." | `workflow-pipeline` | Solution architecture |
| "After 6 months..." / "We saw X% increase..." / "The results..." | `big-stat-reveal` or `kpi-dashboard` | Outcome metrics (green accents) |
| Specific data / rankings / supplier lists | `data-table` | Tabular results with scanning highlight |
| "Companies like X, Y, Z..." / "We also work with..." | `logo-endorsement` | Trust grid with client logos |
| Referral / endorsement quote / "I would recommend..." | `cta-comment` | Closing CTA with quote overlay |

---

## Asset Checklist

### Required

- [ ] **Talking head video** (.mp4, H.264) — the interview recording
- [ ] **Transcript with timestamps** — word-level preferred for precise scene alignment
- [ ] **Client name, title, company** — for person-scorecard
- [ ] **Before/after metrics** — at least 2–3 numbers showing transformation (e.g., "58 min → 3 min prep time")
- [ ] **Result KPIs** — 3–4 headline numbers for kpi-dashboard (e.g., "$722K saved", "2.7M records", "99.8% accuracy")

### Optional

- [ ] Client logo (PNG/SVG) for logo-endorsement and lower-thirds
- [ ] Other client logos for "trusted by" grid
- [ ] Implementation timeline data (phases, durations) for timeline-steps
- [ ] Client testimonial quote (exact text for quote card overlay)
- [ ] Before/after screenshots for comparison-split visual evidence
- [ ] Partnership graphic / joint logos for announcements

### Sourcing Guide

| Asset Type | Source |
|---|---|
| Interview video | Record via Riverside/Zoom (landscape, 1080p minimum) |
| Transcript | Descript auto-transcription or Whisper API |
| Client logo | Request from client or pull from company website |
| Metrics / KPIs | Pull from interview transcript or client-provided data |
| Stock footage | Pexels API (free) — rarely needed for case studies |

---

## Proof Pack

Case studies have a unique element: the **Proof Pack** — on-screen credibility stats that reinforce the interviewee's authority. Collect these from the transcript:

```
Example Proof Pack (Walt Charles, EP Squared):
- 7x CPO at Fortune companies
- 100,000+ suppliers managed
- $2 trillion in buying activity
- 30,000 procurement leaders
- 100 million suppliers in database
```

Map proof pack stats to:
- **person-scorecard badges** — top 3 most impressive stats
- **big-stat-reveal** — the single most shocking number (use as hook)
- **kpi-dashboard cards** — 3–4 supporting stats in the Results scene

---

## Overlay Checklist

From the case study editor template, these overlays map to B-roll scenes:

| # | Overlay | Editor Section | B-Roll Template | Notes |
|---|---------|---------------|-----------------|-------|
| 1 | Key stat / dollar callout | Hook | `big-stat-reveal` | Animate as interviewee mentions it |
| 2 | Lower-third for interviewee | Intro | `person-scorecard` | "[Name] | [Title] | [Company]" |
| 3 | Problem visual (checklist/infographic) | Problem | `comparison-split` or `kpi-dashboard` | Match to what interviewee describes |
| 4 | Solution diagram or flow | Solution | `workflow-pipeline` or `timeline-steps` | Show how the system works |
| 5 | Memorable quote callout | Solution/Testimonial | Text overlay on talking head | Bold, centered text |
| 6 | Partnership graphic | Future | `logo-endorsement` | Logos + key stats (if applicable) |
| 7 | Closing quote card | Close | `cta-comment` | The referral/endorsement quote |

---

## Production Workflow

### Step 1 — Gather Inputs
Collect interview video, transcript, client details, and metrics. Fill in the Proof Pack.

### Step 2 — Transcript Analysis
Read the full transcript. Identify:
- **The hook moment** — most compelling quote or stat (usually a crisis, a dollar amount, or a dramatic scenario)
- **Section boundaries** — where the conversation shifts from intro → problem → solution → results → endorsement
- **Key quotes** — 3–5 lines worth keeping verbatim (for quote card overlays)
- **Cut targets** — pleasantries, filler, repeated points, interviewer setup questions

### Step 3 — Scene Assignment
Map each section to the scene sequence:
```
Scene 1 (0–240):    big-stat-reveal — "$20M procurement crisis at 1 AM"
Scene 2 (240–540):  person-scorecard — "Walt Charles III, 7x CPO, Fortune 500"
Scene 3 (540–840):  comparison-split — Before: 4 manual systems | After: unified platform
Scene 4 (840–1140): timeline-steps — Phase 1: Assessment → Phase 2: Migration → Phase 3: Go-Live
Scene 5 (1140–1440): kpi-dashboard — $722K saved, 2.7M records, 99.8% accuracy
Scene 6 (1440–1680): logo-endorsement + cta-comment — Trusted by + "Comment PROCUREMENT"
```

### Step 4 — Build Composition
Copy the scaffold:
```
cp -r _scaffolds/case-study/ compositions/[client-name]/
```

Update TopPanel with interview video, BottomPanel with scene components and timing, and build individual scene files using scene template specs.

### Step 5 — Asset Integration
Place video in `public/[project-name]/`, add client logos and any screenshots.

### Step 6 — Review and Render
```bash
npx remotion studio  # preview
npx remotion render [CompositionId] out/[filename].mp4
```

**Review checklist:**
- [ ] Hook stat matches the most compelling moment in the interview
- [ ] Person scorecard badges reflect real credentials from the transcript
- [ ] Before/after in comparison-split accurately represents the transformation
- [ ] All metrics are accurate (cross-check against transcript)
- [ ] Client's name and title are correct in lower-third/scorecard
- [ ] No confidential information is displayed (check against confidentiality notes)
- [ ] Text is readable at mobile resolution (min 28px)

---

## Example Scene Data

```json
{
  "contentType": "case-study",
  "title": "EP Squared — Walt Charles Case Study",
  "fps": 30,
  "totalFrames": 1680,
  "scenes": [
    {
      "scene": 1,
      "template": "big-stat-reveal",
      "from": 0,
      "duration": 240,
      "label": "The $20M Problem",
      "data": {
        "prefix": "$",
        "value": 20000000,
        "format": "abbreviated",
        "color": "#FF4444",
        "subtitle": "Procurement crisis discovered at 1:12 AM",
        "comparison": {
          "before": { "label": "Initial Error", "value": "$2" },
          "after": { "label": "Actual Exposure", "value": "$20M" }
        }
      }
    },
    {
      "scene": 2,
      "template": "person-scorecard",
      "from": 240,
      "duration": 300,
      "label": "Walt Charles III · CPO",
      "data": {
        "name": "Walt Charles III",
        "title": "Chief Procurement Officer",
        "badges": [
          { "value": "7x", "label": "CPO" },
          { "value": "100K+", "label": "Suppliers" },
          { "value": "Fortune 500", "label": "Experience" }
        ],
        "bottomStrip": "EP Squared · Agentic Operating System"
      }
    },
    {
      "scene": 3,
      "template": "comparison-split",
      "from": 540,
      "duration": 300,
      "label": "Before vs After",
      "data": {
        "left": {
          "header": "BEFORE",
          "color": "#FF4444",
          "icon": "cross",
          "items": [
            "4 disconnected systems",
            "58 min manual prep per meeting",
            "No supplier risk visibility",
            "Reactive crisis management"
          ]
        },
        "right": {
          "header": "AFTER",
          "color": "#00FF88",
          "icon": "check",
          "items": [
            "Unified procurement platform",
            "Real-time intelligence briefs",
            "Proactive risk scoring",
            "$722K revenue protected"
          ]
        }
      }
    },
    {
      "scene": 4,
      "template": "timeline-steps",
      "from": 840,
      "duration": 300,
      "label": "Implementation Journey",
      "data": {
        "header": "EP² Deployment",
        "steps": [
          { "label": "Discovery & Assessment", "subtitle": "Weeks 1–4", "status": "complete" },
          { "label": "Data Migration", "subtitle": "Weeks 5–10", "status": "complete" },
          { "label": "Agent Training", "subtitle": "Weeks 11–14", "status": "complete" },
          { "label": "Go-Live", "subtitle": "Week 15", "status": "active" }
        ],
        "progress": 95
      }
    },
    {
      "scene": 5,
      "template": "kpi-dashboard",
      "from": 1140,
      "duration": 300,
      "label": "Results",
      "data": {
        "header": "Impact After 6 Months",
        "cards": [
          { "label": "Revenue Protected", "prefix": "$", "value": 722, "suffix": "K", "color": "#00FF88" },
          { "label": "Suppliers Monitored", "value": 2.7, "suffix": "M", "color": "#00D4FF" },
          { "label": "Risk Score Accuracy", "value": 99.8, "suffix": "%", "color": "#00FF88" }
        ],
        "sparkline": true
      }
    },
    {
      "scene": 6,
      "template": "logo-endorsement+cta-comment",
      "from": 1440,
      "duration": 240,
      "label": "Trusted Partners",
      "data": {
        "logoGrid": {
          "header": "Trusted By",
          "logos": ["EP Squared", "TechCorp", "DataFlow", "CloudBase", "Acme Inc", "NovaTech"]
        },
        "cta": {
          "action": "COMMENT",
          "keyword": "PROCUREMENT"
        }
      }
    }
  ]
}
```

---

## Confidentiality Notes

Case studies often contain sensitive client information. Before building:

- [ ] Confirm all metrics are approved for public display
- [ ] Check if any interview segments are marked confidential (M&A details, revenue figures, exit strategy)
- [ ] Get client approval on their name/title/logo usage
- [ ] Verify no NDA-protected information appears in B-roll graphics

---

## Reference Builds

| Build | Location | Type | Notes |
|---|---|---|---|
| Case Study Editor Template | `Editor_Bot/TEMPLATE_Case_Study_Editor_Notes.md` | Editor guide | 6-section reusable template |
| Walt Charles Case Study | `Editor_Bot/EP2_CaseStudy_Editor_Notes.md` | Editor guide | Real example with timestamps |
| Walt Charles JSON Spec | `Editor_Bot/EP2_CaseStudy_Walt_Charles_EDITOR_SPEC.json` | Structured spec | JSON editor spec with sections + overlays |
| Jon Pierpoint Short | `compositions/jon-pierpoint/` | Remotion build | Technical content but structure is similar |
