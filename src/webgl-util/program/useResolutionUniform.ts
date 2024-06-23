import { useWebglRenderer } from "../renderer/useWebglRenderer";
import { useOnRender } from "../renderer/useOnRender";
import { useEffect, useState } from "react";

export function useResolutionUniform(program: WebGLProgram | null) {
  const renderer = useWebglRenderer();
  const { gl } = renderer;

  const [resolutionUniformLocation, setResolutionUniformLocation] =
    useState<WebGLUniformLocation | null>(null);

  useEffect(() => {
    if (program) {
      setResolutionUniformLocation(
        gl.getUniformLocation(program, "u_resolution")
      );
    }
  }, [gl, program]);

  useOnRender(
    () => {
      if (resolutionUniformLocation) {
        gl.uniform2f(
          resolutionUniformLocation,
          renderer.width,
          renderer.height
        );
      }
    },
    {
      priority: 0,
    }
  );

  return resolutionUniformLocation;
}
