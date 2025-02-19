import LineBuffer from '@/luban/canvas/buffer/LineBuffer'
import { LineBufferType } from '@/luban/canvas/buffer/LineBufferType'
import type VertexBuffer from '@/luban/canvas/VertexBuffer'

export default class DashedLineBuffer extends LineBuffer {
  constructor(
    vertexes: VertexBuffer,
    lengths: VertexBuffer,
    first: number,
    count: number,
    total: number,
    dashed: number,
    type = LineBufferType.Default,
  ) {
    super(vertexes, first, count, type)
    this.lengths = lengths
    this.total = total
    this.dashed = dashed
  }
  lengths: VertexBuffer
  total: number
  dashed: number
}
