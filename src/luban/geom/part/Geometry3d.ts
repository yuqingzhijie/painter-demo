import Context from '@/luban/canvas/Context'
import type Device from '@/luban/canvas/Device'
import type Container from '@/luban/geom/Container'
import Geometry from '@/luban/geom/Geometry'

export default abstract class Geometry3d extends Geometry {
  constructor(container: Container, id: number) {
    super(container, id)
  }

  abstract draw(device: Device, context: Context): void
  abstract pick(device: Device, context: Context): void
}
