import { EngineClient } from '@/utils/engineClient';
import emitter from '@asus-aics/x-fe-emitter';
import engineMap, {
  SyncEvent,
  EncounterStateEngine,
  CatastrophicIllnessSchema,
  OpdStateEngine,
  EngineEvent,
  EncounterClass,
  useOpdStateEngine,
  StateEvent,
  MachineId,
  CollabEvent,
} from '@asus-aics/x-fe-engine';
import { Native } from '@asus-aics/x-fe-native';
import { pick, set } from 'lodash';
import { nextTick } from 'vue';
import { EngineBase } from './base';

const { engine: encounterInstance } = engineMap.useEncounterStateEngine();

class EncounterEngine extends EngineBase {
  private static instance: EncounterEngine;
  engine: EncounterStateEngine = encounterInstance;
  opd: OpdStateEngine;

  constructor() {
    super();
    this.opd = this.getOpdEngine();
  }

  getEngine(): EncounterStateEngine {
    return encounterInstance;
  }

  getOpdEngine(): OpdStateEngine {
    const { engine } = useOpdStateEngine();

    return engine;
  }

  registerEvents(): void {
    super.registerEvents();

    this.engine.core.on(EngineEvent.SWITCH, this.handleSwitch.bind(this));
    emitter.on(CollabEvent.DocSaveDraft, this.handleSaveDraft.bind(this));
    emitter.on(CollabEvent.DocAbandonCurrentEdit, this.handleAbandonCurrentEdit.bind(this));
    emitter.on(CollabEvent.DocCompleteEncounter, this.handleCompleteEncounter.bind(this));
    emitter.on(CollabEvent.DocSaveCatastrophicIllness, this.handleSaveCatastrophicData.bind(this));
  }

  async handleSwitch(syncId: string, context: Record<string, unknown>): Promise<void> {
    const result = await this.initConnect();

    if (!result) {
      return;
    }

    // opd related fields
    set(this.opd.reactStore.context, ['encounterSyncId'], this.getSyncId());
    set(
      this.opd.reactStore.context,
      ['encounterSyncIdMap', this.getSyncId()],
      pick(context, ['encounterId', 'encounterClass'])
    );

    // encounter related fields
    this.engine.setAwarenessData({
      user: Object.assign({}, this.opd.reactStore.context.user),
      computer: await Native.getHostName(),
    });
  }

  createInitSyncEvent(stateJSON: Record<string, unknown>): SyncEvent {
    stateJSON.context = Object.assign(
      {
        encounterClass: EncounterClass.Outpatient,
      },
      stateJSON.context
    );

    return super.createInitSyncEvent(stateJSON);
  }

  async handleSaveDraft(syncId: string, context: Record<string, unknown>): Promise<SaveDraftAcked> {
    const event: SyncEvent = {
      type: StateEvent.RESOLVE,
      machineId: MachineId.ENCOUNTER,
      syncId,
      forceSyncId: true,
      context,
    };

    await this.engine.isSync();

    const result = await EngineClient.getInstance().saveDraft(event);

    if (result.success && syncId === this.getSyncId()) {
      if (result.encounterStatus) {
        set(this.engine.reactStore.context, ['encounterStatus'], result.encounterStatus);
      }

      if (result.customDefined?.encounterNum) {
        set(this.engine.reactStore.context, ['customDefined', 'encounterNum'], result.customDefined.encounterNum);
      }

      await nextTick();
    }

    return result;
  }

  async handleCompleteEncounter(syncId: string, context: Record<string, unknown>): Promise<CompleteEncounterAcked> {
    const event: SyncEvent = {
      type: StateEvent.RESOLVE,
      machineId: MachineId.ENCOUNTER,
      syncId,
      forceSyncId: true,
      context,
    };

    await this.engine.isSync();

    const result = await EngineClient.getInstance().completeEncounter(event);

    if (result.success && syncId === this.getSyncId()) {
      if (result.encounterStatus) {
        set(this.engine.reactStore.context, ['encounterStatus'], result.encounterStatus);
      }

      if (result.customDefined?.encounterNum) {
        set(this.engine.reactStore.context, ['customDefined', 'encounterNum'], result.customDefined.encounterNum);
      }

      await nextTick();
    }

    return result;
  }

  async handleAbandonCurrentEdit(syncId: string): Promise<boolean> {
    const event: SyncEvent = {
      type: StateEvent.RESOLVE,
      machineId: MachineId.ENCOUNTER,
      syncId,
    };

    const result = await EngineClient.getInstance().abandonCurrentEdit(event);
    return result.success;
  }

  async handleSaveCatastrophicData(
    syncId: string,
    context: { patientId: string; practitionerId: string; data: CatastrophicIllnessSchema[] }
  ): Promise<boolean> {
    const event: SyncEvent = {
      type: StateEvent.RESOLVE,
      machineId: MachineId.ENCOUNTER,
      syncId,
      context,
    };

    await this.engine.isSync();

    const result = await EngineClient.getInstance().saveCatastrophicData(event);
    return result.success;
  }

  static getInstance(): EncounterEngine {
    if (!EncounterEngine.instance) {
      EncounterEngine.instance = new EncounterEngine();
    }

    return EncounterEngine.instance;
  }
}
const encounterEngine = EncounterEngine.getInstance();

export { encounterEngine, EncounterEngine };
