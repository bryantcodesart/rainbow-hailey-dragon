import { useWebglRenderer } from "../webgl-util/renderer/useWebglRenderer";
import { useOnFrame } from "../webgl-util/renderer/useOnFrame";
import { useEffect, useState } from "react";
import { createProgram } from "../webgl-util/program/createProgram";
import { Uniform } from "../webgl-util/program/Uniform";
import { ImageTexture } from "../webgl-util/program/ImageTexture";
import { ControlsTunnel } from "../tunnels/ControlsTunnel";
import { useMotionValue } from "framer-motion";
import { NumberSlider } from "../ui/NumberSlider";

const N_HAILEYS = 3000;

const vertShader = /*glsl*/ `#version 300 es
#pragma vscode_glsllint_stage : vert

precision mediump float;

in vec4 a_position;
in float a_offset;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_length;
uniform float u_craziness;

out vec2 v_uv;
out float v_offset;
out float v_t;

float PI = 3.141592;
float TAU = 6.283185;

float spikySin(float t) {
  return 10.*(cos(t)*cos(2.*t)*cos(3.*t)*cos(4.*t)*cos(5.*t));
}

void main() {
  v_uv = a_position.xy * .5 + .5;
  v_offset = a_offset;

  float aspect = u_resolution.x / u_resolution.y;

  float largerSide = max(1.0,aspect);
  float smallerSide = min(1.0,aspect);

  float t = u_time * 2.0 + (7.0 *  TAU * a_offset ); // * (1.0- 0.3 * u_craziness);
  v_t = t;


  float width = 0.1*(pow(a_offset, 5.0) * 5. + 0.1);
  width = (sin(t+u_time*3.)*0.1+0.8)*width;
  width *= sin(t)*0.5+0.8;
  // width *= smallerSide;

  // width = mix(width, width * 1.2, smoothstep(0.99,1.0,a_offset));

  if(a_offset<1.-u_length) width = 0.0;
  vec2 size = vec2(width, width);
  float rotation = sin(t)*spikySin(t*0.2);
  float radius = sin(a_offset*sin(t*0.2)*4.0)+v_offset*0.5;
  radius += u_craziness*spikySin(t*0.3)*0.5*spikySin(t*0.11);

  radius *= smallerSide * (0.9 - 0.2 * u_craziness);

  float x = cos(t) * radius;
  float y = sin(t) * radius;
  vec2 translation = vec2(x,y);

  float anchorX = cos(t*5.) * u_craziness * 3.0 + 0.5;
  float anchorY = sin(t*3.2) * u_craziness * 3.0 + 0.5;
  vec2 anchor = vec2(anchorY, anchorX);



  vec2 scale = size * 0.5 ;


  vec2 vertPosition = a_position.xy;
  vertPosition *= size * 0.5;
  vertPosition -= (anchor-0.5)*size;
  vertPosition = vec2(
    vertPosition.x * cos(rotation) - vertPosition.y * sin(rotation),
    vertPosition.x * sin(rotation) + vertPosition.y * cos(rotation)
  );
  vertPosition += translation;

  vertPosition = vec2(vertPosition.x / aspect, vertPosition.y);

  gl_Position = vec4(vertPosition, a_position.z, a_position.w);
}
`;

const fragShader = /*glsl*/ `#version 300 es
#pragma vscode_glsllint_stage : frag

precision mediump float;

in vec2 v_uv;
in float v_offset;
in float v_t;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_pointer;
uniform vec3 u_color;
uniform sampler2D u_texture;


out vec4 outColor;


void main() {
  vec2 uv = v_uv;
  uv.y = 1.0 - uv.y;
  // uv*=2.0;
  vec4 texColor = texture(u_texture, uv);


  vec4 tailColor = texColor;
  float b = (sin(v_offset*200.+u_time*20.)*0.5+0.9)*1.0+0.5;
  b*= v_offset;
  tailColor *= vec4(b, b, b, 1.0);

  // float halo = 1.0 - distance(v_uv, vec2(0.5, 0.5))*3.0;
  // halo = clamp(halo, 0.0, 1.0);
  // halo *= sin(halo*20.+v_t*8.+u_time*20.);
  // color = texColor; //*0.5+halo*2.;
  float ct = v_t+u_time*2.0;
  tailColor.r += sin(ct);
  tailColor.g += sin(ct*2.2);
  tailColor.b += sin(ct*3.7);
  tailColor.a *= 1.;

  vec4 headColor = texColor*(1.0 + 0.5*(sin(u_time*7.)*0.5+0.5));
  vec4 color = mix(tailColor, headColor, smoothstep(0.99,1.0,v_offset));

  outColor = color;


  // outColor = vec4(uv, 0.0, 1.0);
}
`;

class Program {
  gl: WebGL2RenderingContext;
  program: WebGLProgram | null;
  attributeLocs: {
    a_position: number;
    a_offset: number;
  };
  buffers: {
    vertPositionData: WebGLBuffer | null;
    instancedOffsetData: WebGLBuffer | null;
  };
  uniforms: {
    u_resolution: Uniform<"vec2">;
    u_time: Uniform<"float">;
    u_texture: Uniform<"sampler2D">;
    u_length: Uniform<"float">;
    u_craziness: Uniform<"float">;
  };
  textures: {
    hailey: ImageTexture;
  };

