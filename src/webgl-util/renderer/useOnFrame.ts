import { useEffect } from "react";
import { RenderQueueOptions, WebGLRenderer } from "./WebGLRenderer";
import { useWebglRenderer } from "./useWebglRenderer";

export function useOnFrame(
  callback: (_renderer: WebGLRenderer) => void,
  options: Partial<RenderQueueOptions> = {}
): void {
  const renderer = useWebglRenderer();
  const { order } = options;
  useEffect(() => {
    const unsub = renderer.onFrame(callback, {
      order: order ?? 5,
    });
    return () => {
      unsub();
    };
  }, [callback, renderer, order]);
}
