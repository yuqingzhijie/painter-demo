import { RenderModeEnum } from '@/config/luban'
import { defineStore } from 'pinia'

interface State {
  renderMode: RenderModeEnum
}

export const useOptionsStore = defineStore('options', {
  state: (): State => ({
    renderMode: RenderModeEnum.Shaded,
  }),
  getters: {},
  actions: {
    setRenderMode(renderMode: RenderModeEnum) {
      this.renderMode = renderMode
    },
  },
  persist: true,
})
