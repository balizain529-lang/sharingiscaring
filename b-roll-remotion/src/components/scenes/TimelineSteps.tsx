import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { TimelineStepsScene } from "../../data/schema";

const BG = "#0B1222";
const TEAL = "#00D4FF";
const GREEN = "#00FF88";

export const TimelineSteps: React.FC<{ data: TimelineStepsScene["data"] }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerP = spring({ frame, fps, config: { damping: 18 } });

  return (
    <div style={{
      width: "100%", height: "100%", background: BG,
      fontFamily: "Inter, system-ui, sans-serif",
      padding: "24px 36px 20px", display: "flex", flexDirection: "column",
      boxSizing: "border-box",
    }}>
      <div style={{
        opacity: interpolate(headerP, [0, 1], [0, 1]),
        fontSize: 22, fontWeight: 800, color: TEAL, letterSpacing: "0.08em", marginBottom: 20,
      }}>
        {data.header}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 0 }}>
        {data.steps.map((step, i) => {
          const delay = 10 + i * 12;
          const p = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 14 } });
          const op = interpolate(p, [0, 1], [0, 1]);
          const labelX = interpolate(p, [0, 1], [-15, 0]);

          const isComplete = step.status === "complete";
          const isActive = step.status === "active";
          const circleColor = isComplete ? GREEN : isActive ? TEAL : "rgba(255,255,255,0.15)";
          const activeGlow = isActive ? Math.sin(frame * 0.1 + i) * 0.4 + 0.6 : 0;

          const lineP = spring({ frame: Math.max(0, frame - delay - 4), fps, config: { damping: 20 } });
          const lineH = interpolate(lineP, [0, 1], [0, 100]);

          return (
            <div key={step.label} style={{ opacity: op, display: "flex", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 32 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  border: `2px solid ${circleColor}`,
                  background: isComplete ? GREEN : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: isActive ? `0 0 ${12 * activeGlow}px ${TEAL}` : "none",
                  flexShrink: 0,
                }}>
                  {isComplete ? (
                    <span style={{ fontSize: 16, color: BG, fontWeight: 900 }}>✓</span>
                  ) : (
                    <span style={{ fontSize: 14, fontWeight: 700,
                      color: isActive ? TEAL : "rgba(255,255,255,0.3)" }}>{i + 1}</span>
                  )}
                </div>
                {i < data.steps.length - 1 && (
                  <div style={{
                    width: 2, flex: 1, minHeight: 20, marginTop: 4, marginBottom: 4,
                    background: isComplete ? GREEN : `${TEAL}33`,
                    clipPath: `inset(0 0 ${100 - lineH}% 0)`,
                  }} />
                )}
              </div>
              <div style={{ transform: `translateX(${labelX}px)`, paddingTop: 4, paddingBottom: 16 }}>
                <div style={{
                  fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 4,
                }}>{step.label}</div>
                {step.subtitle && (
                  <div style={{
                    fontSize: 15, color: "rgba(255,255,255,0.4)",
                    opacity: interpolate(
                      spring({ frame: Math.max(0, frame - delay - 4), fps, config: { damping: 18 } }),
                      [0, 1], [0, 1]
                    ),
                  }}>{step.subtitle}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {data.progress !== undefined && (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>Progress</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: GREEN }}>{data.progress}%</span>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
            <div style={{
              height: "100%", borderRadius: 2,
              width: `${interpolate(
                spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 22 } }),
                [0, 1], [0, data.progress]
              )}%`,
              background: `linear-gradient(90deg, ${TEAL}, ${GREEN})`,
              boxShadow: `0 0 8px ${GREEN}44`,
            }} />
          </div>
        </div>
      )}
    </div>
  );
};
