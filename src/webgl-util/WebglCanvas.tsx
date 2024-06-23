import { ReactNode, useEffect, useRef, useState } from "react";
import { WebGLRenderer } from "./renderer/WebGLRenderer";
import { WebglRendererContext } from "./renderer/WebglRendererContext";

export function WebGLCanvas({ children }: { children?: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [renderer, setRenderer] = useState<WebGLRenderer | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const renderer = new WebGLRenderer(canvas, container);

    let animationFrameId: number;
    setRenderer(renderer);

    return () => {
      cancelAnimationFrame(animationFrameId);
      renderer.destroy();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 w-full h-full bg-violet"
    >
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      {renderer && (
        <WebglRendererContext.Provider value={renderer}>
          {children}
        </WebglRendererContext.Provider>
      )}
    </div>
  );
}
