<template>
  <div class="xfe-icd-editor-body">
    <IcdEditorList v-model="selectedIcdList" :selectable="false" :editable="true" :handle-remove="removeAt" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import IcdEditorList from './IcdEditorList.vue';
import { useIcdList } from '../utils/useIcdData';

export default defineComponent({
  name: 'IcdEditorBody',
  components: { IcdEditorList },
  setup() {
    const { selectedIcdList, removeAt, icdListErrors } = useIcdList();

    return {
      selectedIcdList,
      removeAt,
      icdListErrors,
    };
  },
});
</script>

<style lang="scss" scoped>
.xfe-icd-editor-body {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 0;
  min-width: 0;
}
</style>
