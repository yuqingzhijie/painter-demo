<!-- 
  Copyright(c) 2021, ZWSOFT Co., LTD. (Guangzhou)ALL Rights Reserved.
-->

<script setup lang="ts">
/**
 * 初始化默认几何单元
 * 控制球
 * 鼠标控制
 */

import Edge from '@/luban/geom/part/Edge'
import Face from '@/luban/geom/part/Face'
import Part from '@/luban/geom/part/Part'
import Plane from '@/luban/geom/part/Plane'
import Shape from '@/luban/geom/part/Shape'
import PickEventHandler from '@/luban/geom/pick/PickEventHandler'
import { createCuboid } from '@/luban/math'

import { useCanvasStore } from '@/stores/canvas'
import { throttle } from '@/utils'
import { Canvas, Color, Context, Matrix, Vector, Vertex } from '@painter/gl-canvas'
import { onMounted, ref, unref, type Ref } from 'vue'

const initDatumPlanes = (part: Part): Plane[] => {
  return [
    new Plane(part, 100, '21.5, 67.298°', Matrix.IDENTITY),
    new Plane(part, 101, 'Left', Matrix.IDENTITY.rotate(Vector.Y_AXIS, -Math.PI / 2)),
    new Plane(part, 102, 'Top', Matrix.IDENTITY.rotate(Vector.X_AXIS, -Math.PI / 2)),
  ]
}

const addCuboid = (
  part: Part,
  id: number,
  origin: Vertex,
  length: number,
  width: number,
  height: number,
): Shape => {
  const shape = new Shape(part, id)
  const cuboid = createCuboid(origin, length, width, height)
  cuboid.edges.forEach((edge) => {
    shape.edges.set(id, new Edge(part, id++, shape, edge.vertexes, Color.EDGE_COLOR))
  })
  cuboid.faces.forEach((face) => {
    shape.faces.set(id, new Face(part, id++, shape, face, Color.FACE_COLOR))
  })
  shape.barycenter = origin
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
    const id = 2
    part.addShape(addCuboid(part, id, new Vertex(0, 0, 0), 100, 40, 60))
    part.addShape(addCuboid(part, id + 18, new Vertex(60, 0, 80), 100, 40, 40))
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
