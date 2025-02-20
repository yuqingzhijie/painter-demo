import Face from '@/luban/geom/part/Face'
import Geometry3d from '@/luban/geom/part/Geometry3d'
import Shape from '@/luban/geom/part/Shape'
import type { Container, Device } from '@painter/gl-canvas'
import {
  Color,
  Context,
  DashedLineBuffer,
  LineBuffer,
  LineBufferType,
  Vector,
} from '@painter/gl-canvas'

// [totalLength  dashLength] pixels
const defaultDashOption = [20, 5]

export default class Edge extends Geometry3d {
  constructor(
    container: Container,
    id: number,
    shape: Shape,
    vertexes: number[],
    color: Color,
    dashed?: number[] | true,
  ) {
    super(container, id)
    this.shape = shape
    this.vertexes = vertexes
    this.color = color
    if (dashed) {
      this.dashConfig = dashed === true ? defaultDashOption : dashed
    }
  }

  private createBuffer4NormalLine(device: Device) {
    this.buffer = new LineBuffer(
      device.createVertexBuffer(this.vertexes),
      0,
      this.vertexes.length / 3,
      LineBufferType.Strip,
    )
  }

  private createBuffer4DashedLine(device: Device) {
    const lengths = [0]
    const v0 = new Vector()
    const v1 = new Vector()
    let distance = 0
    const positions = this.vertexes
    const vertextCount = positions.length / 3
    for (let i = 1; i < vertextCount; i++) {
      v0.x = positions[(i - 1) * 3]
      v0.y = positions[(i - 1) * 3 + 1]
      v0.z = positions[(i - 1) * 3 + 2]

      v1.x = positions[i * 3]
      v1.y = positions[i * 3 + 1]
      v1.z = positions[i * 3 + 2]

      distance = Math.hypot(v0.x - v1.x, v0.y - v1.y, v0.z - v1.z) // todo Vector.prototype.distanceTo

      lengths.push(distance + lengths[i - 1])
    }

    const [totalLength, dashLength] = this.dashConfig as number[]

    this.buffer = new DashedLineBuffer(
      device.createVertexBuffer(this.vertexes),
      device.createVertexBuffer(lengths),
      0,
      vertextCount,
      totalLength,
      dashLength,
      LineBufferType.Strip,
    )
  }

  get picked(): boolean {
    for (const neighbor of this.neighbors) if (neighbor.picked) return true
    return super.picked
  }

  set picked(flag: boolean) {
    super.picked = flag
  }

  createBuffer(device: Device): void {
    if (this.buffer !== undefined) return

    if (this.dashConfig === undefined) this.createBuffer4NormalLine(device)
    else this.createBuffer4DashedLine(device)
  }

  draw(device: Device, context: Context): void {
    this.createBuffer(device)
    device.drawLine(
      context,
      this.buffer as LineBuffer,
      this.picked ? Color.PICKED_EDGE_COLOR : this.color,
    )
  }

  pick(device: Device, context: Context): void {
    this.createBuffer(device)
    device.pickLine(context, this.buffer as LineBuffer, this.id)
  }

  hover(device: Device, context: Context): void {
    this.createBuffer(device)
    device.disableDepth()
    device.drawLine(context, this.buffer as LineBuffer, Color.HOVER_COLOR)
    device.enableDepth()
  }

  shape: Shape
  neighbors: Face[] = []

  vertexes: number[]
  dashConfig?: number[]
  buffer?: LineBuffer
  color: Color
}
