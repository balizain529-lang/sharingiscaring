import React from "react";
import { Series } from "remotion";
import { TakeawaySequence } from "./TakeawaySequence";
import { EndCard } from "../../components/EndCard";

/**
 * Full conclusion b-roll:
 *   4 takeaway cards (10s) + end card (5s) = 15s total
 *
 * Drop this rendered clip into Descript at ~12:52 overlay point.
 */
export const ConclusionBRoll: React.FC = () => {
  return (
    <Series>
      {/* Takeaway cards — 4 x 75 frames = 300 frames (10s) */}
      <Series.Sequence durationInFrames={300}>
        <TakeawaySequence />
      </Series.Sequence>

      {/* End card — 150 frames (5s) */}
      <Series.Sequence durationInFrames={150}>
        <EndCard />
      </Series.Sequence>
    </Series>
  );
};
