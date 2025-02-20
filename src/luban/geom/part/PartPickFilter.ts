import Edge from '@/luban/geom/part/Edge'
import Face from '@/luban/geom/part/Face'
import Plane from '@/luban/geom/part/Plane'
import Point from '@/luban/geom/part/Point'
import { Geometry } from '@painter/gl-canvas'
// import PickFilter from '@/luban/geom/pick/PickFilter'

export default class PartPickFilter {
  filter(geometries: (Geometry | null)[]): Geometry | null {
    for (const geometry of geometries) if (geometry instanceof Point) return geometry
    for (const geometry of geometries) if (geometry instanceof Edge) return geometry
    for (const geometry of geometries) if (geometry instanceof Face) return geometry
    for (const geometry of geometries) if (geometry instanceof Plane) return geometry
    return null
  }
}
