import React from "react";
import { Composition } from "remotion";
import { TakeawayCard } from "./components/TakeawayCard";
import { EndCard } from "./components/EndCard";
import { TakeawaySequence } from "./compositions/conclusion/TakeawaySequence";
import { ConclusionBRoll } from "./compositions/conclusion/ConclusionBRoll";
import { TakeawayGrid } from "./compositions/conclusion/TakeawayGrid";
import { ConclusionGrid } from "./compositions/conclusion/ConclusionGrid";
import { AskAIScreen } from "./compositions/screens/AskAIScreen";
import { DashboardScreen } from "./compositions/screens/DashboardScreen";
import { ScreensBRoll } from "./compositions/screens/ScreensBRoll";
import { JonPierpointShort } from "./compositions/jon-pierpoint/JonPierpointShort";
import { TechWalkthroughShort } from "./compositions/_scaffolds/technical-walkthrough/TechWalkthroughShort";
import { CaseStudyShort } from "./compositions/_scaffolds/case-study/CaseStudyShort";
import { PodcastShort } from "./compositions/_scaffolds/podcast/PodcastShort";
import { DynamicShort } from "./compositions/dynamic/DynamicShort";
import { DynamicCutaway } from "./compositions/dynamic/DynamicCutaway";
import { TAKEAWAYS } from "./data/conclusion";
import type { BRollConfig } from "./data/schema";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {TAKEAWAYS.map((t) => (
        <Composition
          key={`takeaway-${t.number}`}
          id={`Takeaway${t.number}`}
          component={TakeawayCard}
          durationInFrames={75}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            number: t.number,
            headline: t.headline,
            subtext: t.subtext,
            icon: t.icon,
            lottieSrc: t.lottieSrc,
          }}
        />
      ))}

      <Composition
        id="TakeawaySequence"
        component={TakeawaySequence}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="EndCard"
        component={EndCard}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="ConclusionBRoll"
        component={ConclusionBRoll}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="TakeawayGrid"
        component={TakeawayGrid}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="ConclusionGrid"
        component={ConclusionGrid}
        durationInFrames={390}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Screenshot B-Roll ── */}
      <Composition
        id="AskAIScreen"
        component={AskAIScreen}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="DashboardScreen"
        component={DashboardScreen}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="ScreensBRoll"
        component={ScreensBRoll}
        durationInFrames={480}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Jon Pierpoint Short Form ── */}
      <Composition
        id="JonPierpointShort"
        component={JonPierpointShort}
        durationInFrames={1490}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ── Scaffolds (preview placeholders) ── */}
      <Composition
        id="TechWalkthroughScaffold"
        component={TechWalkthroughShort}
        durationInFrames={1680}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="CaseStudyScaffold"
        component={CaseStudyShort}
        durationInFrames={1680}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="PodcastScaffold"
        component={PodcastShort}
        durationInFrames={1260}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ── Dynamic (JSON-driven) ── */}
      <Composition
        id="DynamicCutaway"
        component={DynamicCutaway}
        durationInFrames={1650}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          config: {
            meta: { contentType: "technical-walkthrough", title: "Pre-Meeting Intelligence System", fps: 30, width: 1080, height: 1920, talkingHeadUrl: "" },
            scenes: [
              { type: "big-stat-reveal", from: 0, durationInFrames: 240, data: { value: 58, suffix: "min", color: "#FF4444", subtitle: "Average time wasted on manual meeting prep" } },
              { type: "person-scorecard", from: 240, durationInFrames: 270, data: { name: "Zain Bukhari", title: "Senior AI Engineer — TrueHorizon", badges: [{ value: "AI", label: "Systems" }, { value: "n8n", label: "Automation" }, { value: "50+", label: "Workflows" }], bottomStrip: "TrueHorizon AI" } },
              { type: "workflow-pipeline", from: 510, durationInFrames: 360, data: { header: "Pre-Meeting Intelligence", status: "ACTIVE", rows: [[{ label: "Calendar", sub: "Trigger" }, { label: "CRM Lookup", sub: "HubSpot" }, { label: "Enrichment", sub: "Apollo.io", glow: true }], [{ label: "Normalize", sub: "Data Clean" }, { label: "AI Agent", sub: "GPT-4o", glow: true }, { label: "Gmail", sub: "Deliver" }]], stats: [{ label: "Records", value: "2.7M" }, { label: "Response", value: "<3s" }] } },
              { type: "comparison-split", from: 870, durationInFrames: 300, data: { left: { header: "BEFORE", color: "#FF4444", icon: "cross", items: ["Check CRM manually", "Scan LinkedIn profiles", "Search old emails", "58 min avg prep time"] }, right: { header: "AFTER", color: "#00FF88", icon: "check", items: ["Auto-detect meetings", "CRM + enrichment in seconds", "AI-structured brief", "Delivered before the call"] } } },
              { type: "kpi-dashboard", from: 1170, durationInFrames: 270, data: { header: "System Performance", status: "LIVE", cards: [{ label: "Briefs Sent", value: 847, color: "#00D4FF" }, { label: "Prep Time", value: 3, suffix: "min", color: "#00FF88" }, { label: "Accuracy", value: 99, suffix: "%", color: "#00FF88" }], sparkline: true } },
              { type: "cta-comment", from: 1440, durationInFrames: 210, data: { action: "COMMENT", keyword: "AUTOMATION", subtitle: "Want this for your team?" } }
            ],
            textStrip: { labels: [{ from: 0, label: "The Problem" }, { from: 240, label: "Zain · TrueHorizon AI" }, { from: 510, label: "Intelligence Pipeline" }, { from: 870, label: "Before vs After" }, { from: 1170, label: "System Performance" }, { from: 1440, label: "Join the Conversation" }] }
          } as BRollConfig,
        }}
        calculateMetadata={({ props }) => {
          const lastScene = props.config.scenes.reduce(
            (max: number, s: { from: number; durationInFrames: number }) =>
              Math.max(max, s.from + s.durationInFrames),
            300
          );
          return { durationInFrames: lastScene };
        }}
      />

      <Composition
        id="DynamicShort"
        component={DynamicShort}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          config: {
            meta: {
              contentType: "technical-walkthrough",
              title: "Preview",
              fps: 30,
              width: 1080,
              height: 1920,
              talkingHeadUrl: "",
            },
            scenes: [],
            textStrip: { labels: [{ from: 0, label: "PREVIEW" }] },
          } as BRollConfig,
        }}
        calculateMetadata={({ props }) => {
          const lastScene = props.config.scenes.reduce(
            (max: number, s: { from: number; durationInFrames: number }) =>
              Math.max(max, s.from + s.durationInFrames),
            300
          );
          return { durationInFrames: lastScene };
        }}
      />
    </>
  );
};
