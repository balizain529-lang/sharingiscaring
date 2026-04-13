import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { TOP_PANEL_HEIGHT } from "./TopPanel";

// ─── Scene timing (frames @ 30fps) ───────────────────────────────────
//
// Blueprint: Podcast (4–6 scenes, 40–60s)
// See: templates/content-types/podcast.md
//
// Scene 1: Guest Intro     0:00–0:09  =    0–270   person-scorecard
// Scene 2: Key Stat        0:09–0:16  =  270–480   big-stat-reveal (hook)
// Scene 3: Topic Viz 1     0:16–0:27  =  480–810   varies by topic (from pool)
// Scene 4: Topic Viz 2     0:27–0:36  =  810–1080  varies by topic (from pool)
// Scene 5: CTA             0:36–0:42  = 1080–1260  cta-comment
//
// NOTE: Podcasts are topic-driven, not narrative-driven.
//       Add or remove middle scenes based on conversation topics.
//       See the "Middle Scene Pool" in the blueprint for options.
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
      {/* Scene 1: Guest Intro — person-scorecard */}
      <Sequence from={0} durationInFrames={270}>
        <PlaceholderScene
          title="Scene 1: Guest Intro"
          template="person-scorecard"
          hint="Guest credentials + stat badges"
        />
      </Sequence>

      {/* Scene 2: Key Stat — big-stat-reveal (hook) */}
      <Sequence from={270} durationInFrames={210}>
        <PlaceholderScene
          title="Scene 2: Key Stat"
          template="big-stat-reveal"
          hint="One shocking stat pulled from conversation"
        />
      </Sequence>

      {/* Scene 3: Topic Visualization 1 — pick from pool */}
      {/* Options: workflow-pipeline, comparison-split, kpi-dashboard,
          logo-endorsement, timeline-steps, node-graph, data-table */}
      <Sequence from={480} durationInFrames={330}>
        <PlaceholderScene
          title="Scene 3: Topic Viz 1"
          template="varies — pick from pool"
          hint="Visualize the most important discussion topic"
        />
      </Sequence>

      {/* Scene 4: Topic Visualization 2 — pick from pool */}
      <Sequence from={810} durationInFrames={270}>
        <PlaceholderScene
          title="Scene 4: Topic Viz 2"
          template="varies — pick from pool"
          hint="Visualize the second key topic"
        />
      </Sequence>

      {/* Add more Topic Viz scenes as needed for longer clips:
      <Sequence from={1080} durationInFrames={270}>
        <PlaceholderScene title="Scene 5: Topic Viz 3" ... />
      </Sequence>
      */}

      {/* Scene 5: CTA — cta-comment */}
      <Sequence from={1080} durationInFrames={180}>
        <PlaceholderScene
          title="Scene 5: Engagement CTA"
          template="cta-comment"
          hint="Drive comments, follows, engagement"
        />
      </Sequence>
    </div>
  );
};

// ─── Placeholder Scene ───────────────────────────────────────────────
// Replace each PlaceholderScene with your actual scene component.
// Build scene components using the specs in templates/*.md
//
// Podcast tip: Middle scenes should match the *topic* being discussed.
// See the "Middle Scene Pool" table in the podcast blueprint.
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
