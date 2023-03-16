<template>
  <div class="float-toolbar">
    <div class="link" @click="goTo('')">Use Dynamic Layout</div>
    <div class="link" @click="goTo('/static')">Use Static Layout</div>
  </div>
  <div class="title">Local Layout Playground</div>
  <div class="demo-widget-container">
    <div class="demo-widget-grid-container x-scroll-bar">
      <grid-layout
        id="my-test-grid-layout"
        :layout="layout"
        class="demo-widget-grid"
        :editable="edit"
        :col-num="colNum"
        :row-num="rowNum"
        :margin="margin"
        :fit-mode="false"
        :style="gridLayoutStyle"
        @delete-grid-item="deleteComponent"
      />
    </div>
    <div class="demo-widget-sidebar x-scroll-bar">
      <h2>Grid Settings</h2>
      <div>
        <div class="demo-widget-grid-controls">
          <XButton @click="toggleEdit">Edit</XButton>
          <XButton @click="logLayout">Layout</XButton>
          <XDialogue v-model:show="showLayout" :height="600" :width="800" close-on-backdrop>
            <div class="demo-widget-grid-dialog x-scroll-bar">
              <VueJsonPretty :data="layout" />
            </div>
          </XDialogue>
        </div>
        <div>preview width: <XInputText v-model="preview.width" type="number" /></div>
        <div>preview height: <XInputText v-model="preview.height" type="number" /></div>
        <div>col-num: <XInputText v-model.number="colNum" type="number" /></div>
        <div>row-num: <XInputText v-model.number="rowNum" type="number" /></div>
        <div>margin-x: <XInputText v-model.number="margin.x" type="number" /></div>
        <div>margin-y: <XInputText v-model.number="margin.y" type="number" /></div>
      </div>
      <div class="demo-widget-settings">
        <h2>Add Widget</h2>
        <XSelect v-model="selectedWidget" :data-options="widgetOptions" class="demo-widget-settings_select" />
        <XButton @click="addWidget">Add Widget</XButton>
        <h4>Widget Config</h4>
        <VueJsonPretty :data="widgetInfo" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, computed } from 'vue';
import { GridLayout, GridItemType } from '@asus-aics/xhis-widget-framework';
import { XButton, XSelect, XInputText, XDialogue } from '@asus-aics/xui';
import { getWidgets } from './utils/widgetUtil';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import router from '@/router';
import { pathPrefix } from './subRouter';

export default defineComponent({
  components: {
    GridLayout,
    XButton,
    XSelect,
    XInputText,
    VueJsonPretty,
    XDialogue,
  },
  setup() {
    const l: GridItemType[] = [
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
    ];
    const layout = reactive(l);
    const edit = ref(true);
    const toggleEdit = () => {
      edit.value = !edit.value;
    };
    const showLayout = ref(false);
    const logLayout = () => {
      showLayout.value = true;
    };

    const widgets: { [key: string]: any } = {};
    const widgetOptions: { value: string; label: string }[] = [];
    getWidgets().forEach((widget) => {
      if (widget.config) {
        widgets[widget.config.name] = widget;
        widgetOptions.push({
          value: widget.config.name,
          label: widget.config.displayName,
        });
      }
    });
    const selectedWidget = ref(widgetOptions[0].value);

    const widgetInfo = computed(() => {
      return widgets[selectedWidget.value].config;
    });
    const randId = () => (Math.random() + 1).toString(36).substring(7);
    const addWidget = () => {
      const config = widgets[selectedWidget.value].config;
      layout.push({
        ...widgetInfo.value,
        x: 0,
        y: 0,
        component: config.name,
        id: `${config.name}-${randId()}`,
      });
    };

    const colNum = ref(16);
    const rowNum = ref(9);
    const margin = reactive({ x: 0, y: 0 });

    const preview = reactive({ width: 1080, height: 720 });
    const gridLayoutStyle = computed(() => ({
      width: `${preview.width}px`,
      height: `${preview.height}px`,
    }));

    return {
      goTo(path) {
        router.push({ path: pathPrefix + path });
      },
      deleteComponent(index: number) {
        layout.splice(index, 1);
      },
      layout,
      toggleEdit,
      edit,
      logLayout,
      addWidget,
      widgetOptions,
      selectedWidget,
      colNum,
      rowNum,
      margin,
      widgetInfo,
      showLayout,
      gridLayoutStyle,
      preview,
    };
  },
});
</script>

<style lang="scss">
#app {
  height: 100%;
  width: 100%;
}
html {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  body {
    height: 100%;
    width: 100%;
  }
}
.title {
  text-align: center;
  width: 100%;
  font-size: 32px;
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
.demo-widget-grid-dialog {
  height: 100%;
  padding: 2rem;
  overflow: scroll;
}
.demo-widget-container {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 1rem;
  position: relative;
  .demo-widget-sidebar {
    overflow: scroll;
    padding: 1rem;
    position: absolute;
    transition: all 0.2s;
    left: 0;
    top: 0;
    transform: translateX(-99%);
    box-shadow: 2px 2px 10px grey;
    background-color: white;
    height: 100%;
    width: fit-content;
    z-index: 2;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    opacity: 0;
    &:hover {
      opacity: 1;
      transform: none;
    }
    .demo-widget-grid-controls {
      display: flex;
      justify-content: space-between;
    }
    .demo-widget-settings {
      display: flex;
      flex-direction: column;
      margin-bottom: 1rem;
      .demo-widget-settings_select {
        width: 100%;
      }
    }
  }
  .demo-widget-grid-container {
    width: 100%;
    overflow: scroll;
    .demo-widget-grid {
      width: 100%;
      height: 100%;
      border: 1px solid black;
    }
  }
}
</style>
