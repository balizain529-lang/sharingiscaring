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
const ORANGE = "#FF8C00";
const RED = "#FF4444";
const PURPLE = "#8B5CF6";
const CARD_BG = "#111E30";
const BORDER = "rgba(255,255,255,0.08)";

// Floating particles for bg depth
const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  const particles = Array.from({ length: 15 }, (_, i) => {
    const x = ((i * 137.5 + 20) % 100);
    const y = ((i * 73.1 + 10) % 100) + Math.sin(frame * 0.025 + i * 1.7) * 6;
    const size = 2 + (i % 3);
    const opacity = 0.06 + Math.sin(frame * 0.03 + i * 0.8) * 0.03;
    return { x, y, size, opacity };
  });

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size, borderRadius: "50%",
          background: TEAL, opacity: p.opacity,
        }} />
      ))}
    </div>
  );
};

export const Scene5_SystemLive: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase timing for 360-frame scene (0:32–0:44 system live, 0:44–0:49 CTA)
  // 360 frames for system live portion, then CTA starts at frame 360 (handled by BottomPanel Sequence)
  // Actually this scene gets 530 frames total (960–1490)
  const phase1 = frame < 160;   // Requirements
  const phase2 = frame >= 160 && frame < 360;  // System Live
  const phase3 = frame >= 360;  // CTA

  // === PHASE 1: Requirements ===
  const reqHeaderP = spring({ frame, fps, config: { damping: 18 } });
  const reqBarProgress = Math.min(Math.max(0, frame - 6) / 80, 1);
  const reqPercent = Math.round(reqBarProgress * -32);

  const items = [
    "Query 2.7M records < 15s",
    "NLP-to-SQL pipeline",
    "Real-time risk scoring",
    "Supplier intelligence",
    "Executive dashboard",
  ];

  const buildFrame = Math.max(0, frame - 100);
  const buildProgress = Math.min(buildFrame / 50, 1);
  const buildPercent = Math.round(buildProgress * 62);

  // === PHASE 2: System Live ===
  const p2Frame = Math.max(0, frame - 160);
  const sysP = spring({ frame: p2Frame, fps, config: { damping: 16 } });
  const sysOp = interpolate(sysP, [0, 1], [0, 1]);
  const deployGlow = Math.sin(frame * 0.11) * 0.3 + 0.7;

  const nodes = [
    { label: "NLP Engine", x: 15, y: 30, delay: 6, color: TEAL },
    { label: "SQL Pipeline", x: 50, y: 12, delay: 14, color: TEAL },
    { label: "Risk Scorer", x: 85, y: 30, delay: 22, color: ORANGE },
    { label: "Intel Agent", x: 28, y: 68, delay: 30, color: TEAL },
    { label: "Dashboard", x: 68, y: 68, delay: 38, color: GREEN },
  ];

  const edges = [
    { x1: 15, y1: 30, x2: 50, y2: 12, delay: 10, color: TEAL },
    { x1: 50, y1: 12, x2: 85, y2: 30, delay: 18, color: ORANGE },
    { x1: 15, y1: 30, x2: 28, y2: 68, delay: 26, color: TEAL },
    { x1: 28, y1: 68, x2: 68, y2: 68, delay: 34, color: GREEN },
    { x1: 50, y1: 12, x2: 28, y2: 68, delay: 28, color: PURPLE },
  ];

  // === PHASE 3: CTA ===
  const p3Frame = Math.max(0, frame - 360);
  const ctaP = spring({ frame: p3Frame, fps, config: { damping: 12, stiffness: 150 } });
  const ctaOp = interpolate(ctaP, [0, 1], [0, 1]);
  const ctaScale = interpolate(ctaP, [0, 1], [0.85, 1]);
  const inputP = spring({ frame: Math.max(0, p3Frame - 10), fps, config: { damping: 16 } });
  const inputOp = interpolate(inputP, [0, 1], [0, 1]);
  const cursorBlink = Math.floor(p3Frame / 14) % 2 === 0 ? 1 : 0;
  const ctaGlow = Math.sin(p3Frame * 0.1) * 0.3 + 0.7;

  return (
    <div style={{
      width: "100%", height: "100%", background: BG,
      fontFamily: "Inter, system-ui, sans-serif",
      padding: "24px 36px 16px",
      display: "flex", flexDirection: "column",
      boxSizing: "border-box",
      position: "relative",
    }}>
      <Particles />

      {/* PHASE 1: Requirements */}
      {phase1 && (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative", zIndex: 1 }}>
          <div style={{ opacity: interpolate(reqHeaderP, [0, 1], [0, 1]), marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: PURPLE, letterSpacing: "0.08em" }}>REQUIREMENTS</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: RED }}>{reqPercent}%</span>
            </div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
              <div style={{
                height: "100%", borderRadius: 2,
                width: `${Math.abs(reqPercent) * 3}%`,
                background: `linear-gradient(90deg, ${PURPLE}, ${TEAL})`,
                boxShadow: `0 0 8px ${PURPLE}44`,
              }} />
            </div>
          </div>

          <div style={{
            background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 10,
            padding: "18px 24px", marginBottom: 18,
          }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 14 }}>Requirements Spec</div>
            {items.map((item, i) => {
              const itemP = spring({ frame: Math.max(0, frame - 8 - i * 6), fps, config: { damping: 18 } });
              return (
                <div key={i} style={{
                  opacity: interpolate(itemP, [0, 1], [0, 1]),
                  transform: `translateX(${interpolate(itemP, [0, 1], [-12, 0])}px)`,
                  display: "flex", alignItems: "center", gap: 10,
                  fontSize: 16, color: "rgba(255,255,255,0.7)", marginBottom: 7,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL, flexShrink: 0 }} />
                  {i + 1}. {item}
                </div>
              );
            })}
          </div>

          {frame > 100 && (
            <div style={{ marginTop: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: RED, letterSpacing: "0.06em" }}>BUILDING...</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: GREEN }}>{buildPercent}%</span>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                <div style={{
                  height: "100%", borderRadius: 2,
                  width: `${buildPercent}%`,
                  background: `linear-gradient(90deg, ${TEAL}, ${GREEN})`,
                  boxShadow: `0 0 8px ${GREEN}44`,
                }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* PHASE 2: System Live + Node Graph */}
      {phase2 && (
        <div style={{ opacity: sysOp, display: "flex", flexDirection: "column", height: "100%", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: TEAL, letterSpacing: "0.08em" }}>SYSTEM LIVE</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: GREEN,
                boxShadow: `0 0 ${10 * deployGlow}px ${GREEN}`, opacity: 0.7 + 0.3 * deployGlow }} />
              <span style={{ fontSize: 17, fontWeight: 700, color: GREEN, letterSpacing: "0.1em" }}>DEPLOYED</span>
            </div>
          </div>
          <div style={{
            height: 2, borderRadius: 1, marginBottom: 14,
            width: `${interpolate(sysOp, [0, 1], [0, 100])}%`,
            background: `linear-gradient(90deg, ${GREEN}, ${TEAL}44)`,
            boxShadow: `0 0 8px ${GREEN}44`,
          }} />

          {/* Node graph — bigger */}
          <div style={{ position: "relative", flex: 1 }}>
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              viewBox="0 0 100 100" preserveAspectRatio="none">
              {edges.map((e, i) => {
                const ep = spring({ frame: Math.max(0, p2Frame - e.delay), fps, config: { damping: 20, stiffness: 80 } });
                const len = Math.sqrt((e.x2 - e.x1) ** 2 + (e.y2 - e.y1) ** 2);
                // Travelling dot
                const dotT = ep > 0.5 ? ((p2Frame - e.delay) % 30) / 30 : 0;
                const dotX = e.x1 + (e.x2 - e.x1) * dotT;
                const dotY = e.y1 + (e.y2 - e.y1) * dotT;
                return (
                  <g key={i}>
                    <line
                      x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                      stroke={e.color} strokeWidth={0.5} strokeOpacity={0.45}
                      strokeDasharray={len}
                      strokeDashoffset={interpolate(ep, [0, 1], [len, 0])}
                    />
                    {ep > 0.5 && (
                      <circle cx={dotX} cy={dotY} r={1} fill={e.color}
                        style={{ filter: `drop-shadow(0 0 2px ${e.color})` }} />
                    )}
                  </g>
                );
              })}
            </svg>
            {nodes.map(n => {
              const np = spring({ frame: Math.max(0, p2Frame - n.delay), fps, config: { damping: 10, stiffness: 200 } });
              const g = Math.sin(frame * 0.09 + n.delay) * 0.3 + 0.7;
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
                    boxShadow: `0 0 ${14 * g}px ${n.color}55`,
                  }}>{n.label}</div>
                </div>
              );
            })}
          </div>

          {/* Status bar */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 0", marginTop: 8,
            borderTop: `1px solid rgba(255,255,255,0.06)`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: GREEN, fontSize: 16 }}>✓</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: GREEN }}>Deployed</span>
            </div>
            <span style={{ fontSize: 15, color: "rgba(255,255,255,0.5)" }}>2.6M/s</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: TEAL }}>11ms</span>
          </div>
        </div>
      )}

      {/* PHASE 3: CTA — big, bold, glowing */}
      {phase3 && (
        <div style={{
          opacity: ctaOp, transform: `scale(${ctaScale})`,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          height: "100%", textAlign: "center",
          position: "relative", zIndex: 1,
        }}>
          <div style={{
            fontSize: 46, fontWeight: 900, color: "#fff", marginBottom: 4,
            textShadow: "0 2px 16px rgba(0,0,0,0.5)",
          }}>COMMENT</div>
          <div style={{
            fontSize: 46, fontWeight: 900, color: GREEN, marginBottom: 36,
            textShadow: `0 0 ${20 * ctaGlow}px ${GREEN}66`,
          }}>"PROCUREMENT"</div>

          {/* Fake comment input */}
          <div style={{
            opacity: inputOp,
            background: "rgba(255,255,255,0.07)",
            border: `1.5px solid rgba(255,255,255,0.15)`,
            borderRadius: 28, padding: "14px 22px",
            display: "flex", alignItems: "center", gap: 14,
            width: "85%",
            boxShadow: `0 0 ${16 * ctaGlow}px rgba(0,212,255,0.1)`,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, #FF4500, #FF6B35)",
              flexShrink: 0,
            }} />
            <div style={{ flex: 1, textAlign: "left" }}>
              <span style={{ fontSize: 18, color: "#fff", fontWeight: 600 }}>PROCUREMENT</span>
              <span style={{
                display: "inline-block", width: 2, height: 20,
                background: TEAL, marginLeft: 2, verticalAlign: "middle",
                opacity: cursorBlink,
                boxShadow: `0 0 4px ${TEAL}`,
              }} />
            </div>
            <div style={{
              color: TEAL, fontSize: 22, fontWeight: 800,
              textShadow: `0 0 8px ${TEAL}`,
            }}>→</div>
          </div>
        </div>
      )}
    </div>
  );
};
