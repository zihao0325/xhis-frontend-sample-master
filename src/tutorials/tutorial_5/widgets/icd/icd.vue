<template>
  <div class="xfe-icd-editor" data-qa-widget="IcdEditor">
    <div class="xfe-icd-editor-container">
      <IcdEditorHeader :title="title" />
      <IcdEditorBody ref="bodyRef" class="xfe-icd-editor-body" />
    </div>
  </div>
</template>

<script lang="ts">
import { WidgetProps } from '@asus-aics/xhis-widget-framework';
import emitter, { RuleListChangeEvent } from '@asus-aics/x-fe-emitter';
import { IcdSchema } from '@asus-aics/x-fe-engine';
import { defineComponent, computed, onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import IcdEditorBody from './components/IcdEditorBody.vue';
import IcdEditorHeader from './components/IcdEditorHeader.vue';
import { icdSearchState, initIcdSearchState, useIcdList } from './utils/useIcdData';
import { useWidgetConfig } from './utils/useWidgetConfig';

const _hasIcdList = (icdList: IcdSchema[]) => icdList && icdList.length > 0;

export default defineComponent({
  name: 'IcdEditor',
  components: {
    IcdEditorHeader,
    IcdEditorBody,
  },
  props: WidgetProps,
  emits: ['update:dataLoading', 'update:error'],
  setup(props) {
    useWidgetConfig().setWidgetConfig(props.gridItem?.extra);
    const { appendIcd } = useIcdList();

    // header
    const title = computed(() => {
      return 'ICD 10';
    });

    // for history ditto
    const parentState = ref(true);
    const childrenState = ref({});

    const handleListChangeAdd = async (icdList: IcdSchema[]) => {
      if (_hasIcdList(icdList)) {
        for (const item of icdList) {
          await appendIcd(item);
        }
      }
    };

    onMounted(() => {
      emitter.on(RuleListChangeEvent.ADD_ICD_EVENT, handleListChangeAdd);
    });
    onUnmounted(() => {
      emitter.off(RuleListChangeEvent.ADD_ICD_EVENT, handleListChangeAdd);
    });

    // reset widget global state
    onBeforeMount(() => {
      Object.assign(icdSearchState, initIcdSearchState());
    });

    return {
      title,
      parentState,
      childrenState,
      handleListChangeAdd,
    };
  },
});
</script>

<style lang="scss" scoped>
.xfe-icd-editor {
  width: 100%;
  height: 100%;
  padding: 8px;
  display: flex;
  flex-flow: column;

  &-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    border-radius: 16px;
    background-color: var(--xv-container--surface);
  }

  &-body {
    flex-grow: 1;
  }

  &-loading {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0px;
    margin: 0px;
    height: 100%;
    width: 100%;
  }
}
</style>
