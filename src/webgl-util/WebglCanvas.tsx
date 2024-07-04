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

      {/* <div className="absolute w-[1px] h-full bg-white top-1/2 transform -translate-y-1/2 left-0 right-0 mx-auto opacity-30" /> */}
      {/* <div className="absolute h-[1px] w-full bg-white left-1/2 transform -translate-x-1/2 top-0 bottom-0 my-auto opacity-30" /> */}
    </div>
  );
}
