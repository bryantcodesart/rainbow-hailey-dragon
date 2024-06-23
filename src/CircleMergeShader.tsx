import { useOnRender, useWebglRenderer } from "./WebglCanvas";
import { useEffect, useState } from "react";
import { useUIStore } from "./useUIStore";
import { useResolutionUniform } from "./useResolutionUniform";
import { useTimeUniform } from "./useTimeUniform";
import { useFullCanvasShaderProgram } from "./useFullCanvasShaderProgram";

export function CircleMergeShader() {
  const renderer = useWebglRenderer();
  const { gl } = renderer;

  // Make a big triangle that covers the canvas
  const { program, vao } = useFullCanvasShaderProgram();

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
