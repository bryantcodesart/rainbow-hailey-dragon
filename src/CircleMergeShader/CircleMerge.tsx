import { useWebglRenderer } from "../webgl-util/renderer/useWebglRenderer";
import { useOnRender } from "../webgl-util/renderer/useOnRender";
import { useEffect, useState } from "react";
import { useUIStore } from "../ui/useUIStore";
import { useResolutionUniform } from "../webgl-util/program/useResolutionUniform";
import { useTimeUniform } from "../webgl-util/program/useTimeUniform";
import { useFullCanvasShaderProgram } from "../webgl-util/program/useFullCanvasShaderProgram";
import testFragShader from "./circleMerge.frag.glsl?raw";
import testVertShader from "./circleMerge.vert.glsl?raw";

export function CircleMerge() {
  const renderer = useWebglRenderer();
  const { gl } = renderer;

  // Make a big triangle that covers the canvas
  const { program, vao } = useFullCanvasShaderProgram(
    testVertShader,
    testFragShader
  );

  // Set up our uniforms
  useTimeUniform(program);
  useResolutionUniform(program);
  const [colorUniformLocation, setColorUniformLocation] =
    useState<WebGLUniformLocation | null>(null);
  useEffect(() => {
    if (!program) {
      return;
    }
    setColorUniformLocation(gl.getUniformLocation(program, "u_color"));
  }, [program, gl]);

  const { red, green, blue } = useUIStore();
  useOnRender(() => {
    if (!program || !vao || !colorUniformLocation) {
      return;
    }

    // Tee up the program and the VAO
    gl.useProgram(program);
    gl.bindVertexArray(vao);

    // Update our case-specific uniforms
    gl.uniform3fv(colorUniformLocation, [red / 255, green / 255, blue / 255]);

    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  });

  return null;
}
