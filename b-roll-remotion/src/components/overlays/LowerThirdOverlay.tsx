import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Scene } from "../../data/schema";

const TEAL = "#00D4FF";
const GREEN = "#00FF88";
const CARD_BG = "rgba(11, 18, 34, 0.85)";

/**
 * Lower-third overlay — bottom 28% of frame, full width.
 * Speaker stays visible above. Card slides up from below with backdrop blur.
 * Renders different content based on scene type.
 */
export const LowerThirdOverlay: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 18 } });
  const opacity = interpolate(p, [0, 1], [0, 1]);
  const slideY = interpolate(p, [0, 1], [60, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        right: 40,
        bottom: 60,
        opacity,
        transform: `translateY(${slideY}px)`,
        fontFamily: "Inter, system-ui, sans-serif",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <LowerThirdContent scene={scene} frame={frame} fps={fps} />
    </div>
  );
};

const LowerThirdContent: React.FC<{ scene: Scene; frame: number; fps: number }> = ({ scene, frame, fps }) => {
  if (scene.type === "person-scorecard") {
    const data = scene.data;
    return (
      <div style={card()}>
        <div style={{ ...accentBar() }} />
        <div style={{ flex: 1, padding: "20px 28px" }}>
          <div style={{ fontSize: 38, fontWeight: 900, color: "#fff", letterSpacing: "0.01em" }}>{data.name}</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: TEAL, marginTop: 6, letterSpacing: "0.05em" }}>{data.title}</div>
          {data.badges?.length > 0 && (
            <div style={{ display: "flex", gap: 24, marginTop: 14 }}>
              {data.badges.slice(0, 3).map((b, i) => {
                const delay = 8 + i * 6;
                const bp = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 12 } });
                const op = interpolate(bp, [0, 1], [0, 1]);
                return (
                  <div key={i} style={{ opacity: op }}>
                    <span style={{ fontSize: 24, fontWeight: 800, color: GREEN, marginRight: 6 }}>{b.value}</span>
                    <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{b.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (scene.type === "cta-comment") {
    const data = scene.data;
    const cursorBlink = Math.floor(frame / 14) % 2 === 0 ? 1 : 0;
    const ctaGlow = Math.sin(frame * 0.1) * 0.3 + 0.7;
    return (
      <div style={card()}>
        <div style={{ ...accentBar(), background: GREEN }} />
        <div style={{ flex: 1, padding: "22px 32px", display: "flex", alignItems: "center", gap: 24 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>{data.action}</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: GREEN, textShadow: `0 0 ${16 * ctaGlow}px ${GREEN}66` }}>
              "{data.keyword}"
              <span style={{ display: "inline-block", width: 3, height: 30, background: TEAL, marginLeft: 4, verticalAlign: "middle", opacity: cursorBlink, boxShadow: `0 0 4px ${TEAL}` }} />
            </div>
          </div>
          {data.subtitle && (
            <div style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", flex: 1 }}>{data.subtitle}</div>
          )}
        </div>
      </div>
    );
  }

  if (scene.type === "logo-endorsement") {
    const data = scene.data;
    return (
      <div style={card()}>
        <div style={{ ...accentBar() }} />
        <div style={{ flex: 1, padding: "16px 28px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: TEAL, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 10 }}>
            {data.header}
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
            {data.logos.slice(0, 6).map((logo, i) => {
              const delay = 4 + i * 5;
              const bp = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 14 } });
              const op = interpolate(bp, [0, 1], [0, 1]);
              return (
                <div key={i} style={{ opacity: op, fontSize: 18, fontWeight: 700, color: "#fff" }}>
                  {logo.name}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Workflow-pipeline → render as compact horizontal strip in lower-third
  if (scene.type === "workflow-pipeline") {
    const data = scene.data;
    const allNodes = data.rows.flat().slice(0, 5);
    return (
      <div style={card()}>
        <div style={{ ...accentBar() }} />
        <div style={{ flex: 1, padding: "16px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: TEAL, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 10 }}>
            {data.header}
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {allNodes.map((n, i) => {
              const delay = 4 + i * 5;
              const bp = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 12 } });
              const op = interpolate(bp, [0, 1], [0, 1]);
              const scl = interpolate(bp, [0, 1], [0.5, 1]);
              return (
                <React.Fragment key={i}>
                  <div style={{ opacity: op, transform: `scale(${scl})`, display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "rgba(17,30,48,0.85)", border: `1px solid ${n.glow ? (n.color || TEAL) : "rgba(255,255,255,0.1)"}`, borderRadius: 8 }}>
                    {n.icon && <img src={`https://api.iconify.design/${n.icon}.svg?color=%23ffffff`} alt="" style={{ width: 20, height: 20 }} />}
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>{n.label}</span>
                  </div>
                  {i < allNodes.length - 1 && <span style={{ color: TEAL, fontSize: 18, opacity: 0.6 }}>→</span>}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Generic fallback — show scene type label
  return (
    <div style={card()}>
      <div style={{ ...accentBar() }} />
      <div style={{ flex: 1, padding: "20px 28px", fontSize: 22, fontWeight: 700, color: "#fff" }}>
        {scene.type}
      </div>
    </div>
  );
};

function card() {
  return {
    display: "flex",
    background: CARD_BG,
    backdropFilter: "blur(8px)",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  } as React.CSSProperties;
}

function accentBar() {
  return {
    width: 5,
    background: TEAL,
    boxShadow: `0 0 12px ${TEAL}88`,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  } as React.CSSProperties;
}
