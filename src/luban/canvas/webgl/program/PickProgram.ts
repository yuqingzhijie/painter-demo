import WebglProgram from '@/luban/canvas/webgl/WebglProgram'

export default class PickProgram extends WebglProgram {
  static vertSource = `
    uniform mat4 uVertexMatrix;

    attribute vec3 aVertex;
    
    void main() {
        gl_Position = uVertexMatrix * vec4(aVertex, 1.0);
        gl_PointSize = 3.0;
    }
    `
  static fragSource = `
    precision mediump float;
    
    uniform vec4 uColor;
    
    void main() {
        gl_FragColor = uColor;
    }
    `

  constructor(webgl: WebGLRenderingContext) {
    super(webgl, PickProgram.vertSource, PickProgram.fragSource)
    this.vertexAttribPosition = webgl.getAttribLocation(this.program, 'aVertex')
    this.colorUniformPosition = webgl.getUniformLocation(
      this.program,
      'uColor',
    ) as WebGLUniformLocation
  }

  vertexAttribPosition: number
  colorUniformPosition: WebGLUniformLocation
}
