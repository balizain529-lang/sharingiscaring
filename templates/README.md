# B-Roll Scene Templates Library

Reusable visual patterns for split-screen short-form video b-roll. Each template describes a layout, animation sequence, and data shape — independent of specific content or topic.

## Content-Type Blueprints

These scene templates are building blocks. For full "recipe" blueprints that tell you which templates to use and in what order for specific video formats, see:

| Video Format | Blueprint |
|---|---|
| Demos, tutorials, system walkthroughs | [Technical Walkthrough](content-types/technical-walkthrough.md) |
| Client success stories, interviews | [Case Study](content-types/case-study.md) |
| Interviews, debates, conversations | [Podcast](content-types/podcast.md) |

See [Content-Type Blueprints](content-types/README.md) for the full index and decision matrix.

---

## How to Use

1. Pick templates that match what's being **said** in the script
2. Fill in the data shape with your content
3. Reference the template name + data when building the Remotion composition

For lower-level animation primitives (typewriters, particles, 3D scenes, glitch text, animated counters) usable inside any template, see [bits-library.md](bits-library.md). The `remotion-bits` package is installed and importable from any composition.

---

## Templates

### Credibility & Authority
| Template | File | Best For |
|---|---|---|
| **Person Scorecard** | [person-scorecard.md](person-scorecard.md) | Introducing a speaker, guest, or expert with name + stats |
| **Logo Endorsement** | [logo-endorsement.md](logo-endorsement.md) | "Trusted by" grids, tech stacks, partner logos |

### Data & Metrics
| Template | File | Best For |
|---|---|---|
| **KPI Dashboard** | [kpi-dashboard.md](kpi-dashboard.md) | 2-4 stat cards with live-ticking values + sparkline |
| **Big Stat Reveal** | [big-stat-reveal.md](big-stat-reveal.md) | One massive number as a hook — "$20M problem" |
| **Data Table** | [data-table.md](data-table.md) | Supplier lists, risk tables, ranked data with scanning highlight |

### Process & Technical
| Template | File | Best For |
|---|---|---|
| **Workflow Pipeline** | [workflow-pipeline.md](workflow-pipeline.md) | Agent chains, data flows, step-by-step pipelines |
| **Node Graph** | [node-graph.md](node-graph.md) | Architecture diagrams, system connections, microservices |
| **Timeline Steps** | [timeline-steps.md](timeline-steps.md) | Implementation phases, build journeys, chronological events |

### Contrast & CTA
| Template | File | Best For |
|---|---|---|
| **Comparison Split** | [comparison-split.md](comparison-split.md) | Before/after, old way vs new way, manual vs automated |
| **CTA Comment** | [cta-comment.md](cta-comment.md) | Final scene — drives comments, follows, engagement |

---

## Picking Templates for a Script

Map each **script segment** to the template that matches what's being said:

| What speaker says | Template to use |
|---|---|
| Introduces a person / credentials | Person Scorecard |
| States a big number or problem | Big Stat Reveal or KPI Dashboard |
| Explains how something works | Workflow Pipeline |
| Shows results or data | Data Table |
| Describes system architecture | Node Graph |
| Compares old vs new | Comparison Split |
| Lists clients or partners | Logo Endorsement |
| Describes a journey or phases | Timeline Steps |
| Asks for engagement | CTA Comment |

---

## Design System (Shared)

All templates use these defaults unless overridden:

| Property | Value |
|---|---|
| Background | `#0B1222` |
| Card bg | `#111E30` |
| Border | `rgba(255,255,255,0.08)` |
| Teal accent | `#00D4FF` |
| Green accent | `#00FF88` |
| Red accent | `#FF4444` |
| Orange accent | `#FF8C00` |
| Purple accent | `#8B5CF6` |
| Font | Inter, system-ui, sans-serif |
| Font weights | 600 (body), 700 (labels), 800-900 (headers/stats) |
| Animation | Spring physics via Remotion `spring()` |
| Particles | 10-20 teal dots, opacity 0.04-0.12, sin wave drift |
