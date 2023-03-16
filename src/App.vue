<template>
  <main>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </main>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, provide } from 'vue';
import qs from '@/utils/qsHelper';
import engineSet, { EngineStoreMode, MachineId, StateEvent } from '@asus-aics/x-fe-engine';
import { mainEngine } from './engine/main';
import { VersionManager } from './utils/versionManager';

import.meta.env.WIDGET_SDK_DEV_TOKEN;

export default defineComponent({
  setup() {
    provide('engineStoreMode', EngineStoreMode.Collab);

    mainEngine.registerActionEvents();
    if (qs.mode === 'inspect') {
      mainEngine.enableDevTool();
    }

    VersionManager.getInstance().setUsingVersion('opd', __OPD_VER__);

    onMounted(async () => {
      await nextTick();
      if (qs.dev === 'true') {
        return;
      }
    });
  },
});
</script>

<style scoped lang="scss">
html {
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  body {
    height: 100%;
    width: 100%;
  }
}

#app {
  width: 100%;
  height: 100%;
  // App background color should align with design ui
  // May check this color after if there is any change.
  background-color: #efeef2;
}
</style>
