<template>
  <XTag :theme="data.theme">{{ data.name }}</XTag>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { XTag, type XColorTheme } from '@asus-aics/xui';

const PatientStates: Record<string, { name: string; theme: XColorTheme }> = {
  completed: {
    name: '完診',
    theme: 'green',
  },
  planned: {
    name: '待診',
    theme: 'violet',
  },
  'in-progress': {
    name: '看診中',
    theme: 'orange',
  },
  undefined: {
    name: '--',
    theme: 'neutral',
  },
};

export default defineComponent({
  name: 'PatientListCellState',
  components: {
    XTag,
  },
  props: {
    status: {
      default: 'completed',
      type: String,
    },
  },
  setup(props) {
    const data = computed(() => PatientStates[props.status] ?? PatientStates.undefined);

    return {
      data,
    };
  },
});
</script>
