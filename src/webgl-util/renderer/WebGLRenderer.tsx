import Stats from "stats.js";
import { getDpr } from "../../utility/getDpr";
import { DEBUG_OPTIONS } from "../../DEBUG_OPTIONS";

export type RenderQueueOptions = {
  order: number;
};
type RenderQueueItem = {
  function: (_renderer: WebGLRenderer) => void;
  options: RenderQueueOptions;
};

export class WebGLRenderer {
  public gl: WebGL2RenderingContext;
  public canvas: HTMLCanvasElement;
  public inView = false;
  private canvasContainer: HTMLElement;
  private renderQueue: RenderQueueItem[] = [];
  private intersectionObserver: IntersectionObserver;
  public dpr = getDpr();
  public width = 0;
  public height = 0;
  public time = 0;
  private stats: Stats;

  constructor(canvas: HTMLCanvasElement, canvasContainer: HTMLElement) {
    // console.log("creating webgl renderer", this.id);
    const gl = canvas.getContext("webgl2", { depth: true });
    if (!gl) throw new Error("WebGL2 not supported");
    this.gl = gl;

    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.canvasContainer = canvasContainer;
    this.canvas = canvas;

    this.stats = new Stats(); // Initialize stats
    if (DEBUG_OPTIONS.STATS) document.body.appendChild(this.stats.dom); // Append stats to the DOM

    this.intersectionObserver = new IntersectionObserver((entries) => {
      this.inView = entries[0].isIntersecting;
    }, {});
    this.intersectionObserver.observe(canvas);

    this.resizeCanvasToDisplaySize();

    const drawLoop = () => {
      if (DEBUG_OPTIONS.STATS) this.stats.begin();
      this.frame();
      if (DEBUG_OPTIONS.STATS) this.stats.end();
      requestAnimationFrame(drawLoop);
    };

    drawLoop();
  }

  public onFrame(
    fn: (renderer: WebGLRenderer) => void,
    options: RenderQueueOptions
  ): () => void {
    const newItem: RenderQueueItem = {
      function: fn,
      options: options,
    };

    const index = this.renderQueue.findIndex(
      (item) => item.options.order > options.order
    );
    if (index === -1) {
      this.renderQueue.unshift(newItem);
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

  private resizeCanvasToDisplaySize(): boolean {
    const canvas = this.gl.canvas;
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error("Invalid canvas");
    }
    const dpr = getDpr();
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

  public frame(): void {
    this.resizeCanvasToDisplaySize();
    this.time += 1 / 60;

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    for (const item of this.renderQueue) {
      item.function(this);
    }
  }

  public destroy(): void {
    this.intersectionObserver.disconnect();
    if (DEBUG_OPTIONS.STATS) this.stats.dom.remove();
  }
}
