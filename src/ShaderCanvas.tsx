"use client";
import { useEffect, useRef } from "react";

import Stats from "stats.js";
import { DEBUG_OPTIONS } from "./DEBUG_OPTIONS";
import { getUIState } from "./useUIStore";

const vertexShaderSource = /*glsl*/ `#version 300 es
    in vec4 a_position;
    out vec2 v_uv;
    uniform vec2 u_resolution;
    void main() {
      float aspect = u_resolution.x / u_resolution.y;
      v_uv = a_position.xy * .5 + .5;
      gl_Position = a_position;
    }
`;

const fragmentShaderSource = /*glsl*/ `#version 300 es
    precision highp float;
    out vec4 outColor;
    in vec4 v_correctedPosition;
    in vec2 v_uv;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_pointer;
    uniform vec3 u_color;

    float smoothmin(float a, float b, float k) {
      float h = max(k-abs(a-b), 0.0) / k;
      return min(a, b) - h*h*h*k*(1.0/6.0);
    }

    void main() {
      float aspect = u_resolution.x / u_resolution.y;
      vec2 uv = vec2((v_uv.x - 0.5) * aspect, v_uv.y - 0.5);
      vec2 pointer = vec2((u_pointer.x - 0.5) * aspect, u_pointer.y - 0.5);

      float t = (sin(u_time* 2.)+1.)/2.;
      // float d = max(1. - distance(v_uv, u_pointer)*5.,0.);

      float d1 = distance(uv, vec2(0.15-t*0.5,0.));
      float d2 = distance(uv, vec2(-0.15+t*0.5,0.));
      float d3 = distance(uv, pointer);
      float d = smoothmin(d1, d2, 0.1);
      // d = smoothmin(d, d3, 0.1);

      float blur = 0.01;
      float rad = 0.2-0.1*t;
      float bw = 0.01;

      float v = step(rad, d);


      float bgd = distance(uv, vec2(0.0));
      float grad = (bgd) * sin((bgd-u_time*0.5)*10.);

      vec3 bg = mix(vec3(1.), u_color, grad);


      float border = step(rad-bw, d) - step(rad+bw, d);
      float fill = step(rad,d);
      vec3 color = mix(u_color, bg, fill);
      color = mix(color, vec3(0.), border);
      // outColor = vec4(v_uv.xy, d*(0.5+0.5*t), 1.);
      outColor = vec4(color,1.);
    }
`;

function createShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string
) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Failed to create shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.error(gl.getShaderInfoLog(shader));
  throw new Error("Failed to compile shader");
}

function createProgram(
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) {
  const program = gl.createProgram();
  if (!program) throw new Error("Failed to create program");

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
  console.error(gl.getProgramInfoLog(program));
  throw new Error("Failed to link program");
}

function getDpr() {
  if (DEBUG_OPTIONS.FORCE_DPR !== null) {
    return DEBUG_OPTIONS.FORCE_DPR;
  }
  return window.devicePixelRatio;
}

function resizeCanvasToDisplaySize(
  canvas: HTMLCanvasElement,
  canvasContainer: HTMLDivElement
) {
  const dpr = getDpr();
  const { clientWidth, clientHeight } = canvasContainer;

  const targetWidth = clientWidth * dpr;
  const targetHeight = clientHeight * dpr;
  const needsResize =
    canvas.width !== targetWidth || canvas.height !== targetWidth;

  if (needsResize) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
  }
}

export function ShaderCanvas() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error("Canvas not found");
    const canvasContainer = canvasContainerRef.current;
    if (!canvasContainer) throw new Error("Canvas container not found");
    const gl = canvas.getContext("webgl2");
    if (!gl) throw new Error("WebGL2 not supported");
    console.log("gl", gl);

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );
    const program = createProgram(gl, vertexShader, fragmentShader);
    console.log(program);

    const positionAttributeLocation = gl.getAttribLocation(
      program,
      "a_position"
    );

    const resolutionUniformLocation = gl.getUniformLocation(
      program,
      "u_resolution"
    );

    const colorUniformLocation = gl.getUniformLocation(program, "u_color");

    const pointerUniformLocation = gl.getUniformLocation(program, "u_pointer");

    const timeUniformLocation = gl.getUniformLocation(program, "u_time");

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

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
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

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    let pointerClientX = 0;
    let pointerClientY = 0;
    const handlePointerMove = (e: PointerEvent) => {
      pointerClientX = e.clientX;
      pointerClientY = e.clientY;
    };
    window.addEventListener("pointermove", handlePointerMove);

    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    let animationFrameHandle: number;
    const draw = (time: number) => {
      animationFrameHandle = requestAnimationFrame(draw);
      stats.begin();

      const { red, green, blue } = getUIState();

      resizeCanvasToDisplaySize(canvas, canvasContainer);
      const rect = canvas.getBoundingClientRect();
      const pointerPositionInUv = [
        (pointerClientX - rect.left) / rect.width,
        1 - (pointerClientY - rect.top) / rect.height,
      ];

      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.uniform2f(
        resolutionUniformLocation,
        gl.canvas.width,
        gl.canvas.height
      );
      gl.uniform1f(timeUniformLocation, time / 1000);
      gl.uniform2fv(pointerUniformLocation, pointerPositionInUv);

      gl.uniform3fv(colorUniformLocation, [red / 255, green / 255, blue / 255]);

      gl.drawArrays(gl.TRIANGLES, 0, 3);

      stats.end();
    };
    animationFrameHandle = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameHandle);
      stats.dom.remove();

      window.removeEventListener("pointermove", handlePointerMove);
      gl.deleteBuffer(positionBuffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <div
      ref={canvasContainerRef}
      className="border border-red-600 w-full h-full fixed top-0 left-0 bg-[violet]"
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full border border-blue-600"
      />
    </div>
  );
}
