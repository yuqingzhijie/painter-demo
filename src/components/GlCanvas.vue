<!-- 
  Copyright(c) 2021, ZWSOFT Co., LTD. (Guangzhou)ALL Rights Reserved.
-->

<script setup lang="ts">
/**
 * 初始化默认几何单元
 * 控制球
 * 鼠标控制
 */

import Canvas from '@/luban/canvas/Canvas'
import Color from '@/luban/canvas/Color'
import Context from '@/luban/canvas/Context'
import Edge from '@/luban/geom/part/Edge'
import Face from '@/luban/geom/part/Face'
import Part from '@/luban/geom/part/Part'
import Plane from '@/luban/geom/part/Plane'
import Point from '@/luban/geom/part/Point'
import Shape from '@/luban/geom/part/Shape'
import Vertex from '@/luban/geom/part/Vertex'
import PickEventHandler from '@/luban/geom/pick/PickEventHandler'
import Matrix from '@/luban/math/Matrix'
import Vector from '@/luban/math/Vector'
import { useCanvasStore } from '@/stores/canvas'
import { throttle } from '@/utils'
import { onMounted, ref, unref, type Ref } from 'vue'

const initDatumPlanes = (part: Part): Plane[] => {
  return [
    new Plane(part, 100, '21.5, 67.298°', Matrix.IDENTITY),
    new Plane(part, 101, 'Left', Matrix.IDENTITY.rotate(Vector.Y_AXIS, -Math.PI / 2)),
    new Plane(part, 102, 'Top', Matrix.IDENTITY.rotate(Vector.X_AXIS, -Math.PI / 2)),
  ]
}

const initCube = (part: Part): Shape => {
  const v = [
    [-100, -100, 100],
    [100, -100, 100],
    [100, 100, 100],
    [-100, 100, 100],
    [-100, -100, -100],
    [100, -100, -100],
    [100, 100, -100],
    [-100, 100, -100],
  ] as number[][]
  const shape = new Shape(part, 0)
  shape.points.push(new Point(part, 1, [0, 0, 0], Color.POINT_COLOR))
  shape.faces.set(
    2,
    new Face(
      part,
      2,
      shape,
      {
        vertexes: [...v[0], ...v[1], ...v[2], ...v[3]],
        normals: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
        indexes: [0, 1, 2, 0, 2, 3],
      },
      Color.FACE_COLOR,
    ),
  ) //front
  shape.faces.set(
    3,
    new Face(
      part,
      3,
      shape,
      {
        vertexes: v[4].concat(v[5]).concat(v[7]).concat(v[6]),
        normals: [0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1],
      },
      Color.FACE_COLOR,
    ),
  ) //back
  shape.faces.set(
    4,
    new Face(
      part,
      4,
      shape,
      {
        vertexes: v[0].concat(v[3]).concat(v[4]).concat(v[7]),
        normals: [-1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0],
      },
      Color.FACE_COLOR,
    ),
  ) //left
  shape.faces.set(
    5,
    new Face(
      part,
      5,
      shape,
      {
        vertexes: v[1].concat(v[2]).concat(v[5]).concat(v[6]),
        normals: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0],
      },
      Color.FACE_COLOR,
    ),
  ) //right
  shape.faces.set(
    6,
    new Face(
      part,
      6,
      shape,
      {
        vertexes: v[2].concat(v[3]).concat(v[6]).concat(v[7]),
        normals: [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
      },
      Color.FACE_COLOR,
    ),
  ) //top
  shape.faces.set(
    7,
    new Face(
      part,
      7,
      shape,
      {
        vertexes: v[1].concat(v[0]).concat(v[5]).concat(v[4]),
        normals: [0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0],
      },
      Color.FACE_COLOR,
    ),
  ) //bottom
  shape.edges.set(8, new Edge(part, 8, shape, v[0].concat(v[1]), Color.EDGE_COLOR))
  shape.edges.set(9, new Edge(part, 9, shape, v[1].concat(v[2]), Color.EDGE_COLOR))
  shape.edges.set(10, new Edge(part, 10, shape, v[2].concat(v[3]), Color.EDGE_COLOR))
  shape.edges.set(11, new Edge(part, 11, shape, v[3].concat(v[0]), Color.EDGE_COLOR))
  shape.edges.set(12, new Edge(part, 12, shape, v[4].concat(v[5]), Color.EDGE_COLOR))
  shape.edges.set(13, new Edge(part, 13, shape, v[5].concat(v[6]), Color.EDGE_COLOR))
  shape.edges.set(14, new Edge(part, 14, shape, v[6].concat(v[7]), Color.EDGE_COLOR))
  shape.edges.set(15, new Edge(part, 15, shape, v[7].concat(v[4]), Color.EDGE_COLOR))
  shape.edges.set(16, new Edge(part, 16, shape, v[0].concat(v[4]), Color.EDGE_COLOR))
  shape.edges.set(17, new Edge(part, 17, shape, v[1].concat(v[5]), Color.EDGE_COLOR))
  shape.edges.set(18, new Edge(part, 18, shape, v[2].concat(v[6]), Color.EDGE_COLOR))
  shape.edges.set(19, new Edge(part, 19, shape, v[3].concat(v[7]), Color.EDGE_COLOR))

  shape.faces.get(0)?.borders.push(shape.edges.get(0) as Edge)
  shape.faces.get(0)?.borders.push(shape.edges.get(1) as Edge)
  shape.faces.get(0)?.borders.push(shape.edges.get(2) as Edge)
  shape.faces.get(0)?.borders.push(shape.edges.get(3) as Edge)
  shape.faces.get(1)?.borders.push(shape.edges.get(4) as Edge)
  shape.faces.get(1)?.borders.push(shape.edges.get(5) as Edge)
  shape.faces.get(1)?.borders.push(shape.edges.get(6) as Edge)
  shape.faces.get(1)?.borders.push(shape.edges.get(7) as Edge)
  shape.faces.get(2)?.borders.push(shape.edges.get(3) as Edge)
  shape.faces.get(2)?.borders.push(shape.edges.get(7) as Edge)
  shape.faces.get(2)?.borders.push(shape.edges.get(8) as Edge)
  shape.faces.get(2)?.borders.push(shape.edges.get(11) as Edge)
  shape.faces.get(3)?.borders.push(shape.edges.get(1) as Edge)
  shape.faces.get(3)?.borders.push(shape.edges.get(5) as Edge)
  shape.faces.get(3)?.borders.push(shape.edges.get(9) as Edge)
  shape.faces.get(3)?.borders.push(shape.edges.get(10) as Edge)
  shape.faces.get(4)?.borders.push(shape.edges.get(2) as Edge)
  shape.faces.get(4)?.borders.push(shape.edges.get(6) as Edge)
  shape.faces.get(4)?.borders.push(shape.edges.get(10) as Edge)
  shape.faces.get(4)?.borders.push(shape.edges.get(11) as Edge)
  shape.faces.get(5)?.borders.push(shape.edges.get(0) as Edge)
  shape.faces.get(5)?.borders.push(shape.edges.get(4) as Edge)
  shape.faces.get(5)?.borders.push(shape.edges.get(8) as Edge)
  shape.faces.get(5)?.borders.push(shape.edges.get(9) as Edge)

  shape.barycenter = new Vertex(0, 0, 0)
  return shape
}

