import WebglProgram from '@/luban/canvas/webgl/WebglProgram'

export default class ColoredFaceProgram extends WebglProgram {
  static vertSource = `
    uniform mat4 uVertexMatrix;
    uniform mat4 uNormalMatrix;
    
    attribute vec3 aVertex;
    attribute vec3 aNormal;

    varying vec3 vVertex;
    varying vec3 vNormal;

    void main() {
        vec4 vertex = uVertexMatrix * vec4(aVertex, 1.0);
        vec4 normal = uNormalMatrix * vec4(aNormal, 0.0);
        vVertex = vertex.xyz;
        vNormal = normalize(normal.xyz);
        gl_Position = vertex;
    }
    `
  static fragSource = `
    precision mediump float;
    
    uniform vec4 uColor;
    uniform vec3 uAmbientLightColor;
    uniform vec3 uPointLightVertex;
    uniform vec3 uPointLightColor;
    
    varying vec3 vVertex;
    varying vec3 vNormal;

    void main() {
        vec3 normal = normalize(vNormal);
        vec3 direction = normalize(uPointLightVertex - vVertex);
        vec3 diffuse = uPointLightColor * uColor.rgb * max(dot(direction, normal), 0.0);
        vec3 ambient = uAmbientLightColor * uColor.rgb;

        // vec3 point = normalize(vVertex.xyz);
        if (dot(vVertex.xyz, vec3(0, 0, 1.0)) > -0.005) {
            gl_FragColor = vec4(diffuse + ambient, uColor.a);
        } else {
            discard;
        }
    }
    `

  constructor(webgl: WebGLRenderingContext) {
    super(webgl, ColoredFaceProgram.vertSource, ColoredFaceProgram.fragSource)
    this.vertexAttribPosition = webgl.getAttribLocation(this.program, 'aVertex')
    this.normalAttribPosition = webgl.getAttribLocation(this.program, 'aNormal')

    this.normalMatrixUniformPosition = webgl.getUniformLocation(
      this.program,
      'uNormalMatrix',
    ) as WebGLUniformLocation
    this.colorUniformPosition = webgl.getUniformLocation(
      this.program,
      'uColor',
    ) as WebGLUniformLocation
    this.ambientColorUniformPosition = webgl.getUniformLocation(
      this.program,
      'uAmbientLightColor',
    ) as WebGLUniformLocation
    this.pointVectorUniformPosition = webgl.getUniformLocation(
      this.program,
      'uPointLightVertex',
    ) as WebGLUniformLocation
    this.pointColorUniformPosition = webgl.getUniformLocation(
      this.program,
      'uPointLightColor',
    ) as WebGLUniformLocation
  }

  vertexAttribPosition: number
  normalAttribPosition: number

  normalMatrixUniformPosition: WebGLUniformLocation
  colorUniformPosition: WebGLUniformLocation
  ambientColorUniformPosition: WebGLUniformLocation
  pointVectorUniformPosition: WebGLUniformLocation
  pointColorUniformPosition: WebGLUniformLocation
}
