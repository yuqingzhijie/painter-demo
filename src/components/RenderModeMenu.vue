<template>
  <n-dropdown trigger="hover" :options="options" @select="handleSelect">
    <n-button>{{ renderMode }}</n-button>
  </n-dropdown>
</template>

<script setup lang="ts">
import { RenderModeEnum } from '@/config/luban'
import { useCanvasStore } from '@/stores/canvas'
import { NButton, NDropdown, type DropdownOption } from 'naive-ui'
import { ref } from 'vue'

// type Option = {
//   label: string
//   key: RenderModeEnum
//   disabled?: boolean
// }

const canvasStore = useCanvasStore()
const options = [
  {
    label: '正常',
    key: RenderModeEnum.Shaded,
  },
  {
    label: '不带边',
    key: RenderModeEnum.ShadedWithoutEdges,
  },
  {
    label: '带隐藏边',
    key: RenderModeEnum.ShadedWithHiddenEdges,
  },
  {
    label: '白色',
    key: RenderModeEnum.Unshaded,
    disabled: true,
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

const renderMode = ref(options[0].label)
const handleSelect = (key: RenderModeEnum, option: DropdownOption) => {
  renderMode.value = option.label as string
  // todo 下面会导致卡住，明天换elem，后面有空再定位
  canvasStore.renderMode = key
}
</script>
