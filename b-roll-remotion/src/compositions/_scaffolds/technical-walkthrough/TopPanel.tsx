import React from "react";
import { OffthreadVideo, staticFile } from "remotion";

// Top panel: talking head — 53% of 1920 = ~1020px
const TOP_HEIGHT = 1020;

export const TOP_PANEL_HEIGHT = TOP_HEIGHT;

export const TopPanel: React.FC = () => {
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
      {/* TODO: Replace with your talking head video path */}
      <OffthreadVideo
        src={staticFile("TODO-project-name/talking-head.mp4")}
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
