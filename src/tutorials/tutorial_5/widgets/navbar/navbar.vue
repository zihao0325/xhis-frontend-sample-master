<template>
  <div class="xfe-navbar">
    <XButton display="text" icon="arrow-left" outline @click="back">Go Back</XButton>
    <XButton @click="sendEngineEvent('icd')">Go ICD</XButton>
    <XButton @click="sendEngineEvent('drug')">Go Drug</XButton>
  </div>
</template>

<script lang="ts">
import { WidgetProps } from '@asus-aics/xhis-widget-framework';
import engineSet, { StateEvent } from '@asus-aics/x-fe-engine';
import { defineComponent } from 'vue';
import { XButton } from '@asus-aics/xui';

export default defineComponent({
  components: { XButton },
  props: WidgetProps,
  setup() {
    const { engine } = engineSet.useOpdStateEngine();

    const sendEngineEvent = (dest: string) => {
      engine.sendEvent({
        type: StateEvent.RESOLVE,
        guards: {
          destination: dest,
        },
      });
    };

    return {
      sendEngineEvent,
      back: () => {
        engine.sendEvent({
          type: StateEvent.REJECT,
        });
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.xfe-navbar {
  width: 100%;
  display: flex;
  column-gap: 0.5rem;
  padding: 0.5rem;
  align-items: center;
}
</style>
