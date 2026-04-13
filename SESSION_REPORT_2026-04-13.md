# Session Report — B-Roll Automation Pipeline
### April 13, 2026

---

## What Was Built This Session

### 1. Content-Type Blueprints (markdown)
Templates that define which scene templates to use, in what order, for each video format.

| File | Content Type |
|---|---|
| `templates/content-types/README.md` | Index + decision matrix |
| `templates/content-types/technical-walkthrough.md` | 5-scene flow for demos/tutorials |
| `templates/content-types/case-study.md` | 6-scene flow for client success stories |
| `templates/content-types/podcast.md` | Flexible 4-6 scene flow for interviews |

### 2. Remotion Scaffolds (starter code)
Copyable composition folders for each content type at `b-roll-remotion/src/compositions/_scaffolds/`:
- `technical-walkthrough/` — TechWalkthroughShort.tsx + BottomPanel + TopPanel
- `case-study/` — CaseStudyShort.tsx + BottomPanel + TopPanel
- `podcast/` — PodcastShort.tsx + BottomPanel + TopPanel

### 3. Parameterized Scene Components
10 JSON-driven scene components at `b-roll-remotion/src/components/scenes/`:

| Component | File | Derived From |
|---|---|---|
| PersonScorecard | `PersonScorecard.tsx` | Scene2_WaltCharles.tsx |
| BigStatReveal | `BigStatReveal.tsx` | New (count-up pattern) |
| KpiDashboard | `KpiDashboard.tsx` | Scene4_Dashboard.tsx |
| WorkflowPipeline | `WorkflowPipeline.tsx` | Scene3_Workflow.tsx |
| DataTable | `DataTable.tsx` | Scene4_Dashboard.tsx |
| NodeGraph | `NodeGraph.tsx` | Scene5_SystemLive.tsx Phase 2 |
| TimelineSteps | `TimelineSteps.tsx` | New (from template spec) |
| ComparisonSplit | `ComparisonSplit.tsx` | New (from template spec) |
| LogoEndorsement | `LogoEndorsement.tsx` | New (from template spec) |
| CtaComment | `CtaComment.tsx` | Scene5_SystemLive.tsx Phase 3 |

Scene registry at `components/scenes/index.ts` maps type strings to components.

### 4. Dynamic Compositions
| Composition | File | Format | Description |
|---|---|---|---|
| DynamicCutaway | `compositions/dynamic/DynamicCutaway.tsx` | Full-screen + overlay | Team's preferred format. Speaker full-screen, graphics overlay with 8-frame fades. |
| DynamicShort | `compositions/dynamic/DynamicShort.tsx` | Split-screen | Top panel talking head + bottom panel B-roll graphics. |
| DynamicTopPanel | `compositions/dynamic/DynamicTopPanel.tsx` | Shared | Loads video from URL prop. |
| DynamicBottomPanel | `compositions/dynamic/DynamicBottomPanel.tsx` | Shared | Maps scenes from JSON to components via registry. |

### 5. Schema + Helpers
- `b-roll-remotion/src/data/schema.ts` — TypeScript types for BRollConfig (the contract between Claude API and Remotion)
- `getCurrentLabel()` and `getTotalFrames()` helper functions

### 6. Shared TextStrip Component
Extracted from jon-pierpoint to `b-roll-remotion/src/components/TextStrip.tsx` — reusable across all compositions.

### 7. n8n Workflows (deployed to balibullet119.app.n8n.cloud)

| Workflow | ID | Status | Purpose |
|---|---|---|---|
| **Form Intake** | `exUPieKM6bHlnxRI` | Deployed (inactive) | Web form → Claude → Drive + ClickUp |
| **Drive Watcher** | `DFIOkov6gWS6kNrK` | Deployed (inactive) | Drop MP4/txt in Drive → Whisper transcribe → Claude → Drive + ClickUp |

Deleted workflows (redundant):
- Scene Generator (`wY1leKEf82XdguwI`) — replaced by Form Intake
- Full Pipeline (`WnpiB3Q1qVU6BxN4`) — replaced by Form Intake
- Batch Processor (`sG6tNGrJX0VGiIiX`) — no practical caller

Workflow JSON files saved locally at `n8n-workflows/`.

### 8. Claude API System Prompts
Standalone prompt files at `prompts/`:
- `technical-walkthrough.txt`
- `case-study.txt`
- `podcast.txt`

### 9. Render Server
Express server code at `render-server/`:
- `index.js` — HTTP API: POST /render, GET /status/:id, GET /download/:id
- `package.json` — dependencies
- `Dockerfile` — ready for Railway/VPS deployment

### 10. Architecture Doc
`n8n-broll-pipeline-architecture.md` — full 5-layer architecture covering schema, Remotion compositions, Claude prompts, n8n workflows, and render API.

