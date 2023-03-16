<template>
  <div class="xfe-navbar">
    <XButton display="text" icon="arrow-left" outline @click="back">Go Back</XButton>
  </div>
</template>

<script lang="ts">
import { WidgetProps } from '@asus-aics/xhis-widget-framework';
import { defineComponent } from 'vue';
import { XButton } from '@asus-aics/xui';

export default defineComponent({
  components: { XButton },
  props: WidgetProps,
  setup() {
    return {
      back: () => {},
    };
  },
});
</script>

<style lang="scss" scoped>
.xfe-navbar {
  width: 100%;
}
</style>
