import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { KpiDashboardScene } from "../../data/schema";

const BG = "#0B1222";
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
      width: "100%", height: "100%", background: BG,
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

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {data.cards.map((card, i) => {
          const delay = 8 + i * 10;
          const p = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 14 } });
          const scale = interpolate(p, [0, 1], [0.85, 1]);
          const op = interpolate(p, [0, 1], [0, 1]);
          const t = Math.min(Math.max(0, frame - delay) / 35, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          const counted = Math.round(eased * card.value);
          const cardGlow = Math.sin(frame * 0.1 + i) * 0.3 + 0.7;
          return (
            <div key={card.label} style={{
              opacity: op, transform: `scale(${scale})`, flex: 1,
              background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 10,
              padding: "18px 14px", textAlign: "center",
            }}>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>{card.label}</div>
              <div style={{
                fontSize: 42, fontWeight: 900, color: card.color,
                textShadow: `0 0 ${20 * cardGlow}px ${card.color}66`,
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
