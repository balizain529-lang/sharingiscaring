import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const resolveVideoSrc = (url: string): string =>
  /^https?:\/\//i.test(url) ? url : staticFile(url);
import { SCENE_REGISTRY } from "../../components/scenes";
import { getCurrentLabel } from "../../data/schema";
import type { BRollConfig, LowerThird, Scene } from "../../data/schema";

/**
 * DynamicCutaway — Full-screen speaker video with animated graphics overlaying.
 *
 * The speaker's video plays full-screen at all times (audio source).
 * Animated scene graphics cover the speaker at key moments (cutaways).
 * Each cutaway has built-in 8-frame fade-in and fade-out.
 * Adjacent cutaways overlap by 8+ frames to prevent speaker peek-through.
 *
 * Format: 1080x1920 (vertical short-form) or 1920x1080 (horizontal)
 */

const FADE_FRAMES = 8;

const LOWER_THIRD_FADE_IN = 15;
const LOWER_THIRD_FADE_OUT = 24;

const LowerThirdBanner: React.FC<{ data: LowerThird }> = ({ data }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, LOWER_THIRD_FADE_IN], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [data.durationInFrames - LOWER_THIRD_FADE_OUT, data.durationInFrames],
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
        alignItems: "stretch",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 4,
          background: "#00D4FF",
          boxShadow: "0 0 10px #00D4FF88",
          borderRadius: 2,
        }}
      />
      <div
        style={{
          background: "rgba(0,10,25,0.78)",
          padding: "14px 22px",
          backdropFilter: "blur(4px)",
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 800, color: "#fff", letterSpacing: "0.01em", lineHeight: 1.1 }}>
          {data.name}
        </div>
        <div style={{ fontSize: 18, fontWeight: 500, color: "rgba(255,255,255,0.78)", marginTop: 6, letterSpacing: "0.05em" }}>
          {data.title}
        </div>
      </div>
    </div>
  );
};

const CutawayOverlay: React.FC<{ scene: Scene; index: number }> = ({ scene, index }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = scene;

  // Fade in over first FADE_FRAMES, fade out over last FADE_FRAMES
  const fadeIn = interpolate(frame, [0, FADE_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - FADE_FRAMES, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opacity = Math.min(fadeIn, fadeOut);

  const Component = SCENE_REGISTRY[scene.type];
  if (!Component) return null;

  return (
    <AbsoluteFill style={{ opacity }}>
      <Component data={scene.data} />
    </AbsoluteFill>
  );
};

export const DynamicCutaway: React.FC<{ config: BRollConfig }> = ({ config }) => {
  const frame = useCurrentFrame();
  const label = getCurrentLabel(frame, config.textStrip.labels);
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Layer 1: Speaker video — always playing, full-screen, audio source */}
      {config.meta.talkingHeadUrl && (
        <OffthreadVideo
          src={resolveVideoSrc(config.meta.talkingHeadUrl)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}

      {/* Layer 2: Cutaway overlays — full-screen graphics that cover the speaker */}
      {config.scenes.map((scene, i) => (
        <Sequence
          key={`${scene.type}-${i}`}
          from={scene.from}
          durationInFrames={scene.durationInFrames}
        >
          <CutawayOverlay scene={scene} index={i} />
        </Sequence>
      ))}

      {/* Layer 2.5: Lower-third banners — name cards over the speaker */}
      {config.lowerThirds?.map((lt, i) => (
        <Sequence
          key={`lt-${i}`}
          from={lt.from}
          durationInFrames={lt.durationInFrames}
        >
          <LowerThirdBanner data={lt} />
        </Sequence>
      ))}

      {/* Layer 3: Text strip — persistent label at bottom (hidden when no labels) */}
      {config.textStrip.labels.length > 0 && (
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 20,
        }}
      >
        <div
          style={{
            background: "rgba(0,10,25,0.85)",
            borderTop: "2px solid #00D4FF",
            borderBottom: "2px solid #00D4FF",
            padding: "6px 24px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#00D4FF",
              boxShadow: "0 0 8px #00D4FF",
            }}
          />
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#00D4FF",
              letterSpacing: "0.14em",
              fontFamily: "Inter, system-ui, sans-serif",
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#00D4FF",
              boxShadow: "0 0 8px #00D4FF",
            }}
          />
        </div>
      </div>
      )}
    </AbsoluteFill>
  );
};
