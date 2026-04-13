import React from "react";
import { Sequence } from "remotion";
import { TOP_PANEL_HEIGHT } from "./TopPanel";
import { Scene2_WaltCharles } from "./Scene2_WaltCharles";
import { Scene3_Workflow } from "./Scene3_Workflow";
import { Scene4_Dashboard } from "./Scene4_Dashboard";
import { Scene5_SystemLive } from "./Scene5_SystemLive";

// Scene timing matched to transcript (frames @ 30fps):
// Scene 1: 0:00–0:12  = 0–360     Walt Charles III scorecard (Walt speaks about the problem)
// Scene 2: 0:12–0:21  = 360–630   EP² Workflow (Jon: "AI agents, EP Squared, NLP to SQL")
// Scene 3: 0:21–0:32  = 630–960   EP² Dashboard (Jon: "revenue at risk, supplier intelligence")
// Scene 4: 0:32–0:44  = 960–1320  System Live (Walt: "True Horizons, value-added partner")
// CTA:     0:44–0:49  = 1320–1490 CTA (Jon: "comment procurement")

const BOTTOM_HEIGHT = 1920 - TOP_PANEL_HEIGHT;

export const BottomPanel: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: TOP_PANEL_HEIGHT,
        left: 0,
        width: 1080,
        height: BOTTOM_HEIGHT,
        background: "#0B1222",
        overflow: "hidden",
      }}
    >
      <Sequence from={0} durationInFrames={360}>
        <Scene2_WaltCharles />
      </Sequence>
      <Sequence from={360} durationInFrames={270}>
        <Scene3_Workflow />
      </Sequence>
      <Sequence from={630} durationInFrames={330}>
        <Scene4_Dashboard />
      </Sequence>
      <Sequence from={960} durationInFrames={530}>
        <Scene5_SystemLive />
      </Sequence>
    </div>
  );
};
