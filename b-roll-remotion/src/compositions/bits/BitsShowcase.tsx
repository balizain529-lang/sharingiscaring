import React from "react";
import { AbsoluteFill } from "remotion";
import {
  TypeWriter,
  AnimatedText,
  AnimatedCounter,
  Particles,
  Spawner,
  Behavior,
  StaggeredMotion,
  useViewportRect,
} from "remotion-bits";

const BG = "#0B1222";
const TEAL = "#00D4FF";
const GREEN = "#00FF88";
const PANEL = "rgba(17,30,48,0.7)";

const Panel: React.FC<{ x: string; y: string; w: string; h: string; label: string; children: React.ReactNode }> = ({
  x, y, w, h, label, children,
}) => (
  <div
    style={{
      position: "absolute",
      left: x, top: y, width: w, height: h,
      background: PANEL,
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      padding: 32,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      overflow: "hidden",
    }}
  >
    <div style={{ position: "absolute", top: 12, left: 16, fontSize: 14, fontWeight: 700, color: TEAL, letterSpacing: "0.1em", fontFamily: "Inter, system-ui, sans-serif" }}>
      {label}
    </div>
    {children}
  </div>
);

const FirefliesPanel: React.FC = () => {
  const rect = useViewportRect();
  return (
    <Particles>
      <Spawner
        rate={0.3}
        max={60}
        area={{ width: rect.width, height: rect.height }}
        position={{ x: rect.width / 2, y: rect.height / 2 }}
        lifespan={100}
        velocity={{ x: 0.4, y: 0.4, varianceX: 1, varianceY: 1 }}
      >
        <StaggeredMotion transition={{ opacity: [0, 1, 0] }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: GREEN,
              boxShadow: `0 0 16px 6px ${GREEN}99`,
            }}
          />
        </StaggeredMotion>
      </Spawner>
      <Behavior wiggle={{ magnitude: 2, frequency: 0.1 }} wiggleVariance={1} />
    </Particles>
  );
};

export const BitsShowcase: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG, fontFamily: "Inter, system-ui, sans-serif" }}>
      <Panel x="80px" y="80px" w="850px" h="430px" label="TYPEWRITER">
        <div style={{ fontSize: 64, fontWeight: 800, color: "#fff" }}>
          <TypeWriter
            text={["Pipeline ready", "Rendering b-roll", "Shipping in 89s"]}
            typeSpeed={3}
            deleteSpeed={2}
            pauseAfterType={45}
            cursor
          />
        </div>
      </Panel>

      <Panel x="80px" y="570px" w="850px" h="430px" label="ANIMATED TEXT — GLITCH">
        <AnimatedText
          transition={{
            opacity: [0, 1],
            duration: 30,
            split: "character",
            splitStagger: 1.5,
            glitch: [1, 0],
          }}
          style={{ fontSize: 96, fontWeight: 900, color: TEAL, letterSpacing: "-0.02em" }}
        >
          OUTLIER FOUND
        </AnimatedText>
      </Panel>

      <Panel x="990px" y="80px" w="850px" h="430px" label="ANIMATED COUNTER">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <AnimatedCounter
            transition={{ values: [0, 5300], duration: 60 }}
            postfix={<span style={{ color: GREEN }}>K+</span>}
            style={{ fontSize: 140, fontWeight: 900, color: "#fff", lineHeight: 1 }}
          />
          <div style={{ fontSize: 22, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
            views unlocked
          </div>
        </div>
      </Panel>

      <Panel x="990px" y="570px" w="850px" h="430px" label="PARTICLES — FIREFLIES">
        <FirefliesPanel />
      </Panel>
    </AbsoluteFill>
  );
};
