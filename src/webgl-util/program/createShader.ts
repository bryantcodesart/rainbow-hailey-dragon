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
  const errorMessage = getFormattedShaderErrorMessage(gl, shader, type, source);
  throw new Error(errorMessage);
}

function getShaderTypeString(gl: WebGL2RenderingContext, val: number) {
  if (val === gl.VERTEX_SHADER) return "vertex";
  if (val === gl.FRAGMENT_SHADER) return "fragment";
  return "unknown";
}

function getFormattedShaderErrorMessage(
  gl: WebGL2RenderingContext,
  shader: WebGLShader,
  type: number,
  source: string
) {
  const errorMessage = gl.getShaderInfoLog(shader) ?? "Unknown webgl error.";
  const shaderType = getShaderTypeString(gl, type);

  const lines = source.split("\n");
  const lineCount = lines.length;
  const maxLineNumberLength = String(lineCount).length;

  const formattedSource = lines
    .map((line, index) => {
      const lineNumber = index + 1;
      const paddedLineNumber = lineNumber
        .toString()
        .padStart(maxLineNumberLength, " ");
      return `   ${paddedLineNumber}:   ${line}`;
    })
    .join("\n");

  const errorLines = errorMessage.split("\n").map((errorLine) => {
    const match = errorLine.match(/\d+:(\d+):/);
    if (match) {
      const lineNumber = parseInt(match[1], 10) - 1;
      if (lineNumber >= 0 && lineNumber < lineCount) {
        const paddedLineNumber = (lineNumber + 1)
          .toString()
          .padStart(maxLineNumberLength, " ");
        const relevantLine = `   ${paddedLineNumber}: ${lines[lineNumber]}`;
        return `${errorLine}\n${relevantLine}\n`;
      }
    }
    return errorLine;
  });

  return `Failed to compile ${shaderType} shader:\n\n${errorLines.join(
    "\n"
  )}\n\nFULL SOURCE:\n${formattedSource}`;
}
