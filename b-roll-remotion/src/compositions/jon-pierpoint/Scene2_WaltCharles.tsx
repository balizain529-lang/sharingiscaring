import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const BG = "#0B1222";
const TEAL = "#00D4FF";
const GREEN = "#00FF88";
// Animated floating particles for depth
const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  const particles = Array.from({ length: 20 }, (_, i) => {
    const x = ((i * 137.5) % 100);
    const baseY = ((i * 73.1) % 100);
    const y = baseY + Math.sin(frame * 0.02 + i * 2) * 8;
    const size = 2 + (i % 3);
    const opacity = 0.08 + Math.sin(frame * 0.03 + i) * 0.04;
    return { x, y, size, opacity };
  });

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size, borderRadius: "50%",
          background: TEAL, opacity: p.opacity,
        }} />
      ))}
    </div>
  );
};

export const Scene2_WaltCharles: React.FC = () => {
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

  const badges = [
    { value: "7", label: "Fortune 500s", delay: 22 },
    { value: "$100B+", label: "Spend Managed", delay: 28 },
    { value: "25+", label: "Years Exp.", delay: 34 },
  ];

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
      padding: "24px 40px",
      boxSizing: "border-box",
      position: "relative",
    }}>
      <Particles />

      {/* Top divider */}
      <div style={{
        width: `${lineW}%`, height: 2, borderRadius: 1, marginBottom: 20,
        background: `linear-gradient(90deg, transparent, ${TEAL}, transparent)`,
        boxShadow: `0 0 12px ${TEAL}44`,
      }} />

      {/* Name — big, bold, with glow */}
      <div style={{
        opacity: nameOp, transform: `scale(${nameScale})`,
        fontSize: 52, fontWeight: 900, color: "#fff",
        letterSpacing: "0.04em", textAlign: "center", marginBottom: 8,
        textShadow: "0 2px 20px rgba(0,0,0,0.5)",
      }}>
        WALT CHARLES III
      </div>

      {/* Title */}
      <div style={{
        opacity: titleOp,
        fontSize: 22, fontWeight: 700, color: TEAL,
        letterSpacing: "0.14em", textAlign: "center", marginBottom: 16,
        textShadow: `0 0 16px ${TEAL}44`,
      }}>
        CHIEF PROCUREMENT OFFICER
      </div>

      {/* Second divider */}
      <div style={{
        width: `${line2W}%`, height: 2, borderRadius: 1, marginBottom: 24,
        background: `linear-gradient(90deg, transparent, ${TEAL}66, transparent)`,
      }} />

      {/* Stat badges — bigger, with glow borders */}
      <div style={{ display: "flex", gap: 16, marginBottom: 28, width: "100%" }}>
        {badges.map(b => {
          const p = spring({ frame: Math.max(0, frame - b.delay), fps, config: { damping: 10, stiffness: 200 } });
          const scale = interpolate(p, [0, 1], [0.4, 1]);
          const op = interpolate(p, [0, 1], [0, 1]);
          const badgeGlow = Math.sin(frame * 0.08 + b.delay) * 0.2 + 0.8;
          return (
            <div key={b.label} style={{
              opacity: op, transform: `scale(${scale})`,
              flex: 1, textAlign: "center",
              border: `1px solid rgba(0,212,255,${0.1 + 0.15 * badgeGlow})`,
              borderRadius: 10, padding: "18px 8px",
              background: "rgba(17,30,48,0.8)",
              boxShadow: `0 0 ${16 * badgeGlow}px rgba(0,212,255,0.08)`,
            }}>
              <div style={{ fontSize: 42, fontWeight: 900, color: "#fff", marginBottom: 4 }}>{b.value}</div>
              <div style={{ fontSize: 15, color: "rgba(255,255,255,0.5)" }}>{b.label}</div>
            </div>
          );
        })}
      </div>

      {/* Bottom strip */}
      <div style={{
        opacity: stripOp, transform: `scale(${stripScale})`,
        width: "100%",
        background: "rgba(0,0,0,0.7)", borderRadius: 8,
        padding: "16px 28px",
        display: "flex", justifyContent: "center", alignItems: "center", gap: 24,
        boxShadow: `0 0 ${20 * glow}px rgba(0,212,255,0.1)`,
        border: `1px solid rgba(0,212,255,0.15)`,
      }}>
        <span style={{ fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: "0.06em" }}>
          WALT CHARLES
        </span>
        <span style={{
          fontSize: 28, fontWeight: 900, color: GREEN,
          textShadow: `0 0 ${14 * glow}px ${GREEN}`,
          letterSpacing: "0.06em",
        }}>
          7x CPO
        </span>
      </div>
    </div>
  );
};
