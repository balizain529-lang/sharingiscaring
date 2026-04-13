import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRAND, CTA } from "../data/conclusion";
import { AnimatedBackground } from "./AnimatedBackground";
import { StrokeReveal } from "./StrokeReveal";

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Wordmark entrance
  const logoProgress = spring({ frame, fps, config: { damping: 14 } });
  const logoScale = interpolate(logoProgress, [0, 1], [0.6, 1]);
  const logoOpacity = interpolate(logoProgress, [0, 1], [0, 1]);

  // Divider
  const dividerProgress = spring({
    frame: frame - 12,
    fps,
    config: { damping: 20 },
  });

  // CTA headline
  const ctaProgress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 16 },
  });
  const ctaY = interpolate(ctaProgress, [0, 1], [50, 0]);

  // Subtext
  const subProgress = spring({
    frame: frame - 28,
    fps,
    config: { damping: 16 },
  });
  const subY = interpolate(subProgress, [0, 1], [40, 0]);

  // Closing line
  const closingProgress = spring({
    frame: frame - 42,
    fps,
    config: { damping: 16 },
  });

  return (
    <AbsoluteFill>
      <AnimatedBackground />

      <AbsoluteFill
        style={{
          fontFamily: BRAND.fontFamily,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
          }}
        >
          {/* Wordmark only — no logo icon */}
          <div
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h1
              style={{
                fontSize: 108,
                fontWeight: 700,
                color: BRAND.textColor,
                margin: 0,
                letterSpacing: -1,
              }}
            >
              <span>TrueHorizon</span>{" "}
              <span style={{ color: BRAND.accentLight, fontWeight: 400 }}>
                AI
              </span>
            </h1>
          </div>

          {/* Stroke reveal divider */}
          <div
            style={{
              opacity: interpolate(dividerProgress, [0, 1], [0, 1]),
            }}
          >
            <StrokeReveal
              width={440}
              color={BRAND.accentColor}
              delay={12}
              thickness={4}
            />
          </div>

          {/* CTA headline */}
          <h2
            style={{
              fontSize: 84,
              fontWeight: 600,
              color: BRAND.textColor,
              margin: 0,
              opacity: ctaProgress,
              transform: `translateY(${ctaY}px)`,
            }}
          >
            {CTA.headline}
          </h2>

          {/* CTA subtext */}
          <p
            style={{
              fontSize: 52,
              color: BRAND.subtextColor,
              margin: 0,
              opacity: subProgress,
              transform: `translateY(${subY}px)`,
            }}
          >
            {CTA.subtext}
          </p>

          {/* Closing line */}
          <p
            style={{
              fontSize: 40,
              color: BRAND.subtextColor,
              margin: "24px 0 0 0",
              opacity: closingProgress,
              fontStyle: "italic",
            }}
          >
            {CTA.closing}
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
