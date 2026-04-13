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
import { KpiCallout } from "../../components/KpiCallout";

// Chart glow overlay that pulses over the right-side bar chart
const ChartGlow: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 20 },
  });
  const opacity = interpolate(appear, [0, 1], [0, 1]);

  // Pulse breathing
  const pulse = Math.sin((frame - delay) * 0.08) * 0.15 + 0.55;

  return (
    <div
      style={{
        position: "absolute",
        // Overlay on the right-half bar chart area of the screenshot
        top: "28%",
        right: "5%",
        width: "40%",
        height: "38%",
        opacity: opacity * pulse,
        borderRadius: 12,
        border: `2px solid ${BRAND.accentColor}`,
        boxShadow: `0 0 40px ${BRAND.accentColor}55, inset 0 0 60px ${BRAND.accentColor}18`,
        pointerEvents: "none",
      }}
    />
  );
};

// Animated scan line that sweeps the dashboard
const ScanLine: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const appear = spring({ frame: f, fps: 30, config: { damping: 20 } });
  const opacity = interpolate(appear, [0, 1], [0, 0.6]);

  // Sweep from top to bottom over 90 frames, then loop
  const sweepProgress = (f % 90) / 90;
  const topPercent = interpolate(sweepProgress, [0, 1], [18, 90]);

  return (
    <div
      style={{
        position: "absolute",
        top: `${topPercent}%`,
        left: "7%",
        right: "5%",
        height: 2,
        background: `linear-gradient(90deg, transparent, ${BRAND.accentColor}, transparent)`,
        opacity,
        pointerEvents: "none",
        boxShadow: `0 0 8px ${BRAND.accentColor}`,
      }}
    />
  );
};

export const DashboardScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Headline
  const headlineProgress = spring({ frame, fps, config: { damping: 18 } });
  const headlineY = interpolate(headlineProgress, [0, 1], [-40, 0]);
  const headlineOpacity = interpolate(headlineProgress, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ background: BRAND.primaryColor }}>
      <AnimatedBackground />

      {/* Top eyebrow label */}
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
            EP Squared · Executive Dashboard
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

      {/* Dashboard screenshot — zoom-in entrance */}
      <ScreenFrame
        src="screenshots/dashboard.png"
        label="Executive Dashboard"
        sublabel="Real-time procurement analytics at a glance"
        entranceStyle="zoomIn"
        delay={8}
      />

      {/* KPI callout overlays — staggered appearance */}
      {/* These are positioned relative to the viewport as % values */}
      {/* Tuned to overlay each KPI card area on the screenshot */}

      {/* Total Recorded Spend — £732.12M (top-right KPI) */}
      <KpiCallout
        label="Total Recorded Spend"
        value="£732.12M"
        top={19}
        left={72}
        delay={45}
      />

      {/* Distinct Suppliers — 1,232 (third KPI card) */}
      <KpiCallout
        label="Distinct Suppliers"
        value="1,232"
        top={19}
        left={53}
        delay={60}
      />

      {/* Monthly Spend Lines — 23,315 (first KPI card) */}
      <KpiCallout
        label="Monthly Spend Lines"
        value="23,315"
        top={19}
        left={10}
        delay={75}
      />

      {/* Chart glow — highlights the bar chart */}
      <ChartGlow delay={90} />

      {/* Scan line data effect */}
      <ScanLine delay={30} />
    </AbsoluteFill>
  );
};
