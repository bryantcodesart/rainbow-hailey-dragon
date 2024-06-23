#version 300 es
in vec4 a_position;
out vec2 v_uv;
uniform vec2 u_resolution;
void main() {
  float aspect = u_resolution.x / u_resolution.y;
  v_uv = a_position.xy * .5 + .5;
  gl_Position = a_position;
}