import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { TOP_PANEL_HEIGHT } from "./TopPanel";

// ─── Scene timing (frames @ 30fps) ───────────────────────────────────
//
// Blueprint: Technical Walkthrough (5 scenes, 45–60s)
// See: templates/content-types/technical-walkthrough.md
//
// Scene 1: Hook/Problem    0:00–0:12  =    0–360   big-stat-reveal or kpi-dashboard
// Scene 2: Speaker Intro   0:12–0:20  =  360–600   person-scorecard
// Scene 3: How It Works    0:20–0:34  =  600–1020  workflow-pipeline
// Scene 4: Results/Data    0:34–0:44  = 1020–1320  data-table or kpi-dashboard
// Scene 5: Arch + CTA      0:44–0:56  = 1320–1680  node-graph + cta-comment
//
// TODO: Adjust frame ranges to match your transcript timestamps.
//       frame = seconds × 30
// ──────────────────────────────────────────────────────────────────────

const BOTTOM_HEIGHT = 1920 - TOP_PANEL_HEIGHT;

export const BottomPanel: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: TOP_PANEL_HEIGHT,
        left: 0,
        width: 1080,
        height: BOTTOM_HEIGHT,
        background: "#0B1222",
        overflow: "hidden",
      }}
    >
      {/* Scene 1: Hook / Problem — big-stat-reveal or kpi-dashboard */}
      <Sequence from={0} durationInFrames={360}>
        <PlaceholderScene
          title="Scene 1: Hook / Problem"
          template="big-stat-reveal or kpi-dashboard"
          hint="Open with the problem scale — a shocking number or dashboard"
        />
      </Sequence>

      {/* Scene 2: Speaker Intro — person-scorecard */}
      <Sequence from={360} durationInFrames={240}>
        <PlaceholderScene
          title="Scene 2: Speaker Intro"
          template="person-scorecard"
          hint="Name, title, 3 credential badges"
        />
      </Sequence>

      {/* Scene 3: How It Works — workflow-pipeline */}
      <Sequence from={600} durationInFrames={420}>
        <PlaceholderScene
          title="Scene 3: How It Works"
          template="workflow-pipeline"
          hint="Step-by-step pipeline or agent chain"
        />
      </Sequence>

      {/* Scene 4: Results / Data — data-table or kpi-dashboard */}
      <Sequence from={1020} durationInFrames={300}>
        <PlaceholderScene
          title="Scene 4: Results / Data"
          template="data-table or kpi-dashboard"
          hint="Data the system processes or results it produces"
        />
      </Sequence>

      {/* Scene 5: Architecture + CTA — node-graph + cta-comment */}
      <Sequence from={1320} durationInFrames={360}>
        <PlaceholderScene
          title="Scene 5: Architecture + CTA"
          template="node-graph + cta-comment"
          hint="System architecture view → engagement CTA"
        />
      </Sequence>
    </div>
  );
};

// ─── Placeholder Scene ───────────────────────────────────────────────
// Replace each PlaceholderScene with your actual scene component.
// Build scene components using the specs in templates/*.md
// ──────────────────────────────────────────────────────────────────────

const PlaceholderScene: React.FC<{
  title: string;
  template: string;
  hint: string;
}> = ({ title, template, hint }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: "#0B1222",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: 60,
      }}
    >
      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: "#00D4FF",
          marginBottom: 16,
          textAlign: "center",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: "rgba(255,255,255,0.5)",
          marginBottom: 12,
          textAlign: "center",
        }}
      >
        Template: {template}
      </div>
      <div
        style={{
          fontSize: 18,
          color: "rgba(255,255,255,0.3)",
          textAlign: "center",
          maxWidth: 800,
        }}
      >
        {hint}
      </div>
      <div
        style={{
          fontSize: 14,
          color: "rgba(255,255,255,0.2)",
          marginTop: 20,
        }}
      >
        Frame: {frame}
      </div>
    </AbsoluteFill>
  );
};
