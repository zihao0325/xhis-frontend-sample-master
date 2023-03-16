<template>
  <div>
    Bind Page
    {{ state.value }}
  </div>
</template>

<script lang="ts">
import bindMachine from '@/engine/bind';
import { mainEngine } from '@/engine/main';
import { api } from '@/utils/api';
import { EngineClient } from '@/utils/engineClient';
import { useMachine } from '@/utils/xstateWrapper';
import engineSet, { StateEvent, BaseStateEngine } from '@asus-aics/x-fe-engine';
import { defineComponent, nextTick, onMounted, watch } from 'vue';
import { BaseContextSchema } from '@asus-aics/xhis-schema';
import { getChart } from './charts/myChart';

export default defineComponent({
  setup() {
    const { engine } = engineSet.useOpdStateEngine();
    const { state, send, service } = useMachine(bindMachine);

    engine.core.setNeedConfirmState(false);
    engine.register(service);

    async function handleSyncChart(engine: BaseStateEngine<BaseContextSchema>) {
      try {
        // send chart
        await api.updateEngineChart(engine.core.getMachineId(), getChart());

        // const chart = await api.loadEngineChart(engine.core.getMachineId());
        console.log('loadEngineChart', getChart());
        engine.restoreChart(getChart());

        console.log('handleSyncChart', engine.core.getState().value);
      } catch (err) {
        // prevent no chart from server side
        console.log('chart not found', err);
      }
    }

    async function syncChart() {
      console.log('syncChart');
      const engines = [engineSet.useOpdStateEngine()];
      await Promise.all(engines.map((useEngine) => handleSyncChart(useEngine.engine)));
    }

    async function handleSocketState() {
      await syncChart();

      const jwtToken = import.meta.env.VITE_WIDGET_SDK_DEV_TOKEN;
      const client = EngineClient.getInstance();
      client.setAuthToken(jwtToken);
      await client.connect(`${api.getStateApiUrl()}`);
      await mainEngine.initConnect();

      engine.sendEvent({
        type: StateEvent.RESOLVE,
      });
      console.log('handleSocketState', engine.core.getState().value);
    }

    watch(state, async (stateValue) => {
      if (stateValue.value === 'socket') {
        console.log('watch(stateValue)', engine.core.getState().value);
        await handleSocketState();
      }
    });

    onMounted(async () => {
      console.log('onMounted', engine.core.getState().value);
      await nextTick();
      send(StateEvent.RESOLVE);
    });

    return {
      state,
      syncChart,
      handleSyncChart,
    };
  },
});
</script>
