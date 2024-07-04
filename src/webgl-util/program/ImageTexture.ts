export class ImageTexture {
  gl: WebGL2RenderingContext;
  texture: WebGLTexture | null;
  destroyed = false;

  constructor({ gl, src }: { gl: WebGL2RenderingContext; src: string }) {
    this.gl = gl;
    this.texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); // Use mipmaps for minification
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const placeHolderImage = new Uint8Array([0, 0, 255, 255]);

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      placeHolderImage
    );

    const image = new Image();
    image.onload = () => {
      if (this.destroyed) return;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image
      );
      // gl.generateMipmap(gl.TEXTURE_2D); // Generate mipmaps
    };
    image.src = src;
  }

  destroy() {
    this.destroyed = true;
    if (this.gl && this.texture) {
      this.gl.deleteTexture(this.texture);
      this.texture = null;
    }
  }
}
