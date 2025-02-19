import WebglProgram from '@/luban/canvas/webgl/WebglProgram'

export default class Face2DProgram extends WebglProgram {
  static vertSource = `
      uniform mat4 uVertexMatrix;
      attribute vec2 aVertex;
  
      void main(){
          gl_Position = vec4(aVertex, 1.0, 1.0);
      }
      `
  static fragSource = `
      precision mediump float;
  
      uniform vec4 uColor;
      
      void main(){
          gl_FragColor = uColor;
      }
      `

  constructor(webgl: WebGLRenderingContext) {
    super(webgl, Face2DProgram.vertSource, Face2DProgram.fragSource)
    this.vertexAttribPosition = webgl.getAttribLocation(this.program, 'aVertex')
    this.colorUniformPosition = webgl.getUniformLocation(
      this.program,
      'uColor',
    ) as WebGLUniformLocation
  }

  vertexAttribPosition: number
  colorUniformPosition: WebGLUniformLocation
}
