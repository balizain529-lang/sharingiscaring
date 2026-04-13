# Editor Notes — Pre-Meeting Intelligence Video (Draft 1)
### For Descript Editing | April 2, 2026
### Total Raw Length: 14:39 | Target Final: 8–10 min (Zain sections only)

---

## Overview

This is a first-draft recording of a technical walkthrough video. The talent (Zain) largely followed the script but has several repeated lines, false starts, out-of-order tangents, and a major stutter zone from 8:25–10:49 that needs significant trimming. The structure below maps raw footage to final edit sections.

Milan's founder intro is a separate asset — not included in this footage.

---

## CUT MAP — Section by Section

### SECTION 1: IMPACT DEMO (0:00–1:25) — KEEP MOST
**Script target: 1–2 min | Raw: ~1:25 | Verdict: Slightly over, minor trims**

| Timestamp | Content | Action |
|---|---|---|
| 0:00–0:08 | "Hey, Zane from True Horizon here. Before we get into the very fun building..." | **KEEP** — Good energy, natural opening. Differs from script ("Alright, before we build anything") but works better as his own voice. |
| 0:08–0:24 | Shows email brief, explains no manual CRM/web search needed | **KEEP** — Follows script intent. The "anxiously drink three cups of coffee" line is a nice ad-lib. |
| 0:24–0:45 | Scrolls through brief: LinkedIn link, CRM notes, last touchpoint, deal status | **KEEP** — Clean walkthrough of the email. |
| 0:45–1:05 | Top 3 priorities, framing areas of agreement/disagreement | **KEEP** — Good elaboration, maps to script. |
| 1:05–1:16 | "I especially like this last touch point section..." | **KEEP** — Ad-lib but adds value. Not in script, but reinforces the qualitative/quantitative point. |
| 1:16–1:25 | Clicks LinkedIn link, "Now let me show you how this works" | **KEEP** — Clean transition. Matches script: *"Now let me show you how this actually works."* |

**Section 1 Notes:** This section is solid. No cuts needed. ~1:25 is right on target.

---

### SECTION 2: PROBLEM + ARCHITECTURE (1:25–3:24) — KEEP WITH TRIMS
**Script target: Problem 30–45s + Architecture 1.5–2 min | Raw: ~2:00 | Verdict: Good density**

Note: Zain combined the Problem and Architecture sections into one continuous flow (no Excalidraw live-draw — used a pre-made diagram instead). This works for this edit. Future re-record can add the live-draw per Malika's feedback.

| Timestamp | Content | Action |
|---|---|---|
| 1:25–1:36 | "You'll see here we have a nice little diagram..." | **KEEP** — Transitions to architecture. |
| 1:36–1:57 | Three systems: Calendar, HubSpot, Apollo | **KEEP** — Clean explanation, maps to script's three-box concept. |
| 1:57–2:14 | "But nothing connects these three systems..." + the VP/Director line | **KEEP** — This is the key script line: *"you're still digging through tabs trying to figure out if they're a VP or a Director."* Nailed it. |
| 2:14–2:34 | Two paths: known contact vs. net-new | **KEEP** — Maps to script's fork diagram. |
| 2:34–2:43 | "Normalize that data... I'll call out that template you just viewed" | **KEEP** — Good callback to the email they just saw. |
| 2:43–3:05 | AI brief via Gmail + log/shared history | **KEEP** — Covers delivery + logging. |
| 3:05–3:24 | Error handling / guardrails / "if not, having the proper guardrails..." | **KEEP** — Maps to script's reliability theme. Slight ramble but acceptable. |

**Section 2 Notes:** Solid section. The "Anyways, I digress" at 3:24 is the cue to cut to the transition.

---

### TRANSITION (3:24–3:45) — CUT REPEATED LINES
**This is the first major problem area.**

| Timestamp | Content | Action |
|---|---|---|
| 3:24–3:28 | "Anyways, I digress. Let's get to building." | **KEEP** — Use this as the transition line. |
| 3:28–3:32 | "Alright, let's get to building." | **CUT** — Repeat #1 |
| 3:32–3:38 | "Alright, let's get to building." | **CUT** — Repeat #2 |
| 3:38–3:45 | "Alright, alright, here is our workflow in N8N." | **KEEP** — Use this as the landing line after the cut. Natural energy reset. |

**Edit:** Jump cut from 3:28 → 3:38. Or crossfade 3:24 → 3:38.

