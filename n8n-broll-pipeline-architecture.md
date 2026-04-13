# B-Roll Automation Pipeline — Full Architecture

## Overview

An end-to-end pipeline that takes a transcript + talking head video + content type and delivers a rendered B-roll MP4 — fully orchestrated by n8n Cloud, with Claude API for scene generation and Remotion for rendering.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  n8n Cloud Workflow                                                      │
│                                                                          │
│  Webhook ──→ Claude API ──→ Validate ──→ Render API ──→ Poll ──→ Deliver │
│  (inputs)    (scene JSON)   (schema)     (trigger)     (wait)   (MP4)   │
└──────────────────────────────────────────────────────────────────────────┘
       │              │              │              │              │
       ▼              ▼              ▼              ▼              ▼
  transcript     system prompt   JSON schema   Remotion Lambda   Google Drive
  + video URL    per content     validation    or Express API    / Slack / Email
  + content type type blueprint
```

---

## Layer 1 — Scene JSON Schema (The Contract)

This is the single most important piece. It defines the exact data format that:
- Claude API **outputs** (from n8n)
- Remotion compositions **consume** (as `inputProps`)

### Schema Definition

```typescript
interface BRollConfig {
  meta: {
    contentType: "technical-walkthrough" | "case-study" | "podcast";
    title: string;
    fps: 30;
    width: 1080;
    height: 1920;
    talkingHeadUrl: string;        // URL or staticFile path to talking head video
    talkingHeadTrim?: {
      startFrame?: number;         // trimBefore in frames
      endFrame?: number;           // trimAfter in frames
    };
  };
  scenes: Scene[];
  textStrip: {
    labels: { from: number; label: string }[];  // TextStrip labels per scene
  };
}

// Union type — each scene type has its own data shape
type Scene =
  | BigStatRevealScene
  | PersonScorecardScene
  | KpiDashboardScene
  | WorkflowPipelineScene
  | DataTableScene
  | NodeGraphScene
  | TimelineStepsScene
  | ComparisonSplitScene
  | LogoEndorsementScene
  | CtaCommentScene;

// ─── Base (shared by all scenes) ────────────────────────────

interface SceneBase {
  type: string;
  from: number;              // start frame
  durationInFrames: number;  // scene length in frames
}

// ─── Scene Types ────────────────────────────────────────────

interface BigStatRevealScene extends SceneBase {
  type: "big-stat-reveal";
  data: {
    value: number;
    prefix?: string;           // "$", "#", etc.
    suffix?: string;           // "K", "M", "%", etc.
    format?: "abbreviated" | "full" | "compact" | "percentage";
    color: string;             // hex color for the number
    subtitle: string;
    comparison?: {
      before: { label: string; value: string };
      after: { label: string; value: string };
    };
  };
}

interface PersonScorecardScene extends SceneBase {
  type: "person-scorecard";
  data: {
    name: string;
    title: string;
    badges: { value: string; label: string }[];  // 2-4 badges
    bottomStrip?: string;
  };
}

interface KpiDashboardScene extends SceneBase {
  type: "kpi-dashboard";
  data: {
    header: string;
    status?: string;           // "LIVE", "ACTIVE", etc.
    cards: {
      label: string;
      value: number;
      prefix?: string;
      suffix?: string;
      color: string;
    }[];                       // 2-4 cards
    sparkline?: boolean;
  };
}

interface WorkflowPipelineScene extends SceneBase {
  type: "workflow-pipeline";
  data: {
    header: string;
    status?: string;
    rows: {
      label: string;
      sub?: string;
      glow?: boolean;
      color?: string;
    }[][];                     // 1-2 rows of nodes
    stats?: { label: string; value: string }[];
    title?: { text: string; accentWord?: string };
  };
}

interface DataTableScene extends SceneBase {
  type: "data-table";
  data: {
    header: string;
    heroStat?: {
      label: string;
      value: number;
      color: string;
      subtitle?: string;
    };
    table: {
      columns: string[];
      rows: {
        cells: string[];
        color?: string;
      }[];
    };
    title?: { text: string; coloredWords?: { word: string; color: string }[] };
  };
}

