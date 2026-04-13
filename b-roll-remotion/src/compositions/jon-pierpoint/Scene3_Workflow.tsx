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
const CARD_BG = "#111E30";
const BORDER = "rgba(255,255,255,0.08)";

// Animated scan line sweeping across
const ScanLine: React.FC = () => {
  const frame = useCurrentFrame();
  const y = (frame * 2.5) % 900;
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, top: y, height: 1,
      background: `linear-gradient(90deg, transparent, ${TEAL}33, transparent)`,
      pointerEvents: "none",
    }} />
  );
};

const WorkflowNode: React.FC<{
  label: string; sub: string; delay: number; glow?: boolean; color?: string;
}> = ({ label, sub, delay, glow, color = TEAL }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 10, stiffness: 200 } });
  const scale = interpolate(p, [0, 1], [0.3, 1]);
  const opacity = interpolate(p, [0, 1], [0, 1]);
  const g = glow ? Math.sin(frame * 0.1 + delay) * 0.35 + 0.65 : 0;

  return (
    <div style={{
      opacity, transform: `scale(${scale})`,
      background: CARD_BG, border: `1.5px solid ${glow ? color : BORDER}`,
      borderRadius: 10, padding: "12px 18px", textAlign: "center", minWidth: 110,
      boxShadow: glow ? `0 0 ${18 * g}px ${color}55, inset 0 0 ${8 * g}px ${color}11` : "none",
    }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: glow ? color : "#fff", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>{sub}</div>
    </div>
  );
};

const DottedLine: React.FC<{ delay: number; color?: string }> = ({ delay, color = TEAL }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 20 } });
  const opacity = interpolate(p, [0, 1], [0, 0.6]);
  const dotPos = p > 0.3 ? ((frame - delay) % 24) / 24 * 100 : 0;

  return (
    <div style={{ flex: 1, position: "relative", height: 2, alignSelf: "center" }}>
      <div style={{
        width: "100%", height: 1, opacity,
        borderTop: `1.5px dashed ${color}44`,
      }} />
      {p > 0.3 && (
        <div style={{
          position: "absolute", top: -4, left: `${dotPos}%`,
          width: 8, height: 8, borderRadius: "50%", background: color,
          boxShadow: `0 0 8px ${color}`, transform: "translateX(-50%)",
        }} />
      )}
    </div>
  );
};

export const Scene3_Workflow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headerP = spring({ frame, fps, config: { damping: 18 } });
  const activeGlow = Math.sin(frame * 0.12) * 0.3 + 0.7;

  const statDelay = 40;
  const t = Math.min(Math.max(0, frame - statDelay) / 35, 1);
  const eased = 1 - Math.pow(1 - t, 3);
  const records = (eased * 2.7).toFixed(1);
  const respTime = Math.round(eased * 11);

  const statP = spring({ frame: Math.max(0, frame - statDelay), fps, config: { damping: 16 } });
  const statOp = interpolate(statP, [0, 1], [0, 1]);
  const statFloat = Math.sin(frame * 0.06) * 3;

  const titleP = spring({ frame: Math.max(0, frame - 54), fps, config: { damping: 12, stiffness: 140 } });
  const titleScale = interpolate(titleP, [0, 1], [0.85, 1]);

  return (
    <div style={{
      width: "100%", height: "100%", background: BG,
      fontFamily: "Inter, system-ui, sans-serif",
      padding: "24px 32px 20px",
      display: "flex", flexDirection: "column",
      boxSizing: "border-box",
      position: "relative",
    }}>
      <ScanLine />

      {/* Header */}
      <div style={{
        opacity: interpolate(headerP, [0, 1], [0, 1]),
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 20,
      }}>
        <span style={{ fontSize: 24, fontWeight: 800, color: TEAL, letterSpacing: "0.06em" }}>EP² Workflow</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: GREEN,
            boxShadow: `0 0 ${8 * activeGlow}px ${GREEN}`, opacity: 0.7 + 0.3 * activeGlow }} />
          <span style={{ fontSize: 17, fontWeight: 700, color: GREEN, letterSpacing: "0.1em" }}>ACTIVE</span>
        </div>
      </div>

      {/* Row 1: Trigger → SQL Agent → Database */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <WorkflowNode label="Trigger" sub="User Query" delay={4} />
        <DottedLine delay={10} />
        <WorkflowNode label="SQL Agent" sub="NLP → SQL" delay={12} glow />
        <DottedLine delay={18} />
        <WorkflowNode label="Database" sub="2.7M Records" delay={20} />
      </div>

      {/* Stats — bigger, glowing, floating */}
      <div style={{
        opacity: statOp,
        transform: `translateY(${statFloat}px)`,
        display: "flex", justifyContent: "space-around",
        marginBottom: 18, paddingTop: 8,
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 52, fontWeight: 900, color: GREEN,
            textShadow: `0 0 28px ${GREEN}66` }}>{records}M</div>
          <div style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>records queried</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 52, fontWeight: 900, color: TEAL,
            textShadow: `0 0 28px ${TEAL}66` }}>{respTime}s</div>
          <div style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>response time</div>
        </div>
      </div>

      {/* Title — AGENTIC green, bigger, with glow */}
      <div style={{
        opacity: interpolate(titleP, [0, 1], [0, 1]),
        transform: `scale(${titleScale})`,
        textAlign: "center", flex: 1,
        display: "flex", flexDirection: "column", justifyContent: "center",
      }}>
        <div style={{ fontSize: 38, fontWeight: 900, letterSpacing: "0.04em" }}>
          <span style={{ color: GREEN, textShadow: `0 0 20px ${GREEN}55` }}>AGENTIC</span>
          <span style={{ color: "#fff" }}> OPERATING</span>
        </div>
        <div style={{ fontSize: 38, fontWeight: 900, color: "#fff", letterSpacing: "0.04em" }}>
          SYSTEM
        </div>
      </div>
    </div>
  );
};
