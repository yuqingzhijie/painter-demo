export default class WebglProgram {
  constructor(webgl: WebGLRenderingContext, vertSource: string, fragSource: string) {
    this.webgl = webgl

    const vertShader: WebGLShader = webgl.createShader(webgl.VERTEX_SHADER) as WebGLShader
    webgl.shaderSource(vertShader, vertSource)
    webgl.compileShader(vertShader)

    const fragShader: WebGLShader = webgl.createShader(webgl.FRAGMENT_SHADER) as WebGLShader
    webgl.shaderSource(fragShader, fragSource)
    webgl.compileShader(fragShader)

    const program: WebGLProgram = webgl.createProgram() as WebglProgram
    webgl.attachShader(program, vertShader)
    webgl.attachShader(program, fragShader)
    webgl.linkProgram(program)

    this.vertexMatrixUniformPosition = webgl.getUniformLocation(
      program,
      'uVertexMatrix',
    ) as WebGLUniformLocation

    this.program = program
  }

  webgl: WebGLRenderingContext
  program: WebGLProgram

  vertexMatrixUniformPosition: WebGLUniformLocation
}
