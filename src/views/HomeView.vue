<template>
  <main id="home-view">
    <div class="tool-bar">tool bar</div>
    <div class="main">
      <DemoPanel class="demo-panel" />
      <div class="gl-canvas-wrap">
        <GlCanvas class="gl-canvas" />
        <div class="render-mode-menu-wrap">
          <RenderModeMenu />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import DemoPanel from '@/components/DemoPanel.vue'
import GlCanvas from '@/components/GlCanvas.vue'
import RenderModeMenu from '@/components/RenderModeMenu.vue'
</script>

<style scoped>
#home-view {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;

  .tool-bar {
    height: var(--painter-tool-bar-height);
    box-sizing: border-box;
    border-bottom: 1px solid #666;
    display: flex;
    align-items: center;
    padding: 0 12px;
  }

  .main {
    flex: 1;
    min-height: 0;
    display: flex;

    .demo-panel {
      border-right: 1px solid #666;
    }

    .gl-canvas-wrap {
      position: relative;

      .render-mode-menu-wrap {
        position: absolute;
        top: 120px;
        right: 80px;
      }
    }
  }
}
</style>
