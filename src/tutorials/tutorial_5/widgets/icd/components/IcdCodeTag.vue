<template>
  <XTag :theme="theme" rounded>{{ icdCode }}</XTag>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { XTag } from '@asus-aics/xui';

export default defineComponent({
  name: 'IcdCodeTag',
  components: { XTag },
  props: {
    icdCode: {
      default: () => '',
      type: String,
    },
    hasSelected: {
      default: false,
      type: Boolean,
    },
    hint: {
      default: false,
      type: Boolean,
    },
  },
  setup(props) {
    const theme = computed(() => {
      if (props.hasSelected) {
        return 'neutral';
      }
      if (props.hint) {
        return 'red';
      }
      return 'teal';
    });
    return { theme };
  },
});
</script>

<style lang="scss" scoped>
.x-tag {
  min-width: 88px;
  font-size: 14px;
  font-weight: 600;
}
</style>
