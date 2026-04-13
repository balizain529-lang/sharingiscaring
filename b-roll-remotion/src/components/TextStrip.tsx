import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const TEAL = "#00D4FF";

/**
 * Text strip overlays the divider where top panel meets bottom panel.
 * Shared across all split-screen compositions.
 */
export const TextStrip: React.FC<{ label: string; topPanelHeight?: number }> = ({
  label,
  topPanelHeight = 1020,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 20 } });
  const opacity = interpolate(p, [0, 1], [0, 1]);
  const scaleX = interpolate(p, [0, 1], [0.4, 1]);

  return (
    <div
      style={{
        position: "absolute",
        top: topPanelHeight - 18,
        left: 0,
        width: 1080,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <div
        style={{
          opacity,
          transform: `scaleX(${scaleX})`,
          background: "rgba(0,10,25,0.92)",
          borderTop: `2px solid ${TEAL}`,
          borderBottom: `2px solid ${TEAL}`,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: TEAL,
            boxShadow: `0 0 8px ${TEAL}`,
          }}
        />
        <span
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: TEAL,
            letterSpacing: "0.14em",
            fontFamily: "Inter, system-ui, sans-serif",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: TEAL,
            boxShadow: `0 0 8px ${TEAL}`,
          }}
        />
      </div>
    </div>
  );
};
