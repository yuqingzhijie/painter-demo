import WebglProgram from '@/luban/canvas/webgl/WebglProgram'

export default class DynamicLineProgram extends WebglProgram {
  static vertSource = `
     uniform mat4 uVertexMatrix;
     uniform vec2 uOffset;
 
     attribute vec2 aVertex;
 
     void main(){
         vec4 position = vec4(aVertex, 1.0, 1.0);
         position.x += uOffset.x;
         position.y += uOffset.y;
         gl_Position = position;
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
    super(webgl, DynamicLineProgram.vertSource, DynamicLineProgram.fragSource)
    this.vertexAttribPosition = webgl.getAttribLocation(this.program, 'aVertex')
    this.offsetUniformPosition = webgl.getUniformLocation(
      this.program,
      'uOffset',
    ) as WebGLUniformLocation
    this.colorUniformPosition = webgl.getUniformLocation(
      this.program,
      'uColor',
    ) as WebGLUniformLocation
  }

  vertexAttribPosition: number
  offsetUniformPosition: WebGLUniformLocation
  colorUniformPosition: WebGLUniformLocation
}
