import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { NodeGraphScene } from "../../data/schema";

const BG = "#0B1222";
const TEAL = "#00D4FF";
const GREEN = "#00FF88";
const CARD_BG = "#111E30";

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

export const NodeGraph: React.FC<{ data: NodeGraphScene["data"] }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sysP = spring({ frame, fps, config: { damping: 16 } });
  const sysOp = interpolate(sysP, [0, 1], [0, 1]);
  const deployGlow = Math.sin(frame * 0.11) * 0.3 + 0.7;

  return (
    <div style={{
      width: "100%", height: "100%",
      fontFamily: "Inter, system-ui, sans-serif",
      padding: "24px 36px 16px", display: "flex", flexDirection: "column",
      boxSizing: "border-box", position: "relative",
    }}>
      <Particles />
      <div style={{
        opacity: sysOp, display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 12, position: "relative", zIndex: 1,
      }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: TEAL, letterSpacing: "0.08em" }}>{data.header}</span>
        {data.status && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: data.status.color,
              boxShadow: `0 0 ${10 * deployGlow}px ${data.status.color}`,
              opacity: 0.7 + 0.3 * deployGlow }} />
            <span style={{ fontSize: 17, fontWeight: 700, color: data.status.color,
              letterSpacing: "0.1em" }}>{data.status.label}</span>
          </div>
        )}
      </div>
      <div style={{
        height: 2, borderRadius: 1, marginBottom: 14,
        width: `${interpolate(sysOp, [0, 1], [0, 100])}%`,
        background: `linear-gradient(90deg, ${GREEN}, ${TEAL}44)`,
        boxShadow: `0 0 8px ${GREEN}44`, position: "relative", zIndex: 1,
      }} />

      <div style={{ position: "relative", flex: 1, zIndex: 1 }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          viewBox="0 0 100 100" preserveAspectRatio="none">
          {data.edges.map((edge, i) => {
            const fromNode = data.nodes[edge.from];
            const toNode = data.nodes[edge.to];
            if (!fromNode || !toNode) return null;
            const delay = 10 + i * 8;
            const ep = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 20, stiffness: 80 } });
            const len = Math.sqrt((toNode.x - fromNode.x) ** 2 + (toNode.y - fromNode.y) ** 2);
            const dotT = ep > 0.5 ? ((frame - delay) % 30) / 30 : 0;
            const dotX = fromNode.x + (toNode.x - fromNode.x) * dotT;
            const dotY = fromNode.y + (toNode.y - fromNode.y) * dotT;
            const color = edge.color || TEAL;
            return (
              <g key={i}>
                <line x1={fromNode.x} y1={fromNode.y} x2={toNode.x} y2={toNode.y}
                  stroke={color} strokeWidth={0.5} strokeOpacity={0.45}
                  strokeDasharray={len}
                  strokeDashoffset={interpolate(ep, [0, 1], [len, 0])} />
                {ep > 0.5 && (
                  <circle cx={dotX} cy={dotY} r={1} fill={color}
                    style={{ filter: `drop-shadow(0 0 2px ${color})` }} />
                )}
              </g>
            );
          })}
        </svg>
        {data.nodes.map((n, i) => {
          const delay = 6 + i * 8;
          const np = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 10, stiffness: 200 } });
          const g = n.glow ? Math.sin(frame * 0.09 + i * 2) * 0.3 + 0.7 : 0;
          const iconUrl = n.icon
            ? `https://api.iconify.design/${n.icon}.svg?color=${encodeURIComponent(n.color)}`
            : null;
          return (
            <div key={n.label} style={{
              position: "absolute", left: `${n.x}%`, top: `${n.y}%`,
              transform: `translate(-50%, -50%) scale(${interpolate(np, [0, 1], [0.2, 1])})`,
              opacity: interpolate(np, [0, 1], [0, 1]),
            }}>
              <div style={{
                background: CARD_BG, border: `1.5px solid ${n.color}`,
                borderRadius: 8, padding: "8px 14px",
                fontSize: 15, fontWeight: 700, color: "#fff", whiteSpace: "nowrap",
                boxShadow: n.glow ? `0 0 ${14 * g}px ${n.color}55` : "none",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                {iconUrl && (
                  <img src={iconUrl} alt="" style={{ width: 18, height: 18 }} />
                )}
                <span>{n.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {data.statusBar && (
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "10px 0", marginTop: 8,
          borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", zIndex: 1,
        }}>
          {data.statusBar.map((s, i) => (
            <span key={s.label} style={{
              fontSize: 15, fontWeight: 700,
              color: i === 0 ? GREEN : TEAL,
            }}>{s.label}: {s.value}</span>
          ))}
        </div>
      )}
    </div>
  );
};