interface NodeGraphScene extends SceneBase {
  type: "node-graph";
  data: {
    header: string;
    status?: { label: string; color: string };
    nodes: {
      label: string;
      x: number;              // percentage position (0-100)
      y: number;
      color: string;
      glow?: boolean;
    }[];
    edges: {
      from: number;           // index into nodes array
      to: number;
      color?: string;
    }[];
    statusBar?: { label: string; value: string }[];
  };
}

interface TimelineStepsScene extends SceneBase {
  type: "timeline-steps";
  data: {
    header: string;
    steps: {
      label: string;
      subtitle?: string;
      status: "complete" | "active" | "pending";
    }[];
    progress?: number;         // 0-100
  };
}

interface ComparisonSplitScene extends SceneBase {
  type: "comparison-split";
  data: {
    left: {
      header: string;
      color: string;
      icon: "cross" | "minus" | "warning";
      items: string[];
    };
    right: {
      header: string;
      color: string;
      icon: "check" | "plus" | "star";
      items: string[];
    };
  };
}

interface LogoEndorsementScene extends SceneBase {
  type: "logo-endorsement";
  data: {
    header: string;
    logos: {
      name: string;
      imageUrl?: string;       // optional — falls back to text
    }[];
    layout?: "grid-3x2" | "row" | "scroll";
    summaryStat?: { label: string; value: string };
  };
}

interface CtaCommentScene extends SceneBase {
  type: "cta-comment";
  data: {
    action: string;            // "COMMENT", "FOLLOW", "LINK"
    keyword: string;           // "PROCUREMENT", "AI", etc.
    subtitle?: string;
  };
}
```

### Example (complete config)

```json
{
  "meta": {
    "contentType": "technical-walkthrough",
    "title": "Pre-Meeting Intelligence System",
    "fps": 30,
    "width": 1080,
    "height": 1920,
    "talkingHeadUrl": "https://storage.example.com/videos/talking-head.mp4"
  },
  "scenes": [
    {
      "type": "big-stat-reveal",
      "from": 0,
      "durationInFrames": 300,
      "data": {
        "value": 58,
        "suffix": "min",
        "color": "#FF4444",
        "subtitle": "Average time spent on manual meeting prep"
      }
    },
    {
      "type": "person-scorecard",
      "from": 300,
      "durationInFrames": 270,
      "data": {
        "name": "Zain Bukhari",
        "title": "Co-Founder, True Horizon AI",
        "badges": [
          { "value": "AI", "label": "Systems" },
          { "value": "n8n", "label": "Automation" },
          { "value": "50+", "label": "Workflows" }
        ]
      }
    },
    {
      "type": "workflow-pipeline",
      "from": 570,
      "durationInFrames": 360,
      "data": {
        "header": "Pre-Meeting Intelligence",
        "status": "ACTIVE",
        "rows": [
          [
            { "label": "Calendar", "sub": "Trigger" },
            { "label": "CRM Lookup", "sub": "HubSpot" },
            { "label": "Enrichment", "sub": "Apollo.io", "glow": true }
          ],
          [
            { "label": "Normalize", "sub": "Data Clean" },
            { "label": "AI Agent", "sub": "GPT-4o", "glow": true },
            { "label": "Gmail", "sub": "Deliver" }
          ]
        ],
        "stats": [
          { "label": "Records", "value": "2.7M" },
          { "label": "Response", "value": "<3s" }
        ]
      }
    },
    {
      "type": "kpi-dashboard",
      "from": 930,
      "durationInFrames": 300,
      "data": {
        "header": "System Performance",
        "cards": [
          { "label": "Briefs Sent", "value": 847, "color": "#00D4FF" },
          { "label": "Prep Time", "value": 3, "suffix": "min", "color": "#00FF88" },
          { "label": "Accuracy", "value": 99.8, "suffix": "%", "color": "#00FF88" }
        ],
        "sparkline": true
      }
    },
    {
      "type": "cta-comment",
      "from": 1230,
      "durationInFrames": 180,
      "data": {
        "action": "COMMENT",
        "keyword": "AUTOMATION",
        "subtitle": "Want this for your team?"
      }
    }
  ],
  "textStrip": {
    "labels": [
      { "from": 0, "label": "The Problem" },
      { "from": 300, "label": "Zain · True Horizon" },
      { "from": 570, "label": "Intelligence Pipeline" },
      { "from": 930, "label": "Results" },
      { "from": 1230, "label": "Join the Conversation" }
    ]
  }
}
```

---

## Layer 2 — Parameterized Remotion Compositions

### Architecture

Replace the current hardcoded scene approach with a **scene registry** pattern. One composition reads the full JSON config from `inputProps` and dynamically renders the correct scene component for each entry.

```
b-roll-remotion/src/
├── components/
│   ├── TextStrip.tsx              ← already extracted (shared)
│   ├── AnimatedBackground.tsx     ← already exists
│   ├── StrokeReveal.tsx           ← already exists
│   └── scenes/                    ← NEW: parameterized scene components
│       ├── BigStatReveal.tsx
│       ├── PersonScorecard.tsx
│       ├── KpiDashboard.tsx
│       ├── WorkflowPipeline.tsx
│       ├── DataTable.tsx
│       ├── NodeGraph.tsx
│       ├── TimelineSteps.tsx
│       ├── ComparisonSplit.tsx
│       ├── LogoEndorsement.tsx
│       ├── CtaComment.tsx
│       └── index.ts               ← scene registry (type → component map)
├── compositions/
│   ├── dynamic/                   ← NEW: JSON-driven composition
│   │   ├── DynamicShort.tsx       ← main composition (reads inputProps)
│   │   ├── DynamicBottomPanel.tsx ← maps scenes from JSON to components
│   │   └── DynamicTopPanel.tsx    ← loads video from URL in inputProps
│   ├── jon-pierpoint/             ← existing (unchanged)
│   ├── conclusion/                ← existing (unchanged)
│   ├── screens/                   ← existing (unchanged)
│   └── _scaffolds/                ← existing (unchanged)
└── data/
    ├── conclusion.ts              ← existing
    └── schema.ts                  ← NEW: TypeScript types for BRollConfig
