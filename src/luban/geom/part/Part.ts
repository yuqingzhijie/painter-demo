import { RenderModeEnum } from '@/config/luban'
import type Edge from '@/luban/geom/part/Edge'
import type Face from '@/luban/geom/part/Face'
import Plane from '@/luban/geom/part/Plane'
import Point from '@/luban/geom/part/Point'
import Shape from '@/luban/geom/part/Shape'
import { useOptionsStore } from '@/stores/options'
import type { Container, Device } from '@gl-painter/gl-canvas'
import { Color, Context, Geometry, Vertex } from '@gl-painter/gl-canvas'

export default class Part implements Container {
  draw(device: Device, context: Context): void {
    const faces = this.shapes.reduce((res: Face[], cur: Shape) => {
      return [...res, ...cur.faces.values()]
    }, [])
    const edges = this.shapes.reduce((res: Edge[], cur: Shape) => {
      return [...res, ...cur.edges.values()]
    }, [])
    const renderMode = useOptionsStore().renderMode
    switch (renderMode) {
      case RenderModeEnum.Shaded:
        faces.forEach((face) => {
          face.draw(device, context)
        })
        edges.forEach((edge) => {
          edge.draw(device, context)
        })
        break
      case RenderModeEnum.ShadedWithoutEdges:
        faces.forEach((face) => {
          face.draw(device, context)
        })
        break
      case RenderModeEnum.Unshaded:
        faces.forEach((face) => {
          face.draw(device, context, { color: Color.WHITE })
        })
        edges.forEach((edge) => {
          edge.draw(device, context)
        })
        break
      case RenderModeEnum.UnshadedWithHiddenEdges:
        faces.forEach((face) => {
          face.draw(device, context, { color: Color.WHITE })
        })
        device.disableDepth()
        edges.forEach((edge) => {
          edge.draw(device, context, { color: Color.LIGHT_GRAY })
        })
        device.enableDepth()
        edges.forEach((edge) => {
          edge.draw(device, context)
        })
        break
      case RenderModeEnum.Wireframe:
        edges.forEach((edge) => {
          edge.draw(device, context, { color: Color.WIREFRAME_EDGE_COLOR })
        })
        break
      case RenderModeEnum.Translucent:
        device.depthMask(false)
        device.cullFrontFace()
        faces.forEach((face) => {
          face.draw(device, context, { opacity: face.picked ? 0.4 : 0.2 })
        })
        device.cullBackFace()
        faces.forEach((face) => {
          face.draw(device, context, { opacity: face.picked ? 0.4 : 0.2 })
        })
        device.disableCullFace()
        device.depthMask(true)
        edges.forEach((edge) => {
          edge.draw(device, context)
        })
        break
      default:
        break
    }
    // for (const shape of this.shapes) shape.draw(device, context)
    for (const point of this.points) point.draw(device, context)

    device.depthMask(false)
    for (const plane of this.planes) plane.draw(device, context)
    device.depthMask(true)
  }

  pick(device: Device, context: Context): void {
    for (const plane of this.planes) plane.pick(device, context)
    device.clearDepth()
    for (const shape of this.shapes) shape.pick(device, context)
    device.disableDepth()
    for (const point of this.points) point.pick(device, context)
    device.enableDepth()
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
