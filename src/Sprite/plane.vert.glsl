#version 300 es
in vec4 a_position;
out vec2 v_uv;
uniform vec2 u_resolution;
uniform vec2 u_size;
uniform vec2 u_position;
uniform float u_rotation;
uniform vec2 u_origin;

void main() {
  v_uv = a_position.xy * .5 + .5;

  float aspect = u_resolution.x / u_resolution.y;

  vec2 scale = u_size * 0.5;
  vec2 position = a_position.xy;
  position *= u_size * 0.5;
  position -= (u_origin-0.5)*u_size;
  position = vec2(
    position.x * cos(u_rotation) - position.y * sin(u_rotation),
    position.x * sin(u_rotation) + position.y * cos(u_rotation)
  );
  position+= u_position;

  position = vec2(position.x / aspect, position.y);


  gl_Position = vec4(position, a_position.z, a_position.w);
}