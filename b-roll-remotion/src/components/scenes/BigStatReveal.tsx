import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { BigStatRevealScene } from "../../data/schema";

const BG = "#0B1222";
const TEAL = "#00D4FF";

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

function formatValue(raw: number, eased: number, format?: string): string {
  const v = eased * raw;
  if (format === "percentage") return `${Math.round(v)}`;
  if (format === "abbreviated" || format === "compact") {
    if (raw >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}`;
    if (raw >= 1_000) return `${Math.round(v / 1_000)}`;
  }
  return `${Math.round(v)}`;
}

function autoSuffix(raw: number, format?: string, suffix?: string): string {
  if (suffix) return suffix;
  if (format === "percentage") return "%";
  if ((format === "abbreviated" || format === "compact") && raw >= 1_000_000) return "M";
  if ((format === "abbreviated" || format === "compact") && raw >= 1_000) return "K";
  return "";
}

export const BigStatReveal: React.FC<{ data: BigStatRevealScene["data"] }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t = Math.min(Math.max(0, frame - 6) / 40, 1);
  const eased = 1 - Math.pow(1 - t, 3);
  const glow = Math.sin(frame * 0.1) * 0.3 + 0.7;

  const subP = spring({ frame: Math.max(0, frame - 30), fps, config: { damping: 16 } });
  const subOp = interpolate(subP, [0, 1], [0, 1]);
  const subY = interpolate(subP, [0, 1], [20, 0]);

  const lineP = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 22, stiffness: 70 } });
  const lineW = interpolate(lineP, [0, 1], [0, 100]);

  const compP = spring({ frame: Math.max(0, frame - 50), fps, config: { damping: 18 } });
  const compOp = interpolate(compP, [0, 1], [0, 1]);

  const displayed = formatValue(data.value, eased, data.format);
  const suffix = autoSuffix(data.value, data.format, data.suffix);

  return (
    <div style={{
      width: "100%", height: "100%",
      fontFamily: "Inter, system-ui, sans-serif",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px 40px", boxSizing: "border-box", position: "relative",
    }}>
      <Particles />
      {data.value !== 0 && (
        <div style={{
          fontSize: 180, fontWeight: 900, color: data.color, textAlign: "center",
          textShadow: `0 0 ${44 * glow}px ${data.color}88`,
          position: "relative", zIndex: 1, lineHeight: 1,
        }}>
          {data.prefix ?? ""}{displayed}{suffix}
        </div>
      )}
      {data.value !== 0 && (
        <div style={{
          width: `${lineW}%`, height: 3, borderRadius: 2, marginTop: 28, marginBottom: 28,
          background: `linear-gradient(90deg, transparent, ${data.color}, transparent)`,
          boxShadow: `0 0 16px ${data.color}55`,
        }} />
      )}
      <div style={{
        opacity: subOp, transform: `translateY(${subY}px)`,
        fontSize: 36, fontWeight: 600, color: "rgba(255,255,255,0.8)",
        textAlign: "center", maxWidth: 1200, position: "relative", zIndex: 1, lineHeight: 1.3,
      }}>
        {data.subtitle}
      </div>
      {data.comparison && (
        <div style={{
          opacity: compOp, display: "flex", alignItems: "center", gap: 48,
          marginTop: 56, position: "relative", zIndex: 1,
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, color: "rgba(255,255,255,0.45)", marginBottom: 8, letterSpacing: "0.1em", fontWeight: 700 }}>{data.comparison.before.label}</div>
            <div style={{ fontSize: 64, fontWeight: 800, color: "rgba(255,255,255,0.45)" }}>{data.comparison.before.value}</div>
          </div>
          <div style={{ fontSize: 56, color: "rgba(255,255,255,0.35)" }}>→</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, color: "rgba(255,255,255,0.45)", marginBottom: 8, letterSpacing: "0.1em", fontWeight: 700 }}>{data.comparison.after.label}</div>
            <div style={{ fontSize: 64, fontWeight: 800, color: data.color,
              textShadow: `0 0 16px ${data.color}66` }}>{data.comparison.after.value}</div>
          </div>
        </div>
      )}
    </div>
  );
};
