<template>
  <div class="demo-panel">
    <ul>
      <li @click="returnInitialView">返回最初视图</li>
      <li @click="setHalfPIByY">绕y轴旋转PI/2</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { setView } from '@/luban/utils'
import { useCanvasStore } from '@/stores/canvas'
import { Matrix, Vector, type Canvas } from '@painter/gl-canvas'

const canvasStore = useCanvasStore()

const returnInitialView = () => {
  setView(Matrix.IDENTITY)
}
const setHalfPIByY = () => {
  const canvas = canvasStore.rawCanvas as Canvas
  canvas.context.viewMatrix = Matrix.IDENTITY.rotate(Vector.Y_AXIS, Math.PI / 2)
  canvas.draw()
  canvas.pick()
}
</script>

<style>
.demo-panel {
  width: var(--painter-demo-panel-width);
  box-sizing: border-box;
}
</style>
