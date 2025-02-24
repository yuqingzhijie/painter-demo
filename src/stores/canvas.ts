import { RenderModeEnum } from '@/config/luban'
import type { Canvas } from '@painter/gl-canvas'
import { defineStore } from 'pinia'
import { toRaw } from 'vue'

interface State {
  /** Canvas实例
   * 初始值为null
   * 初始化失败为undefine
   */
  canvas: Canvas | null | undefined
  renderMode: RenderModeEnum
  testNumber: number
}

export const useCanvasStore = defineStore('canvas', {
  state: (): State => ({
    canvas: null,
    renderMode: RenderModeEnum.Shaded,
    testNumber: 0,
  }),
  getters: {
    rawCanvas(): State['canvas'] {
      return toRaw(this.canvas as Canvas)
    },
  },
  actions: {
    setCanvas(canvas: Canvas) {
      this.canvas = canvas
    },
    setRenderMode(renderMode: RenderModeEnum) {
      this.renderMode = renderMode
    },
  },
})
