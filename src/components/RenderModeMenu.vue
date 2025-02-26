<template>
  <n-dropdown trigger="hover" :options="renderModeOptionList" @select="handleSelect">
    <n-button>{{ currentRenderModeOption.label }}</n-button>
  </n-dropdown>
</template>

<script setup lang="ts">
import { RenderModeEnum } from '@/config/luban'
import { useCanvasStore } from '@/stores/canvas'
import { useOptionsStore } from '@/stores/options'
import { NButton, NDropdown, type DropdownOption } from 'naive-ui'
import { ref } from 'vue'

type RenderModeOption = {
  label: string
  key: RenderModeEnum
  disabled?: boolean
}

const optionsStore = useOptionsStore()
const canvasStore = useCanvasStore()

const renderModeOptionList: RenderModeOption[] = [
  {
    label: '正常',
    key: RenderModeEnum.Shaded,
  },
  {
    label: '不带边',
    key: RenderModeEnum.ShadedWithoutEdges,
  },
  {
    label: '不带隐藏边',
    key: RenderModeEnum.Unshaded,
  },
  {
    label: '带隐藏边',
    key: RenderModeEnum.UnshadedWithHiddenEdges,
  },
  {
    label: '线框',
    key: RenderModeEnum.Wireframe,
  },
  {
    label: '半透明',
    key: RenderModeEnum.Translucent,
  },
]

const currentRenderModeOption = ref(renderModeOptionList[0])
const handleSelect = (key: RenderModeEnum, option: DropdownOption) => {
  currentRenderModeOption.value = option as RenderModeOption
  optionsStore.setRenderMode(key)
  canvasStore.rawCanvas?.draw()
}
</script>

<style></style>
