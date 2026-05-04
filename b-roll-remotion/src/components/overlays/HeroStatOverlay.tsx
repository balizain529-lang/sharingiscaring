import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Scene } from "../../data/schema";

const TEAL = "#00D4FF";
const CARD_BG = "rgba(11, 18, 34, 0.85)";

/**
 * Hero stat overlay — top-right corner, ~30% of frame.
 * Big number + label, semi-transparent backdrop.
 * Speaker visible behind and to the left.
 */
export const HeroStatOverlay: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 14, stiffness: 150 } });
  const opacity = interpolate(p, [0, 1], [0, 1]);
  const slideX = interpolate(p, [0, 1], [80, 0]);

  return (
    <div
      style={{
        position: "absolute",
        top: 80,
        right: 60,
        opacity,
        transform: `translateX(${slideX}px)`,
        fontFamily: "Inter, system-ui, sans-serif",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <HeroStatContent scene={scene} frame={frame} fps={fps} />
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

const HeroStatContent: React.FC<{ scene: Scene; frame: number; fps: number }> = ({ scene, frame, fps }) => {
  if (scene.type === "big-stat-reveal") {
    const data = scene.data;
    const t = Math.min(Math.max(0, frame - 6) / 35, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const glow = Math.sin(frame * 0.1) * 0.3 + 0.7;
    const displayed = formatValue(data.value, eased, data.format);
    const suffix = autoSuffix(data.value, data.format, data.suffix);

    return (
      <div style={card()}>
        <div style={{ padding: "24px 32px", textAlign: "center", minWidth: 320 }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: data.color,
              textShadow: `0 0 ${28 * glow}px ${data.color}77`,
              lineHeight: 1,
            }}
          >
            {data.prefix ?? ""}
            {displayed}
            {suffix}
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "rgba(255,255,255,0.8)",
              marginTop: 12,
              maxWidth: 320,
              lineHeight: 1.3,
            }}
          >
            {data.subtitle}
          </div>
        </div>
      </div>
    );
  }

  if (scene.type === "kpi-dashboard") {
    const data = scene.data;
    // Pull the most prominent card and render as hero
    const card0 = data.cards[0];
    const t = Math.min(Math.max(0, frame - 6) / 35, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const counted = Math.round(eased * card0.value);
    const glow = Math.sin(frame * 0.1) * 0.3 + 0.7;

    return (
      <div style={card()}>
        <div style={{ padding: "20px 28px", minWidth: 280 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TEAL, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>
            {data.header}
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: card0.color,
              textShadow: `0 0 ${24 * glow}px ${card0.color}66`,
              lineHeight: 1,
            }}
          >
            {card0.prefix ?? ""}
            {counted}
            {card0.suffix ?? ""}
          </div>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", marginTop: 8 }}>{card0.label}</div>
          {data.cards.length > 1 && (
            <div style={{ display: "flex", gap: 18, marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              {data.cards.slice(1, 3).map((c, i) => {
                const delay = 14 + i * 6;
                const cp = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 14 } });
                const op = interpolate(cp, [0, 1], [0, 1]);
                const ct = Math.min(Math.max(0, frame - delay) / 30, 1);
                const cv = Math.round((1 - Math.pow(1 - ct, 3)) * c.value);
                return (
                  <div key={i} style={{ opacity: op }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: c.color }}>
                      {c.prefix ?? ""}
                      {cv}
                      {c.suffix ?? ""}
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{c.label}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={card()}>
      <div style={{ padding: 20, fontSize: 18, color: "#fff" }}>{scene.type}</div>
    </div>
  );
};

function card() {
  return {
    background: CARD_BG,
    backdropFilter: "blur(8px)",
    borderRadius: 12,
    border: "1px solid rgba(0,212,255,0.2)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  } as React.CSSProperties;
}
