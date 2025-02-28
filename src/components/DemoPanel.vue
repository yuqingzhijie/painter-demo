<template>
  <div class="demo-panel">
    <ul>
      <li @click="returnInitialView">返回最初视图</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { returnInitialView as reInitView } from '@/luban/utils'
import { useCanvasStore } from '@/stores/canvas'
import type { Canvas } from '@painter/gl-canvas'

const canvasStore = useCanvasStore()

const returnInitialView = () => {
  reInitView(canvasStore.rawCanvas as Canvas)
}
</script>

<style>
.demo-panel {
  width: var(--painter-demo-panel-width);
  box-sizing: border-box;
}
</style>
