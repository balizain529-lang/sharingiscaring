import React from "react";
import { Series } from "remotion";
import { TakeawayCard } from "../../components/TakeawayCard";
import { TAKEAWAYS } from "../../data/conclusion";

export const TakeawaySequence: React.FC = () => {
  return (
    <Series>
      {TAKEAWAYS.map((t) => (
        <Series.Sequence key={t.number} durationInFrames={75}>
          <TakeawayCard
            number={t.number}
            headline={t.headline}
            subtext={t.subtext}
            icon={t.icon}
            lottieSrc={t.lottieSrc}
          />
        </Series.Sequence>
      ))}
    </Series>
  );
};
