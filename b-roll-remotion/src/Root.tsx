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
import { DynamicOverlay } from "./compositions/dynamic/DynamicOverlay";
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

      {/* ── YT Scraper Intro (horizontal cutaway) ── */}
      <Composition
        id="YtScraperIntro"
        component={DynamicCutaway}
        durationInFrames={2670}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          config: {
            meta: {
              contentType: "technical-walkthrough",
              title: "YT Scraper Intro",
              fps: 30,
              width: 1920,
              height: 1080,
              talkingHeadUrl: "yt-scraper/intro.mp4",
            },
            scenes: [
              {
                type: "comparison-split",
                from: 210,
                durationInFrames: 240,
                backgroundVideo: {
                  query: "person at desk dark room",
                  url: "https://videos.pexels.com/video-files/4069295/4069295-uhd_2732_1440_25fps.mp4",
                  opacity: 0.25,
                  source: "pexels",
                },
                data: {
                  left: {
                    header: "THE CREATOR TRAP",
                    color: "#FF4444",
                    icon: "cross",
                    items: [
                      "Scrolling YouTube for hours",
                      "Guessing what's trending",
                      "Wave has already passed",
                    ],
                  },
                  right: {
                    header: "",
                    color: "#FF4444",
                    icon: "cross",
                    items: [],
                  },
                },
              },
              {
                type: "big-stat-reveal",
                from: 720,
                durationInFrames: 240,
                backgroundVideo: {
                  query: "clock time lapse",
                  url: "https://videos.pexels.com/video-files/7346142/7346142-uhd_1920_1440_25fps.mp4",
                  opacity: 0.18,
                  source: "pexels",
                },
                data: {
                  value: 0,
                  color: "#FF8C00",
                  subtitle: "Research is eating your filming time.",
                  comparison: {
                    before: { label: "RESEARCHING", value: "4 hrs" },
                    after: { label: "FILMING", value: "30 min" },
                  },
                },
              },
              {
                type: "workflow-pipeline",
                from: 1200,
                durationInFrames: 360,
                backgroundVideo: {
                  query: "abstract neural network animation",
                  url: "https://videos.pexels.com/video-files/37104472/15718790_1920_1080_30fps.mp4",
                  opacity: 0.20,
                  source: "pexels",
                },
                data: {
                  header: "Viral Outlier Pipeline",
                  status: "ACTIVE",
                  rows: [
                    [
                      { label: "YouTube API", sub: "Intake", icon: "mdi:youtube" },
                      { label: "Niche Filter", sub: "Your Topic", icon: "mdi:filter-variant" },
                      { label: "Apify Scraper", sub: "Extract", glow: true, icon: "mdi:web-box" },
                    ],
                    [
                      { label: "Transcript + Thumb", sub: "Parse", icon: "mdi:script-text-outline" },
                      { label: "LLM Analysis", sub: "Claude", glow: true, icon: "mdi:brain" },
                      { label: "Outlier Ranked", sub: "Scored", icon: "mdi:trophy-variant" },
                    ],
                  ],
                },
              },
              {
                type: "big-stat-reveal",
                from: 1860,
                durationInFrames: 240,
                backgroundVideo: {
                  query: "abstract blue particles glow",
                  url: "https://videos.pexels.com/video-files/29168272/12596084_1920_1080_30fps.mp4",
                  opacity: 0.22,
                  source: "pexels",
                },
                data: {
                  value: 99,
                  suffix: "%",
                  format: "percentage",
                  color: "#00FF88",
                  subtitle: "Enterprise-grade uptime. 12+ workflows shipped. 50K+ records processed.",
                },
              },
            ],
            textStrip: {
              labels: [],
            },
            lowerThirds: [
              {
                name: "Milan",
                title: "Co-Founder, True Horizon",
                from: 45,
                durationInFrames: 165,
              },
            ],
          } as BRollConfig,
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

      {/* ── YT Scraper OVERLAY variant (speaker full-screen, no cutaways) ── */}
      <Composition
        id="YtScraperOverlay"
        component={DynamicOverlay}
        durationInFrames={2670}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          config: {
            meta: {
              contentType: "technical-walkthrough",
              title: "YT Scraper Intro Overlay",
              fps: 30,
              width: 1920,
              height: 1080,
              talkingHeadUrl: "yt-scraper/intro.mp4",
            },
            scenes: [
              {
                type: "comparison-split",
                from: 210,
                durationInFrames: 180,
                layout: "fullscreen-cutaway",
                backgroundVideo: {
                  query: "clock time-lapse",
                  url: "https://videos.pexels.com/video-files/7346142/7346142-uhd_1920_1440_25fps.mp4",
                  opacity: 0.20,
                  source: "pexels",
                },
                data: {
                  left: {
                    header: "THE CREATOR TRAP",
                    color: "#FF4444",
                    icon: "cross",
                    items: [
                      "Scrolling YouTube for hours",
                      "Guessing what's trending",
                      "Wave has already passed",
                    ],
                  },
                  right: { header: "", color: "#FF4444", icon: "cross", items: [] },
                },
              },
              {
                type: "big-stat-reveal",
                from: 720,
                durationInFrames: 180,
                layout: "caption-left",
                data: {
                  value: 0,
                  color: "#FF8C00",
                  subtitle: "Research is eating your filming time.",
                  comparison: {
                    before: { label: "RESEARCHING", value: "4 hrs" },
                    after: { label: "FILMING", value: "30 min" },
                  },
                },
              },
              {
                type: "workflow-pipeline",
                from: 1200,
                durationInFrames: 300,
                layout: "fullscreen-cutaway",
                backgroundVideo: {
                  query: "video editor workstation timeline",
                  url: "https://videos.pexels.com/video-files/32150707/13707651_2560_1440_24fps.mp4",
                  opacity: 0.22,
                  source: "pexels",
                },
                data: {
                  header: "Viral Outlier Pipeline",
                  status: "ACTIVE",
                  rows: [
                    [
                      { label: "YouTube API", sub: "Intake", icon: "mdi:youtube" },
                      { label: "Niche Filter", sub: "Your Topic", icon: "mdi:filter-variant" },
                      { label: "Apify Scraper", sub: "Extract", glow: true, icon: "mdi:web-box" },
                    ],
                    [
                      { label: "Transcript + Thumb", sub: "Parse", icon: "mdi:script-text-outline" },
                      { label: "LLM Analysis", sub: "Claude", glow: true, icon: "mdi:brain" },
                      { label: "Outlier Ranked", sub: "Scored", icon: "mdi:trophy-variant" },
                    ],
                  ],
                  stats: [
                    { label: "videos analyzed", value: "5K+" },
                    { label: "avg scan time", value: "<2 min" },
                  ],
                  title: { text: "FIND OUTLIERS BEFORE THE WAVE PASSES", accentWord: "OUTLIERS" },
                },
              },
              {
                type: "big-stat-reveal",
                from: 1860,
                durationInFrames: 240,
                layout: "hero-stat-corner",
                data: {
                  value: 5000,
                  format: "abbreviated",
                  suffix: "K+",
                  color: "#00FF88",
                  subtitle: "Videos analyzed per niche. Outliers ranked by viral potential.",
                },
              },
            ],
            textStrip: { labels: [] },
            lowerThirds: [
              {
                name: "Milan",
                title: "Co-Founder, True Horizon",
                from: 45,
                durationInFrames: 165,
              },
            ],
          } as BRollConfig,
        }}
      />

      {/* ── Jon Pierpoint Vertical V2 (DynamicCutaway with new defaults) ── */}
      <Composition
        id="JonPierpointVerticalV2"
        component={DynamicCutaway}
        durationInFrames={1490}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          config: {
            meta: {
              contentType: "case-study",
              title: "Walt Charles V2 Vertical",
              fps: 30,
              width: 1080,
              height: 1920,
              talkingHeadUrl: "jon-pierpoint/talking-head.mp4",
            },
            scenes: [
              {
                type: "person-scorecard",
                from: 0,
                durationInFrames: 360,
                backgroundVideo: {
                  query: "executive boardroom",
                  url: "https://videos.pexels.com/video-files/29168272/12596084_1920_1080_30fps.mp4",
                  opacity: 0.20,
                  source: "pexels",
                },
                data: {
                  name: "Walt Charles III",
                  title: "Chief Procurement Officer",
                  badges: [
                    { value: "7", label: "Fortune 500s" },
                    { value: "$100B+", label: "Spend Managed" },
                    { value: "25+", label: "Years Exp." },
                  ],
                  bottomStrip: "WALT CHARLES · 7x CPO",
                },
              },
              {
                type: "workflow-pipeline",
                from: 360,
                durationInFrames: 270,
                backgroundVideo: {
                  query: "abstract neural network",
                  url: "https://videos.pexels.com/video-files/37104472/15718790_1920_1080_30fps.mp4",
                  opacity: 0.22,
                  source: "pexels",
                },
                data: {
                  header: "EP² Workflow",
                  status: "ACTIVE",
                  rows: [
                    [
                      { label: "Trigger", sub: "User Query", icon: "mdi:cursor-default-click" },
                      { label: "SQL Agent", sub: "NLP → SQL", glow: true, icon: "mdi:brain" },
                      { label: "Database", sub: "2.7M Records", icon: "mdi:database" },
                    ],
                  ],
                  stats: [
                    { label: "records queried", value: "2.7M" },
                    { label: "response time", value: "11s" },
                  ],
                  title: { text: "AGENTIC OPERATING SYSTEM", accentWord: "AGENTIC" },
                },
              },
              {
                type: "kpi-dashboard",
                from: 630,
                durationInFrames: 330,
                backgroundVideo: {
                  query: "data center servers",
                  url: "https://videos.pexels.com/video-files/4069295/4069295-uhd_2732_1440_25fps.mp4",
                  opacity: 0.18,
                  source: "pexels",
                },
                data: {
                  header: "EP² Dashboard",
                  status: "LIVE",
                  cards: [
                    { label: "Revenue at Risk", prefix: "$", value: 722, suffix: "K", color: "#00FF88" },
                    { label: "Records Scanned", value: 2.7, suffix: "M", color: "#00D4FF" },
                    { label: "High-Risk Suppliers", value: 5, color: "#FF4444" },
                  ],
                  sparkline: true,
                },
              },
              {
                type: "node-graph",
                from: 960,
                durationInFrames: 360,
                backgroundVideo: {
                  query: "abstract blue particles",
                  url: "https://videos.pexels.com/video-files/29168272/12596084_1920_1080_30fps.mp4",
                  opacity: 0.22,
                  source: "pexels",
                },
                data: {
                  header: "SYSTEM LIVE",
                  status: { label: "DEPLOYED", color: "#00FF88" },
                  nodes: [
                    { label: "NLP Engine", x: 18, y: 30, color: "#00D4FF", icon: "mdi:translate" },
                    { label: "SQL Pipeline", x: 50, y: 14, color: "#00D4FF", icon: "mdi:database-arrow-right", glow: true },
                    { label: "Risk Scorer", x: 82, y: 30, color: "#FF8C00", icon: "mdi:shield-alert" },
                    { label: "Intel Agent", x: 30, y: 70, color: "#00D4FF", icon: "mdi:brain" },
                    { label: "Dashboard", x: 70, y: 70, color: "#00FF88", icon: "mdi:view-dashboard", glow: true },
                  ],
                  edges: [
                    { from: 0, to: 1 },
                    { from: 1, to: 2, color: "#FF8C00" },
                    { from: 0, to: 3 },
                    { from: 3, to: 4, color: "#00FF88" },
                    { from: 1, to: 3, color: "#8B5CF6" },
                  ],
                  statusBar: [
                    { label: "✓ Deployed", value: "" },
                    { label: "Throughput", value: "2.6M/s" },
                    { label: "Latency", value: "11ms" },
                  ],
                },
              },
              {
                type: "cta-comment",
                from: 1320,
                durationInFrames: 170,
                backgroundVideo: {
                  query: "phone scrolling close-up",
                  url: "https://videos.pexels.com/video-files/4069295/4069295-uhd_2732_1440_25fps.mp4",
                  opacity: 0.18,
                  source: "pexels",
                },
                data: {
                  action: "COMMENT",
                  keyword: "PROCUREMENT",
                  subtitle: "I'll send the full breakdown",
                },
              },
            ],
            textStrip: {
              labels: [
                { from: 0, label: "Walt Charles III · 7x CPO" },
                { from: 360, label: "EP² · Agentic Operating System" },
                { from: 630, label: "EP² · Revenue at Risk" },
                { from: 960, label: "True Horizons · System Live" },
                { from: 1320, label: "Comment Procurement" },
              ],
            },
            lowerThirds: [
              {
                name: "Walt Charles III",
                title: "Chief Procurement Officer",
                from: 60,
                durationInFrames: 240,
              },
            ],
          } as BRollConfig,
        }}
      />
    </>
  );
};