```

### Scene Registry

```tsx
// src/components/scenes/index.ts
import { BigStatReveal } from "./BigStatReveal";
import { PersonScorecard } from "./PersonScorecard";
import { KpiDashboard } from "./KpiDashboard";
import { WorkflowPipeline } from "./WorkflowPipeline";
import { DataTable } from "./DataTable";
import { NodeGraph } from "./NodeGraph";
import { TimelineSteps } from "./TimelineSteps";
import { ComparisonSplit } from "./ComparisonSplit";
import { LogoEndorsement } from "./LogoEndorsement";
import { CtaComment } from "./CtaComment";

export const SCENE_REGISTRY: Record<string, React.FC<{ data: any }>> = {
  "big-stat-reveal": BigStatReveal,
  "person-scorecard": PersonScorecard,
  "kpi-dashboard": KpiDashboard,
  "workflow-pipeline": WorkflowPipeline,
  "data-table": DataTable,
  "node-graph": NodeGraph,
  "timeline-steps": TimelineSteps,
  "comparison-split": ComparisonSplit,
  "logo-endorsement": LogoEndorsement,
  "cta-comment": CtaComment,
};
```

### DynamicBottomPanel

```tsx
// src/compositions/dynamic/DynamicBottomPanel.tsx
import { Sequence } from "remotion";
import { SCENE_REGISTRY } from "../../components/scenes";
import { Scene } from "../../data/schema";

const BOTTOM_HEIGHT = 900; // 1920 - 1020

export const DynamicBottomPanel: React.FC<{ scenes: Scene[] }> = ({ scenes }) => {
  return (
    <div style={{
      position: "absolute", top: 1020, left: 0,
      width: 1080, height: BOTTOM_HEIGHT,
      background: "#0B1222", overflow: "hidden",
    }}>
      {scenes.map((scene, i) => {
        const Component = SCENE_REGISTRY[scene.type];
        if (!Component) return null;
        return (
          <Sequence key={i} from={scene.from} durationInFrames={scene.durationInFrames}>
            <Component data={scene.data} />
          </Sequence>
        );
      })}
    </div>
  );
};
```

### DynamicShort (main composition)

```tsx
// src/compositions/dynamic/DynamicShort.tsx
export const DynamicShort: React.FC<{ config: BRollConfig }> = ({ config }) => {
  const frame = useCurrentFrame();
  const label = getCurrentLabel(frame, config.textStrip.labels);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <DynamicTopPanel videoUrl={config.meta.talkingHeadUrl} />
      <TextStrip label={label} />
      <DynamicBottomPanel scenes={config.scenes} />
    </AbsoluteFill>
  );
};
```

### Registration in Root.tsx

```tsx
<Composition
  id="DynamicShort"
  component={DynamicShort}
  durationInFrames={1800}         // overridden by calculateMetadata
  fps={30}
  width={1080}
  height={1920}
  schema={BRollConfigSchema}      // Zod schema for validation
  calculateMetadata={({ props }) => ({
    durationInFrames: props.config.scenes.reduce(
      (max, s) => Math.max(max, s.from + s.durationInFrames), 0
    ),
  })}
