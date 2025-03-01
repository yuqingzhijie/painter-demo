<script setup lang="ts">
/**
 * 初始化默认几何单元
 * 控制球
 * 鼠标控制
 */

import { DEMO_PANEL_WIDTH, TOOL_BAR_HEIGHT } from '@/config/luban'
import Dice from '@/luban/geom/dice/Dice'
import Edge from '@/luban/geom/part/Edge'
import Face from '@/luban/geom/part/Face'
import Part from '@/luban/geom/part/Part'
import Plane from '@/luban/geom/part/Plane'
import Shape from '@/luban/geom/part/Shape'
import PickEventHandler from '@/luban/geom/pick/PickEventHandler'
import { createCuboid, createCylinderFace, createSphere, ModelingDirectionEnum } from '@/luban/math'

import { useCanvasStore } from '@/stores/canvas'
import { throttle } from '@/utils'
import { Canvas, Color, Matrix, Vector, Vertex } from '@painter/gl-canvas'
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
const addSphere = (part: Part, id: number, origin: Vertex, radius: number): Shape => {
  const shape = new Shape(part, id)
  const sphere = createSphere(origin, radius, {
    widthSegmentRange: [24, 8],
  })
  shape.faces.set(id, new Face(part, id++, shape, sphere, Color.FACE_COLOR))
  shape.barycenter = origin
  return shape
}
const addCylinderSide = (
  part: Part,
  id: number,
  baseCenter: Vertex,
  radius: number,
  height: number,
): Shape => {
  const shape = new Shape(part, id)
  const cylinderFace = createCylinderFace(baseCenter, radius, height, {
    range: [24, 16],
    direction: ModelingDirectionEnum.Z,
  })
  shape.faces.set(id, new Face(part, id++, shape, cylinderFace, Color.FACE_COLOR))
  shape.barycenter = baseCenter
  return shape
}

const initCanvas = (root: Part, dom: HTMLCanvasElement) => {
  const canvas = new Canvas(dom, { dice: new Dice() })
  canvas.root = root
  canvas.eventHandler.next = new PickEventHandler(canvas)
  canvas.setCustomDraw(function (this: Canvas) {
    this.device.beginDraw()
    this.root?.draw(this.device, this.context)
    this.device.clearDepth()
    ;(this.customContent as { dice: Dice }).dice.draw(this.device, this.context)
    this.device.endDraw()
  })
  canvas.setCustomPick(function (this: Canvas) {
    this.device.beginPick()
    this.root?.pick(this.device, this.context)
    this.device.clearDepth()
    ;(this.customContent as { dice: Dice }).dice.pick(this.device, this.context)
    this.picked = this.device.getPicked(0, 0, this.device.width(), this.device.height())
    this.device.endPick()
  })

  canvas.resize(window.innerWidth - DEMO_PANEL_WIDTH, window.innerHeight - TOOL_BAR_HEIGHT)
  canvas.context.viewMatrix = Matrix.IDENTITY.rotate(Vector.Y_AXIS, Math.PI / 8).rotate(
    Vector.X_AXIS,
    Math.PI / 8,
  )
  canvas.draw()
  canvas.pick()
  window.addEventListener(
    'resize',
    throttle(() => {
      canvas.resize(window.innerWidth - DEMO_PANEL_WIDTH, window.innerHeight - TOOL_BAR_HEIGHT)
    }, 150),
  )

  return canvas
}

const canvasRef = ref() as Ref<HTMLCanvasElement>

onMounted(function init() {
  const canvasDom = unref(canvasRef)
  if (canvasDom instanceof HTMLCanvasElement) {
    const part = new Part()
    let id = 2
    part.addShape(addCuboid(part, id, new Vertex(-60, 0, -80), 100, 40, 60))
    part.addShape(addCuboid(part, (id = id + 19), new Vertex(120, 0, 80), 100, 40, 40))
    part.addShape(addSphere(part, (id = id + 19), new Vertex(-60, 0, 80), 20))
    part.addShape(addCylinderSide(part, (id = id + 2), new Vertex(120, 0, -80), 20, 60))
    const planes = initDatumPlanes(part)
    planes.forEach((plane) => part.addPlane(plane))

    const canvas = initCanvas(part, canvasDom)
    const canvasStore = useCanvasStore()
    canvasStore.setCanvas(canvas)
  } else {
    throw new Error('failed to find canvas dom.')
  }
})
</script>

<template>
  <canvas ref="canvasRef"></canvas>
</template>

<style></style>
