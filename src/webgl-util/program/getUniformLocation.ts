export function getUniformLocation(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  name: string
) {
  const location = gl.getUniformLocation(program, name);
  if (!location) {
    console.warn(
      `Failed to get uniform location for ${name}.  Might be unused.`
    );
  }
  return location;
}