---

### SECTION 3: STEP-BY-STEP BUILD — PART A (3:45–8:25) — KEEP WITH MINOR TRIMS
**Script target: 4–5 min | Raw Part A: ~4:40 | Good pacing**

| Timestamp | Content | Action |
|---|---|---|
| 3:45–3:53 | Overview of n8n workflow canvas | **KEEP** — Establishes the visual. |
| 3:53–4:08 | "Wanted to show you our client stack first... net new contact as well as existing" | **KEEP** — Sets up both demo paths. |
| 4:08–4:17 | "Native nodes for HubSpot, API call for Apollo" | **KEEP** — Quick tech orientation. |
| 4:17–4:33 | Trigger layer: schedule every 5 min, filter 60 min window | **KEEP** — Matches script Step 1. |
| 4:33–4:52 | Calendar event example: "Sales Call with Senior Director of Growth at Launchpad" + "I've been promoted to Senior Executive" | **KEEP** — The self-deprecating joke lands. |
| 4:52–5:10 | Extract attendees: strip out CCs, your own email | **KEEP** — Matches script Step 2. |
| 5:10–5:31 | CRM lookup using Google Sheets as stand-in | **KEEP** — This is the Google Sheets demo moment. |
| 5:31–5:44 | "Oh yeah, one last thing about extract attendees — stripping emails is important because you don't want to send the brief to the wrong person" | **DECISION:** This is out of order (should have been at 5:10). Two options: (A) **CUT** and trust the 4:52–5:10 section covered it, or (B) **KEEP** as a natural aside. Recommend **CUT** for pacing since he already covered it. |
| 5:44–5:57 | "Hit the database request here, let me jump really quickly to this" | **TRIM** — Remove "let me just jump really quickly to this" filler. |
| 5:57–6:14 | Shows CRM sheet: first name, last name, title, company, LinkedIn, lifecycle stage | **KEEP** — This is the visual money shot of the Google Sheets data. |
| 6:14–6:39 | Contact NOT in CRM → enrichment path, API call to third-party service | **KEEP** — Matches script Step 4 (net-new enrichment). |
| 6:39–6:54 | "No CRM to pull from, but clean data from email + name to conduct search" | **KEEP** — Good explanation. |
| 6:54–7:07 | "For our existing client case, this would often be a one-minute execution in the background" | **KEEP** — Sets production expectations. |
| 7:07–7:37 | Normalizing data from API call | **KEEP** — Matches script Step 5. Key concept moment. |
| 7:37–7:51 | Email template for net-new contact: research + talking points | **KEEP** — Shows the output. |
| 7:51–8:10 | Talking points detail: "Launchpad's European expansion", Stripe/HubSpot background | **KEEP** — Concrete, impressive AI output. |
| 8:10–8:25 | Top 3 priorities for this meeting | **KEEP** — Clean wrap of the demo. |

**Section 3A Notes:** Mostly clean. One out-of-order aside to cut (5:31–5:44). ~4:00 after trims.

---

### SECTION 3: STEP-BY-STEP BUILD — PART B: THE STUTTER ZONE (8:25–10:49) — HEAVY CUTS
**This is the biggest problem area. Zain attempts to explain "how the AI stays consistent" at least 5 times with false starts.**

| Timestamp | Content | Action |
|---|---|---|
| 8:25–8:40 | "How does this AI format the brief in a consistent way? Through system prompts and consistent inputs" + "normalize all our contact data helps feed the AI..." | **CANDIDATE A** — Decent first attempt. Usable but not the best take. |
| 8:40–8:59 | "Renders templates the way we want... full control... how do you ensure the AI agent delivers a consistent brief?" | **CUT** — Restates without adding. Ends with another question setup. |
| 8:59–9:11 | "How the heck do the AI, oh man..." + restart | **CUT** — Visible false start, Zain acknowledges it. |
| 9:11–9:20 | "How does the AI consistently deliver this output?" | **CUT** — Yet another restart of the same question. |
| 9:20–9:42 | "We have two templates... part of system instructions... after being provided key information from database pool or enrichment..." | **CANDIDATE B** — This is the cleanest explanation. Keep this as the core. |
| 9:42–9:49 | "The AI brief is really cool, but how does the AI do its job? Let's jump into the system prompt." | **CUT** — Another restart. But "Let's jump into the system prompt" is a good transition line — splice it onto the end of Candidate B if needed. |
| 9:49–10:00 | "We normalize that contact data so the AI receives consistent information every time" | **CANDIDATE C** — Best single-sentence summary. Use this OR Candidate A. |
| 10:00–10:15 | "Don't think or guess, it just formats the prompt to strict and exact sections... system prompt..." | **KEEP** — Matches script: *"The AI's job is formatting. Not thinking. Not guessing."* |
| 10:15–10:25 | "How do you consistently generate a meeting brief..." | **CUT** — Final repeat of the same question. |
| 10:25–10:49 | "That really comes down to two things. The system prompt... as well as the information going in." | **KEEP** — Clean landing. Summarizes the concept. |

