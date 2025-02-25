type FaceData = { vertexes: number[]; normals: number[] }
type EdgeData = { vertexes: number[] }

import type { Vertex } from '@painter/gl-canvas'

function createCuboid(
  origin: Vertex,
  length: number,
  width: number,
  height: number,
): { faces: FaceData[]; edges: EdgeData[] } {
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

  const faces: FaceData[] = [
    // 背面
    {
      vertexes: [
        ...vertexes[0],
        ...vertexes[3],
        ...vertexes[1],
        ...vertexes[3],
        ...vertexes[2],
        ...vertexes[1],
      ],
      normals: Array(6).fill([0, 0, -1]).flat(),
    },
    // 前面
    {
      vertexes: [
        ...vertexes[4],
        ...vertexes[5],
        ...vertexes[7],
        ...vertexes[7],
        ...vertexes[5],
        ...vertexes[6],
      ],
      normals: Array(6).fill([0, 0, 1]).flat(),
    },
    // 左面
    {
      vertexes: [
        ...vertexes[0],
        ...vertexes[4],
        ...vertexes[3],
        ...vertexes[4],
        ...vertexes[7],
        ...vertexes[3],
      ],
      normals: Array(6).fill([-1, 0, 0]).flat(),
    },
    // 右面
    {
      vertexes: [
        ...vertexes[1],
        ...vertexes[2],
        ...vertexes[5],
        ...vertexes[5],
        ...vertexes[2],
        ...vertexes[6],
      ],
      normals: Array(6).fill([1, 0, 0]).flat(),
    },
    // 顶面
    {
      vertexes: [
        ...vertexes[3],
        ...vertexes[7],
        ...vertexes[2],
        ...vertexes[7],
        ...vertexes[6],
        ...vertexes[2],
      ],
      normals: Array(6).fill([0, 1, 0]).flat(),
    },
    // 底面
    {
      vertexes: [
        ...vertexes[0],
        ...vertexes[1],
        ...vertexes[4],
        ...vertexes[4],
        ...vertexes[1],
        ...vertexes[5],
      ],
      normals: Array(6).fill([0, -1, 0]).flat(),
    },
  ]

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
  heightSegmentRange?: [number, number]
  widthSegmentRange?: [number, number]
}
const defaultSphereOptions: SphereOptions = Object.freeze({
  widthSegments: 32,
  heightSegments: 16,
  widthSegmentRange: [0, 32] as [number, number],
  heightSegmentRange: [0, 16] as [number, number],
})

function createSphere(origin: Vertex, radius: number, options?: SphereOptions) {
  const { x: cx, y: cy, z: cz } = origin
  const _options = Object.assign({}, defaultSphereOptions, options) as Required<SphereOptions>
  const { widthSegments, heightSegments, widthSegmentRange, heightSegmentRange } = _options

  // 为每个顶点预先计算位置和法向量
  const positions: [number, number, number][][] = []
  const positionNormals: [number, number, number][][] = []
  for (let i = 0; i <= heightSegments; i++) {
    const phi = (i * Math.PI) / heightSegments
    if (i < heightSegmentRange[0] || i > heightSegmentRange[1]) continue
    const sinPhi = Math.sin(phi)
    const cosPhi = Math.cos(phi)
    positions[i] = []
    positionNormals[i] = []

    for (let j = 0; j <= widthSegments; j++) {
      const theta = (j * 2 * Math.PI) / widthSegments
      if (j < widthSegmentRange[0] || j > widthSegmentRange[1]) continue
      if (j === widthSegments) {
        positions[i][j] = positions[i][0]
        positionNormals[i][j] = positionNormals[i][0]
        continue
      }
      const sinTheta = Math.sin(theta)
      const cosTheta = Math.cos(theta)

      const x = radius * sinPhi * cosTheta
      const y = radius * cosPhi
      const z = -radius * sinPhi * sinTheta

      positions[i][j] = [x, y, z]
      positionNormals[i][j] = [x / radius, y / radius, z / radius]
    }
  }

  // 生成三角片元
  const vertexes: number[] = []
  const normals: number[] = []
  for (let i = 0; i < heightSegments; i++) {
    if (i < heightSegmentRange[0] || i >= heightSegmentRange[1]) continue
    for (let j = 0; j < widthSegments; j++) {
      if (j < widthSegmentRange[0] || j >= widthSegmentRange[1]) continue
      const v0 = getPos(positions[i][j])
      const v1 = getPos(positions[i + 1][j])
      const v2 = getPos(positions[i + 1][j + 1])
      const v3 = getPos(positions[i][j + 1])

      function getPos(p: [number, number, number]) {
        return [p[0] + cx, p[1] + cy, p[2] + cz]
      }

      vertexes.push(...v0)
      normals.push(...positionNormals[i][j])
      vertexes.push(...v1)
      normals.push(...positionNormals[i + 1][j])
      vertexes.push(...v2)
      normals.push(...positionNormals[i + 1][j + 1])

      vertexes.push(...v0)
      normals.push(...positionNormals[i][j])
      vertexes.push(...v2)
      normals.push(...positionNormals[i + 1][j + 1])
      vertexes.push(...v3)
      normals.push(...positionNormals[i][j + 1])
    }
  }

  return { vertexes, normals }
}

type CylinderFaceOptions = {
  segments?: number
}
const defaultCylinderFaceOptions: CylinderFaceOptions = Object.freeze({
  segments: 32,
})

function createCylinderFace(
  baseCenter: Vertex,
  radius: number,
  height: number,
  options?: CylinderFaceOptions,
) {
  const _options = Object.assign(
    {},
    defaultCylinderFaceOptions,
    options,
  ) as Required<CylinderFaceOptions>
  const { segments } = _options
  const { x: cx, y: cy, z: cz } = baseCenter
  const topY = cy + height

  const baseVertexes: { x: number; z: number }[] = []
  const topVertexes: { x: number; z: number }[] = []
  const baseNormals: [number, number, number][] = []
  for (let i = 0; i <= segments; i++) {
    if (i === segments) {
      baseVertexes.push(baseVertexes[0])
      topVertexes.push(topVertexes[0])
      baseNormals.push(baseNormals[0])
      continue
    }
    const theta = (i * 2 * Math.PI) / segments
    const cosTheta = Math.cos(theta)
    const sinTheta = Math.sin(theta)
    const x = radius * cosTheta
    const z = radius * sinTheta
    baseVertexes.push({ x: cx + x, z: cz + z })
    topVertexes.push({ x: cx + x, z: cz + z })
    baseNormals.push([cosTheta, 0, sinTheta])
  }

  const vertexes: number[] = []
  const normals: number[] = []
  for (let i = 0; i < segments; i++) {
    const bottom1 = baseVertexes[i]
    const bottom2 = baseVertexes[i + 1]
    const top1 = topVertexes[i]
    const top2 = topVertexes[i + 1]

    vertexes.push(top1.x, topY, top1.z)
    vertexes.push(bottom1.x, cy, bottom1.z)
    vertexes.push(bottom2.x, cy, bottom2.z)

    vertexes.push(top1.x, topY, top1.z)
    vertexes.push(bottom2.x, cy, bottom2.z)
    vertexes.push(top2.x, topY, top2.z)

    normals.push(
      ...baseNormals[i],
      ...baseNormals[i],
      ...baseNormals[i + 1],
      ...baseNormals[i],
      ...baseNormals[i + 1],
      ...baseNormals[i + 1],
    )
  }

  return {
    vertexes,
    normals,
  }
}

export { createCuboid, createCylinderFace, createSphere }
