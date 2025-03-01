import type { Canvas } from '@painter/gl-canvas'
import { defineStore } from 'pinia'
import { toRaw } from 'vue'

// !除了canvas，别放其他东西，取值必须用rawCanvas, 尽量少set

interface State {
  /** Canvas实例
   * 初始值为null
   * 初始化失败为undefine
   */
  _canvas: Canvas | null | undefined
}

export const useCanvasStore = defineStore('canvas', {
  state: (): State => ({
    _canvas: null,
  }),
  getters: {
    rawCanvas(): State['_canvas'] {
      return toRaw(this._canvas as Canvas)
    },
  },
  actions: {
    setCanvas(canvas: Canvas) {
      this._canvas = canvas
    },
  },
})
