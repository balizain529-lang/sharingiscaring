import React from "react";
import { Series } from "remotion";
import { TakeawayGrid } from "./TakeawayGrid";
import { EndCard } from "../../components/EndCard";

/**
 * Grid version: all 4 takeaways on one screen (8s) + end card (5s) = 13s
 */
export const ConclusionGrid: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={240}>
        <TakeawayGrid />
      </Series.Sequence>
      <Series.Sequence durationInFrames={150}>
        <EndCard />
      </Series.Sequence>
    </Series>
  );
};
