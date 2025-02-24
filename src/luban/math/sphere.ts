export default class SphereGeometry {
  public vertices: number[] = []
  public normals: number[] = []
  public indices: number[] = [] // 新增索引数组

  constructor(
    private center: { x: number; y: number; z: number },
    private radius: number,
    private widthSegments: number = 32,
    private heightSegments: number = 16,
  ) {
    this.generateSphere()
  }

  private generateSphere(): void {
    const { x: cx, y: cy, z: cz } = this.center
    const vertices: number[] = []
    const normals: number[] = []
    const indices: number[] = []

    // 生成顶点数据
    for (let y = 0; y <= this.heightSegments; y++) {
      const phi = (y * Math.PI) / this.heightSegments
      const sinPhi = Math.sin(phi)
      const cosPhi = Math.cos(phi)

      for (let x = 0; x <= this.widthSegments; x++) {
        // 注意这里保持widthSegments+1个顶点
        const theta = (x * 2 * Math.PI) / this.widthSegments
        const sinTheta = Math.sin(theta)
        const cosTheta = Math.cos(theta)

        // 顶点坐标
        const px = this.radius * sinPhi * cosTheta
        const py = this.radius * cosPhi
        const pz = this.radius * sinPhi * sinTheta

        vertices.push(cx + px, cy + py, cz + pz)
        normals.push(px / this.radius, py / this.radius, pz / this.radius)
      }
    }

    // 生成索引数据（关键修复）
    for (let y = 0; y < this.heightSegments; y++) {
      for (let x = 0; x < this.widthSegments; x++) {
        const a = y * (this.widthSegments + 1) + x
        const b = a + this.widthSegments + 1
        indices.push(a, b, a + 1)
        indices.push(b, b + 1, a + 1)
      }
    }

    this.vertices = vertices
    this.normals = normals
    this.indices = indices
  }
}
