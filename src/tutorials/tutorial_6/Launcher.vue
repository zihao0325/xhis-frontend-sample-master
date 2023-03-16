<template>
  <div>Launcher Page</div>
</template>

<script lang="ts">
import engineSet, { StateEvent } from '@asus-aics/x-fe-engine';
import { defineComponent, nextTick, onMounted } from 'vue';

export default defineComponent({
  setup() {
    const { engine } = engineSet.useOpdStateEngine();

    onMounted(async () => {
      await nextTick();
      engine.core.sendTransitionEvent({
        machineId: engine.core.getMachineId(),
        type: StateEvent.RESOLVE,
        stateType: StateEvent.RESOLVE,
      });
    });
  },
});
</script>
