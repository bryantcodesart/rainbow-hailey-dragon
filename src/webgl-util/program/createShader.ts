// import { useUIStore } from "./useUIStore";
export function createShader(
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
  const errorMessage = gl.getShaderInfoLog(shader);
  throw new Error(`Failed to compile shader: ${errorMessage}`);
}
