<template>
  <div class="xfe-icd-editor-list-item" :data-qa-key="item.code" :data-qa-order="index">
    <div class="xfe-icd-editor-list-item-delete x-flex-center">
      <XIconButton size="sm" icon="dismiss" @click="$emit('remove', index)" />
    </div>
    <div
      class="xfe-icd-editor-list-item-entry"
      :class="{
        'xfe-icd-editor-list-item-entry--selectable': selectable,
      }"
      :style="{ cursor: selectable ? 'pointer' : 'default' }"
      @click="$emit('select', element)"
    >
      <IcdCodeTag :icd-code="item.code" :has-selected="neutralTheme" :hint="!!(item.chronic || item.catastrophic)" />
      <div class="xfe-icd-editor-list-item-name x-ellipsis" :style="{ color: textColor }">
        {{ item.enDisplay }}
      </div>
      <div class="xfe-icd-editor-list-item-reorder">
        <XIcon icon="handler" color="var(--xv-text--medium-emphasis-text)" />
      </div>
    </div>
    <div v-if="showError && errors.length > 0" class="xfe-icd-editor-list-item-error">
      <span v-for="err in errors" :key="err.messge" class="err">{{ err.message }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { XIconButton, XTooltip, XIcon } from '@asus-aics/xui';
import type { IcdSchema } from '@asus-aics/x-fe-engine';

import type { IcdTreeNodeSchema } from '../utils/schema';
import IcdCodeTag from './IcdCodeTag.vue';

export default defineComponent({
  name: 'IcdEditorListItem',
  components: {
    XIconButton,
    XTooltip,
    XIcon,
    IcdCodeTag,
  },
  props: {
    element: {
      default: () => ({
        value: {
          enDisplay: '',
          chDisplay: '',
          code: '',
        },
      }),
      type: Object as PropType<IcdSchema | IcdTreeNodeSchema | any>,
    },
    index: {
      default: () => NaN,
      type: Number,
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    neutralTheme: {
      type: Boolean,
      default: false,
    },
    checkboxState: {
      type: Boolean,
      default: true,
    },
    reorderable: {
      type: Boolean,
      default: true,
    },
    textColor: {
      type: String,
      default: 'var(--xv-text--high-emphasis-text)',
    },
  },
  emits: ['select', 'remove', 'update:checkboxState'],
  setup(props) {
    const item = computed(() => {
      return props.element.value || props.element;
    });

    const errors = computed(() => {
      return [...(item.value?.errorList ?? [])];
    });
    const showError = computed(() => errors.value.length > 0);
    return {
      showError,
      errors,
      item,
    };
  },
});
</script>

<style lang="scss">
.err {
  color: red;
}
.xfe-icd-editor-list-item {
  .x-w-rule-error-entry {
    width: unset;
  }

  display: grid;
  grid-template-areas:
    'leading entry'
    '. error';
  grid-template-rows: auto auto;
  grid-template-columns: auto 1fr;
  width: 100%;

  &-checkbox {
    grid-area: leading;
    display: flex;
    width: 32px;
    height: 43px;
    padding-left: 3px;
  }

  &-delete {
    grid-area: leading;
    display: flex;
    align-items: center;
    width: 36px;
    height: 43px;
  }

  &-entry {
    grid-area: entry;
    display: flex;
    align-items: center;
    height: 43px;
    padding-left: 4px;
    padding-right: 4px;
    &--selectable {
      &:hover {
        background: var(--xv-container--surface-hovered);
      }
      &:active {
        background: var(--xv-container--surface-pressed);
      }
    }
  }

  &-name {
    flex-grow: 1;
    font-size: 16px;
    margin-left: 8px;
  }

  &-bookmark {
    margin-left: 10px;
  }

  &-reorder[disabled='true'] {
    cursor: not-allowed;
    pointer-events: none;
  }

  &-reorder[disabled='false'] {
    cursor: grab;

    :active {
      cursor: grabbing;
    }
  }

  &-error {
    grid-area: error;
  }
}
</style>
