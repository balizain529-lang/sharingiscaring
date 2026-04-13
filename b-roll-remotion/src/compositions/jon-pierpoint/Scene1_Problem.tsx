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

function useCountUp(delay: number, target: number, duration = 50) {
  const frame = useCurrentFrame();
  const t = Math.min(Math.max(0, frame - delay) / duration, 1);
  return Math.round((1 - Math.pow(1 - t, 3)) * target);
}

const StatCard: React.FC<{
  label: string; prefix?: string; value: number; suffix?: string;
  sub: string; subColor: string; delay: number; decimals?: boolean;
}> = ({ label, prefix = "", value, suffix = "", sub, subColor, delay, decimals }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 18 } });
  const opacity = interpolate(p, [0, 1], [0, 1]);
  const count = useCountUp(delay, value, 45);
  const settled = frame > delay + 50;
  const jitter = settled ? Math.floor(Math.sin(frame * 0.3) * 3) : 0;
  const display = settled ? count + jitter : count;
  const formatted = decimals ? (display / 10).toFixed(1) : display.toLocaleString();

  return (
    <div style={{
      opacity, flex: 1,
      background: CARD_BG, border: `1px solid ${BORDER}`,
      borderRadius: 8, padding: "14px 16px",
    }}>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 34, fontWeight: 800, color: "#fff" }}>{prefix}{formatted}{suffix}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: subColor, marginTop: 4 }}>{sub}</div>
    </div>
  );
};

const SpendChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = spring({ frame: Math.max(0, frame - 14), fps, config: { damping: 26, stiffness: 50 } });
  const W = 960, H = 50;
  const pts: [number, number][] = [
    [0, 30], [80, 22], [160, 34], [240, 18], [320, 28],
    [400, 20], [480, 32], [560, 16], [640, 26], [720, 30],
    [800, 20], [880, 28], [960, 22],
  ];
  const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const areaD = `${d} L${W},${H} L0,${H} Z`;
  const totalLen = 1200;

  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={TEAL} stopOpacity="0.2" />
          <stop offset="100%" stopColor={TEAL} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#sparkFill)"
        style={{ clipPath: `inset(0 ${(1 - draw) * 100}% 0 0)` }} />
      <path d={d} fill="none" stroke={TEAL} strokeWidth={2}
        strokeDasharray={totalLen} strokeDashoffset={interpolate(draw, [0, 1], [totalLen, 0])}
        strokeLinecap="round" />
    </svg>
  );
};

export const Scene1_Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headerP = spring({ frame, fps, config: { damping: 18 } });
  const liveGlow = Math.sin(frame * 0.14) * 0.4 + 0.6;
  const titleP = spring({ frame: Math.max(0, frame - 40), fps, config: { damping: 14 } });
  const shimmer = (Math.sin(frame * 0.08) + 1) / 2;

  return (
    <div style={{
      width: "100%", height: "100%", background: BG,
      fontFamily: "Inter, system-ui, sans-serif",
      padding: "32px 40px 24px",
      display: "flex", flexDirection: "column",
      boxSizing: "border-box",
    }}>
      <div style={{
        opacity: interpolate(headerP, [0, 1], [0, 1]),
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 20,
      }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: TEAL, letterSpacing: "0.08em" }}>SUPPLY CHAIN</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN,
            boxShadow: `0 0 ${6 + 8 * liveGlow}px ${GREEN}`, opacity: 0.6 + 0.4 * liveGlow }} />
          <span style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>LIVE</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <StatCard label="Total Spend" prefix="$" value={24} suffix="B" sub="+12%" subColor={GREEN} delay={4} />
        <StatCard label="Suppliers" value={3847} sub="-2.1%" subColor={RED} delay={8} />
        <StatCard label="Risk Score" value={784} sub="HIGH" subColor={ORANGE} delay={12} decimals />
      </div>

      <div style={{
        background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 8,
        padding: "12px 16px", marginBottom: 16,
      }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", marginBottom: 8 }}>
          SPEND VARIANCE (90-DAY)
        </div>
        <SpendChart />
      </div>

      <div style={{
        background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 8,
        padding: "12px 16px", marginBottom: 20,
      }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", marginBottom: 10 }}>
          SUPPLY CHAIN FLOW
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {["Raw Materials", "Manufacturing", "Distribution"].map((s, i) => (
            <React.Fragment key={s}>
              <span style={{
                fontSize: 16, fontWeight: 600,
                color: i === 2 ? BG : "#fff",
                background: i === 2 ? TEAL : "transparent",
                border: i === 2 ? "none" : `1px solid ${BORDER}`,
                borderRadius: 6, padding: "6px 14px",
              }}>{s}</span>
              {i < 2 && <span style={{ color: "rgba(255,255,255,0.3)" }}>—</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{
        opacity: interpolate(titleP, [0, 1], [0, 1]),
        transform: `scale(${interpolate(titleP, [0, 1], [0.9, 1])})`,
        textAlign: "center", flex: 1,
        display: "flex", flexDirection: "column", justifyContent: "center",
      }}>
        <div style={{ fontSize: 36, fontWeight: 900, color: "#fff" }}>
          THE <span style={{ color: `hsl(${155 + shimmer * 15}, 100%, 55%)` }}>$20,000,000</span>
        </div>
        <div style={{ fontSize: 36, fontWeight: 900, color: "#fff" }}>PROBLEM</div>
      </div>
    </div>
  );
};
