import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Scene } from "../../data/schema";

const RED = "#FF4444";
const GREEN = "#00FF88";
const TEAL = "#00D4FF";

/**
 * Caption overlay — full-width animated text reveal across upper-third / center.
 * Bold magazine-style typography. Speaker fully visible underneath
 * (semi-transparent backdrop only behind the text).
 *
 * Best for:
 * - comparison-split: animated BAD → GOOD reveal
 * - big-stat-reveal: bold value + subtitle (alternative to corner hero)
 */
export const CaptionOverlay: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: "4%",
        fontFamily: "Inter, system-ui, sans-serif",
        pointerEvents: "none",
        zIndex: 10,
        textAlign: "center",
      }}
    >
      <CaptionContent scene={scene} frame={frame} fps={fps} />
    </div>
  );
};

const CaptionContent: React.FC<{ scene: Scene; frame: number; fps: number }> = ({ scene, frame, fps }) => {
  if (scene.type === "comparison-split") {
    const data = scene.data;
    const left = data.left;
    const right = data.right;
    const hasRight = right.items.length > 0;

    return (
      <div style={{ display: "inline-block", maxWidth: "70%", padding: "20px 32px", background: "rgba(11,18,34,0.82)", backdropFilter: "blur(10px)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 12px 36px rgba(0,0,0,0.5)" }}>
        <ItemList items={left.items} color={left.color} icon={left.icon} startDelay={0} frame={frame} fps={fps} />
        {hasRight && (
          <>
            <div style={{ height: 2, background: "rgba(255,255,255,0.15)", margin: "16px auto", width: "60%" }} />
            <ItemList items={right.items} color={right.color} icon={right.icon} startDelay={left.items.length * 8 + 20} frame={frame} fps={fps} />
          </>
        )}
      </div>
    );
  }

  if (scene.type === "big-stat-reveal") {
    const data = scene.data;
    const t = Math.min(Math.max(0, frame - 6) / 35, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const glow = Math.sin(frame * 0.1) * 0.3 + 0.7;

    let displayed = `${Math.round(eased * data.value)}`;
    let suffix = data.suffix ?? "";
    if (data.format === "percentage") suffix = "%";
    if (data.format === "abbreviated" && data.value >= 1_000_000) {
      displayed = `${(eased * data.value / 1_000_000).toFixed(1)}`;
      suffix = "M";
    } else if (data.format === "abbreviated" && data.value >= 1_000) {
      displayed = `${Math.round(eased * data.value / 1_000)}`;
      suffix = "K";
    }

    return (
      <div style={{ display: "inline-block", maxWidth: "85%", padding: "32px 56px", background: "rgba(11,18,34,0.78)", backdropFilter: "blur(10px)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 12px 36px rgba(0,0,0,0.5)" }}>
        {data.value !== 0 && (
          <div style={{ fontSize: 120, fontWeight: 900, color: data.color, textShadow: `0 0 ${36 * glow}px ${data.color}88`, lineHeight: 1, marginBottom: 16 }}>
            {data.prefix ?? ""}
            {displayed}
            {suffix}
          </div>
        )}
        {data.comparison && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 40, marginBottom: 20, opacity: interpolate(spring({ frame: Math.max(0, frame - 30), fps, config: { damping: 18 } }), [0, 1], [0, 1]) }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em" }}>{data.comparison.before.label}</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: "rgba(255,255,255,0.5)" }}>{data.comparison.before.value}</div>
            </div>
            <div style={{ fontSize: 32, color: "rgba(255,255,255,0.4)" }}>→</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em" }}>{data.comparison.after.label}</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: data.color, textShadow: `0 0 12px ${data.color}66` }}>{data.comparison.after.value}</div>
            </div>
          </div>
        )}
        <div style={{ fontSize: 22, fontWeight: 600, color: "rgba(255,255,255,0.85)", maxWidth: 800, margin: "0 auto" }}>{data.subtitle}</div>
      </div>
    );
  }

  return null;
};

const ICONS: Record<string, string> = {
  cross: "✕", minus: "−", warning: "⚠",
  check: "✓", plus: "+", star: "★",
};

const ItemList: React.FC<{
  items: string[];
  color: string;
  icon: string;
  startDelay: number;
  frame: number;
  fps: number;
}> = ({ items, color, icon, startDelay, frame, fps }) => {
  return (
    <div>
      {items.map((item, i) => {
        const delay = startDelay + 8 + i * 10;
        const p = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 14 } });
        const op = interpolate(p, [0, 1], [0, 1]);
        const x = interpolate(p, [0, 1], [-30, 0]);
        return (
          <div key={i} style={{ opacity: op, transform: `translateX(${x}px)`, fontSize: 26, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 6 }}>
            <span style={{ fontSize: 22, color, textShadow: `0 0 8px ${color}44` }}>{ICONS[icon] || "•"}</span>
            {item}
          </div>
        );
      })}
    </div>
  );
};
