import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { PersonScorecardScene } from "../../data/schema";

const BG = "#0B1222";
const TEAL = "#00D4FF";
const GREEN = "#00FF88";

const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${(i * 137.5) % 100}%`,
          top: `${((i * 73.1) % 100) + Math.sin(frame * 0.02 + i * 2) * 8}%`,
          width: 2 + (i % 3), height: 2 + (i % 3), borderRadius: "50%",
          background: TEAL, opacity: 0.08 + Math.sin(frame * 0.03 + i) * 0.04,
        }} />
      ))}
    </div>
  );
};

export const PersonScorecard: React.FC<{ data: PersonScorecardScene["data"] }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineP = spring({ frame, fps, config: { damping: 22, stiffness: 70 } });
  const lineW = interpolate(lineP, [0, 1], [0, 100]);

  const nameP = spring({ frame: Math.max(0, frame - 4), fps, config: { damping: 14, stiffness: 120 } });
  const nameOp = interpolate(nameP, [0, 1], [0, 1]);
  const nameScale = interpolate(nameP, [0, 1], [0.85, 1]);

  const titleP = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 18 } });
  const titleOp = interpolate(titleP, [0, 1], [0, 1]);

  const line2P = spring({ frame: Math.max(0, frame - 16), fps, config: { damping: 22, stiffness: 70 } });
  const line2W = interpolate(line2P, [0, 1], [0, 100]);

  const stripP = spring({ frame: Math.max(0, frame - 42), fps, config: { damping: 14 } });
  const stripOp = interpolate(stripP, [0, 1], [0, 1]);
  const stripScale = interpolate(stripP, [0, 1], [0.8, 1]);
  const glow = Math.sin(frame * 0.09) * 0.3 + 0.7;

  return (
    <div style={{
      width: "100%", height: "100%", background: BG,
      fontFamily: "Inter, system-ui, sans-serif",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px 40px", boxSizing: "border-box", position: "relative",
    }}>
      <Particles />
      <div style={{
        width: `${lineW}%`, height: 2, borderRadius: 1, marginBottom: 20,
        background: `linear-gradient(90deg, transparent, ${TEAL}, transparent)`,
        boxShadow: `0 0 12px ${TEAL}44`,
      }} />
      <div style={{
        opacity: nameOp, transform: `scale(${nameScale})`,
        fontSize: 52, fontWeight: 900, color: "#fff",
        letterSpacing: "0.04em", textAlign: "center", marginBottom: 8,
        textShadow: "0 2px 20px rgba(0,0,0,0.5)",
      }}>
        {data.name.toUpperCase()}
      </div>
      <div style={{
        opacity: titleOp, fontSize: 22, fontWeight: 700, color: TEAL,
        letterSpacing: "0.14em", textAlign: "center", marginBottom: 16,
        textShadow: `0 0 16px ${TEAL}44`,
      }}>
        {data.title.toUpperCase()}
      </div>
      <div style={{
        width: `${line2W}%`, height: 2, borderRadius: 1, marginBottom: 24,
        background: `linear-gradient(90deg, transparent, ${TEAL}66, transparent)`,
      }} />
      <div style={{ display: "flex", gap: 16, marginBottom: 28, width: "100%" }}>
        {data.badges.map((b, i) => {
          const delay = 22 + i * 6;
          const p = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 10, stiffness: 200 } });
          const scale = interpolate(p, [0, 1], [0.4, 1]);
          const op = interpolate(p, [0, 1], [0, 1]);
          const badgeGlow = Math.sin(frame * 0.08 + delay) * 0.2 + 0.8;
          return (
            <div key={b.label} style={{
              opacity: op, transform: `scale(${scale})`, flex: 1, textAlign: "center",
              border: `1px solid rgba(0,212,255,${0.1 + 0.15 * badgeGlow})`,
              borderRadius: 10, padding: "18px 8px", background: "rgba(17,30,48,0.8)",
              boxShadow: `0 0 ${16 * badgeGlow}px rgba(0,212,255,0.08)`,
            }}>
              <div style={{ fontSize: 42, fontWeight: 900, color: "#fff", marginBottom: 4 }}>{b.value}</div>
              <div style={{ fontSize: 15, color: "rgba(255,255,255,0.5)" }}>{b.label}</div>
            </div>
          );
        })}
      </div>
      {data.bottomStrip && (
        <div style={{
          opacity: stripOp, transform: `scale(${stripScale})`, width: "100%",
          background: "rgba(0,0,0,0.7)", borderRadius: 8, padding: "16px 28px",
          display: "flex", justifyContent: "center", alignItems: "center",
          boxShadow: `0 0 ${20 * glow}px rgba(0,212,255,0.1)`,
          border: `1px solid rgba(0,212,255,0.15)`,
        }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: GREEN, letterSpacing: "0.06em",
            textShadow: `0 0 ${14 * glow}px ${GREEN}` }}>
            {data.bottomStrip}
          </span>
        </div>
      )}
    </div>
  );
};
