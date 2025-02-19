import { LineBufferType } from '@/luban/canvas/buffer/LineBufferType'
import type VertexBuffer from '@/luban/canvas/VertexBuffer'

export default class LineBuffer {
  constructor(vertexes: VertexBuffer, first: number, count: number, type = LineBufferType.Default) {
    this.vertexes = vertexes
    this.first = first
    this.count = count
    this.type = type
  }
  vertexes: VertexBuffer
  first: number
  count: number
  type: LineBufferType
}
