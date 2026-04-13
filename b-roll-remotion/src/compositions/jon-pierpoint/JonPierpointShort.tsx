import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TopPanel } from "./TopPanel";
import { BottomPanel } from "./BottomPanel";
import { TextStrip } from "./TextStrip";

const SCENES: { from: number; label: string }[] = [
  { from: 0,    label: "Walt Charles III · 7x CPO" },
  { from: 360,  label: "EP² · Agentic Operating System" },
  { from: 630,  label: "EP² · Revenue at Risk" },
  { from: 960,  label: "True Horizons · System Live" },
  { from: 1320, label: "Comment Procurement" },
];

function getCurrentLabel(frame: number) {
  for (let i = SCENES.length - 1; i >= 0; i--) {
    if (frame >= SCENES[i].from) return SCENES[i].label;
  }
  return SCENES[0].label;
}

export const JonPierpointShort: React.FC = () => {
  const frame = useCurrentFrame();
  const label = getCurrentLabel(frame);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <TopPanel />
      <TextStrip label={label} />
      <BottomPanel />
    </AbsoluteFill>
  );
};
