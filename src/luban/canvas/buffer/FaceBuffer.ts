import { FaceBufferType } from '@/luban/canvas/buffer/FaceBufferType'
import type IndexBuffer from '@/luban/canvas/IndexBuffer'
import type VertexBuffer from '@/luban/canvas/VertexBuffer'

export default class FaceBuffer {
  constructor(
    data: {
      vertexes: VertexBuffer
      normals: VertexBuffer
      indexes?: IndexBuffer
    },
    first: number,
    count: number,
    type = FaceBufferType.Strip, //todo => FaceBufferType.Default
  ) {
    this.vertexes = data.vertexes
    this.normals = data.normals
    this.indexes = data.indexes
    this.first = first
    this.count = count
    this.type = type
  }
  vertexes: VertexBuffer
  normals: VertexBuffer
  indexes?: IndexBuffer
  first: number
  count: number
  type: FaceBufferType
}