const initCanvas = (root: Part, dom: HTMLCanvasElement) => {
  const canvas = new Canvas(dom)
  canvas.root = root
  canvas.eventHandler.next = new PickEventHandler(canvas)

  canvas.resize(window.innerWidth, window.innerHeight - 36)
  window.addEventListener(
    'resize',
    throttle(() => {
      canvas.resize(window.innerWidth, window.innerHeight - 36)
    }, 150),
  )

  return canvas
}

function perspectAnimate(context: Context, canvas: Canvas): void {
  const oldViewMatrix = context.viewMatrix
  const angle = oldViewMatrix.getAngle()
  const translation = oldViewMatrix.getTranslation()
  const oldCameraSize = context.orthoUnits

  const STEP_TOTAL = 50
  let currentStep = STEP_TOTAL - 1
  function step() {
    const stepValue = currentStep / STEP_TOTAL
    const translationMatrix = Matrix.IDENTITY.translate(
      new Vector(
        translation[0] * stepValue,
        translation[1] * stepValue,
        translation[2] * stepValue,
      ),
    )
    const rotateMatrix = Matrix.IDENTITY.rotate(Vector.X_AXIS, angle[0] * stepValue)
      .rotate(Vector.Y_AXIS, angle[1] * stepValue)
      .rotate(Vector.Z_AXIS, angle[2] * stepValue)

    context.viewMatrix = translationMatrix.multiply(rotateMatrix)
    context.orthoUnits =
      Context.INIT_ORTHO_UNIT - (Context.INIT_ORTHO_UNIT - oldCameraSize) * stepValue
    canvas.draw()

    currentStep--
    if (currentStep >= 0) {
      requestAnimationFrame(step)
    }
  }
  step()
}

const enterSketch = (canvas: Canvas): void => {
  // 1. auto select xy datum
  // 2. change v&p matrix to make sure user see the sketch right
  // 3. draw a rectangle in the sketch
  // const part = canvas.root as Part;
  // const xyPlane = Part.getPlanes()[2]; // todo
  // part.addSketch(drawSketch(part, 20, xyPlane));
  perspectAnimate(canvas.context, canvas)
}

const canvasRef = ref() as Ref<HTMLCanvasElement>

onMounted(function init() {
  const canvasDom = unref(canvasRef)
  if (canvasDom instanceof HTMLCanvasElement) {
    const part = new Part()
    part.addShape(initCube(part))
    const planes = initDatumPlanes(part)
    planes.forEach((plane) => part.addPlane(plane))

    const canvas = initCanvas(part, canvasDom)
    const canvasStore = useCanvasStore()
    canvasStore.canvas = canvas
    setTimeout(() => {
      enterSketch(canvasStore.rawCanvas!)
    }, 5000)
  } else {
    throw new Error('failed to find canvas dom.')
  }
})
</script>

<template>
  <canvas ref="canvasRef"></canvas>
</template>

<style></style>
