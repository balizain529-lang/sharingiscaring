import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { WorkflowPipelineScene } from "../../data/schema";
import { MOTION } from "../../data/motion-presets";

const TEAL = "#00D4FF";
const GREEN = "#00FF88";
const CARD_BG = "#111E30";
const BORDER = "rgba(255,255,255,0.08)";

const ScanLine: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, top: (frame * 2.5) % 900, height: 1,
      background: `linear-gradient(90deg, transparent, ${TEAL}33, transparent)`,
      pointerEvents: "none",
    }} />
  );
};

const iconifyUrl = (icon: string, color: string): string =>
  `https://api.iconify.design/${icon}.svg?color=${encodeURIComponent(color)}`;

const WorkflowNode: React.FC<{
  label: string; sub?: string; delay: number; glow?: boolean; color?: string; icon?: string;
}> = ({ label, sub, delay, glow, color = TEAL, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: Math.max(0, frame - delay), fps, config: MOTION.spring.snappy });
  const entranceScale = interpolate(p, [0, 1], [0.3, 1]);
  const opacity = interpolate(p, [0, 1], [0, 1]);
  const g = glow ? MOTION.continuous.glowPulse(frame, 0.1, delay) : 0;
  const breathe = p >= 1 ? MOTION.continuous.breathe(frame, delay) : 1;
  const scale = entranceScale * breathe;
  const iconColor = glow ? color : "#FFFFFF";

  return (
    <div style={{
      opacity, transform: `scale(${scale})`,
      background: CARD_BG, border: `1.5px solid ${glow ? color : BORDER}`,
      borderRadius: 12, padding: "18px 26px", textAlign: "center", minWidth: 160,
      boxShadow: glow ? `0 0 ${24 * g}px ${color}66, inset 0 0 ${10 * g}px ${color}14` : "none",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
    }}>
      {icon && (
        <img
          src={iconifyUrl(icon, iconColor)}
          alt=""
          style={{ width: 36, height: 36, opacity: glow ? 0.7 + 0.3 * g : 0.85 }}
        />
      )}
      <div style={{ fontSize: 22, fontWeight: 800, color: glow ? color : "#fff", letterSpacing: "0.01em" }}>{label}</div>
      {sub && <div style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", letterSpacing: "0.02em" }}>{sub}</div>}
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
      <div style={{ width: "100%", height: 1, opacity, borderTop: `1.5px dashed ${color}44` }} />
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

export const WorkflowPipeline: React.FC<{ data: WorkflowPipelineScene["data"] }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerP = spring({ frame, fps, config: { damping: 18 } });
  const activeGlow = Math.sin(frame * 0.12) * 0.3 + 0.7;

  return (
    <div style={{
      width: "100%", height: "100%",
      fontFamily: "Inter, system-ui, sans-serif",
      padding: "48px 64px 40px", display: "flex", flexDirection: "column",
      justifyContent: "center", gap: 32,
      boxSizing: "border-box", position: "relative",
    }}>
      <ScanLine />
      <div style={{
        opacity: interpolate(headerP, [0, 1], [0, 1]),
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 28, fontWeight: 800, color: TEAL, letterSpacing: "0.06em" }}>{data.header}</span>
        {data.status && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: GREEN,
              boxShadow: `0 0 ${8 * activeGlow}px ${GREEN}`, opacity: 0.7 + 0.3 * activeGlow }} />
            <span style={{ fontSize: 17, fontWeight: 700, color: GREEN, letterSpacing: "0.1em" }}>{data.status}</span>
          </div>
        )}
      </div>

      {data.rows.map((row, ri) => (
        <div key={ri} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {row.map((node, ni) => {
            const delay = 4 + ri * 20 + ni * 6;
            const lineDelay = delay + 3;
            return (
              <React.Fragment key={ni}>
                <WorkflowNode label={node.label} sub={node.sub} delay={delay}
                  glow={node.glow} color={node.color} icon={node.icon} />
                {ni < row.length - 1 && <DottedLine delay={lineDelay} color={node.color || TEAL} />}
              </React.Fragment>
            );
          })}
        </div>
      ))}

      {data.stats && (
        <div style={{ display: "flex", justifyContent: "space-around", marginTop: 8, paddingTop: 8 }}>
          {data.stats.map((s, i) => {
            const delay = 40 + i * 8;
            const p = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 16 } });
            const op = interpolate(p, [0, 1], [0, 1]);
            const float = Math.sin(frame * 0.06 + i) * 3;
            return (
              <div key={s.label} style={{ opacity: op, transform: `translateY(${float}px)`, textAlign: "center" }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: i === 0 ? GREEN : TEAL,
                  textShadow: `0 0 28px ${i === 0 ? GREEN : TEAL}66` }}>{s.value}</div>
                <div style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{s.label}</div>
              </div>
            );
          })}
        </div>
      )}

      {data.title && (
        <div style={{ textAlign: "center", marginTop: "auto", paddingTop: 12 }}>
          {data.title.accentWord ? (
            <div style={{ fontSize: 34, fontWeight: 900 }}>
              <span style={{ color: GREEN, textShadow: `0 0 20px ${GREEN}55` }}>{data.title.accentWord}</span>
              <span style={{ color: "#fff" }}> {data.title.text.replace(data.title.accentWord, "").trim()}</span>
            </div>
          ) : (
            <div style={{ fontSize: 34, fontWeight: 900, color: "#fff" }}>{data.title.text}</div>
          )}
        </div>
      )}
    </div>
  );
};
