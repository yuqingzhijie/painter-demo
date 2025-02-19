import type Texture from '@/luban/canvas/Texture'

const startIndex = WebGL2RenderingContext.prototype.TEXTURE0
let textureIndex = startIndex

export default class WebglTexture implements Texture {
  constructor(webgl: WebGLRenderingContext, texture: WebGLTexture) {
    this.webgl = webgl
    this.texture = texture
    this.width = 0
    this.height = 0
    this.number = textureIndex++
  }

  webgl: WebGLRenderingContext
  texture: WebGLTexture
  number: number
  width: number
  height: number

  static StartIndex: number = startIndex
}
