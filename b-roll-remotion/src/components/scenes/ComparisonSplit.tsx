import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { ComparisonSplitScene } from "../../data/schema";

const BG = "#0B1222";
const TEAL = "#00D4FF";

const ICONS: Record<string, string> = {
  cross: "✕", minus: "−", warning: "⚠",
  check: "✓", plus: "+", star: "★",
};

export const ComparisonSplit: React.FC<{ data: ComparisonSplitScene["data"] }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rightHidden = data.right.items.length === 0;

  const dividerP = spring({ frame, fps, config: { damping: 22, stiffness: 60 } });
  const dividerH = interpolate(dividerP, [0, 1], [0, 100]);

  const rightDone = data.right.items.length * 8 + 38;
  const dimP = spring({ frame: Math.max(0, frame - rightDone), fps, config: { damping: 20 } });
  const leftDim = rightHidden ? 1 : interpolate(dimP, [0, 1], [1, 0.5]);

  const rightGlow = Math.sin(frame * 0.08) * 0.3 + 0.7;

  return (
    <div style={{
      width: "100%", height: "100%", background: BG,
      fontFamily: "Inter, system-ui, sans-serif",
      padding: "72px 80px", display: "flex", gap: 48,
      alignItems: "center",
      justifyContent: rightHidden ? "center" : "flex-start",
      boxSizing: "border-box", position: "relative",
    }}>
      {/* Center divider */}
      {!rightHidden && (
        <div style={{
          position: "absolute", left: "50%", top: "10%",
          width: 2, height: `${dividerH * 0.8}%`,
          background: `linear-gradient(180deg, transparent, rgba(255,255,255,0.2), transparent)`,
          transform: "translateX(-50%)",
        }} />
      )}

      {/* Left (Before) */}
      <div style={{ flex: rightHidden ? "0 1 auto" : 1, maxWidth: rightHidden ? 900 : undefined, opacity: leftDim }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 12, marginBottom: 32,
        }}>
          <span style={{ fontSize: 34, color: data.left.color }}>{ICONS[data.left.icon] || "✕"}</span>
          <span style={{ fontSize: 30, fontWeight: 800, color: data.left.color,
            letterSpacing: "0.08em" }}>{data.left.header}</span>
        </div>
        {data.left.items.map((item, i) => {
          const delay = 8 + i * 14;
          const p = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 16 } });
          const op = interpolate(p, [0, 1], [0, 1]);
          const x = interpolate(p, [0, 1], [-30, 0]);
          const settled = p >= 0.99;
          const float = settled ? Math.sin(frame * 0.05 + i * 0.7) * 1.5 : 0;
          return (
            <div key={i} style={{
              opacity: op, transform: `translate(${x}px, ${float}px)`,
              display: "flex", alignItems: "flex-start", gap: 14,
              marginBottom: 20, fontSize: 24, color: "rgba(255,255,255,0.75)", lineHeight: 1.35,
            }}>
              <span style={{ color: data.left.color, fontSize: 22, marginTop: 3, flexShrink: 0 }}>
                {ICONS[data.left.icon] || "✕"}
              </span>
              {item}
            </div>
          );
        })}
      </div>

      {/* Right (After) */}
      {!rightHidden && (
      <div style={{
        flex: 1,
        borderRadius: 12,
        padding: "16px 20px",
        boxShadow: `inset 0 0 ${20 * rightGlow}px ${data.right.color}12`,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 12, marginBottom: 32,
        }}>
          <span style={{ fontSize: 34, color: data.right.color }}>{ICONS[data.right.icon] || "✓"}</span>
          <span style={{ fontSize: 30, fontWeight: 800, color: data.right.color,
            letterSpacing: "0.08em" }}>{data.right.header}</span>
        </div>
        {data.right.items.map((item, i) => {
          const delay = 50 + i * 14;
          const p = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 16 } });
          const op = interpolate(p, [0, 1], [0, 1]);
          const x = interpolate(p, [0, 1], [30, 0]);
          const settled = p >= 0.99;
          const float = settled ? Math.sin(frame * 0.05 + i * 0.7 + 1) * 1.5 : 0;
          return (
            <div key={i} style={{
              opacity: op, transform: `translate(${x}px, ${float}px)`,
              display: "flex", alignItems: "flex-start", gap: 14,
              marginBottom: 20, fontSize: 24, color: "#fff", fontWeight: 600, lineHeight: 1.35,
            }}>
              <span style={{ color: data.right.color, fontSize: 22, marginTop: 3, flexShrink: 0,
                textShadow: `0 0 8px ${data.right.color}` }}>
                {ICONS[data.right.icon] || "✓"}
              </span>
              {item}
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};
