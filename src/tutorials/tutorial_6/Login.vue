<template>
  <div>Login Page</div>
</template>

<script lang="ts">
import engineSet, { MachineId, StateEvent } from '@asus-aics/x-fe-engine';
import { defineComponent, nextTick, onMounted } from 'vue';

export default defineComponent({
  setup() {
    const { engine } = engineSet.useOpdStateEngine();

    onMounted(async () => {
      await nextTick();
      console.log('login.onMounted', {
        syncId: engine.core.getSyncId(),
        syncState: engine.core.getSyncState(),
        preSyncState: engine.core.getPreSyncState(),
      });

      engine.core.sendTransitionEvent({
        machineId: engine.core.getMachineId() as MachineId,
        type: StateEvent.RESOLVE,
        stateType: StateEvent.RESOLVE,
      });
    });
  },
});
</script>
