<template>
  <div class="float-toolbar">
    <div class="link" @click="goTo('/layout-playground')">Go to Local Layout Playground</div>
    <div class="link" @click="goTo('')">Use Dynamic Layout</div>
  </div>
  <div class="title">Static Layout</div>
  <div class="page-container">
    <grid-layout
      id="grid-patient-list-layout"
      :style="gridLayoutStyle"
      :margin="margin"
      :layout="layoutComponents"
      :row-num="rowNum"
      :col-num="colNum"
      :editable="false"
      :fit-mode="false"
    />
  </div>
</template>

<script lang="ts">
import { GridLayout } from '@asus-aics/xhis-widget-framework';
import { defineComponent, reactive, ref } from 'vue';
import { pathPrefix } from './subRouter';
import router from '@/router';

// #region StaticLayoutSetting
export default defineComponent({
  name: 'PatientList',
  components: { GridLayout },

  setup() {
    const colNum = ref(16);
    const rowNum = ref(9);
    const layoutComponents = reactive([
      {
        name: 'w-demo-patientlist',
        displayName: '病患清單',
        description: 'Patient List',
        w: 6,
        h: 9,
        minW: 4,
        minH: 5,
        maxH: 8,
        maxW: 10,
        extra: {},
        x: 0,
        y: 0,
        component: 'w-demo-patientlist',
        id: 'w-demo-patientlist-7vuq',
      },
    ]);
    const margin = ref({
      x: 0,
      y: 0,
    });
    const gridLayoutStyle = {
      width: '1600px',
      height: '900px',
    };
    return {
      goTo(path) {
        router.push({ path: pathPrefix + path });
      },
      gridLayoutStyle,
      margin,
      layoutComponents,
      colNum,
      rowNum,
    };
  },
});
// #endregion StaticLayoutSetting
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
