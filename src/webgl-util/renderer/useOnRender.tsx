import { useEffect } from "react";
import { RenderQueueOptions, WebGLRenderer } from "./WebGLRenderer";
import { useWebglRenderer } from "./useWebglRenderer";

export function useOnRender(
  callback: (_renderer: WebGLRenderer) => void,
  options: Partial<RenderQueueOptions> = {}
): void {
  const renderer = useWebglRenderer();
  const { priority } = options;
  useEffect(() => {
    const unsub = renderer.onRender(callback, {
      priority: priority ?? 5,
    });
    return () => {
      unsub();
    };
  }, [callback, renderer, priority]);
}
