import React from "react";
import { Lottie, LottieAnimationData } from "@remotion/lottie";
import {
  cancelRender,
  continueRender,
  delayRender,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";

type Props = {
  /** Path relative to public/ e.g. "lottie/search.json" */
  src: string;
  size?: number;
  delay?: number;
};

export const LottieIcon: React.FC<Props> = ({
  src,
  size = 120,
  delay = 3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [animationData, setAnimationData] =
    React.useState<LottieAnimationData | null>(null);
  const [handle] = React.useState(() => delayRender("Loading Lottie"));

  React.useEffect(() => {
    fetch(staticFile(src))
      .then((res) => res.json())
      .then((data) => {
        setAnimationData(data);
        continueRender(handle);
      })
      .catch((err) => {
        cancelRender(err);
      });
  }, [src, handle]);

  const scaleProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 10, stiffness: 160 },
  });
  const scale = interpolate(scaleProgress, [0, 1], [0, 1]);

  if (!animationData) return null;

  return (
    <div
      style={{
        width: size,
        height: size,
        transform: `scale(${Math.max(0, scale)})`,
      }}
    >
      <Lottie
        animationData={animationData}
        style={{ width: size, height: size }}
        playbackRate={0.8}
      />
    </div>
  );
};
