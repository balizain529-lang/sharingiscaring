import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * An animated accent line that draws itself on with a stroke-dashoffset reveal.
 * Use below headlines for a "pen stroke" underline effect.
 */
type Props = {
  width?: number;
  color: string;
  delay?: number;
  thickness?: number;
};

export const StrokeReveal: React.FC<Props> = ({
  width = 160,
  color,
  delay = 8,
  thickness = 3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 22, stiffness: 80 },
  });

  const dashOffset = interpolate(progress, [0, 1], [width + 20, 0]);

  return (
    <svg
      width={width}
      height={thickness + 8}
      viewBox={`0 0 ${width} ${thickness + 8}`}
      style={{ overflow: "visible" }}
    >
      {/* Glow behind */}
      <path
        d={`M 4 ${thickness + 2} Q ${width * 0.25} ${thickness - 2}, ${width * 0.5} ${thickness + 2} Q ${width * 0.75} ${thickness + 5}, ${width - 4} ${thickness + 1}`}
        stroke={color}
        strokeWidth={thickness + 4}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={width + 20}
        strokeDashoffset={dashOffset}
        opacity={0.15}
      />
      {/* Main stroke */}
      <path
        d={`M 4 ${thickness + 2} Q ${width * 0.25} ${thickness - 2}, ${width * 0.5} ${thickness + 2} Q ${width * 0.75} ${thickness + 5}, ${width - 4} ${thickness + 1}`}
        stroke={color}
        strokeWidth={thickness}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={width + 20}
        strokeDashoffset={dashOffset}
      />
    </svg>
  );
};