/>
```

### Building Scene Components

Each parameterized scene component in `components/scenes/` should be derived from the existing hardcoded Jon Pierpoint scenes:

| Parameterized Component | Reference Implementation | Key Props |
|---|---|---|
| `BigStatReveal.tsx` | Part of `Scene5_SystemLive.tsx` (count-up stats) | value, prefix, suffix, color, subtitle |
| `PersonScorecard.tsx` | `Scene2_WaltCharles.tsx` | name, title, badges[], bottomStrip |
| `KpiDashboard.tsx` | `Scene4_Dashboard.tsx` (hero stat + stats) | header, cards[], sparkline |
| `WorkflowPipeline.tsx` | `Scene3_Workflow.tsx` | header, rows[][], stats[] |
| `DataTable.tsx` | `Scene4_Dashboard.tsx` (table portion) | header, heroStat, table |
| `NodeGraph.tsx` | `Scene5_SystemLive.tsx` (Phase 2) | header, nodes[], edges[] |
| `TimelineSteps.tsx` | New (spec in `templates/timeline-steps.md`) | header, steps[], progress |
| `ComparisonSplit.tsx` | New (spec in `templates/comparison-split.md`) | left, right |
| `LogoEndorsement.tsx` | New (spec in `templates/logo-endorsement.md`) | header, logos[], layout |
| `CtaComment.tsx` | `Scene5_SystemLive.tsx` (Phase 3) | action, keyword, subtitle |

---

## Layer 3 — Claude API System Prompts

### Prompt Design

Each content type gets a system prompt that:
1. Defines the role (B-roll scene generator)
2. Includes the complete JSON schema
3. Provides the content-type-specific scene sequence and mapping rules (from the blueprints)
4. Constrains output to valid JSON only

### System Prompt Template

```
You are a B-roll scene generator for TrueHorizon video production. You analyze
video transcripts and output a JSON configuration that drives animated B-roll
graphics in Remotion.

## Your Task
Given a transcript (with timestamps) and a content type, output a valid BRollConfig
JSON object. The JSON must exactly match the schema below — no extra fields, no
missing required fields.

## Content Type: {CONTENT_TYPE}

{BLUEPRINT_RULES — scene sequence, transcript mapping rules, timing guidelines}

## JSON Schema

{FULL_SCHEMA — types, fields, constraints, enums}

## Rules
1. Every scene's `from` + `durationInFrames` must not overlap with adjacent scenes
   (scenes play sequentially, not overlapping)
2. Total duration = last scene's `from` + `durationInFrames`
3. Use frame math: frame = seconds × 30
4. Match scenes to what the speaker is saying at that moment — every graphic must
   directly illustrate the spoken content
5. TextStrip labels must match the scene they correspond to
6. Colors must be valid hex from the design system:
   Teal: #00D4FF, Green: #00FF88, Red: #FF4444, Orange: #FF8C00, Purple: #8B5CF6
7. Minimum scene duration: 180 frames (6 seconds)
8. Output ONLY the JSON object — no markdown, no explanation, no code fences

## Input Format
The user will provide:
- Content type (already specified above)
- Transcript with timestamps
- Talking head video URL
- Any additional context (speaker name, company, key metrics)
```

### Per-Content-Type Inserts

**Technical Walkthrough** — insert from `templates/content-types/technical-walkthrough.md`:
- Default 5-scene flow table
- Transcript mapping rules table
- Cutaway guidance (if full-screen format requested)

**Case Study** — insert from `templates/content-types/case-study.md`:
- Default 6-scene flow table
- Editor section mapping (Hook → Intro → Problem → Solution → Testimonial → Referral)
- Proof Pack extraction rules

**Podcast** — insert from `templates/content-types/podcast.md`:
- Flexible 4-6 scene flow
- Middle scene pool table
- Topic detection rules for unstructured conversation

---

## Layer 4 — n8n Workflow

### Workflow Design

One universal workflow with a content-type switch. The webhook accepts all three content types and routes to the appropriate Claude API system prompt.

### Node Map

```
┌─────────────┐
│ 1. Webhook  │  POST /broll-generate
│    Trigger  │  Body: { contentType, transcript, videoUrl, speakerName, 
│             │          company, metrics[], context }
└──────┬──────┘
       │