**RECOMMENDED EDIT for 8:25–10:49:**

Assemble from best takes:
1. **9:49–10:00** — "We normalize that contact data so the AI receives consistent information every time to generate its template output." (Clean thesis)
2. **10:00–10:15** — "If you don't think or guess, it just formats the prompt to strict and exact sections." (Key script line)
3. **10:25–10:49** — "That really comes down to two things. The system prompt... as well as the information going in." (Landing)

This cuts ~2:00 of stutter down to ~40 seconds.

---

### SECTION 3: STEP-BY-STEP BUILD — PART C: SYSTEM PROMPT WALKTHROUGH (10:49–12:06) — KEEP WITH ONE CUT

| Timestamp | Content | Action |
|---|---|---|
| 10:49–11:00 | "Generate pre-meeting intelligence brief for the following meeting" — shows the user prompt | **KEEP** |
| 11:00–11:20 | System prompt details: "You are a pre-meeting intelligence analyst. Generate a concise actionable meeting brief." | **KEEP** — Maps to script Step 6. |
| 11:20–11:40 | Templates for existing contacts vs. new contacts | **KEEP** |
| 11:40–12:06 | Tangent about model selection, cost, token usage, creative tone | **CUT** — This is the tangent Zain flagged. Not in script. Breaks pacing. Viewers don't need model cost discussion in a walkthrough. |

**Edit:** Cut at 11:40, jump to 12:06.

---

### SECTION 4: EXECUTION SPEED + ERROR HANDLING (12:06–12:52) — KEEP

| Timestamp | Content | Action |
|---|---|---|
| 12:06–12:17 | "This execution probably takes 30 seconds and saves you minutes, even hours" | **KEEP** — Good soundbite. |
| 12:17–12:32 | Error handling: no attendee email, web search errors | **KEEP** — Matches script Step 7. |
| 12:32–12:52 | Error path demo: notification stating brief failed | **KEEP** — Visual proof of guardrails. |

**Section 4 Notes:** Clean. No cuts needed. ~46 seconds.

---

### SECTION 5: TAKEAWAYS (12:52–13:42) — KEEP WITH MINOR TRIM

| Timestamp | Content | Action |
|---|---|---|
| 12:52–13:01 | "Every execution gets logged... system defaults to sending, not waiting" | **KEEP** — Key script line: *"If it doesn't arrive before the meeting, it doesn't count."* (He paraphrased but the intent lands.) |
| 13:01–13:11 | Takeaway 1: Identity matching is the real bottleneck | **KEEP** |
| 13:11–13:21 | Takeaway 2: Normalize data before AI | **KEEP** |
| 13:21–13:42 | Takeaway 3: Net-new contacts are enrichment opportunity + mentions custom API / HTTPS scrape options | **KEEP** — Slight over-explanation but acceptable. |
| (missing) | Takeaway 4: Reliability over cleverness | He covers this at 12:52. The "system defaults to sending" line serves as #4. Consider adding a text overlay: "4. Reliability over cleverness" |

---

### SECTION 6: CTA + OUTRO (13:42–14:39) — PICK BEST TAKE

| Timestamp | Content | Action |
|---|---|---|
| 13:42–14:00 | Error logging wrap-up + "richer intelligence later" | **CUT** — Repeats earlier error handling content. |
| 14:00–14:09 | CTA Take 1: "If you want this for your team... that's what we build at True Horizon." | **KEEP — BEST TAKE.** Clean, confident, matches script exactly. |
| 14:09–14:24 | CTA Take 2: Same line repeated + "Links in the description. Thanks for watching." | **CUT** — Duplicate. Use "Links in the description. Thanks for watching." from this take and splice onto Take 1 if needed. |
| 14:24–14:33 | CTA Take 3: "Yes, you can have the template, but we're here to tell you... free AI consultation." | **CUT for now** — Different tone, more salesy. Save as alternate. Zain noted he'll create separate b-roll for the outro. |

