import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TopPanel } from "./TopPanel";
import { BottomPanel } from "./BottomPanel";
import { TextStrip } from "../../../components/TextStrip";

// ─── Scene labels for TextStrip ──────────────────────────────────────
// TODO: Replace with your actual scene labels from the transcript.
// Podcast labels should reflect the current discussion topic.
// ──────────────────────────────────────────────────────────────────────

const SCENES: { from: number; label: string }[] = [
  { from: 0, label: "TODO · Guest Intro" },
  { from: 270, label: "TODO · Key Stat" },
  { from: 480, label: "TODO · Topic 1" },
  { from: 810, label: "TODO · Topic 2" },
  { from: 1080, label: "TODO · CTA" },
];

function getCurrentLabel(frame: number) {
  for (let i = SCENES.length - 1; i >= 0; i--) {
    if (frame >= SCENES[i].from) return SCENES[i].label;
  }
  return SCENES[0].label;
}

export const PodcastShort: React.FC = () => {
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