┌──────▼──────┐
│ 2. Switch   │  Route on contentType:
│             │  "technical-walkthrough" | "case-study" | "podcast"
└──────┬──────┘
       │ (3 branches, each with its own system prompt)
       │
┌──────▼──────────────┐
│ 3a/3b/3c. Claude    │  HTTP Request to Claude API (messages endpoint)
│    API Call         │  System prompt = blueprint for that content type
│                     │  User message = transcript + context
│                     │  Response = scene JSON
└──────┬──────────────┘
       │ (branches merge)
       │
┌──────▼──────┐
│ 4. Code     │  Parse Claude response → extract JSON
│    (Parse)  │  Validate against schema (basic checks)
│             │  Calculate totalFrames from scenes
└──────┬──────┘
       │
┌──────▼──────────────┐
│ 5. HTTP Request     │  POST to Render API
│    (Trigger Render) │  Body: { config: sceneJSON, outputFormat: "mp4" }
│                     │  Returns: { renderId, statusUrl }
└──────┬──────────────┘
       │
┌──────▼──────┐
│ 6. Wait     │  Pause 30-60 seconds (rendering takes time)
└──────┬──────┘
       │
┌──────▼──────────────┐
│ 7. HTTP Request     │  GET statusUrl (poll for completion)
│    (Check Status)   │  Loop back to Wait if still rendering
│                     │  Returns: { status: "complete", outputUrl: "..." }
└──────┬──────────────┘
       │
