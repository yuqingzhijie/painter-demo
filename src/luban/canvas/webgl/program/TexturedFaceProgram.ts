import WebglProgram from '@/luban/canvas/webgl/WebglProgram'

export default class TexturedFaceProgram extends WebglProgram {
  static vertSource = `
    attribute vec3 aVertex;
    attribute vec2 aTextureCoord;
    attribute vec3 aNormal;

    uniform mat4 uVertexMatrix;
    uniform mat4 uNormalMatrix;
    
    varying highp vec3 vVertex;
    varying highp vec3 vNormal;
    varying highp vec2 vTextureCoord;
    
    void main() {
        vec4 vertex = uVertexMatrix * vec4(aVertex, 1.0);
        vVertex = vertex.xyz;
        vTextureCoord = aTextureCoord;
        vNormal = normalize( (uNormalMatrix * vec4(aNormal, 0.0)).xyz );
        
        gl_Position = vertex;
    }
    `
  static fragSource = `
    precision mediump float;
    
    uniform sampler2D uSampler;

    uniform vec4 uColor;
    uniform vec3 uAmbientLight;
    uniform vec3 uPointLightColor;
    uniform vec3 uPointLightLocation;
    
    varying highp vec3 vVertex;
    varying highp vec3 vNormal;
    varying highp vec2 vTextureCoord;
    
    void main() {
        highp vec4 color;
        if(vTextureCoord.x > 1.0 || vTextureCoord.x < 0.0 || vTextureCoord.y < 0.0 || vTextureCoord.y > 1.0) {
            color = uColor;
        } else {
            color = texture2D(uSampler, vTextureCoord);
        }

        vec3 normal = normalize(vNormal);
        vec3 direction = normalize(uPointLightLocation - vVertex);
        vec3 diffuse = uPointLightColor * color.rgb * max(dot(direction, normal), 0.0);
        vec3 ambient = uAmbientLight * color.rgb;

        gl_FragColor = vec4(diffuse + ambient, color.a);
    }
    `

  constructor(webgl: WebGLRenderingContext) {
    super(webgl, TexturedFaceProgram.vertSource, TexturedFaceProgram.fragSource)
    this.vertexAttribPosition = webgl.getAttribLocation(this.program, 'aVertex')
    this.normalAttribPosition = webgl.getAttribLocation(this.program, 'aNormal')
    this.textureCoordPosition = webgl.getAttribLocation(this.program, 'aTextureCoord')
    this.samplerUniformPosition = webgl.getUniformLocation(
      this.program,
      'uSampler',
    ) as WebGLUniformLocation
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
      'uAmbientLight',
    ) as WebGLUniformLocation
    this.pointColorUniformPosition = webgl.getUniformLocation(
      this.program,
      'uPointLightColor',
    ) as WebGLUniformLocation
    this.pointVectorUniformPosition = webgl.getUniformLocation(
      this.program,
      'uPointLightLocation',
    ) as WebGLUniformLocation
  }

  vertexAttribPosition: number
  normalAttribPosition: number

  normalMatrixUniformPosition: WebGLUniformLocation
  colorUniformPosition: WebGLUniformLocation
  ambientColorUniformPosition: WebGLUniformLocation
  pointVectorUniformPosition: WebGLUniformLocation
  pointColorUniformPosition: WebGLUniformLocation

  textureCoordPosition: number
  samplerUniformPosition: WebGLUniformLocation
}
