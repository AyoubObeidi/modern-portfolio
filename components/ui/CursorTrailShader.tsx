"use client";

import { ChromaFlow, CursorRipples, DotGrid, FilmGrain, LinearGradient, Shader } from "shaders/react";

type CursorTrailShaderProps = {
  onUnavailable: () => void;
};

// Exact graph from the shader-cursor-trail skill: keep node order, both invisible drivers and both ID links.
export default function CursorTrailShader({ onUnavailable }: CursorTrailShaderProps) {
  return (
    <Shader disableTelemetry className="cursor-trail-canvas" onUnavailable={onUnavailable}>
      <DotGrid
        id="trailDots"
        density={40}
        twinkle={0.9}
        visible={false}
        dotSize={{
          type: "map",
          source: "trailFlow",
          channel: "alpha",
          inputMin: 0,
          inputMax: 1,
          outputMin: 0,
          outputMax: 1,
        }}
      />
      <ChromaFlow id="trailFlow" intensity={1.4} radius={2.9} visible={false} />
      <LinearGradient
        colorA="#1e1e1f"
        colorB="#070708"
        colorSpace="hsl"
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
      />
      <LinearGradient
        colorA="#000000"
        colorB="#ffffff"
        colorSpace="hsl"
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        maskSource="trailDots"
      />
      <CursorRipples />
      <FilmGrain strength={0.1} />
    </Shader>
  );
}
