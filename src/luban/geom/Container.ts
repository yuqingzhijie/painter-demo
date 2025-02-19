import type Pickable from '@/luban/canvas/Pickable'
import Geometry from '@/luban/geom/Geometry'

export default interface Container extends Pickable {
  geometries: Geometry[]
  picks: Geometry[]
}