┌──────▼──────────────┐
│ 8. Deliver          │  Send MP4 link via:
│                     │  - Google Drive (upload)
│                     │  - Slack message
│                     │  - Email notification
│                     │  - Webhook response (if synchronous)
└─────────────────────┘
```

### n8n Workflow JSON (Node Specs)

**Node 1 — Webhook Trigger**
```json
{
  "id": "webhook-1",
  "name": "B-Roll Generator Webhook",
  "type": "n8n-nodes-base.webhook",
  "typeVersion": 2,
  "position": [250, 300],
  "parameters": {
    "httpMethod": "POST",
    "path": "broll-generate",
    "responseMode": "responseNode",
    "options": {}
  }
}
```

**Node 2 — Switch on Content Type**
```json
{
  "id": "switch-1",
  "name": "Route by Content Type",
  "type": "n8n-nodes-base.switch",
  "typeVersion": 3,
  "position": [480, 300],
  "parameters": {
    "rules": {
      "rules": [
        {
          "conditions": {
            "conditions": [{
              "leftValue": "={{ $json.body.contentType }}",
              "rightValue": "technical-walkthrough",
              "operator": { "type": "string", "operation": "equals" }
            }]
          },
          "renameOutput": true,
          "outputKey": "tech-walkthrough"
        },
        {
          "conditions": {
            "conditions": [{
              "leftValue": "={{ $json.body.contentType }}",
              "rightValue": "case-study",
              "operator": { "type": "string", "operation": "equals" }
            }]
          },
          "renameOutput": true,
          "outputKey": "case-study"
        },
        {
          "conditions": {
            "conditions": [{
              "leftValue": "={{ $json.body.contentType }}",
              "rightValue": "podcast",
              "operator": { "type": "string", "operation": "equals" }
            }]
          },
          "renameOutput": true,
          "outputKey": "podcast"
        }
      ]
    }
  }
}
```

**Node 3a — Claude API (Technical Walkthrough)**
```json
{
  "id": "claude-tech-1",
  "name": "Claude - Tech Walkthrough",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4,
  "position": [740, 140],
  "parameters": {
    "method": "POST",
    "url": "https://api.anthropic.com/v1/messages",
    "authentication": "genericCredentialType",
    "genericAuthType": "httpHeaderAuth",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        { "name": "anthropic-version", "value": "2023-06-01" },
        { "name": "content-type", "value": "application/json" }
      ]
    },
    "sendBody": true,
    "specifyBody": "json",
    "jsonBody": "={{ JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 8000, system: $vars.SYSTEM_PROMPT_TECH_WALKTHROUGH, messages: [{ role: 'user', content: 'Content Type: technical-walkthrough\\nVideo URL: ' + $json.body.videoUrl + '\\nSpeaker: ' + $json.body.speakerName + '\\nCompany: ' + $json.body.company + '\\nMetrics: ' + JSON.stringify($json.body.metrics) + '\\n\\nTranscript:\\n' + $json.body.transcript }] }) }}"
  }
}
```

*(Nodes 3b and 3c are identical but with `SYSTEM_PROMPT_CASE_STUDY` and `SYSTEM_PROMPT_PODCAST`)*

**Node 4 — Parse JSON Response**
```json
{
  "id": "code-parse-1",
  "name": "Parse Scene JSON",
  "type": "n8n-nodes-base.code",
  "typeVersion": 2,
  "position": [1000, 300],
  "parameters": {
    "jsCode": "// Extract JSON from Claude response\nconst response = $input.first().json;\nconst content = response.content[0].text;\n\n// Parse the scene config\nlet config;\ntry {\n  config = JSON.parse(content);\n} catch (e) {\n  // Try extracting JSON from markdown code block\n  const match = content.match(/```(?:json)?\\n?([\\s\\S]*?)```/);\n  if (match) config = JSON.parse(match[1]);\n  else throw new Error('Failed to parse scene JSON from Claude response');\n}\n\n// Calculate total frames\nconst totalFrames = config.scenes.reduce(\n  (max, s) => Math.max(max, s.from + s.durationInFrames), 0\n);\n\n// Basic validation\nif (!config.meta || !config.scenes || config.scenes.length === 0) {\n  throw new Error('Invalid config: missing meta or scenes');\n}\n\nreturn [{ json: { config, totalFrames, sceneCount: config.scenes.length } }];"
  }
}
```

**Node 5 — Trigger Render**
```json
{
  "id": "render-1",
  "name": "Trigger Remotion Render",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4,
  "position": [1240, 300],
  "parameters": {
    "method": "POST",
    "url": "={{ $vars.RENDER_API_URL }}/render",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        { "name": "Authorization", "value": "Bearer {{ $vars.RENDER_API_KEY }}" }
      ]
    },
    "sendBody": true,
    "specifyBody": "json",
    "jsonBody": "={{ JSON.stringify({ compositionId: 'DynamicShort', inputProps: { config: $json.config }, outputFormat: 'mp4' }) }}"
  }
}
```

### n8n Variables (stored in workflow settings)

| Variable | Purpose |
|---|---|
| `SYSTEM_PROMPT_TECH_WALKTHROUGH` | Full system prompt for technical walkthrough |
| `SYSTEM_PROMPT_CASE_STUDY` | Full system prompt for case study |
| `SYSTEM_PROMPT_PODCAST` | Full system prompt for podcast |
| `RENDER_API_URL` | URL of the Remotion render API |
| `RENDER_API_KEY` | Auth key for render API |
| `ANTHROPIC_API_KEY` | Claude API key (or use n8n credential) |

---

## Layer 5 — Render API

Since n8n Cloud cannot call local CLI, Remotion rendering needs an HTTP API.

### Option A: Remotion Lambda (Recommended for Production)

Remotion has official AWS Lambda support. Deploy the Remotion project to Lambda, then trigger renders via HTTP.

```
n8n → POST renderMediaOnLambda() → AWS Lambda → S3 bucket → presigned URL
```

**Pros:** Scales to zero, official support, fast renders (parallel chunking)
**Cons:** AWS setup required, Lambda cold starts, S3 costs

**Setup:**
1. Deploy Remotion site to S3: `npx remotion lambda sites create`
2. Deploy Lambda function: `npx remotion lambda functions deploy`
3. Create a thin API Gateway or Express wrapper that calls `renderMediaOnLambda()`

### Option B: Express API on Railway/Render

A simple Node.js server that wraps `@remotion/renderer`:

```typescript
// render-server/index.ts
import { bundle } from "@remotion/bundler";
import { renderMedia } from "@remotion/renderer";
import express from "express";

