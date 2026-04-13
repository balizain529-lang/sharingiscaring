// Scene Registry — maps scene type strings to React components.
// Used by DynamicBottomPanel to render the correct component for each scene in the JSON config.

import React from "react";
import { PersonScorecard } from "./PersonScorecard";
import { BigStatReveal } from "./BigStatReveal";
import { KpiDashboard } from "./KpiDashboard";
import { WorkflowPipeline } from "./WorkflowPipeline";
import { DataTable } from "./DataTable";
import { NodeGraph } from "./NodeGraph";
import { TimelineSteps } from "./TimelineSteps";
import { ComparisonSplit } from "./ComparisonSplit";
import { LogoEndorsement } from "./LogoEndorsement";
import { CtaComment } from "./CtaComment";
import type { SceneType } from "../../data/schema";

export const SCENE_REGISTRY: Record<SceneType, React.FC<{ data: any }>> = {
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
