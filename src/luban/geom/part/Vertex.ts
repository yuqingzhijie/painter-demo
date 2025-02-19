import Matrix from '@/luban/math/Matrix'
import Vector from '@/luban/math/Vector'

export default class Vertex {
  constructor(x = 0.0, y = 0.0, z = 0.0) {
    this.x = x
    this.y = y
    this.z = z
  }

  transform(mat: Matrix): Vertex {
    const m = mat.array
    const v0 = this.x
    const v1 = this.y
    const v2 = this.z
    const d = v0 * m[0 * 4 + 3] + v1 * m[1 * 4 + 3] + v2 * m[2 * 4 + 3] + m[3 * 4 + 3]

    const d0 = (v0 * m[0] + v1 * m[4] + v2 * m[8] + m[12]) / d
    const d1 = (v0 * m[1] + v1 * m[5] + v2 * m[9] + m[13]) / d
    const d2 = (v0 * m[2] + v1 * m[6] + v2 * m[10] + m[14]) / d
    return new Vertex(d0, d1, d2)
  }

  to(v: Vertex): Vector {
    return new Vector(v.x - this.x, v.y - this.y, v.z - this.z)
  }

  get xyz(): [number, number, number] {
    return [this.x, this.y, this.z]
  }

  readonly x: number
  readonly y: number
  readonly z: number

  static readonly ORIGIN: Vertex = new Vertex(0.0, 0.0, 0.0)
}
