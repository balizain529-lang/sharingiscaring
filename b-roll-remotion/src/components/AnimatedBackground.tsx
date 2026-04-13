import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { noise2D } from "@remotion/noise";
import { BRAND } from "../data/conclusion";

/**
 * Floating particle field with Perlin noise-driven movement.
 * Renders as a subtle animated backdrop behind text cards.
 */
const PARTICLE_COUNT = 40;

// Pre-generate deterministic particle seeds
const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  baseX: (i * 37 + 13) % 100, // spread across width (%)
  baseY: (i * 53 + 7) % 100, // spread across height (%)
  size: 2 + (i % 5) * 1.2,
  speed: 0.3 + (i % 4) * 0.15,
  opacity: 0.08 + (i % 6) * 0.04,
}));

export const AnimatedBackground: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 40%, ${BRAND.cardBg} 0%, ${BRAND.primaryColor} 70%)`,
      }}
    >
      {/* Floating particles */}
      <svg
        width="1920"
        height="1080"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {particles.map((p) => {
          const t = frame * p.speed * 0.01;
          const nx = noise2D(`x${p.id}`, t, 0) * 60;
          const ny = noise2D(`y${p.id}`, 0, t) * 40;
          const x = (p.baseX / 100) * 1920 + nx;
          const y = (p.baseY / 100) * 1080 + ny;

          // Subtle pulse
          const pulse = 1 + noise2D(`s${p.id}`, t * 2, 0) * 0.3;
          const r = p.size * pulse;

          return (
            <circle
              key={p.id}
              cx={x}
              cy={y}
              r={r}
              fill={BRAND.accentColor}
              opacity={p.opacity}
            />
          );
        })}

        {/* Connection lines between nearby particles */}
        {particles.slice(0, 15).map((p, i) => {
          const next = particles[(i * 3 + 1) % PARTICLE_COUNT];
          const t = frame * p.speed * 0.01;
          const tN = frame * next.speed * 0.01;

          const x1 = (p.baseX / 100) * 1920 + noise2D(`x${p.id}`, t, 0) * 60;
          const y1 =
            (p.baseY / 100) * 1080 + noise2D(`y${p.id}`, 0, t) * 40;
          const x2 =
            (next.baseX / 100) * 1920 + noise2D(`x${next.id}`, tN, 0) * 60;
          const y2 =
            (next.baseY / 100) * 1080 + noise2D(`y${next.id}`, 0, tN) * 40;

          const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
          if (dist > 400) return null;

          const lineOpacity = interpolate(dist, [0, 400], [0.06, 0], {
            extrapolateRight: "clamp",
          });

          return (
            <line
              key={`line-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={BRAND.accentColor}
              strokeWidth={0.8}
              opacity={lineOpacity}
            />
          );
        })}
      </svg>

      {/* Soft vignette overlay */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.4) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
