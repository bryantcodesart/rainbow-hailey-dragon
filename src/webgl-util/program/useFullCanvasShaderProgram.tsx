import { useWebglRenderer } from "../renderer/useWebglRenderer";
import { useEffect, useState } from "react";
import { createProgram } from "./createProgram";

export function useFullCanvasShaderProgram(
  vertShaderSource: string,
  fragShaderSource: string
) {
  const { gl } = useWebglRenderer();

  const [program, setProgram] = useState<WebGLProgram | null>(null);
  const [vao, setVao] = useState<WebGLVertexArrayObject | null>(null);

  useEffect(() => {
    // Create a shader program
    const prog = createProgram(gl, vertShaderSource, fragShaderSource);
    setProgram(prog);

    const positionAttributeLocation = gl.getAttribLocation(prog, "a_position");

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      //
      -1, -1,
      //
      -1, 3,
      //
      3, -1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const _vao = gl.createVertexArray();
    setVao(_vao);
    gl.bindVertexArray(_vao);
    gl.enableVertexAttribArray(positionAttributeLocation);
    const size = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.vertexAttribPointer(
      positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    return () => {
      gl.deleteBuffer(positionBuffer);
      gl.deleteVertexArray(_vao);
      gl.deleteProgram(prog);
    };
  }, [gl, vertShaderSource, fragShaderSource]);

  return { program, vao };
}
