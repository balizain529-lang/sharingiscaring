import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { LogoEndorsementScene } from "../../data/schema";

const BG = "#0B1222";
const TEAL = "#00D4FF";
const CARD_BG = "#111E30";
const BORDER = "rgba(255,255,255,0.08)";

export const LogoEndorsement: React.FC<{ data: LogoEndorsementScene["data"] }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerP = spring({ frame, fps, config: { damping: 18 } });
  const headerOp = interpolate(headerP, [0, 1], [0, 1]);

  const lineP = spring({ frame: Math.max(0, frame - 4), fps, config: { damping: 22, stiffness: 70 } });
  const lineW = interpolate(lineP, [0, 1], [0, 100]);

  const cols = data.layout === "row" ? data.logos.length : 3;

  return (
    <div style={{
      width: "100%", height: "100%", background: BG,
      fontFamily: "Inter, system-ui, sans-serif",
      padding: "24px 36px 20px", display: "flex", flexDirection: "column",
      boxSizing: "border-box",
    }}>
      <div style={{
        opacity: headerOp, textAlign: "center", marginBottom: 8,
      }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.12em", textTransform: "uppercase" }}>{data.header}</div>
      </div>
      <div style={{
        width: `${lineW}%`, height: 2, borderRadius: 1, marginBottom: 20, alignSelf: "center",
        background: `linear-gradient(90deg, transparent, ${TEAL}, transparent)`,
        boxShadow: `0 0 8px ${TEAL}44`,
      }} />

      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 12, flex: 1, alignContent: "center",
      }}>
        {data.logos.map((logo, i) => {
          const delay = 10 + i * 6;
          const p = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 12, stiffness: 180 } });
          const scale = interpolate(p, [0, 1], [0.4, 1]);
          const op = interpolate(p, [0, 1], [0, 1]);
          const glow = Math.sin(frame * 0.08 + i * 1.5) * 0.5 + 0.5;
          return (
            <div key={logo.name} style={{
              opacity: op, transform: `scale(${scale})`,
              background: CARD_BG,
              border: `1px solid rgba(0,212,255,${0.1 + 0.15 * glow})`,
              borderRadius: 10, padding: "20px 12px",
              display: "flex", alignItems: "center", justifyContent: "center",
              minHeight: 70,
              boxShadow: `0 0 ${12 * glow}px rgba(0,212,255,0.06)`,
            }}>
              {logo.imageUrl ? (
                <img src={logo.imageUrl} alt={logo.name}
                  style={{ maxHeight: 40, maxWidth: "80%", objectFit: "contain" }} />
              ) : (
                <span style={{ fontSize: 18, fontWeight: 700, color: "#fff", textAlign: "center" }}>
                  {logo.name}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {data.summaryStat && (() => {
        const delay = 40 + data.logos.length * 6;
        const p = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 16 } });
        const op = interpolate(p, [0, 1], [0, 1]);
        const y = interpolate(p, [0, 1], [12, 0]);
        return (
          <div style={{ opacity: op, transform: `translateY(${y}px)`,
            textAlign: "center", marginTop: 16 }}>
            <span style={{ fontSize: 15, color: "rgba(255,255,255,0.4)" }}>{data.summaryStat!.label} </span>
            <span style={{ fontSize: 18, fontWeight: 800, color: TEAL }}>{data.summaryStat!.value}</span>
          </div>
        );
      })()}
    </div>
  );
};
