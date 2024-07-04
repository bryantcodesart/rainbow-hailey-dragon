// import { useUIStore } from "./useUIStore";

function getShaderType(gl: WebGL2RenderingContext, val: number) {
  if (val === gl.VERTEX_SHADER) return "vertex";
  if (val === gl.FRAGMENT_SHADER) return "fragment";
  return "unknown";
}
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
  const shaderType = getShaderType(gl, type);
  throw new Error(
    `Failed to compile ${shaderType} shader:\n\n${errorMessage} \n\n${source}`
  );
}
