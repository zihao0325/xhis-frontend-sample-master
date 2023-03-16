<template>
  <div class="xfe-icd-editor-list x-scroll-bar">
    <XDraggableList
      v-if="modelValue && modelValue.length > 0"
      :list="computedIcdList"
      item-key="code"
      handle=".xfe-icd-editor-list-item-reorder"
      @moveItemEnd="handleReorder"
    >
      <template #item="{ element, index }">
        <IcdEditorListItem
          :element="element"
          :index="index"
          :selectable="selectable"
          :editable="editable"
          :show-bookmark="showBookmark"
          :show-dropdown="showDropdown"
          :neutral-theme="neutralTheme"
          :text-color="textColor"
          :class="{
            'xfe-icd-editor-list-divider': index !== computedIcdList.length - 1,
          }"
          @select="handleSelect"
          @remove="handleRemove"
        />
      </template>
    </XDraggableList>
    <div v-else class="fill-center">
      <slot name="empty-text">尚未開立 ICD</slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { XDraggableList } from '@asus-aics/xui';
import type { IcdSchema } from '@asus-aics/xhis-schema';
import type { IcdTreeNodeSchema } from '../utils/schema';
import IcdEditorListItem from './IcdEditorListItem.vue';

export default defineComponent({
  name: 'IcdEditorList',
  components: { XDraggableList, IcdEditorListItem },
  props: {
    modelValue: {
      type: Array as PropType<IcdSchema[] | IcdTreeNodeSchema[]>,
      default: null,
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    showBookmark: {
      type: Boolean,
      default: false,
    },
    showDropdown: {
      type: Boolean,
      default: false,
    },
    neutralTheme: {
      type: Boolean,
      default: false,
    },
    handleSelect: {
      type: Function,
      default: () => ({}),
    },
    handleRemove: {
      type: Function,
      default: () => ({}),
    },
    handleReorder: {
      type: Function,
      default: () => ({}),
    },
    textColor: {
      type: String,
      default: 'var(--xv-text--high-emphasis-text)',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const computedIcdList = computed<IcdSchema[] | IcdTreeNodeSchema[]>({
      get: () => props.modelValue,
      set: (value) => {
        emit('update:modelValue', value);
        props.handleReorder();
      },
    });

    return {
      computedIcdList,
    };
  },
});
</script>

<style lang="scss" scoped>
.xfe-icd-editor-list {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 0 10px 0 20px;
  scrollbar-gutter: stable;
  scroll-behavior: smooth;

  &-divider {
    border-bottom: 1px solid var(--xv-text--dividing-line);
  }
}

.fill-center {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  text-align: center;
  font-weight: 500;
  font-size: 18px;
  color: var(--xv-text--low-emphasis-text);
}
</style>
