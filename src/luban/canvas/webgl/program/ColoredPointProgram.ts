import WebglProgram from '@/luban/canvas/webgl/WebglProgram'
import WebglTexture from '@/luban/canvas/webgl/WebglTexture'

export default class ColoredPointProgram extends WebglProgram {
  static vertSource = `
    uniform mat4 uVertexMatrix;

    attribute vec3 aVertex;
    
    void main() {
        gl_Position = uVertexMatrix * vec4(aVertex, 1.0);
        gl_PointSize = 6.0;
    }
    `
  static fragSource = `
    precision mediump float;
    
    uniform vec4 uColor;
    uniform sampler2D uTexture;
    
    void main() {
        vec4 color = uColor;
        color *= texture2D(uTexture, vec2(gl_PointCoord.x, gl_PointCoord.y));
        gl_FragColor = color;
    }
    `

  constructor(webgl: WebGLRenderingContext, texture: WebglTexture) {
    super(webgl, ColoredPointProgram.vertSource, ColoredPointProgram.fragSource)
    this.vertexAttribPosition = webgl.getAttribLocation(this.program, 'aVertex')
    this.colorUniformPosition = webgl.getUniformLocation(
      this.program,
      'uColor',
    ) as WebGLUniformLocation
    this.sizeUniformPosition = webgl.getUniformLocation(
      this.program,
      'uSize',
    ) as WebGLUniformLocation
    this.textureUniformPosition = webgl.getUniformLocation(
      this.program,
      'uTexture',
    ) as WebGLUniformLocation
    this.pointTexture = texture

    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR_MIPMAP_LINEAR)
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR)
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE)
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE)
    webgl.generateMipmap(webgl.TEXTURE_2D)
  }

  vertexAttribPosition: number
  colorUniformPosition: WebGLUniformLocation
  sizeUniformPosition: WebGLUniformLocation
  textureUniformPosition: WebGLUniformLocation
  pointTexture: WebglTexture

  static pointTextureImage: ArrayBufferView = (function drawCircle() {
    const pointTexture = []
    for (let i = 0; i < 64; i++) {
      for (let j = 0; j < 64; j++) {
        if (Math.round(Math.sqrt(Math.pow(i - 31, 2) + Math.pow(j - 31, 2))) <= 30) {
          pointTexture.push(-1, -1, -1, -1)
        } else {
          pointTexture.push(0, 0, 0, 0)
        }
      }
    }
    return new Uint8Array(pointTexture)
  })()
}
