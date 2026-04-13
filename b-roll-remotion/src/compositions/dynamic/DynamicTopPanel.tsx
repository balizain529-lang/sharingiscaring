import React from "react";
import { OffthreadVideo } from "remotion";

const TOP_HEIGHT = 1020;

export const TOP_PANEL_HEIGHT = TOP_HEIGHT;

export const DynamicTopPanel: React.FC<{ videoUrl: string }> = ({ videoUrl }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 1080,
        height: TOP_HEIGHT,
        overflow: "hidden",
        background: "#000",
      }}
    >
      <OffthreadVideo
        src={videoUrl}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 30%",
        }}
      />
    </div>
  );
};
