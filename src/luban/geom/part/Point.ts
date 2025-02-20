import Geometry3d from '@/luban/geom/part/Geometry3d'
import type { Container, Device } from '@painter/gl-canvas'
import { Color, Context, PointBuffer, Vertex } from '@painter/gl-canvas'

export default class Point extends Geometry3d {
  constructor(container: Container, id: number, vertexes: number[], color: Color) {
    super(container, id)
    this.vertexes = vertexes
    this.vertex = new Vertex(...vertexes)
    this.color = color
  }

  createBuffer(device: Device): void {
    if (this.buffer === undefined) {
      this.buffer = new PointBuffer(device.createVertexBuffer(this.vertexes), 0, 1)
    }
  }

  draw(device: Device, context: Context): void {
    this.createBuffer(device)
    device.drawPoint(context, this.buffer as PointBuffer, this.color)
  }

  pick(device: Device, context: Context): void {
    this.createBuffer(device)
    device.pickPoint(context, this.buffer as PointBuffer, this.id)
  }

  vertexes: number[]
  vertex: Vertex
  buffer?: PointBuffer
  color: Color
}
