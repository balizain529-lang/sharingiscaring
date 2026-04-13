import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { AskAIScreen } from "./AskAIScreen";
import { DashboardScreen } from "./DashboardScreen";

// AskAIScreen: 210 frames (7s) → DashboardScreen: 270 frames (9s)
// Total: 480 frames (16s) @ 30fps
export const ScreensBRoll: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={210}>
        <AskAIScreen />
      </Sequence>
      <Sequence from={210} durationInFrames={270}>
        <DashboardScreen />
      </Sequence>
    </AbsoluteFill>
  );
};
