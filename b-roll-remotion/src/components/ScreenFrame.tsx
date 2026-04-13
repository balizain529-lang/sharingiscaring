import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRAND } from "../data/conclusion";

type Props = {
  src: string; // path relative to public/
  label: string;
  sublabel?: string;
  entranceStyle?: "slideUp" | "zoomIn";
  delay?: number; // frame delay before entrance starts
};

export const ScreenFrame: React.FC<Props> = ({
  src,
  label,
  sublabel,
  entranceStyle = "slideUp",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const f = Math.max(0, frame - delay);

  // Entrance animation
  const enterProgress = spring({ frame: f, fps, config: { damping: 20, stiffness: 80 } });

  const translateY =
    entranceStyle === "slideUp"
      ? interpolate(enterProgress, [0, 1], [80, 0])
      : 0;
  const scale =
    entranceStyle === "zoomIn"
      ? interpolate(enterProgress, [0, 1], [0.88, 1])
      : 1;
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  // Label reveal (staggered after frame entrance)
  const labelProgress = spring({
    frame: Math.max(0, f - 18),
    fps,
    config: { damping: 18 },
  });
  const labelY = interpolate(labelProgress, [0, 1], [24, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: BRAND.fontFamily,
      }}
    >
      <div
        style={{
          transform: `translateY(${translateY}px) scale(${scale})`,
          opacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
          width: "100%",
        }}
      >
        {/* Screen frame */}
        <div
          style={{
            position: "relative",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: `0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)`,
            width: 1480,
            maxWidth: "100%",
          }}
        >
          {/* Browser chrome bar */}
          <div
            style={{
              background: "#1C2B3A",
              height: 44,
              display: "flex",
              alignItems: "center",
              paddingLeft: 20,
              gap: 10,
            }}
          >
            {["#FF5F57", "#FFBD2E", "#28CA41"].map((color, i) => (
              <div
                key={i}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: color,
                  opacity: 0.85,
                }}
              />
            ))}
            {/* URL bar */}
            <div
              style={{
                marginLeft: 24,
                background: "rgba(255,255,255,0.07)",
                borderRadius: 8,
                height: 26,
                width: 360,
                display: "flex",
                alignItems: "center",
                paddingLeft: 12,
                fontSize: 13,
                color: "rgba(255,255,255,0.4)",
                fontFamily: BRAND.fontFamily,
              }}
            >
              epsquared.com
            </div>
          </div>

          {/* Screenshot */}
          <Img
            src={staticFile(src)}
            style={{
              width: "100%",
              display: "block",
            }}
          />

          {/* Subtle teal glow border at bottom */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, transparent, ${BRAND.accentColor}, transparent)`,
              opacity: 0.7,
            }}
          />
        </div>

        {/* Label beneath */}
        <div
          style={{
            opacity: labelProgress,
            transform: `translateY(${labelY}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: BRAND.textColor,
              letterSpacing: "0.02em",
            }}
          >
            {label}
          </div>
          {sublabel && (
            <div
              style={{
                fontSize: 24,
                color: BRAND.subtextColor,
                fontWeight: 400,
              }}
            >
              {sublabel}
            </div>
          )}
          {/* Teal accent line under label */}
          <div
            style={{
              marginTop: 4,
              width: Math.min(label.length * 18, 400),
              height: 3,
              borderRadius: 2,
              background: `linear-gradient(90deg, ${BRAND.accentColor}, ${BRAND.accentLight})`,
              opacity: 0.9,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
