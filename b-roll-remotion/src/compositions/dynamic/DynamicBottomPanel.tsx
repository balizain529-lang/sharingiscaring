import React from "react";
import { Sequence } from "remotion";
import { SCENE_REGISTRY } from "../../components/scenes";
import { TOP_PANEL_HEIGHT } from "./DynamicTopPanel";
import type { Scene } from "../../data/schema";

const BOTTOM_HEIGHT = 1920 - TOP_PANEL_HEIGHT;

export const DynamicBottomPanel: React.FC<{ scenes: Scene[] }> = ({ scenes }) => {
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
      {scenes.map((scene, i) => {
        const Component = SCENE_REGISTRY[scene.type];
        if (!Component) return null;
        return (
          <Sequence
            key={`${scene.type}-${i}`}
            from={scene.from}
            durationInFrames={scene.durationInFrames}
          >
            <Component data={scene.data} />
          </Sequence>
        );
      })}
    </div>
  );
};
