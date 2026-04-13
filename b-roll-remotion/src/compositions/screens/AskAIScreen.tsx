import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRAND } from "../../data/conclusion";
import { AnimatedBackground } from "../../components/AnimatedBackground";
import { ScreenFrame } from "../../components/ScreenFrame";

// Blinking cursor component — simulates active chat input
const BlinkingCursor: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  // Appear with fade
  const appear = spring({ frame: f, fps: 30, config: { damping: 20 } });
  const opacity = interpolate(appear, [0, 1], [0, 1]);

  // Blink every 18 frames
  const blink = Math.floor(f / 18) % 2 === 0 ? 1 : 0;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "12.5%",
        left: "50%",
        transform: "translateX(-50%)",
        opacity: opacity * blink,
        width: 3,
        height: 28,
        background: BRAND.accentColor,
        borderRadius: 2,
        boxShadow: `0 0 8px ${BRAND.accentColor}`,
      }}
    />
  );
};

// Floating chat bubble highlight
const ChatBubbleHighlight: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 16, stiffness: 120 },
  });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateX = interpolate(progress, [0, 1], [-20, 0]);

  return (
    <div
      style={{
        position: "absolute",
        // Overlaid on the chat bubble in the screenshot (top ~22%, left ~14%)
        top: "21%",
        left: "16%",
        opacity,
        transform: `translateX(${translateX}px)`,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          border: `2px solid ${BRAND.accentColor}`,
          borderRadius: 12,
          padding: "8px 20px",
          background: `rgba(14, 116, 144, 0.12)`,
          boxShadow: `0 0 24px ${BRAND.accentColor}55`,
          fontSize: 20,
          fontWeight: 600,
          color: BRAND.accentLight,
          fontFamily: BRAND.fontFamily,
          whiteSpace: "nowrap",
        }}
      >
        AI Procurement Analyst — Live
      </div>
    </div>
  );
};

export const AskAIScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Headline slides in first
  const headlineProgress = spring({ frame, fps, config: { damping: 18 } });
  const headlineY = interpolate(headlineProgress, [0, 1], [-40, 0]);
  const headlineOpacity = interpolate(headlineProgress, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ background: BRAND.primaryColor }}>
      <AnimatedBackground />

      {/* Headline above the frame */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 64,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: BRAND.fontFamily,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: BRAND.accentColor,
              boxShadow: `0 0 12px ${BRAND.accentColor}`,
            }}
          />
          <span
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: BRAND.subtextColor,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            EP Squared · AI Procurement Platform
          </span>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: BRAND.accentColor,
              boxShadow: `0 0 12px ${BRAND.accentColor}`,
            }}
          />
        </div>
      </AbsoluteFill>

      {/* Screen with slide-up entrance, starts at frame 8 */}
      <ScreenFrame
        src="screenshots/ask-ai.png"
        label="Ask AI"
        sublabel="Natural language queries, instant procurement insights"
        entranceStyle="slideUp"
        delay={8}
      />

      {/* Overlaid chat bubble highlight */}
      <ChatBubbleHighlight delay={40} />

      {/* Blinking cursor overlay */}
      <BlinkingCursor delay={35} />
    </AbsoluteFill>
  );
};
