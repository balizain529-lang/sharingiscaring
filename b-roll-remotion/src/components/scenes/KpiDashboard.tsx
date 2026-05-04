import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { KpiDashboardScene } from "../../data/schema";
import { MOTION } from "../../data/motion-presets";

const TEAL = "#00D4FF";
const GREEN = "#00FF88";
const CARD_BG = "#111E30";
const BORDER = "rgba(255,255,255,0.08)";

export const KpiDashboard: React.FC<{ data: KpiDashboardScene["data"] }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerP = spring({ frame, fps, config: { damping: 18 } });
  const liveGlow = Math.sin(frame * 0.14) * 0.4 + 0.6;

  return (
    <div style={{
      width: "100%", height: "100%",
      fontFamily: "Inter, system-ui, sans-serif",
      padding: "24px 36px 20px", display: "flex", flexDirection: "column",
      boxSizing: "border-box",
    }}>
      <div style={{
        opacity: interpolate(headerP, [0, 1], [0, 1]),
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 20,
      }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{data.header}</span>
        {data.status && (
          <div style={{ display: "flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.06)", borderRadius: 4, padding: "4px 10px" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>{data.status}</span>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN,
              boxShadow: `0 0 ${6 + 8 * liveGlow}px ${GREEN}` }} />
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        {data.cards.map((card, i) => {
          const delay = 8 + i * 10;
          const p = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 14 } });
          const entranceScale = interpolate(p, [0, 1], [0.85, 1]);
          const op = interpolate(p, [0, 1], [0, 1]);
          const countFrames = 35;
          const t = Math.min(Math.max(0, frame - delay) / countFrames, 1);
          const eased = MOTION.easing.easeOutCubic(t);
          // After count-up settles, add a live tick that fluctuates within tickRange
          const settled = t >= 1;
          const tickBase = Math.round(eased * card.value);
          const [tickMin, tickMax] = card.tickRange ?? [-1, 1];
          // map sin(-1..1) into [tickMin, tickMax]
          const tickSin = Math.sin(frame * 0.09 + i * 1.3);
          const tickOffset = settled
            ? Math.round(((tickSin + 1) / 2) * (tickMax - tickMin) + tickMin)
            : 0;
          const counted = Math.max(0, tickBase + tickOffset);
          const cardGlow = MOTION.continuous.glowPulse(frame, 0.1, i);
          const breathe = settled ? MOTION.continuous.breathe(frame, i) : 1;
          const scale = entranceScale * breathe;
          return (
            <div key={card.label} style={{
              opacity: op, transform: `scale(${scale})`, flex: 1,
              background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 12,
              padding: "24px 18px", textAlign: "center",
            }}>
              <div style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", marginBottom: 8, letterSpacing: "0.02em" }}>{card.label}</div>
              <div style={{
                fontSize: 52, fontWeight: 900, color: card.color,
                textShadow: `0 0 ${24 * cardGlow}px ${card.color}77`,
              }}>
                {card.prefix ?? ""}{counted}{card.suffix ?? ""}
              </div>
            </div>
          );
        })}
      </div>

      {data.sparkline && (
        <div style={{ flex: 1, position: "relative", minHeight: 60 }}>
          <svg width="100%" height="100%" viewBox="0 0 960 80" preserveAspectRatio="none"
            style={{ position: "absolute", bottom: 0, left: 0 }}>
            <polyline
              fill="none" stroke={TEAL} strokeWidth={2} strokeLinecap="round"
              points={Array.from({ length: 30 }, (_, i) => {
                const x = i * (960 / 29);
                const y = 40 + Math.sin(i * 0.6 + frame * 0.04) * 25;
                return `${x},${y}`;
              }).join(" ")}
              strokeDasharray={2000}
              strokeDashoffset={interpolate(
                spring({ frame: Math.max(0, frame - 30), fps, config: { damping: 30 } }),
                [0, 1], [2000, 0]
              )}
            />
          </svg>
        </div>
      )}
    </div>
  );
};
