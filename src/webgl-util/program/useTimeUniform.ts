import { useWebglRenderer } from "../renderer/useWebglRenderer";
import { useOnRender } from "../renderer/useOnRender";
import { useEffect, useState } from "react";

export function useTimeUniform(program: WebGLProgram | null) {
  const renderer = useWebglRenderer();
  const { gl } = renderer;

  const [timeUniformLocation, setTimeUniformLocation] =
    useState<WebGLUniformLocation | null>(null);

  useEffect(() => {
    if (program) {
      setTimeUniformLocation(gl.getUniformLocation(program, "u_time"));
    }
  }, [gl, program]);

  useOnRender(
    () => {
      if (timeUniformLocation) {
        gl.useProgram(program);
        gl.uniform1f(timeUniformLocation, renderer.time);
      }
    },
    {
      priority: 0,
    }
  );

  return timeUniformLocation;
}