**RECOMMENDED OUTRO EDIT:**
14:00–14:09 (CTA Take 1) + splice "Links in the description. Thanks for watching." from 14:09.

---

## FINAL CUT SUMMARY

| Section | Raw Time | After Cuts | Key Edits |
|---|---|---|---|
| [1] Impact Demo | 0:00–1:25 | ~1:25 | None |
| [2] Problem + Architecture | 1:25–3:24 | ~1:50 | Minor trim at 3:05 |
| Transition | 3:24–3:45 | ~0:07 | Cut 3 repeated "let's get to building" |
| [3A] Build: Trigger → Enrichment | 3:45–8:25 | ~4:00 | Cut out-of-order aside (5:31–5:44) |
| [3B] Build: AI Consistency | 8:25–10:49 | ~0:40 | Heavy cuts — 5 false starts → 3 clean sentences |
| [3C] Build: System Prompt | 10:49–12:06 | ~0:50 | Cut model cost tangent (11:40–12:06) |
| [4] Execution + Errors | 12:06–12:52 | ~0:46 | None |
| [5] Takeaways | 12:52–13:42 | ~0:50 | None |
| [6] CTA | 14:00–14:09 | ~0:15 | Pick Take 1 + splice closing line |
| **TOTAL** | **14:39** | **~10:33** | |

Target was 8–10 min. At ~10:33, this is slightly over. To hit 10:00 flat, consider tightening:
- Section 2 (3:05–3:24 error handling preamble — 19s, covered again at 12:17)
- Section 3A (6:54–7:07 "one-minute execution" aside — 13s)

---

## B-ROLL TARGETS

These moments would benefit from visual overlays, zoom effects, or text cards:

| Timestamp | B-Roll Suggestion |
|---|---|
| 0:08–0:24 | Zoom into the email brief, slow scroll |
| 1:16 | Zoom into LinkedIn link click + browser loading the profile |
| 1:36–1:57 | Three-system diagram — animate or highlight each box as named |
| 2:14 | Fork/split animation when mentioning "two paths" |
| 5:57–6:14 | Zoom into Google Sheet CRM data — highlight columns |
| 7:37–8:10 | Zoom into the net-new email brief output |
| 10:49–11:20 | Zoom into system prompt text in n8n |
| 12:32–12:52 | Zoom into error path lighting up in n8n |
| 13:01–13:42 | Text overlay cards for each of the 4 takeaways |
| 14:00–14:09 | True Horizon branded end card / logo |

---

## KEY LINES TO PRESERVE (from script — verify these survived)

| # | Script Line | In Transcript? | Timestamp |
|---|---|---|---|
| 1 | "This email landed in my inbox 58 minutes before a call. I didn't do anything." | Yes (paraphrased: "popped into my email inbox an hour before") | 0:08 |
| 2 | "Two paths. Known contact, net-new contact." | Yes | 2:14–2:34 |
| 3 | "The system remembers what your team already learned about this person." | No — not explicitly said. Consider adding as text overlay during CRM section. | — |
| 4 | "Net-new doesn't mean empty. It means we haven't looked yet." | Paraphrased: "Net new contacts aren't... they're an enrichment opportunity" | 13:21 |
| 5 | "Normalization is what makes the AI consistent. Not the prompt." | Paraphrased: "Consistent input creates consistent output every time" | 13:11 |
| 6 | "If it doesn't arrive before the meeting, it doesn't count." | Paraphrased: "System defaults to sending, not waiting" | 12:52 |

---

## NOTES FOR ZAIN

- **Outro b-roll:** Zain will create separately using Claude Code. Leave a clean cut point after 14:09.
- **Excalidraw live-draw:** Not done in this recording (used pre-made diagram). Team wanted "build with me" live-draw — consider for v3 or add as animated overlay in post.
- **"your-email" placeholder:** At 4:52 the workflow shows `zain.bali@outlook.com` — confirm this is OK to show on screen or blur it.
- **Google Sheets as stand-in:** He successfully explains this at 5:10 — "I'm using Google Sheets as a stand-in" — which is exactly the right framing for the video.
