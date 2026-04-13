import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TopPanel } from "./TopPanel";
import { BottomPanel } from "./BottomPanel";
import { TextStrip } from "../../../components/TextStrip";

// ─── Scene labels for TextStrip ──────────────────────────────────────
// TODO: Replace with your actual scene labels from the transcript.
// ──────────────────────────────────────────────────────────────────────

const SCENES: { from: number; label: string }[] = [
  { from: 0, label: "TODO · Hook / Problem" },
  { from: 360, label: "TODO · Speaker Intro" },
  { from: 600, label: "TODO · How It Works" },
  { from: 1020, label: "TODO · Results / Data" },
  { from: 1320, label: "TODO · Architecture + CTA" },
];

function getCurrentLabel(frame: number) {
  for (let i = SCENES.length - 1; i >= 0; i--) {
    if (frame >= SCENES[i].from) return SCENES[i].label;
  }
  return SCENES[0].label;
}

export const TechWalkthroughShort: React.FC = () => {
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
