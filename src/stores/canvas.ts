import type { Canvas } from '@painter/gl-canvas'
import { defineStore } from 'pinia'
import { toRaw } from 'vue'

// !除了canvas，别放其他东西，取值必须用rawCanvas, 尽量少set

interface State {
  /** Canvas实例
   * 初始值为null
   * 初始化失败为undefine
   */
  canvas: Canvas | null | undefined
}

export const useCanvasStore = defineStore('canvas', {
  state: (): State => ({
    canvas: null,
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
  },
})
