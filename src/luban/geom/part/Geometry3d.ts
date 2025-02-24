import type { Color, Container, Device } from '@painter/gl-canvas'
import { Context, Geometry } from '@painter/gl-canvas'

export type DrawOptions = {
  color?: Color
  opacity?: number
}

export default abstract class Geometry3d extends Geometry {
  constructor(container: Container, id: number) {
    super(container, id)
  }

  abstract draw(device: Device, context: Context): void
  abstract pick(device: Device, context: Context): void
}
