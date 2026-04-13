import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRAND } from "../data/conclusion";
import { AnimatedBackground } from "./AnimatedBackground";
import { LottieIcon } from "./LottieIcon";
import { StrokeReveal } from "./StrokeReveal";

type Props = {
  number: number;
  headline: string;
  subtext: string;
  icon: string;
  lottieSrc?: string;
};

export const TakeawayCard: React.FC<Props> = ({
  number,
  headline,
  subtext,
  lottieSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slide-up + fade entrance
  const enterProgress = spring({ frame, fps, config: { damping: 18 } });
  const translateY = interpolate(enterProgress, [0, 1], [120, 0]);
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  // Number badge scale pop
  const badgeScale = spring({
    frame: frame - 4,
    fps,
    config: { damping: 10, stiffness: 200 },
  });

  // Headline reveal
  const headlineProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 16 },
  });
  const headlineY = interpolate(headlineProgress, [0, 1], [40, 0]);

  // Subtext reveal
  const subProgress = spring({
    frame: frame - 18,
    fps,
    config: { damping: 16 },
  });
  const subY = interpolate(subProgress, [0, 1], [30, 0]);

  return (
    <AbsoluteFill>
      <AnimatedBackground />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          fontFamily: BRAND.fontFamily,
        }}
      >
        <div
          style={{
            transform: `translateY(${translateY}px)`,
            opacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
            maxWidth: 1600,
            padding: "0 80px",
          }}
        >
          {/* Lottie icon + number badge row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              marginBottom: 12,
            }}
          >
            {/* Number badge */}
            <div
              style={{
                transform: `scale(${Math.max(0, badgeScale)})`,
                width: 100,
                height: 100,
                borderRadius: 26,
                backgroundColor: BRAND.accentColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 48,
                fontWeight: 800,
                color: "#fff",
                boxShadow: `0 8px 40px ${BRAND.accentColor}66`,
              }}
            >
              {number}
            </div>

            {/* Animated Lottie icon */}
            {lottieSrc && <LottieIcon src={lottieSrc} size={180} delay={5} />}
          </div>

          {/* Headline with stroke-reveal underline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              opacity: headlineProgress,
              transform: `translateY(${headlineY}px)`,
            }}
          >
            <h1
              style={{
                fontSize: 96,
                fontWeight: 700,
                color: BRAND.textColor,
                textAlign: "center",
                lineHeight: 1.15,
                margin: 0,
                marginBottom: 12,
              }}
            >
              {headline}
            </h1>
            <StrokeReveal
              width={Math.min(headline.length * 26, 900)}
              color={BRAND.accentColor}
              delay={14}
              thickness={5}
            />
          </div>

          {/* Subtext */}
          <p
            style={{
              fontSize: 48,
              color: BRAND.subtextColor,
              textAlign: "center",
              lineHeight: 1.4,
              margin: 0,
              marginTop: 12,
              maxWidth: 1400,
              opacity: subProgress,
              transform: `translateY(${subY}px)`,
            }}
          >
            {subtext}
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
