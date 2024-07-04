#version 300 es
precision mediump float;
out vec4 outColor;
in vec4 v_correctedPosition;
in vec2 v_uv;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_pointer;
uniform vec3 u_color;



void main() {
  outColor = vec4(v_uv,0., 1.0);
}