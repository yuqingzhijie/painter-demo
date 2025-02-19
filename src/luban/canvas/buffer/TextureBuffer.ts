import type Texture from '@/luban/canvas/Texture'
import type VertexBuffer from '@/luban/canvas/VertexBuffer'

export default class TextureBuffer {
  constructor(texture: Texture, coordinate: VertexBuffer) {
    this.texture = texture
    this.coordinate = coordinate
  }
  texture: Texture
  coordinate: VertexBuffer
}