const app = express();
app.use(express.json({ limit: "10mb" }));

app.post("/render", async (req, res) => {
  const { compositionId, inputProps, outputFormat } = req.body;
  const renderId = crypto.randomUUID();

  // Start render in background
  renderInBackground(renderId, compositionId, inputProps, outputFormat);

  res.json({ renderId, statusUrl: `/status/${renderId}` });
});

app.get("/status/:id", (req, res) => {
  const status = getRenderStatus(req.params.id);
  res.json(status);  // { status: "rendering" | "complete" | "error", outputUrl?, progress? }
});
```

**Pros:** Simple, full control, no AWS dependency
**Cons:** Server costs (~$7-15/mo), single-threaded renders, must handle video files

### Option C: Hybrid (Start Here)

1. **Phase 1:** Use n8n + Claude API to generate scene JSON (Layers 3-4). Human reviews JSON and triggers local render manually.
2. **Phase 2:** Deploy Express render API on Railway. n8n calls it directly.
3. **Phase 3:** Migrate to Remotion Lambda for production scale.

---

## Implementation Roadmap

### Phase 1 — Scene JSON Generation (can build now)
- [ ] Define TypeScript types in `data/schema.ts`
- [ ] Write 3 Claude API system prompts (one per content type)
- [ ] Build n8n workflow: Webhook → Switch → Claude API → Parse → Respond
- [ ] Test with real transcripts, validate output JSON manually
- **Effort:** ~1 session. Immediate value — generates scene configs from transcripts.

### Phase 2 — Parameterized Remotion Compositions (next)
- [ ] Build 10 parameterized scene components in `components/scenes/`
- [ ] Build `DynamicShort` composition with `DynamicBottomPanel`
- [ ] Register in Root.tsx with `calculateMetadata`
- [ ] Test: feed example JSON → preview in Remotion Studio → render
- **Effort:** ~2-3 sessions. Each scene component takes 30-60 min (extract from Jon Pierpoint + parameterize).

### Phase 3 — Render API
- [ ] Set up Express render server (or Remotion Lambda)
- [ ] Deploy to Railway/Render (or AWS)
- [ ] Add `/render` and `/status` endpoints
- [ ] Handle video file downloads (talking head URL → local file for Remotion)
- **Effort:** ~1 session for Express, ~2 for Lambda.

### Phase 4 — Full Pipeline
- [ ] Connect n8n workflow to render API (add Nodes 5-8)
- [ ] Add error handling / retry logic
- [ ] Add delivery (Google Drive upload, Slack notification)
- [ ] End-to-end test: transcript → MP4 in Google Drive
- **Effort:** ~1 session.

### Phase 5 — Polish
- [ ] Add n8n form trigger (nice UI for uploading transcript + video)
- [ ] Add preview step (send scene JSON to Slack for human review before render)
- [ ] Add cost tracking (Claude API tokens, render time)
- [ ] Template variations (short-form vs long-form toggle in webhook)

---

## Cost Estimates

| Component | Cost | Notes |
|---|---|---|
| Claude API (scene generation) | ~$0.02-0.05 per video | ~2K input tokens (prompt), ~3K output tokens (JSON) |
| Remotion Lambda (rendering) | ~$0.10-0.30 per video | Depends on duration, Lambda memory |
| Railway Express (alternative) | ~$7-15/month fixed | Covers ~50-100 renders/month |
| n8n Cloud | Already paid | Existing subscription |
| **Total per video** | **~$0.12-0.35** | Fully automated, no human time |

---

## File Locations

| Artifact | Path |
|---|---|
| This architecture doc | `B_Roll/n8n-broll-pipeline-architecture.md` |
| Scene JSON schema (TypeScript) | `B_Roll/b-roll-remotion/src/data/schema.ts` (to create) |
| Claude system prompts | `B_Roll/prompts/` (to create) |
| n8n workflow JSON | Created via n8n MCP tools |
| Parameterized scene components | `B_Roll/b-roll-remotion/src/components/scenes/` (to create) |
| Dynamic composition | `B_Roll/b-roll-remotion/src/compositions/dynamic/` (to create) |
| Render API server | `B_Roll/render-server/` (to create, Phase 3) |
| Content-type blueprints | `B_Roll/templates/content-types/` (already created) |
