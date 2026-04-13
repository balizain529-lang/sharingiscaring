import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CtaCommentScene } from "../../data/schema";

const BG = "#0B1222";
const TEAL = "#00D4FF";
const GREEN = "#00FF88";

const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: 15 }, (_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${((i * 137.5 + 20) % 100)}%`,
          top: `${((i * 73.1 + 10) % 100) + Math.sin(frame * 0.025 + i * 1.7) * 6}%`,
          width: 2 + (i % 3), height: 2 + (i % 3), borderRadius: "50%",
          background: TEAL, opacity: 0.06 + Math.sin(frame * 0.03 + i * 0.8) * 0.03,
        }} />
      ))}
    </div>
  );
};

export const CtaComment: React.FC<{ data: CtaCommentScene["data"] }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ctaP = spring({ frame, fps, config: { damping: 12, stiffness: 150 } });
  const ctaOp = interpolate(ctaP, [0, 1], [0, 1]);
  const ctaScale = interpolate(ctaP, [0, 1], [0.85, 1]);

  const inputP = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 16 } });
  const inputOp = interpolate(inputP, [0, 1], [0, 1]);

  const cursorBlink = Math.floor(frame / 14) % 2 === 0 ? 1 : 0;
  const ctaGlow = Math.sin(frame * 0.1) * 0.3 + 0.7;

  const subP = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 18 } });
  const subOp = interpolate(subP, [0, 1], [0, 1]);

  return (
    <div style={{
      width: "100%", height: "100%", background: BG,
      fontFamily: "Inter, system-ui, sans-serif",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px 36px", boxSizing: "border-box", position: "relative",
    }}>
      <Particles />
      <div style={{
        opacity: ctaOp, transform: `scale(${ctaScale})`,
        textAlign: "center", position: "relative", zIndex: 1,
      }}>
        <div style={{
          fontSize: 46, fontWeight: 900, color: "#fff", marginBottom: 4,
          textShadow: "0 2px 16px rgba(0,0,0,0.5)",
        }}>{data.action}</div>
        <div style={{
          fontSize: 46, fontWeight: 900, color: GREEN, marginBottom: 36,
          textShadow: `0 0 ${20 * ctaGlow}px ${GREEN}66`,
        }}>"{data.keyword}"</div>
      </div>

      <div style={{
        opacity: inputOp, position: "relative", zIndex: 1,
        background: "rgba(255,255,255,0.07)",
        border: "1.5px solid rgba(255,255,255,0.15)",
        borderRadius: 28, padding: "14px 22px",
        display: "flex", alignItems: "center", gap: 14,
        width: "85%",
        boxShadow: `0 0 ${16 * ctaGlow}px rgba(0,212,255,0.1)`,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "linear-gradient(135deg, #FF4500, #FF6B35)",
          flexShrink: 0,
        }} />
        <div style={{ flex: 1, textAlign: "left" }}>
          <span style={{ fontSize: 18, color: "#fff", fontWeight: 600 }}>{data.keyword}</span>
          <span style={{
            display: "inline-block", width: 2, height: 20,
            background: TEAL, marginLeft: 2, verticalAlign: "middle",
            opacity: cursorBlink, boxShadow: `0 0 4px ${TEAL}`,
          }} />
        </div>
        <div style={{ color: TEAL, fontSize: 22, fontWeight: 800,
          textShadow: `0 0 8px ${TEAL}` }}>→</div>
      </div>

      {data.subtitle && (
        <div style={{
          opacity: subOp, marginTop: 16, fontSize: 18,
          color: "rgba(255,255,255,0.5)", textAlign: "center",
          position: "relative", zIndex: 1,
        }}>{data.subtitle}</div>
      )}
    </div>
  );
};
