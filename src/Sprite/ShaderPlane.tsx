import { useWebglRenderer } from "../webgl-util/renderer/useWebglRenderer";
import { useOnRender } from "../webgl-util/renderer/useOnRender";
import { useEffect, useState } from "react";
import { useResolutionUniform } from "../webgl-util/program/useResolutionUniform";
import { useTimeUniform } from "../webgl-util/program/useTimeUniform";
import defaultFragShader from "./default.frag.glsl?raw";
import planeVertShader from "./plane.vert.glsl?raw";
import { createProgram } from "../webgl-util/program/createProgram";
import { useUniformLocations } from "../webgl-util/program/useUniformLocations";
import { MotionValue } from "framer-motion";
import { WebGLRenderer } from "../webgl-util/renderer/WebGLRenderer";

function getNumberOrMotionValue(value: MotionValue<number> | number): number {
  return typeof value === "number" ? value : value.get();
}
export function ShaderPlane({
  sizeX = 1,
  sizeY = 1,
  positionX = 0,
  positionY = 0,
  originX = 0.5,
  originY = 0.5,
  rotation = 0,
  fragShader = defaultFragShader,
  order,
  onInit,
  onRender,
}: {
  sizeX?: MotionValue<number> | number;
  sizeY?: MotionValue<number> | number;
  positionX?: MotionValue<number> | number;
  positionY?: MotionValue<number> | number;
  rotation?: MotionValue<number> | number;
  originX?: MotionValue<number> | number;
  originY?: MotionValue<number> | number;
  fragShader?: string;
  order: number;
  onInit?: ({
    gl,
    program,
  }: {
    gl: WebGL2RenderingContext;
    program: WebGLProgram;
  }) => void;
  onRender?: ({
    gl,
    program,
    renderer,
  }: {
    gl: WebGL2RenderingContext;
    program: WebGLProgram;
    renderer: WebGLRenderer;
  }) => void;
}) {
  const { gl } = useWebglRenderer();
  type WebGLResources = {
    program: WebGLProgram | null;
    vao: WebGLVertexArrayObject | null;
  };

  const [webGLResources, setWebGLResources] = useState<WebGLResources>({
    program: null,
    vao: null,
  });

  useEffect(() => {
    // Create a shader program
    const program = createProgram(gl, planeVertShader, fragShader);

    const positionAttributeLocation = gl.getAttribLocation(
      program,
      "a_position"
    );

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1, 1, -1, -1, 1, -1, -1, 1, 1, -1, 1, 1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    onInit?.({ gl, program });

    setWebGLResources({ program, vao });

    return () => {
      gl.deleteBuffer(positionBuffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    };
  }, [gl, fragShader, onInit]);

  const { program, vao } = webGLResources;
  useTimeUniform(program);
  useResolutionUniform(program);
  const uniformLocations = useUniformLocations(gl, program, [
    "u_position",
    "u_size",
    "u_rotation",
    "u_origin",
  ]);

  useOnRender(
    (renderer) => {
      if (!program || !vao || !uniformLocations) {
        return;
      }

      // Tee up the program and the VAO
      gl.useProgram(program);
      gl.bindVertexArray(vao);

      onRender?.({ gl, program, renderer });

      gl.uniform2fv(uniformLocations.u_origin, [
        getNumberOrMotionValue(originX),
        getNumberOrMotionValue(originY),
      ]);

      gl.uniform2fv(uniformLocations.u_position, [
        getNumberOrMotionValue(positionX),
        getNumberOrMotionValue(positionY),
      ]);
      gl.uniform2fv(uniformLocations.u_size, [
        getNumberOrMotionValue(sizeX),
        getNumberOrMotionValue(sizeY),
      ]);
      gl.uniform1f(
        uniformLocations.u_rotation,
        getNumberOrMotionValue(rotation)
      );
      gl.uniform2fv(uniformLocations.u_origin, [
        getNumberOrMotionValue(originX),
        getNumberOrMotionValue(originY),
      ]);

      // Draw
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    },
    {
      priority: order,
    }
  );

  return null;
}
