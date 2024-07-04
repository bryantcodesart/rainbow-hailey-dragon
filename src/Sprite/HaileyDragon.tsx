import { useMotionValue } from "framer-motion";
// import { useOnRender } from "../webgl-util/renderer/useOnRender";
import { ShaderPlane } from "./ShaderPlane";
import { useCallback } from "react";
import { WebGLRenderer } from "../webgl-util/renderer/WebGLRenderer";
import spriteFragmentShader from "./sprite.frag.glsl?raw";

function loadTextureIntoUniform({
  gl,
  program,
  src,
  uniformName,
}: {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  src: string;
  uniformName: string;
}) {
  gl.useProgram(program);
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set up texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  // Create a 1x1 pixel texture as a placeholder
  const pixel = new Uint8Array([255, 0, 0, 255]);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    pixel
  );

  // Get the location of the sampler2D uniform
  const uSamplerLocation = gl.getUniformLocation(program, uniformName);

  // Set the texture unit 0 to the sampler2D uniform
  gl.uniform1i(uSamplerLocation, 0);

  // Bind the texture to texture unit 0
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Load an image
  const image = new Image();
  image.src = src;
  image.onload = () => {
    if (!gl.isProgram(program)) {
      return;
    }
    gl.useProgram(program);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
  };
}

export function HaileyDragon({ offset = 0 }: { offset?: number }) {
  const sizeX = useMotionValue(1);
  const sizeY = useMotionValue(1);
  const positionX = useMotionValue(0);
  const positionY = useMotionValue(0);
  const rotation = useMotionValue(0);

  const onInit = useCallback(
    ({
      gl,
      program,
    }: {
      gl: WebGL2RenderingContext;
      program: WebGLProgram;
    }) => {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      loadTextureIntoUniform({
        gl,
        program,
        src: "/hailey.png",
        uniformName: "u_image",
      });
    },
    []
  );

  const onRender = useCallback(
    ({
      renderer,
    }: {
      gl: WebGL2RenderingContext;
      program: WebGLProgram;
      renderer: WebGLRenderer;
    }) => {
      const { time } = renderer;
      const t = time * 20;
      const size =
        0.05 +
        offset ** 2 * 0.7 * (0.5 + 0.5 * (Math.sin(t * 0.01) * 0.5 + 0.5));
      sizeX.set(size);
      sizeY.set(size);
      const radius =
        0.8 * Math.sin(t * 0.1 + Math.sin(t * 0.01) * Math.PI * offset);
      positionX.set(Math.sin(t * 0.1 + 2 * Math.PI * offset) * radius);
      positionY.set(Math.cos(t * 0.1 + 2 * Math.PI * offset) * radius);
      rotation.set(
        0.5 * Math.sin(t * 0.02 + 2 * Math.PI * offset) + Math.PI * 1.2
      );
    },
    [positionX, positionY, rotation, sizeX, sizeY, offset]
  );

  return (
    <ShaderPlane
      sizeX={sizeX}
      sizeY={sizeY}
      positionX={positionX}
      positionY={positionY}
      rotation={rotation}
      onInit={onInit}
      onRender={onRender}
      fragShader={spriteFragmentShader}
      order={5}
    />
  );
}
