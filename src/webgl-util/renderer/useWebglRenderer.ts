import { useContext } from "react";
import { WebglRendererContext } from "./WebglRendererContext";

export function useWebglRenderer() {
  const renderer = useContext(WebglRendererContext);
  if (!renderer) throw new Error("No WebGLRenderer found");
  return renderer;
}
