import PointBuffer from '@/luban/canvas/buffer/PointBuffer'
import Color from '@/luban/canvas/Color'
import Context from '@/luban/canvas/Context'
import type Device from '@/luban/canvas/Device'
import type Container from '@/luban/geom/Container'
import Geometry3d from '@/luban/geom/part/Geometry3d'
import Vertex from '@/luban/geom/part/Vertex'

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
