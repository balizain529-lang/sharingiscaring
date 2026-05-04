import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import type { BRollConfig, Scene, SceneType } from "../../data/schema";
import { LowerThirdOverlay } from "../../components/overlays/LowerThirdOverlay";
import { HeroStatOverlay } from "../../components/overlays/HeroStatOverlay";
import { CaptionOverlay } from "../../components/overlays/CaptionOverlay";
import { SCENE_REGISTRY } from "../../components/scenes";

const resolveVideoSrc = (url: string): string =>
  /^https?:\/\//i.test(url) ? url : staticFile(url);

const FADE_FRAMES = 8;

type Layout = "lower-third" | "hero-stat-corner" | "caption-center" | "fullscreen-cutaway";

/**
 * Default overlay layout per scene type when scene.layout isn't explicitly set.
 * Speaker is always visible — overlays NEVER cover the face.
 */
const DEFAULT_LAYOUT: Record<SceneType, Layout> = {
  "person-scorecard": "lower-third",
  "logo-endorsement": "lower-third",
  "cta-comment": "lower-third",
  "workflow-pipeline": "lower-third",
  "node-graph": "lower-third",
  "timeline-steps": "lower-third",
  "data-table": "lower-third",
  "big-stat-reveal": "hero-stat-corner",
  "kpi-dashboard": "hero-stat-corner",
  "comparison-split": "caption-center",
};

const OverlaySwitch: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, FADE_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [scene.durationInFrames - FADE_FRAMES, scene.durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opacity = Math.min(fadeIn, fadeOut);

  const layout: Layout = scene.layout ?? DEFAULT_LAYOUT[scene.type] ?? "lower-third";

  // Fullscreen cutaway: covers the speaker for this scene.
  // Renders solid base + optional Pexels background + full scene component.
  if (layout === "fullscreen-cutaway") {
    const bg = scene.backgroundVideo;
    const bgOpacity = bg?.opacity ?? 0.25;
    const Component = SCENE_REGISTRY[scene.type];
    if (!Component) return null;
    return (
      <AbsoluteFill style={{ opacity }}>
        <AbsoluteFill style={{ background: "#0B1222" }} />
        {bg?.url && (
          <AbsoluteFill style={{ opacity: bgOpacity }}>
            <OffthreadVideo
              src={resolveVideoSrc(bg.url)}
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </AbsoluteFill>
        )}
        <Component data={scene.data} />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ opacity }}>
      {layout === "lower-third" && <LowerThirdOverlay scene={scene} />}
      {layout === "hero-stat-corner" && <HeroStatOverlay scene={scene} />}
      {layout === "caption-center" && <CaptionOverlay scene={scene} />}
    </AbsoluteFill>
  );
};

/**
 * DynamicOverlay — speaker stays full-screen the ENTIRE time.
 * Graphics overlay in zones that never cover the speaker's face.
 *
 * Three overlay zones:
 *   - lower-third: bottom 28% of frame
 *   - hero-stat-corner: top-right corner
 *   - caption-center: full-width animated text overlay (speaker still visible behind, semi-transparent backdrop)
 *
 * No `backgroundVideo` layer — speaker IS the background.
 * Format: 1920×1080 horizontal or 1080×1920 vertical.
 */
export const DynamicOverlay: React.FC<{ config: BRollConfig }> = ({ config }) => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Layer 1: Speaker video — full-screen, always playing, audio source */}
      {config.meta.talkingHeadUrl && (
        <OffthreadVideo
          src={resolveVideoSrc(config.meta.talkingHeadUrl)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}

      {/* Layer 2: Per-scene overlays — appear/disappear with scene timing */}
      {config.scenes.map((scene, i) => (
        <Sequence
          key={`${scene.type}-${i}`}
          from={scene.from}
          durationInFrames={scene.durationInFrames}
        >
          <OverlaySwitch scene={scene} />
        </Sequence>
      ))}

      {/* Layer 3: Lower-third name banners (existing pattern, e.g. for guest intro) */}
      {config.lowerThirds?.map((lt, i) => {
        const fadeInFrames = 15;
        const fadeOutFrames = 24;
        return (
          <Sequence
            key={`lt-${i}`}
            from={lt.from}
            durationInFrames={lt.durationInFrames}
          >
            <NameBanner data={lt} fadeInFrames={fadeInFrames} fadeOutFrames={fadeOutFrames} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const NameBanner: React.FC<{
  data: { name: string; title: string; durationInFrames: number };
  fadeInFrames: number;
  fadeOutFrames: number;
}> = ({ data, fadeInFrames, fadeOutFrames }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, fadeInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [data.durationInFrames - fadeOutFrames, data.durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opacity = Math.min(fadeIn, fadeOut);
  const slideY = interpolate(fadeIn, [0, 1], [24, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        bottom: 140,
        opacity,
        transform: `translateY(${slideY}px)`,
        fontFamily: "Inter, system-ui, sans-serif",
        pointerEvents: "none",
        zIndex: 18,
        display: "flex",
        gap: 14,
      }}
    >
      <div style={{ width: 4, background: "#00D4FF", boxShadow: "0 0 10px #00D4FF88", borderRadius: 2 }} />
      <div style={{ background: "rgba(0,10,25,0.78)", padding: "14px 22px", backdropFilter: "blur(4px)" }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>{data.name}</div>
        <div style={{ fontSize: 16, fontWeight: 500, color: "rgba(255,255,255,0.78)", marginTop: 6, letterSpacing: "0.05em" }}>
          {data.title}
        </div>
      </div>
    </div>
  );
};
