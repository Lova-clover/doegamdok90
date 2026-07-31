import React from "react";
import { Composition } from "remotion";
import { DemoVideo, Thumbnail } from "./DemoVideo";

export const RemotionRoot = () => (
  <>
    <Composition
      id="Doegamdok90Demo"
      component={DemoVideo}
      durationInFrames={2640}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="Doegamdok90Thumbnail"
      component={Thumbnail}
      durationInFrames={120}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
