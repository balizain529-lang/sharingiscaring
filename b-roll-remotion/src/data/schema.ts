// ─── B-Roll Config Schema ─────────────────────────────────────────────
// The contract between Claude API (generates JSON) and Remotion (renders video).
// n8n orchestrates: transcript → Claude API → this JSON → Remotion → MP4
// ──────────────────────────────────────────────────────────────────────

export type ContentType = "technical-walkthrough" | "case-study" | "podcast";

export interface BRollConfig {
  meta: {
    contentType: ContentType;
    title: string;
    fps: 30;
    width: number;
    height: number;
    talkingHeadUrl: string;
    talkingHeadTrim?: {
      startFrame?: number;
      endFrame?: number;
    };
  };
  scenes: Scene[];
  textStrip: {
    labels: { from: number; label: string }[];
  };
  lowerThirds?: LowerThird[];
}

export interface LowerThird {
  name: string;
  title: string;
  from: number;
  durationInFrames: number;
}

// ─── Scene Union ────────────────────────────────────────────────────

export type SceneType =
  | "big-stat-reveal"
  | "person-scorecard"
  | "kpi-dashboard"
  | "workflow-pipeline"
  | "data-table"
  | "node-graph"
  | "timeline-steps"
  | "comparison-split"
  | "logo-endorsement"
  | "cta-comment";

export type Scene =
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

// ─── Base ───────────────────────────────────────────────────────────

interface SceneBase {
  type: SceneType;
  from: number;
  durationInFrames: number;
  /** Optional looping stock video behind the scene at low opacity. URL populated by n8n enrichment. */
  backgroundVideo?: {
    /** Search query (e.g., "data center", "abstract tech"). Used by n8n to fetch from Pexels/Pixabay/Mixkit/Coverr. */
    query: string;
    /** Final URL after enrichment. Populated by n8n, not Claude. */
    url?: string;
    /** Background opacity 0-1. Default 0.15. */
    opacity?: number;
    /** Source attribution. Defaults to "pexels" → fallback chain. */
    source?: "pexels" | "pixabay" | "mixkit" | "coverr";
  };
  /** For DynamicOverlay composition: zone where the overlay renders without covering the speaker.
   *  - "lower-third": bottom 28% of frame, full width (default for person-scorecard, cta-comment, logo-endorsement)
   *  - "hero-stat-corner": top-right corner, ~30% of frame (default for big-stat-reveal, kpi-dashboard)
   *  - "caption-center": full-width animated text caption near top, semi-transparent bg (default for comparison-split)
   *  Ignored by DynamicCutaway (which fills full screen with the scene). */
  layout?: "lower-third" | "hero-stat-corner" | "caption-center";
  /** Optional polish notes from Claude flagging potential first-pass issues. */
  _polishNotes?: string;
}

// ─── Scene Types ────────────────────────────────────────────────────

export interface BigStatRevealScene extends SceneBase {
  type: "big-stat-reveal";
  data: {
    value: number;
    prefix?: string;
    suffix?: string;
    format?: "abbreviated" | "full" | "compact" | "percentage";
    color: string;
    subtitle: string;
    comparison?: {
      before: { label: string; value: string };
      after: { label: string; value: string };
    };
  };
}

export interface PersonScorecardScene extends SceneBase {
  type: "person-scorecard";
  data: {
    name: string;
    title: string;
    badges: { value: string; label: string }[];
    bottomStrip?: string;
  };
}

export interface KpiDashboardScene extends SceneBase {
  type: "kpi-dashboard";
  data: {
    header: string;
    status?: string;
    cards: {
      label: string;
      value: number;
      prefix?: string;
      suffix?: string;
      color: string;
      tickRange?: [number, number];
    }[];
    sparkline?: boolean;
  };
}

export interface WorkflowPipelineScene extends SceneBase {
  type: "workflow-pipeline";
  data: {
    header: string;
    status?: string;
    rows: {
      label: string;
      sub?: string;
      glow?: boolean;
      color?: string;
      /** Iconify icon name (e.g., "mdi:database", "ri:brain-line"). Renders inline. */
      icon?: string;
    }[][];
    stats?: { label: string; value: string }[];
    title?: { text: string; accentWord?: string };
  };
}

export interface DataTableScene extends SceneBase {
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
      rows: { cells: string[]; color?: string }[];
    };
    title?: {
      text: string;
      coloredWords?: { word: string; color: string }[];
    };
  };
}

export interface NodeGraphScene extends SceneBase {
  type: "node-graph";
  data: {
    header: string;
    status?: { label: string; color: string };
    nodes: {
      label: string;
      x: number;
      y: number;
      color: string;
      glow?: boolean;
      /** Iconify icon name. Renders next to label. */
      icon?: string;
    }[];
    edges: { from: number; to: number; color?: string }[];
    statusBar?: { label: string; value: string }[];
  };
}

export interface TimelineStepsScene extends SceneBase {
  type: "timeline-steps";
  data: {
    header: string;
    steps: {
      label: string;
      subtitle?: string;
      status: "complete" | "active" | "pending";
    }[];
    progress?: number;
  };
}

export interface ComparisonSplitScene extends SceneBase {
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

export interface LogoEndorsementScene extends SceneBase {
  type: "logo-endorsement";
  data: {
    header: string;
    logos: { name: string; imageUrl?: string }[];
    layout?: "grid-3x2" | "row" | "scroll";
    summaryStat?: { label: string; value: string };
  };
}

export interface CtaCommentScene extends SceneBase {
  type: "cta-comment";
  data: {
    action: string;
    keyword: string;
    subtitle?: string;
  };
}

// ─── Helpers ────────────────────────────────────────────────────────

export function getTotalFrames(config: BRollConfig): number {
  return config.scenes.reduce(
    (max, s) => Math.max(max, s.from + s.durationInFrames),
    0
  );
}

export function getCurrentLabel(
  frame: number,
  labels: { from: number; label: string }[]
): string {
  for (let i = labels.length - 1; i >= 0; i--) {
    if (frame >= labels[i].from) return labels[i].label;
  }
  return labels[0]?.label ?? "";
}
