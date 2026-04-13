import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TopPanel } from "./TopPanel";
import { BottomPanel } from "./BottomPanel";
import { TextStrip } from "../../../components/TextStrip";

// ─── Scene labels for TextStrip ──────────────────────────────────────
// TODO: Replace with your actual scene labels from the transcript.
// ──────────────────────────────────────────────────────────────────────

const SCENES: { from: number; label: string }[] = [
  { from: 0, label: "TODO · Hook Stat" },
  { from: 240, label: "TODO · Client Intro" },
  { from: 540, label: "TODO · The Challenge" },
  { from: 840, label: "TODO · The Solution" },
  { from: 1140, label: "TODO · The Results" },
  { from: 1440, label: "TODO · Trust + CTA" },
];

function getCurrentLabel(frame: number) {
  for (let i = SCENES.length - 1; i >= 0; i--) {
    if (frame >= SCENES[i].from) return SCENES[i].label;
  }
  return SCENES[0].label;
}

export const CaseStudyShort: React.FC = () => {
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
