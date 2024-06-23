#version 300 es
precision highp float;
out vec4 outColor;
in vec4 v_correctedPosition;
in vec2 v_uv;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_pointer;
uniform vec3 u_color;

float smoothmin(float a, float b, float k) {
  float h = max(k-abs(a-b), 0.0) / k;
  return min(a, b) - h*h*h*k*(1.0/6.0);
}

void main() {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 uv = vec2((v_uv.x - 0.5) * aspect, v_uv.y - 0.5);

  float t = (sin(u_time* 2.)+1.)/2.;

  float d1 = distance(uv, vec2(0.15-t*0.5,0.));
  float d2 = distance(uv, vec2(-0.15+t*0.5,0.));
  float d = smoothmin(d1, d2, 0.1);

  float blur = 0.01;
  float rad = 0.2-0.1*t;
  float bw = 0.01;

  float v = step(rad, d);


  float bgd = distance(uv, vec2(0.0));
  float grad = (bgd) * sin((bgd-u_time*0.5)*10.);
  vec3 bg = mix(vec3(1.), u_color, grad);


  float border = step(rad-bw, d) - step(rad+bw, d);
  float fill = step(rad,d);
  vec3 color = mix(u_color, bg, fill);
  color = mix(color, vec3(0.), border);

  outColor = vec4(color,1.);
}