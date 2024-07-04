#version 300 es
precision mediump float;
out vec4 outColor;
in vec4 v_correctedPosition;
in vec2 v_uv;
uniform vec2 u_resolution;
uniform float u_time;


void main() {
  vec2 uv = v_uv;
  float circle = 1.-distance(uv, vec2(0.5+sin(u_time*3.)*0.1,0.5+cos(u_time)*0.1));
  float wave = sin(circle * 10. + u_time*3.);
  uv.y += wave * 0.5;
  uv.x += wave * 0.5;
  outColor = vec4(uv,0.8, 1.0);
}