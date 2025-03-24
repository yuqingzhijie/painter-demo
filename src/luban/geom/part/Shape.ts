import Edge from '@/luban/geom/part/Edge'
import Face from '@/luban/geom/part/Face'
import Geometry3d from '@/luban/geom/part/Geometry3d'
import Point from '@/luban/geom/part/Point'
import type { Container, Device } from '@gl-painter/gl-canvas'
import { Context, Vertex } from '@gl-painter/gl-canvas'

export default class Shape extends Geometry3d {
  constructor(container: Container, id: number) {
    super(container, id)
    this.barycenter = new Vertex(0, 0, 0)
    this.quality = 10000
    this.volume = 10000
  }

  draw(device: Device, context: Context): void {
    for (const [, face] of this.faces) face.draw(device, context)
    for (const [, edge] of this.edges) edge.draw(device, context)
    for (const point of this.points) point.draw(device, context)
  }

  pick(device: Device, context: Context): void {
    for (const [, face] of this.faces) face.pick(device, context)
    for (const [, edge] of this.edges) edge.pick(device, context)
    for (const point of this.points) point.pick(device, context)
  }

  points: Point[] = []
  faces: Map<number, Face> = new Map()
  edges: Map<number, Edge> = new Map()

  barycenter: Vertex
  quality: number
  volume: number
}
