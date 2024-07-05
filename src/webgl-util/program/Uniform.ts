import { NumberArray } from "../../utility/NumberArray";

type UniformType =
  | "float"
  | "vec2"
  | "vec3"
  | "vec4"
  | "mat2"
  | "mat3"
  | "mat4"
  | "int"
  | "ivec2"
  | "ivec3"
  | "ivec4"
  | "sampler2D";

type UniformValueType<T extends UniformType> = T extends "float"
  ? number
  : T extends "vec2"
  ? NumberArray<2>
  : T extends "vec3"
  ? NumberArray<3>
  : T extends "vec4"
  ? NumberArray<4>
  : T extends "mat2"
  ? NumberArray<4>
  : T extends "mat3"
  ? NumberArray<9>
  : T extends "mat4"
  ? NumberArray<16>
  : T extends "int"
  ? number
  : T extends "ivec2"
  ? NumberArray<2>
  : T extends "ivec3"
  ? NumberArray<3>
  : T extends "ivec4"
  ? NumberArray<4>
  : T extends "sampler2D"
  ? number
  : never;

export class Uniform<T extends UniformType> {
  readonly gl: WebGL2RenderingContext;
  readonly program: WebGLProgram;
  readonly name: string;
  readonly type: T;
  location: WebGLUniformLocation | null;
  value!: UniformValueType<T>;

  constructor(props: {
    gl: WebGL2RenderingContext;
    program: WebGLProgram;
    name: string;
    type: T;
    initialValue: UniformValueType<T>;
  }) {
    this.gl = props.gl;
    this.program = props.program;
    this.name = props.name;
    this.type = props.type;
    this.location = this.gl.getUniformLocation(this.program, this.name);
    this.update(props.initialValue);
  }

  update(val: UniformValueType<T>) {
    this.value = val;
    this.gl.useProgram(this.program);
    if (this.location === null) {
      this.location = this.gl.getUniformLocation(this.program, this.name);
    }
    if (this.location === null) {
      console.warn(`Failed to get uniform location for ${this.name}`);
      return;
    }
    switch (this.type) {
      case "float":
        this.gl.uniform1f(this.location, val as UniformValueType<"float">);
        break;
      case "vec2":
        this.gl.uniform2fv(this.location, val as UniformValueType<"vec2">);
        break;
      case "vec3":
        this.gl.uniform3fv(this.location, val as UniformValueType<"vec3">);
        break;
      case "vec4":
        this.gl.uniform4fv(this.location, val as UniformValueType<"vec4">);
        break;
      case "mat2":
        this.gl.uniformMatrix2fv(
          this.location,
          false,
          val as UniformValueType<"mat2">
        );
        break;
      case "mat3":
        this.gl.uniformMatrix3fv(
          this.location,
          false,
          val as UniformValueType<"mat3">
        );
        break;
      case "mat4":
        this.gl.uniformMatrix4fv(
          this.location,
          false,
          val as UniformValueType<"mat4">
        );
        break;
      case "int":
        this.gl.uniform1i(this.location, val as UniformValueType<"int">);
        break;
      case "sampler2D":
        this.gl.uniform1i(this.location, val as UniformValueType<"sampler2D">);
        break;
      case "ivec2":
        this.gl.uniform2iv(this.location, val as UniformValueType<"ivec2">);
        break;
      case "ivec3":
        this.gl.uniform3iv(this.location, val as UniformValueType<"ivec3">);
        break;
      case "ivec4":
        this.gl.uniform4iv(this.location, val as UniformValueType<"ivec4">);
        break;
    }
  }

  destroy() {
    this.location = null;
  }
}
