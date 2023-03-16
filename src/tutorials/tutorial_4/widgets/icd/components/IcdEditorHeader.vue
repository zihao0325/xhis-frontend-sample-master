<template>
  <div class="xfe-icd-editor-header">
    <span class="xfe-icd-editor-header-title">
      {{ title }}
    </span>
    <div class="xfe-icd-editor-header-search">
      <IcdSearch @appendItem="$emit('appendItem')" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import IcdSearch from './IcdSearch.vue';

export default defineComponent({
  name: 'IcdEditorHeader',
  components: { IcdSearch },
  props: {
    title: {
      default: 'ICD 10',
      type: String,
    },
  },
  emits: ['appendItem'],
});
</script>

<style lang="scss">
.xfe-icd-editor-header {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  height: 60px;
  padding: 12px 20px 8px 20px;

  &-title {
    margin-right: 12px;
    font-size: var(--xv-title--title-md--font-size);
    font-weight: var(--xv-title--title-md--font-weight);
    line-height: var(--xv-title--title-md--line-height);
    color: var(--xv-text--high-emphasis-text);
  }

  &-search {
    flex: 1;
    width: 0px;
    max-width: 300px;
  }
}
</style>
