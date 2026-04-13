import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { TOP_PANEL_HEIGHT } from "./TopPanel";

// ─── Scene timing (frames @ 30fps) ───────────────────────────────────
//
// Blueprint: Case Study (6 scenes, 50–70s)
// See: templates/content-types/case-study.md
//
// Scene 1: Hook Stat        0:00–0:08  =    0–240   big-stat-reveal
// Scene 2: Client Intro     0:08–0:18  =  240–540   person-scorecard
// Scene 3: The Challenge    0:18–0:28  =  540–840   comparison-split or kpi-dashboard
// Scene 4: The Solution     0:28–0:38  =  840–1140  timeline-steps or workflow-pipeline
// Scene 5: The Results      0:38–0:48  = 1140–1440  kpi-dashboard + data-table
// Scene 6: Trust + CTA      0:48–0:56  = 1440–1680  logo-endorsement + cta-comment
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
      {/* Scene 1: Hook Stat — big-stat-reveal */}
      <Sequence from={0} durationInFrames={240}>
        <PlaceholderScene
          title="Scene 1: Hook Stat"
          template="big-stat-reveal"
          hint="Lead with the headline result — $2M saved, 340% increase"
        />
      </Sequence>

      {/* Scene 2: Client Intro — person-scorecard */}
      <Sequence from={240} durationInFrames={300}>
        <PlaceholderScene
          title="Scene 2: Client Intro"
          template="person-scorecard"
          hint="Client name, title, company, key credential badges"
        />
      </Sequence>

      {/* Scene 3: The Challenge — comparison-split or kpi-dashboard */}
      <Sequence from={540} durationInFrames={300}>
        <PlaceholderScene
          title="Scene 3: The Challenge"
          template="comparison-split or kpi-dashboard"
          hint="Before-state — what the problem looked like"
        />
      </Sequence>

      {/* Scene 4: The Solution — timeline-steps or workflow-pipeline */}
      <Sequence from={840} durationInFrames={300}>
        <PlaceholderScene
          title="Scene 4: The Solution"
          template="timeline-steps or workflow-pipeline"
          hint="Implementation journey or solution architecture"
        />
      </Sequence>

      {/* Scene 5: The Results — kpi-dashboard + data-table */}
      <Sequence from={1140} durationInFrames={300}>
        <PlaceholderScene
          title="Scene 5: The Results"
          template="kpi-dashboard + data-table"
          hint="After-state metrics — revenue saved, accuracy, scale"
        />
      </Sequence>

      {/* Scene 6: Trust + CTA — logo-endorsement + cta-comment */}
      <Sequence from={1440} durationInFrames={240}>
        <PlaceholderScene
          title="Scene 6: Trust + CTA"
          template="logo-endorsement + cta-comment"
          hint="Social proof grid → engagement CTA"
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
