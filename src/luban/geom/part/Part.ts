import Context from '@/luban/canvas/Context'
import type Device from '@/luban/canvas/Device'
import type Container from '@/luban/geom/Container'
import Geometry from '@/luban/geom/Geometry'
import Plane from '@/luban/geom/part/Plane'
import Point from '@/luban/geom/part/Point'
import Shape from '@/luban/geom/part/Shape'
import Vertex from '@/luban/geom/part/Vertex'
// import Sketch from '@/luban/geom/sketch/Sketch';

export default class Part implements Container {
  draw(device: Device, context: Context): void {
    for (const shape of this.shapes) shape.draw(device, context)
    // for (const sketch of this.sketches) sketch.draw(device, context);
    for (const point of this.points) point.draw(device, context)

    device.depthMask(false)
    for (const plane of this.planes) plane.draw(device, context)
    device.depthMask(true)
  }

  pick(device: Device, context: Context): void {
    for (const plane of this.planes) plane.pick(device, context)
    device.clearDepth()
    for (const shape of this.shapes) shape.pick(device, context)
    // for (const sketch of this.sketches) sketch.pick(device, context);
  }

  addShape(shape: Shape): void {
    this.shapes.push(shape)
    this.geometries[shape.id] = shape
    this.updateBarycenter(shape)
    for (const point of shape.points) this.geometries[point.id] = point
    for (const [, edge] of shape.edges) this.geometries[edge.id] = edge
    for (const [, face] of shape.faces) this.geometries[face.id] = face
  }

  // addSketch(sketch: Sketch): void {
  //     this.sketches.push(sketch);
  //     this.geometries[sketch.id] = sketch;
  //     for (const geometry of sketch.geometries) this.geometries[geometry.id] = geometry;
  // }

  addPlane(plane: Plane): void {
    this.planes.push(plane)
    this.geometries[plane.id] = plane
  }

  addPoint(point: Point): void {
    this.points.push(point)
    this.geometries[point.id] = point
  }

  private shapes: Shape[] = []
  // private sketches: Sketch[] = [];
  private planes: Plane[] = []
  private points: Point[] = []

  geometries: Geometry[] = []
  picks: Geometry[] = []

  barycenter: Vertex = Vertex.ORIGIN
  quality = 0

  private updateBarycenter(shape: Shape) {
    const quality = shape.quality === 0 ? 1 : shape.quality
    this.quality += quality
    const newWeights = shape.quality / this.quality
    const oldWeights = (this.quality - shape.quality) / this.quality
    this.barycenter = new Vertex(
      this.barycenter.x * oldWeights + shape.barycenter.x * newWeights,
      this.barycenter.y * oldWeights + shape.barycenter.y * newWeights,
      this.barycenter.z * oldWeights + shape.barycenter.z * newWeights,
    )
  }
}
