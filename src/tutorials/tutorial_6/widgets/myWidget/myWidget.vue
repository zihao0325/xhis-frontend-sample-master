<template>
  <div>{{ title }}</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { WidgetProps } from '@asus-aics/xhis-widget-framework';

export default defineComponent({
  name: 'MyWidget',
  components: {},
  props: WidgetProps, // WidgetProps is required, do not remove
  setup() {
    const title = ref('Hello World');
    return {
      title,
    };
  },
});
</script>

<style lang="scss">
.demo-widget {
  padding: 1rem;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 16px 2px #2222;
  border-radius: 8px;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
.demo-widget-btn-gp {
  margin-top: 0.5rem;
  display: flex;
  width: 100%;
  justify-content: space-between;
  .demo-widget-btn {
    flex: 1;
  }
  gap: 0.5rem;
}
.demo-widget-count {
  font-size: 4rem;
  color: rgb(63, 125, 226);
}
.demo-widget-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 2rem;
  gap: 2rem;
  flex-direction: column;
  .demo-widget-dialog-notice {
    color: red;
  }
}
.demo-widget-floating-window {
  background-color: white;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  box-shadow: 0px 0px 24px rgba(black, 0.4);
}
</style>
