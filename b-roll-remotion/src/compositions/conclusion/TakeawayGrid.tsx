import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRAND, TAKEAWAYS } from "../../data/conclusion";
import { AnimatedBackground } from "../../components/AnimatedBackground";
import { LottieIcon } from "../../components/LottieIcon";
import { StrokeReveal } from "../../components/StrokeReveal";

/**
 * All 4 takeaways on one screen in a 2x2 grid.
 * Each card staggers in sequentially for a "building the full picture" effect.
 */

const STAGGER = 12; // frames between each card entrance

const GridCard: React.FC<{
  index: number;
  number: number;
  headline: string;
  subtext: string;
  lottieSrc: string;
}> = ({ index, number, headline, subtext, lottieSrc }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delay = index * STAGGER;

  const enterProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 16 },
  });
  const scale = interpolate(enterProgress, [0, 1], [0.85, 1]);
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);
  const translateY = interpolate(enterProgress, [0, 1], [40, 0]);

  // Badge pop
  const badgeScale = spring({
    frame: frame - delay - 3,
    fps,
    config: { damping: 10, stiffness: 200 },
  });

  // Headline
  const headlineProgress = spring({
    frame: frame - delay - 8,
    fps,
    config: { damping: 16 },
  });

  // Subtext
  const subProgress = spring({
    frame: frame - delay - 14,
    fps,
    config: { damping: 16 },
  });

  return (
    <div
      style={{
        flex: "1 1 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        padding: "28px 32px",
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        borderRadius: 24,
        background: `rgba(14, 116, 144, ${0.06 * opacity})`,
        border: `1px solid rgba(14, 116, 144, ${0.15 * opacity})`,
      }}
    >
      {/* Badge + Lottie */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            transform: `scale(${Math.max(0, badgeScale)})`,
            width: 64,
            height: 64,
            borderRadius: 18,
            backgroundColor: BRAND.accentColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            fontWeight: 800,
            color: "#fff",
            boxShadow: `0 4px 20px ${BRAND.accentColor}55`,
          }}
        >
          {number}
        </div>
        <LottieIcon src={lottieSrc} size={100} delay={delay + 4} />
      </div>

      {/* Headline */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: headlineProgress,
        }}
      >
        <h2
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: BRAND.textColor,
            textAlign: "center",
            lineHeight: 1.15,
            margin: 0,
            marginBottom: 6,
          }}
        >
          {headline}
        </h2>
        <StrokeReveal
          width={Math.min(headline.length * 12, 380)}
          color={BRAND.accentColor}
          delay={delay + 10}
          thickness={3}
        />
      </div>

      {/* Subtext */}
      <p
        style={{
          fontSize: 26,
          color: BRAND.subtextColor,
          textAlign: "center",
          lineHeight: 1.4,
          margin: 0,
          opacity: subProgress,
        }}
      >
        {subtext}
      </p>
    </div>
  );
};

export const TakeawayGrid: React.FC = () => {
  return (
    <AbsoluteFill>
      <AnimatedBackground />

      <AbsoluteFill
        style={{
          fontFamily: BRAND.fontFamily,
          justifyContent: "center",
          alignItems: "center",
          padding: "50px 70px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: 36,
            width: "100%",
            height: "100%",
          }}
        >
          <GridCard index={0} {...TAKEAWAYS[0]} />
          <GridCard index={1} {...TAKEAWAYS[1]} />
          <GridCard index={2} {...TAKEAWAYS[2]} />
          <GridCard index={3} {...TAKEAWAYS[3]} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
