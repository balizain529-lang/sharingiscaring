import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SCENE_REGISTRY } from "../../components/scenes";
import { getCurrentLabel } from "../../data/schema";
import type { BRollConfig, Scene } from "../../data/schema";

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
          src={config.meta.talkingHeadUrl}
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

      {/* Layer 3: Text strip — persistent label at bottom */}
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
    </AbsoluteFill>
  );
};
