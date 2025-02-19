import type Canvas from '@/luban/canvas/Canvas'
import { defineStore } from 'pinia'
import { toRaw } from 'vue'

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
  actions: {},
})
