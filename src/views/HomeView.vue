<template>
  <main id="home-view">
    <GlCanvas />
    <div class="render-mode-wrap">
      <RenderModeMenu />
    </div>
  </main>
</template>

<script setup lang="ts">
import GlCanvas from '@/components/GlCanvas.vue'
import RenderModeMenu from '@/components/RenderModeMenu.vue'
</script>

<style scoped>
#home-view {
  position: relative;

  .render-mode-wrap {
    position: absolute;
    top: 120px;
    right: 80px;
  }
}
</style>
