import WebglProgram from '@/luban/canvas/webgl/WebglProgram'

export default class ColoredDashedLineProgram extends WebglProgram {
  static vertSource = `
    uniform mat4 uVertexMatrix;
    uniform vec2 uOffset;

    attribute vec3 aVertex;
    attribute float aLength;

    varying float vLength;
    
    void main() {
        vLength = aLength;

        vec4 position = uVertexMatrix * vec4(aVertex, 1.0);
        position.x += uOffset.x;
        position.y += uOffset.y;
        gl_Position = position;
    }
    `
  static fragSource = `
    precision mediump float;
    
    uniform vec4 uColor;
    uniform float uDashSize;
    uniform float uTotalSize;

    varying float vLength;
    
    void main() {
        if(mod( vLength , uTotalSize ) < uDashSize) {
            discard;
        }
        gl_FragColor = uColor;
    }
    `

  constructor(webgl: WebGLRenderingContext) {
    super(webgl, ColoredDashedLineProgram.vertSource, ColoredDashedLineProgram.fragSource)
    this.vertexAttribPosition = webgl.getAttribLocation(this.program, 'aVertex')
    this.lengthAttribPosition = webgl.getAttribLocation(this.program, 'aLength')
    this.colorUniformPosition = webgl.getUniformLocation(
      this.program,
      'uColor',
    ) as WebGLUniformLocation
    this.offsetUniformPosition = webgl.getUniformLocation(
      this.program,
      'uOffset',
    ) as WebGLUniformLocation
    this.dashSizeUniformPosition = webgl.getUniformLocation(
      this.program,
      'uDashSize',
    ) as WebGLUniformLocation
    this.totalSizeUniformPosition = webgl.getUniformLocation(
      this.program,
      'uTotalSize',
    ) as WebGLUniformLocation
  }

  vertexAttribPosition: number
  lengthAttribPosition: number
  colorUniformPosition: WebGLUniformLocation
  offsetUniformPosition: WebGLUniformLocation
  dashSizeUniformPosition: WebGLUniformLocation
  totalSizeUniformPosition: WebGLUniformLocation
}
