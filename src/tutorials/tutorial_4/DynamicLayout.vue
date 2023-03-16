<template>
  <div class="float-toolbar">
    <div class="link" @click="goTo('/layout-playground')">Go to Local Layout Playground</div>
    <div class="link" @click="goTo('/static')">Use Static Layout</div>
    <XSelect :model-value="currentLayout" :data-options="layoutOpts" @update:model-value="setLayout"></XSelect>
  </div>
  <div class="title">Dynamic Layout</div>
  <div class="page-container">
    <grid-layout
      id="grid-patient-list-layout"
      :style="gridLayoutStyle"
      :margin="margin"
      :layout="layout"
      :row-num="rowNum"
      :col-num="colNum"
      :editable="false"
      :fit-mode="false"
    />
  </div>
</template>

<script lang="ts">
import { GridLayout, ElementManager, Layout } from '@asus-aics/xhis-widget-framework';
import { defineComponent, reactive, ref, computed, watch } from 'vue';
import { XSelect } from '@asus-aics/xui';
import { getWidgets } from './utils/widgetUtil';
import { pathPrefix } from './subRouter';
import router from '@/router';

export default defineComponent({
  name: 'PatientList',
  components: { GridLayout, XSelect },

  setup() {
    ElementManager.registerVueComponents(getWidgets());
    let target: Layout;
    const colNum = ref(16);
    const rowNum = ref(9);
    const layout = reactive([]);
    const margin = ref({
      x: 0,
      y: 0,
    });
    const preview = reactive({
      width: 1280,
      height: 720,
    });
    const gridLayoutStyle = computed(() => ({
      width: `${preview.width}px`,
      height: `${preview.height}px`,
    }));

    const currentLayout = ref('patientList');
    const reloadLayout = () => {
      layout.length = 0;
      target = ElementManager.layouts[currentLayout.value];
      layout.push(...target.components);
      colNum.value = target.colNum;
      rowNum.value = target.rowNum;
      margin.value.x = target.marginX;
      margin.value.y = target.marginY;
      preview.width = target.previewWidth;
      preview.height = target.previewHeight;
    };
    const setLayout = (layout) => {
      currentLayout.value = layout;
      reloadLayout();
    };
    // empty string imply use default group
    const groupName = '';
    ElementManager.loadLayouts(groupName).then(() => {
      reloadLayout();
      watch(reloadLayout, reloadLayout);
    });

    const availableLayouts = ['patientList', 'icd', 'drugList'];
    const layoutOpts = availableLayouts.map((key) => ({
      label: key,
      value: key,
    }));

    return {
      goTo(path) {
        router.push({ path: pathPrefix + path });
      },
      setLayout,
      currentLayout,
      layoutOpts,
      margin,
      gridLayoutStyle,
      layout,
      colNum,
      rowNum,
    };
  },
});
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
  width: 100%;
  font-size: 32px;
}
.page-container {
  width: 100%;
  height: 100%;
}
.link {
  cursor: pointer;
  color: blue;
  text-decoration: underline;
}
.float-toolbar {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 100;
  padding: 1rem;
}
</style>
