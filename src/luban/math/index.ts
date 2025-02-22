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
  const vertices: [number, number, number][] = [
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
      vertexes: [...vertices[0], ...vertices[1], ...vertices[3], ...vertices[2]],
      normals: Array(4).fill([0, 0, -1]).flat(),
    },
    // 背面
    {
      vertexes: [...vertices[4], ...vertices[5], ...vertices[7], ...vertices[6]],
      normals: Array(4).fill([0, 0, 1]).flat(),
    },
    // 左面
    {
      vertexes: [...vertices[0], ...vertices[3], ...vertices[4], ...vertices[7]],
      normals: Array(4).fill([-1, 0, 0]).flat(),
    },
    // 右面
    {
      vertexes: [...vertices[1], ...vertices[2], ...vertices[5], ...vertices[6]],
      normals: Array(4).fill([1, 0, 0]).flat(),
    },
    // 顶面
    {
      vertexes: [...vertices[3], ...vertices[2], ...vertices[7], ...vertices[6]],
      normals: Array(4).fill([0, 1, 0]).flat(),
    },
    // 底面
    {
      vertexes: [...vertices[0], ...vertices[1], ...vertices[4], ...vertices[5]],
      normals: Array(4).fill([0, -1, 0]).flat(),
    },
  ]

  // 定义12条边（避免重复）
  const edges: EdgeData[] = [
    { vertexes: [...vertices[0], ...vertices[1]] },
    { vertexes: [...vertices[1], ...vertices[2]] },
    { vertexes: [...vertices[2], ...vertices[3]] },
    { vertexes: [...vertices[3], ...vertices[0]] },
    { vertexes: [...vertices[4], ...vertices[5]] },
    { vertexes: [...vertices[5], ...vertices[6]] },
    { vertexes: [...vertices[6], ...vertices[7]] },
    { vertexes: [...vertices[7], ...vertices[4]] },
    { vertexes: [...vertices[0], ...vertices[4]] },
    { vertexes: [...vertices[1], ...vertices[5]] },
    { vertexes: [...vertices[2], ...vertices[6]] },
    { vertexes: [...vertices[3], ...vertices[7]] },
  ]

  return { faces, edges }
}

export { createCuboid }
