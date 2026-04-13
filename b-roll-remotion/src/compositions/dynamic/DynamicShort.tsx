import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { DynamicTopPanel } from "./DynamicTopPanel";
import { DynamicBottomPanel } from "./DynamicBottomPanel";
import { TextStrip } from "../../components/TextStrip";
import { getCurrentLabel } from "../../data/schema";
import type { BRollConfig } from "../../data/schema";

export const DynamicShort: React.FC<{ config: BRollConfig }> = ({ config }) => {
  const frame = useCurrentFrame();
  const label = getCurrentLabel(frame, config.textStrip.labels);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <DynamicTopPanel videoUrl={config.meta.talkingHeadUrl} />
      <TextStrip label={label} />
      <DynamicBottomPanel scenes={config.scenes} />
    </AbsoluteFill>
  );
};
