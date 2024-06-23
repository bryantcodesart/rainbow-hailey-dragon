import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const MAX_DPR = 2;

type RenderQueueOptions = {
  priority: number;
};

type RenderQueueItem = {
  function: () => void;
  options: RenderQueueOptions;
};

export class WebGLRenderer {
  public gl: WebGL2RenderingContext;
  public canvas: HTMLCanvasElement;
  public inView = false;
  private canvasContainer: HTMLElement;
  private renderQueue: RenderQueueItem[] = [];
  private intersectionObserver: IntersectionObserver;
  public dpr = this.getDpr();
  public width = 0;
  public height = 0;
  public time = 0;

  constructor(canvas: HTMLCanvasElement, canvasContainer: HTMLElement) {
    // console.log("creating webgl renderer", this.id);
    const gl = canvas.getContext("webgl2");
    if (!gl) throw new Error("WebGL2 not supported");
    this.gl = gl;
    this.canvasContainer = canvasContainer;
    this.canvas = canvas;

    this.intersectionObserver = new IntersectionObserver((entries) => {
      this.inView = entries[0].isIntersecting;
    }, {});
    this.intersectionObserver.observe(canvas);

    this.resizeCanvasToDisplaySize();

    const render = () => {
      this.render();
      requestAnimationFrame(render);
    };

    render();
  }

  public onRender(fn: () => void, options: RenderQueueOptions): () => void {
    const newItem: RenderQueueItem = {
      function: fn,
      options: options,
    };

    const index = this.renderQueue.findIndex(
      (item) => item.options.priority < options.priority
    );
    if (index === -1) {
      this.renderQueue.push(newItem);
    } else {
      this.renderQueue.splice(index, 0, newItem);
    }

    return () => {
      const index = this.renderQueue.indexOf(newItem);
      if (index !== -1) {
        this.renderQueue.splice(index, 1);
      }
    };
  }

  private getDpr(): number {
    return Math.min(MAX_DPR, window.devicePixelRatio);
  }

  private resizeCanvasToDisplaySize(): boolean {
    const canvas = this.gl.canvas;
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error("Invalid canvas");
    }
    const dpr = this.getDpr();
    const { clientWidth, clientHeight } = this.canvasContainer;

    const targetWidth = clientWidth * dpr;
    const targetHeight = clientHeight * dpr;
    const needsResize =
      canvas.width !== targetWidth || canvas.height !== targetHeight;

    if (needsResize) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    this.width = targetWidth;
    this.height = targetHeight;
    this.dpr = dpr;

    return needsResize;
  }

  public render(): void {
    this.resizeCanvasToDisplaySize();
    this.time += 1 / 60;

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    for (const item of this.renderQueue) {
      item.function();
    }
  }

  public destroy(): void {
    this.intersectionObserver.disconnect();
  }
}

const WebglRendererContext = createContext<WebGLRenderer | null>(null);

export function useWebglRenderer() {
  const renderer = useContext(WebglRendererContext);
  if (!renderer) throw new Error("No WebGLRenderer found");
  return renderer;
}

export function useOnRender(
  callback: () => void,
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
