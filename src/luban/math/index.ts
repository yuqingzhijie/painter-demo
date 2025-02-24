type FaceData = { vertexes: number[]; normals: number[] }
type EdgeData = { vertexes: number[] }

import type { Vertex } from '@painter/gl-canvas'

function createCuboid(
  origin: Vertex,
  length: number,
  width: number,
  height: number,
): { faces: FaceData[]; edges: EdgeData[] } {
  // 计算八个顶点
  const { x, y, z } = origin
  const halfLength = length / 2
  const halfWidth = width / 2
  const halfHeight = height / 2
  const vertexes: [number, number, number][] = [
    [x - halfLength, y - halfHeight, z - halfWidth],
    [x + halfLength, y - halfHeight, z - halfWidth],
    [x + halfLength, y + halfHeight, z - halfWidth],
    [x - halfLength, y + halfHeight, z - halfWidth],
    [x - halfLength, y - halfHeight, z + halfWidth],
    [x + halfLength, y - halfHeight, z + halfWidth],
    [x + halfLength, y + halfHeight, z + halfWidth],
    [x - halfLength, y + halfHeight, z + halfWidth],
  ]

  // 定义六个面（法线方向遵循右手法则）
  const faces: FaceData[] = [
    // 前面
    {
      vertexes: [...vertexes[0], ...vertexes[1], ...vertexes[3], ...vertexes[2]],
      normals: Array(4).fill([0, 0, -1]).flat(),
    },
    // 背面
    {
      vertexes: [...vertexes[4], ...vertexes[5], ...vertexes[7], ...vertexes[6]],
      normals: Array(4).fill([0, 0, 1]).flat(),
    },
    // 左面
    {
      vertexes: [...vertexes[0], ...vertexes[3], ...vertexes[4], ...vertexes[7]],
      normals: Array(4).fill([-1, 0, 0]).flat(),
    },
    // 右面
    {
      vertexes: [...vertexes[1], ...vertexes[2], ...vertexes[5], ...vertexes[6]],
      normals: Array(4).fill([1, 0, 0]).flat(),
    },
    // 顶面
    {
      vertexes: [...vertexes[3], ...vertexes[2], ...vertexes[7], ...vertexes[6]],
      normals: Array(4).fill([0, 1, 0]).flat(),
    },
    // 底面
    {
      vertexes: [...vertexes[0], ...vertexes[1], ...vertexes[4], ...vertexes[5]],
      normals: Array(4).fill([0, -1, 0]).flat(),
    },
  ]

  // 定义12条边（避免重复）
  const edges: EdgeData[] = [
    { vertexes: [...vertexes[0], ...vertexes[1]] },
    { vertexes: [...vertexes[1], ...vertexes[2]] },
    { vertexes: [...vertexes[2], ...vertexes[3]] },
    { vertexes: [...vertexes[3], ...vertexes[0]] },
    { vertexes: [...vertexes[4], ...vertexes[5]] },
    { vertexes: [...vertexes[5], ...vertexes[6]] },
    { vertexes: [...vertexes[6], ...vertexes[7]] },
    { vertexes: [...vertexes[7], ...vertexes[4]] },
    { vertexes: [...vertexes[0], ...vertexes[4]] },
    { vertexes: [...vertexes[1], ...vertexes[5]] },
    { vertexes: [...vertexes[2], ...vertexes[6]] },
    { vertexes: [...vertexes[3], ...vertexes[7]] },
  ]

  return { faces, edges }
}

type SphereOptions = {
  widthSegments?: number
  heightSegments?: number
  heightRange?: [number, number]
  widthRange?: [number, number]
}
const defaultSphereOptions: SphereOptions = Object.freeze({
  widthSegments: 32,
  heightSegments: 16,
  widthRange: [0, Math.PI * 2] as [number, number],
  heightRange: [0, Math.PI] as [number, number],
})
// todo 法向有问题，暂时用sphere里的方法
function createSphere(origin: Vertex, radius: number, options?: SphereOptions) {
  const { x: cx, y: cy, z: cz } = origin
  const vertexes: number[] = []
  const normals: number[] = []
  const _options = Object.assign(options || {}, defaultSphereOptions) as Required<SphereOptions>
  const { widthSegments, heightSegments, widthRange, heightRange } = _options

  // 为每个顶点预先计算位置和法向量
  const positions: { x: number; y: number; z: number }[][] = []
  for (let i = 0; i <= heightSegments; i++) {
    const phi = (i * Math.PI) / heightSegments
    if (phi < heightRange[0] || phi > heightRange[1]) break
    const sinPhi = Math.sin(phi)
    const cosPhi = Math.cos(phi)
    positions[i] = []

    for (let j = 0; j <= widthSegments; j++) {
      const theta = (j * 2 * Math.PI) / widthSegments
      if (theta < widthRange[0] || theta > widthRange[1]) break
      const sinTheta = Math.sin(theta)
      const cosTheta = Math.cos(theta)

      const x = radius * sinPhi * cosTheta
      const y = radius * cosPhi
      const z = radius * sinPhi * sinTheta

      positions[i][j] = { x, y, z }
    }
  }
  console.log(positions[0].join('~'))

  // 生成三角形
  for (let i = 0; i < heightSegments; i++) {
    for (let j = 0; j < widthSegments; j++) {
      // 定义两个三角形形成一个四边形
      // 第一个三角形
      const v0 = positions[i][j]
      const v1 = positions[i + 1][j]
      const v2 = positions[i + 1][j + 1]

      // 第二个三角形
      const v3 = positions[i][j]
      const v4 = positions[i + 1][j + 1]
      const v5 = positions[i][j + 1]

      // 添加第一个三角形的顶点和法向量
      vertexes.push(cx + v0.x, cy + v0.y, cz + v0.z)
      vertexes.push(cx + v1.x, cy + v1.y, cz + v1.z)
      vertexes.push(cx + v2.x, cy + v2.y, cz + v2.z)

      // 计算法向量（对于球面，直接用归一化的顶点坐标）
      ;[v0, v1, v2].forEach((v) => {
        const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)
        normals.push(v.x / length, v.y / length, v.z / length)
      })

      // 添加第二个三角形的顶点和法向量
      vertexes.push(cx + v3.x, cy + v3.y, cz + v3.z)
      vertexes.push(cx + v4.x, cy + v4.y, cz + v4.z)
      vertexes.push(cx + v5.x, cy + v5.y, cz + v5.z)
      ;[v3, v4, v5].forEach((v) => {
        const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)
        normals.push(v.x / length, v.y / length, v.z / length)
      })
    }
  }

  return { vertexes, normals }
}

export { createCuboid, createSphere }