  constructor({ gl }: { gl: WebGL2RenderingContext }) {
    this.gl = gl;

    this.program = createProgram(gl, vertShader, fragShader);

    this.buffers = {
      vertPositionData: gl.createBuffer(),
      instancedOffsetData: gl.createBuffer(),
    };
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertPositionData);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, 1, -1, -1, 1, -1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.instancedOffsetData);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(
        new Array(N_HAILEYS).fill(0).map((_, i) => i / N_HAILEYS)
      ),
      gl.STATIC_DRAW
    );

    this.attributeLocs = {
      a_position: gl.getAttribLocation(this.program, "a_position"),
      a_offset: gl.getAttribLocation(this.program, "a_offset"),
    };

    gl.useProgram(this.program);

    this.uniforms = {
      u_resolution: new Uniform({
        gl,
        program: this.program,
        name: "u_resolution",
        type: "vec2",
        initialValue: [1, 1],
      }),
      u_time: new Uniform({
        gl,
        program: this.program,
        name: "u_time",
        type: "float",
        initialValue: 0,
      }),
      u_texture: new Uniform({
        gl,
        program: this.program,
        name: "u_texture",
        type: "sampler2D",
        initialValue: 0,
      }),
      u_length: new Uniform({
        gl,
        program: this.program,
        name: "u_length",
        type: "float",
        initialValue: 0.2,
      }),
      u_craziness: new Uniform({
        gl,
        program: this.program,
        name: "u_craziness",
        type: "float",
        initialValue: 0,
      }),
    };

    this.textures = {
      hailey: new ImageTexture({ gl, src: "/hailey_opt.png" }),
    };
    console.log(this);
  }
  draw() {
    if (!this.program) {
      console.warn("Draw called but program is null");
      return;
    }

    const gl = this.gl;
    gl.useProgram(this.program);

    gl.activeTexture(gl.TEXTURE0);
    this.textures.hailey.gl.bindTexture(
      gl.TEXTURE_2D,
      this.textures.hailey.texture
    );
    gl.uniform1i(this.uniforms.u_texture.location, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertPositionData);
    gl.enableVertexAttribArray(this.attributeLocs.a_position);
    gl.vertexAttribPointer(
      this.attributeLocs.a_position,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.instancedOffsetData);
    gl.enableVertexAttribArray(this.attributeLocs.a_offset);
    gl.vertexAttribPointer(
      this.attributeLocs.a_offset,
      1,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.vertexAttribDivisor(this.attributeLocs.a_offset, 1);

    this.gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, N_HAILEYS);
  }
  destroy(): void {
    for (const uniform of Object.values(this.uniforms)) {
      uniform.destroy();
    }
    for (const texture of Object.values(this.textures)) {
      texture.destroy();
    }
    if (this.gl && this.program) {
      this.gl.deleteProgram(this.program);
      this.program = null;
    }
    for (const buffer of Object.values(this.buffers)) {
      if (buffer) {
        this.gl.deleteBuffer(buffer);
      }
    }
  }
}

export function HaileyDragon() {
  const { gl } = useWebglRenderer();
  const [program, setProgram] = useState<Program | null>(null);

  const [craziness, setCraziness] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [length, setLength] = useState(40);
  const time = useMotionValue(2.25);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    let frameId: number;
    const targetLength = 2000;
    const increment = 10;

    let nextLength = length;
    const animate = () => {
      setLength(() => {
        nextLength = Math.min(targetLength, nextLength + increment);
        return nextLength;
      });

      if (nextLength < targetLength) frameId = requestAnimationFrame(animate);
    };

    let cancelled = false;
    setTimeout(() => {
      if (cancelled) return;
      animate();
    }, 4000);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (!gl) return;
    const program = new Program({ gl });
    setProgram(program);

    return () => {
      program.destroy();
    };
  }, [gl]);

  useOnFrame(
    (renderer) => {
      const gl = renderer.gl;
      if (!program) {
        console.warn("onFrame called with null program");
        return;
      }
      if (program.gl !== gl) {
        console.warn("Program was created with different gl context");
        return;
      }
      const previousTime = time.get();
      const newTime = previousTime + (speed * 0.5) / 60;
      time.set(newTime);
      program.uniforms.u_resolution.update([renderer.width, renderer.height]);
      program.uniforms.u_time.update(newTime);
      program.uniforms.u_length.update(length / N_HAILEYS);
      program.uniforms.u_craziness.update(craziness);
      program.draw();
    },
    {
      order: 1,
    }
  );

  return (
    <ControlsTunnel.In>
      <NumberSlider
        setValue={setLength}
        value={length}
        min={1}
        max={N_HAILEYS}
        step={1}
        icon={"🐶"}
        label={"haileys"}
        key={"dragon-haileys"}
      />
      <NumberSlider
        setValue={setSpeed}
        value={speed}
        min={0}
        max={10}
        step={0.001}
        icon={"🚀"}
        label={"speed"}
        key={"dragon-speed"}
      />
      <NumberSlider
        setValue={setCraziness}
        value={craziness}
        icon={"💥"}
        label={"craziness"}
        step={0.001}
        key="dragon-craziness"
      />
    </ControlsTunnel.In>
  );
}
