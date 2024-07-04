import { useEffect, useState } from "react";
import { getUniformLocation } from "./getUniformLocation";

type UniformLocations<T extends string> = {
  [K in T]: WebGLUniformLocation | null;
};
export function useUniformLocations<T extends string>(
  gl: WebGL2RenderingContext | null,
  program: WebGLProgram | null,
  uniformNames: T[]
): UniformLocations<T> | null {
  const [uniformLocations, setUniformLocations] =
    useState<UniformLocations<T> | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!gl || !program) {
      return;
    }

    const locations = {} as UniformLocations<T>;
    for (let i = 0; i < uniformNames.length; i++) {
      const name = uniformNames[i];
      locations[name] = getUniformLocation(gl, program, name);
    }

    setUniformLocations(locations);
  }, [gl, program, ...uniformNames]);

  return uniformLocations;
}
