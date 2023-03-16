<template>
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
    <FormDialog />
  </div>
</template>

<script lang="ts">
import FormDialog from './FormDialog.vue';
import { GridLayout, ElementManager, Layout } from '@asus-aics/xhis-widget-framework';
import { defineComponent, reactive, ref, computed, watch } from 'vue';
import { getWidgets } from './utils/widgetUtil';

export default defineComponent({
  components: { GridLayout, FormDialog },
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

    const currentLayout = 'icd';
    const reloadLayout = () => {
      layout.length = 0;
      target = ElementManager.layouts[currentLayout];
      layout.push(...target.components);
      colNum.value = target.colNum;
      rowNum.value = target.rowNum;
      margin.value.x = target.marginX;
      margin.value.y = target.marginY;
      preview.width = target.previewWidth;
      preview.height = target.previewHeight;
    };

    // empty string imply use default group
    const groupName = '';
    ElementManager.loadLayouts(groupName).then(() => {
      reloadLayout();
      watch(reloadLayout, reloadLayout);
    });

    return {
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
.page-container {
  width: 100%;
  height: 100%;
}
</style>
