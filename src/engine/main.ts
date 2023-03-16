import router from '@/router';
import qs from '@/utils/qsHelper';
import emitter from '@asus-aics/x-fe-emitter';
import { nanoid } from 'nanoid';
import {
  ActionEvent,
  CollabEvent,
  MachineId,
  OpdStateEngine,
  StateEvent,
  SyncEvent,
  useOpdStateEngine,
} from '@asus-aics/x-fe-engine';
import { EngineBase } from './base';
import { LocationQueryRaw } from 'vue-router';
import { EngineClient } from '@/utils/engineClient';
import './encounter';

type EventData = Record<string, string>;

const { engine } = useOpdStateEngine();
const tutorialIndex = import.meta.env.VITE_TUTORIAL_INDEX;

class MainEngine extends EngineBase {
  private static instance: MainEngine;
  engine: OpdStateEngine = engine;

  getEngine(): OpdStateEngine {
    return engine;
  }

  registerActionEvents(): void {
    emitter.on(ActionEvent.SHOW_PAGE, this.handleShowPage.bind(this));
    emitter.on(ActionEvent.SHOW_DIALOG, async (event) => {
      if (event.name === 'preload') {
        engine.core.sendTransitionEvent({
          machineId: engine.core.getMachineId() as MachineId,
          type: StateEvent.RESOLVE,
          stateType: StateEvent.RESOLVE,
        });
      }
    });
    emitter.on(CollabEvent.DocSaveDraftInBatch, this.handleSaveDraftInBatch.bind(this));
  }

  async handleShowPage(event: EventData): Promise<void> {
    console.log('handleShowPage', event);
    await router.push({ name: event.name + `T${tutorialIndex}`, query: qs as LocationQueryRaw });
  }

  handleSaveDraftInBatch(): Promise<SaveDraftAcked> {
    const map = { ...this.engine.reactStore.context.encounterSyncIdMap };
    const events: SyncEvent[] = [];

    Object.entries(map).forEach(([syncId, context]) => {
      events.push({
        type: StateEvent.RESOLVE,
        machineId: MachineId.ENCOUNTER,
        syncId,
        forceSyncId: true,
        context,
      });
    });

    return EngineClient.getInstance().saveDraftInBatch(events);
  }

  createInitSyncEvent(stateJSON: Record<string, unknown>): SyncEvent {
    const event = super.createInitSyncEvent(stateJSON);

    if (typeof qs.syncId === 'string' && qs.syncId.length > 0) {
      event.syncId = qs.syncId;
      event.forceSyncId = true;
    } else {
      event.syncId = nanoid();
    }

    return event;
  }

  static getInstance(): MainEngine {
    if (!MainEngine.instance) {
      MainEngine.instance = new MainEngine();
    }

    return MainEngine.instance;
  }
}

const mainEngine = MainEngine.getInstance();

export { mainEngine, MainEngine };
