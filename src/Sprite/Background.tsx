// import { useMotionValue } from "framer-motion";
// import { useOnRender } from "../webgl-util/renderer/useOnRender";
import { ShaderPlane } from "./ShaderPlane";
// import { useCallback } from "react";
// import { WebGLRenderer } from "../webgl-util/renderer/WebGLRenderer";
import backgroundFragmentShader from "./background.frag.glsl?raw";

export function Background() {
  // const onInit = useCallback(
  //   ({}: // gl,
  //   // program,
  //   {
  //     gl: WebGL2RenderingContext;
  //     program: WebGLProgram;
  //   }) => {},
  //   []
  // );

  // const onRender = useCallback(
  //   ({}: // renderer,
  //   {
  //     gl: WebGL2RenderingContext;
  //     program: WebGLProgram;
  //     renderer: WebGLRenderer;
  //   }) => {
  //     //   const { time } = renderer;
  //   },
  //   []
  // );

  return (
    <ShaderPlane
      sizeX={4}
      sizeY={2}
      positionX={0}
      positionY={0}
      rotation={0}
      order={20}
      // onInit={onInit}
      // onRender={onRender}
      fragShader={backgroundFragmentShader}
    />
  );
}
