import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND } from "../data/conclusion";

type Props = {
  label: string;
  value: string;
  // Position as percentage of the parent container
  top: number;
  left: number;
  delay?: number; // frame offset before this callout appears
};

export const KpiCallout: React.FC<Props> = ({
  label,
  value,
  top,
  left,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  const scale = interpolate(progress, [0, 1], [0.6, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  // Subtle pulse on value text
  const pulse = Math.sin((frame - delay) * 0.12) * 0.04 + 1;

  return (
    <div
      style={{
        position: "absolute",
        top: `${top}%`,
        left: `${left}%`,
        transform: `scale(${scale})`,
        opacity,
        transformOrigin: "center center",
        pointerEvents: "none",
      }}
    >
      {/* Connector dot */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: -14,
          transform: "translateY(-50%)",
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: BRAND.accentColor,
          boxShadow: `0 0 12px ${BRAND.accentColor}`,
        }}
      />

      {/* Callout box */}
      <div
        style={{
          background: `rgba(14, 116, 144, 0.15)`,
          border: `1.5px solid ${BRAND.accentColor}`,
          borderRadius: 10,
          padding: "10px 18px",
          backdropFilter: "blur(8px)",
          boxShadow: `0 8px 32px rgba(14, 116, 144, 0.25)`,
          minWidth: 160,
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: BRAND.accentLight,
            letterSpacing: "0.01em",
            transform: `scale(${pulse})`,
            transformOrigin: "left center",
            fontFamily: BRAND.fontFamily,
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: 14,
            color: BRAND.subtextColor,
            fontWeight: 500,
            marginTop: 2,
            fontFamily: BRAND.fontFamily,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};