### 11. PDF Deck
`remotion-automation-deck-pdf.pdf` — 3-slide internal deck: Remotion as foundation, automation pipeline, roadmap.

### 12. Sample Config
`b-roll-remotion/public/sample-config.json` — 6-scene Pre-Meeting Intelligence example pre-loaded into DynamicCutaway default props. Run `npx remotion studio` and click DynamicCutaway to see it.

---

## Existing Files Updated

| File | What Changed |
|---|---|
| `CLAUDE.md` | Added Content-Type Blueprints section with links to blueprints + scaffolds |
| `templates/README.md` | Added content-types link table at top |
| `b-roll-remotion/src/Root.tsx` | Added imports + registrations for DynamicCutaway, DynamicShort, 3 scaffolds (18 compositions total) |

---

## Verification

- **18 Remotion compositions** bundle successfully (13 existing + 3 scaffolds + DynamicCutaway + DynamicShort)
- Zero TypeScript errors (only pre-existing moduleResolution deprecation warning)
- All existing builds (Jon Pierpoint, Conclusion, Screens) unaffected

---

## GitHub

Repo: https://github.com/balizain529-lang/sharingiscaring
- Public repo, anyone with link can access
- 109 files pushed
- Excludes: node_modules, .env, .claude/, video files (.mp4/.mov)
- Gerald can clone and run `npm install && npx remotion studio`

---

## n8n Variables Needed (Settings → Variables)

| Variable | What | Status |
|---|---|---|
| `ANTHROPIC_API_KEY` | Claude API key (console.anthropic.com) | Not set yet |
| `OPENAI_API_KEY` | Whisper transcription (platform.openai.com) | Not set yet |
| `CLICKUP_LIST_ID` | ClickUp list for review tasks | Not set yet |
| `RENDER_API_URL` | Render server URL (once deployed) | Not set yet |
| `RENDER_API_KEY` | Render server auth key (we create this) | Not set yet |

n8n credentials needed: Google Drive OAuth, ClickUp API token.

---

## What's Left To Do

### Immediate (before workflows can run)
- [ ] Set `ANTHROPIC_API_KEY` variable in n8n
- [ ] Set `OPENAI_API_KEY` variable in n8n
- [ ] Configure Google Drive OAuth credential in n8n
- [ ] Set Drive Watcher folder ID (open workflow → click trigger node → select folder)
- [ ] Set output folder ID in "Save Config to Drive" node
- [ ] Configure ClickUp credential + set `CLICKUP_LIST_ID`
- [ ] Activate the workflows

### Render Server (the one remaining piece)
- [ ] Decision from Tyler on hosting (Railway ~$5-10/mo vs VPS ~$5-7/mo)
- [ ] Deploy render server (one command: `railway up` or `docker compose up`)
- [ ] Set `RENDER_API_URL` and `RENDER_API_KEY` in n8n
- [ ] Enable the disabled "Trigger Render" node in the Drive Watcher workflow
- [ ] Test end-to-end: drop MP4 → get rendered MP4 back in Drive

### Nice to Have (future)
- [ ] Blotato integration for auto-publishing
- [ ] Music auto-overlay in render pipeline
- [ ] Thumbnail generation from scene data
- [ ] DynamicCutaway polish (lower-third name card, captions layer)

---

## Quick Start for Next Session

```bash
# Preview the sample B-roll in Remotion Studio
cd "c:\Users\zainb\Downloads\Work_Projects\TH_Video_Production\B_Roll\b-roll-remotion"
npx remotion studio
# → Click "DynamicCutaway" in sidebar → see 6 animated scenes

# Test render server locally
cd "c:\Users\zainb\Downloads\Work_Projects\TH_Video_Production\B_Roll\render-server"
npm install
node index.js
# → Server runs on localhost:3100

# Push changes to GitHub
cd "c:\Users\zainb\Downloads\Work_Projects\TH_Video_Production\B_Roll"
git add -A && git commit -m "description" && git push
```

---

## Key Decisions Made

1. **Cutaway over split-screen** — team voted overwhelmingly for full-screen speaker + overlay graphics
2. **n8n Cloud** — can't call local CLI, needs HTTP render API
3. **JSON-driven compositions** — parameterized components accept data props, no custom .tsx per video
4. **Whisper for transcription** — $0.006/min, integrated into Drive Watcher
5. **ClickUp for reviews** — not Slack
6. **Google Drive as file hub** — drop MP4s in, get configs and rendered videos out
7. **Scene JSON schema** — the contract between Claude and Remotion (defined in `data/schema.ts`)

---

## Cost Per Video (fully automated)

| Step | Tool | Cost |
|---|---|---|
| Transcription | OpenAI Whisper | $0.006/min (~$0.01 for 60s) |
| Scene generation | Claude API | ~$0.03 |
| Rendering | Remotion server | ~$0.10 |
| **Total** | | **~$0.14/video** |

vs. freelance editor: $50-150/video
