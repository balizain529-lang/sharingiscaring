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
const RED = "#FF4444";
const ORANGE = "#FF8C00";
const CARD_BG = "#111E30";
const BORDER = "rgba(255,255,255,0.08)";

function useCountUp(delay: number, target: number, duration = 40) {
  const frame = useCurrentFrame();
  const t = Math.min(Math.max(0, frame - delay) / duration, 1);
  return Math.round((1 - Math.pow(1 - t, 3)) * target);
}

// Scanning highlight that sweeps down the table rows
const TableScan: React.FC = () => {
  const frame = useCurrentFrame();
  const scanY = (frame * 3) % 300;
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, top: scanY, height: 2,
      background: `linear-gradient(90deg, transparent, ${TEAL}44, transparent)`,
      pointerEvents: "none",
    }} />
  );
};

const SUPPLIERS = [
  { name: "Acme Corp", risk: "HIGH", exposure: "$144K", color: RED },
  { name: "Global Mfg", risk: "MED", exposure: "$91K", color: ORANGE },
  { name: "TechParts Inc", risk: "HIGH", exposure: "$213K", color: RED },
  { name: "MetalWorks", risk: "LOW", exposure: "$32K", color: GREEN },
  { name: "ChemSupply", risk: "HIGH", exposure: "$246K", color: RED },
];

export const Scene4_Dashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerP = spring({ frame, fps, config: { damping: 18 } });
  const liveGlow = Math.sin(frame * 0.14) * 0.4 + 0.6;

  const revCount = useCountUp(6, 722, 35);
  const revP = spring({ frame: Math.max(0, frame - 4), fps, config: { damping: 14 } });
  const revOp = interpolate(revP, [0, 1], [0, 1]);
  const revScale = interpolate(revP, [0, 1], [0.85, 1]);
  const revGlow = Math.sin(frame * 0.1) * 0.3 + 0.7;

  const barP = spring({ frame: Math.max(0, frame - 14), fps, config: { damping: 22, stiffness: 60 } });
  const barW = interpolate(barP, [0, 1], [0, 72]);

  const tableP = spring({ frame: Math.max(0, frame - 18), fps, config: { damping: 18 } });
  const tableOp = interpolate(tableP, [0, 1], [0, 1]);

  const titleP = spring({ frame: Math.max(0, frame - 65), fps, config: { damping: 12, stiffness: 140 } });
  const titleScale = interpolate(titleP, [0, 1], [0.85, 1]);
  const shimmer = (Math.sin(frame * 0.09) + 1) / 2;

  return (
    <div style={{
      width: "100%", height: "100%", background: BG,
      fontFamily: "Inter, system-ui, sans-serif",
      padding: "24px 36px 16px",
      display: "flex", flexDirection: "column",
      boxSizing: "border-box",
    }}>
      {/* Header */}
      <div style={{
        opacity: interpolate(headerP, [0, 1], [0, 1]),
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 14,
      }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>EP² Dashboard</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6,
          background: "rgba(255,255,255,0.06)", borderRadius: 4, padding: "4px 10px" }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>LIVE</span>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN,
            boxShadow: `0 0 ${6 + 8 * liveGlow}px ${GREEN}` }} />
        </div>
      </div>

      {/* Revenue at Risk — BIG number with glow */}
      <div style={{
        opacity: revOp, transform: `scale(${revScale})`,
        background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 10,
        padding: "16px 20px", marginBottom: 12,
      }}>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>REVENUE AT RISK</div>
        <div style={{
          fontSize: 52, fontWeight: 900, color: GREEN,
          textShadow: `0 0 ${24 * revGlow}px ${GREEN}66`,
        }}>${revCount}K</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
          identified across 2.7M records
        </div>
        <div style={{ marginTop: 10, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
          <div style={{
            height: "100%", width: `${barW}%`, borderRadius: 2,
            background: `linear-gradient(90deg, ${ORANGE}, ${RED})`,
            boxShadow: `0 0 8px ${RED}44`,
          }} />
        </div>
      </div>

      {/* Supplier Intelligence table */}
      <div style={{
        opacity: tableOp,
        background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 10,
        padding: "14px 16px", flex: 1, overflow: "hidden",
        position: "relative",
      }}>
        <TableScan />
        <div style={{ fontSize: 15, fontWeight: 700, color: TEAL, letterSpacing: "0.08em", marginBottom: 8 }}>
          SUPPLIER INTELLIGENCE
        </div>
        <div style={{
          display: "flex", fontSize: 12, color: "rgba(255,255,255,0.3)",
          padding: "4px 0", borderBottom: `1px solid ${BORDER}`, marginBottom: 4,
        }}>
          <div style={{ flex: 1 }}>Supplier</div>
          <div style={{ width: 65, textAlign: "center" }}>Risk</div>
          <div style={{ width: 75, textAlign: "right" }}>Exposure</div>
        </div>
        {SUPPLIERS.map((s, i) => {
          const rowDelay = 24 + i * 8;
          const rowP = spring({ frame: Math.max(0, frame - rowDelay), fps, config: { damping: 16 } });
          const rowOp = interpolate(rowP, [0, 1], [0, 1]);
          const rowX = interpolate(rowP, [0, 1], [-20, 0]);
          // Active row highlight scans
          const scanRow = Math.floor(((frame - 50) % 70) / 14);
          const isActive = scanRow === i && frame > 50;
          return (
            <div key={s.name} style={{
              opacity: rowOp, transform: `translateX(${rowX}px)`,
              display: "flex", alignItems: "center",
              padding: "8px 4px", borderBottom: `1px solid rgba(255,255,255,0.04)`,
              background: isActive ? `${s.color}08` : "transparent",
              borderRadius: 4,
            }}>
              {isActive && (
                <div style={{
                  width: 3, height: 18, borderRadius: 2,
                  background: s.color, marginRight: 8, flexShrink: 0,
                  boxShadow: `0 0 8px ${s.color}`,
                }} />
              )}
              <div style={{ flex: 1, fontSize: 17, fontWeight: 600, color: "#fff" }}>{s.name}</div>
              <div style={{ width: 65, textAlign: "center", fontSize: 15, fontWeight: 800, color: s.color }}>{s.risk}</div>
              <div style={{ width: 75, textAlign: "right", fontSize: 17, fontWeight: 700, color: s.color }}>{s.exposure}</div>
            </div>
          );
        })}
      </div>

      {/* Title — REVENUE green, RISK red, with shimmer */}
      <div style={{
        opacity: interpolate(titleP, [0, 1], [0, 1]),
        transform: `scale(${titleScale})`,
        textAlign: "center", marginTop: 12,
      }}>
        <div style={{ fontSize: 32, fontWeight: 900, color: "#fff" }}>REAL-TIME</div>
        <div style={{ fontSize: 32, fontWeight: 900 }}>
          <span style={{ color: `hsl(${140 + shimmer * 20}, 100%, 58%)`, textShadow: `0 0 16px ${GREEN}55` }}>REVENUE</span>
          <span style={{ color: "#fff" }}> AT </span>
          <span style={{ color: RED, textShadow: `0 0 16px ${RED}55` }}>RISK</span>
        </div>
      </div>
    </div>
  );
};
