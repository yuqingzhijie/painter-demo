import { DICE_CONFIG } from '@/config/luban/dice'
import DiceFace from '@/luban/geom/dice/DiceFace'
import Point from '@/luban/geom/part/Point'
import type { Container, Device, Geometry, Matrix } from '@gl-painter/gl-canvas'
import { Context, Vertex } from '@gl-painter/gl-canvas'

// 最简单dice
export default class Dice implements Container {
  constructor(config = DICE_CONFIG) {
    const { id, width, list } = config
    this.initDiceFaces(id, width, list)
  }

  initDiceFaces(id: number, width: number, list: { text: string; matrix: Matrix }[]): void {
    const vertexes = [
      width,
      width,
      width,
      -width,
      width,
      width,
      width,
      -width,
      width,
      -width,
      -width,
      width,
    ]
    list.forEach(({ text, matrix }) => {
      const face = new DiceFace(this, id, vertexes, text, matrix)
      this.diceFaces.set(id, face)
      id--
    })
  }

  draw(device: Device, context: Context): void {
    for (const [, face] of this.diceFaces) face.draw(device, context)
  }

  pick(device: Device, context: Context): void {
    for (const [, face] of this.diceFaces) face.pick(device, context)
  }

  points: Point[] = []
  diceFaces: Map<number, DiceFace> = new Map()
  // !没用的，先这样吧
  geometries: Geometry[] = []
  picks: Geometry[] = []
  barycenter: Vertex = new Vertex(0, 0, 0)
}
