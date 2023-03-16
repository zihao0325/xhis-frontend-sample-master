/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEqual } from 'lodash';
import { api } from '@/utils/api';
import { EngineClient, EngineChannelEvent } from '@/utils/engineClient';
import { useMachine } from '@/utils/xstateWrapper';
import {
  EngineEvent,
  MachineId,
  StateEvent,
  SyncEvent,
  useOpdStateEngine,
  BaseStateEngine,
  CollabEvent,
} from '@asus-aics/x-fe-engine';
import emitter from '@asus-aics/x-fe-emitter';
import { inspect } from '@xstate/inspect';
import { Interpreter } from 'xstate';

class EngineBase {
  engine: BaseStateEngine<any>;
  isDev = false;
  service?: Interpreter<any, any, any, any>;
  lastStateJSON?: Record<string, unknown>;

  constructor() {
    this.engine = this.getEngine();
    this.registerEvents();
  }

  getEngine(): BaseStateEngine<any> {
    return new BaseStateEngine<any>();
  }

  registerEvents(): void {
    this.engine.core.on(EngineEvent.STATE_MISMATCH, this.fetchState.bind(this));
    this.engine.core.on(EngineEvent.ACKED, this.handleDevService.bind(this));
    this.engine.core.on(EngineEvent.SYNCED, this.handleEngineSynced.bind(this));

    emitter.on(EngineChannelEvent.Disconnected, this.handleChannelDisconnected.bind(this));
    emitter.on(EngineChannelEvent.Connected, this.handleChannelConnected.bind(this));
    emitter.on(EngineChannelEvent.ServerSync, this.handleServerEngineSync.bind(this));
    emitter.on(CollabEvent.DocReset, this.handleDocReset.bind(this));
  }

  async handleChannelConnected(): Promise<void> {
    await this.initConnect(true);
    this.lastStateJSON = undefined;
  }

  handleChannelDisconnected(): void {
    this.lastStateJSON = this.getStateJSON();
    this.engine.disconnectCollab();
  }

  async handleDocReset(syncId: string): Promise<boolean> {
    if (syncId !== this.getSyncId()) {
      return true;
    }

    return EngineClient.getInstance().leave(syncId);
  }

  enableDevTool(): void {
    this.isDev = true;
    inspect({
      iframe: false,
      url: `${api.getServiceBaseUrl()}/stately/viz?inspect`,
    });
  }

  getMachineId(): MachineId {
    return this.engine.core.getMachineId();
  }

  getSyncId(): string {
    return this.engine.core.getSyncId();
  }

  setSyncId(syncId: string): void {
    this.engine.core.setSyncId(syncId);
  }

  async handleServerEngineSync(event: SyncEvent): Promise<void> {
    if (event.machineId !== this.getMachineId() || event.syncId !== this.getSyncId()) {
      return;
    }

    console.log('handleServerEngineSync', {
      syncId: this.getSyncId(),
      machineId: this.getMachineId(),
      event,
    });

    // check new chart from server side
    if (event?.chart) {
      this.setChart(event.chart);
    }

    if (event.syncState) {
      this.engine.core.confirmState(event.syncState);
    }
  }

  async fetchState(): Promise<void> {
    const state = await EngineClient.getInstance().fetch(this.getSyncId());

    this.engine.core.resolveState(state);
    this.engine.core.handleEngineAck(state, { type: StateEvent.RESOLVE });
  }

  handleDevService(): void {
    const state = this.engine.core.getState();

    if (!this.isDev) {
      return;
    }

    if (!this.service) {
      const { service } = useMachine(this.engine.core.machine, {
        devTools: true,
        state,
      });
      this.service = service;
    } else if (this.service) {
      const nextState = this.service.nextState(state.event);

      if (nextState?.value === state.value) {
        this.service.send(state.event);
      } else if (this.service.state.value !== state.value) {
        // next != current and current != current => reset
        this.service.stop();
        this.service.start(state);
      }
    }
  }

  handleEngineSynced(event: SyncEvent): void {
    if (event.type === StateEvent.SELF) {
      return;
    }
    console.log('handleEngineSynced', event);
    EngineClient.getInstance().send(event);
  }

  createInitSyncEvent(stateJSON: Record<string, unknown>): SyncEvent {
    const event = {
      type: StateEvent.RESOLVE,
      machineId: this.engine.core.getMachineId(),
      syncState: this.engine.core.getSyncState(),
      data: {
        stateJSON,
      },
    };
    console.log('createInitSyncEvent', event);
    return event;
  }

  setChart(chart: unknown): void {
    if (isEqual(chart, this.engine.core.getConfigChart())) {
      return;
    }
    const oldState = this.engine.core.getState();
    this.engine.core.setChart(chart);
    this.engine.core.initMachine();
    this.engine.core.resolveState(oldState);
    console.log('setChart', `${oldState}`)

    // reset xstate service
    this.service = undefined;
    this.handleDevService();
  }

  async initConnect(reconnect = false): Promise<boolean> {
    const client = EngineClient.getInstance();
    const stateJSON = this.lastStateJSON || this.getStateJSON();
    const event: SyncEvent = this.createInitSyncEvent(stateJSON);
    const originSyncId = this.getSyncId();
    if (reconnect) {
      console.log('reconnect')
      // keep syncId if it is existed
      event.forceSyncId = true;
      event.syncId = this.getSyncId();

      // handle reconnect scenario exclusively here
      // we rebuild syncedstore and assign it to reactstore
      // after the very first ydoc update
      // which should mitigate the whiteout caused by empty ydoc
      this.engine.ydoc?.destroy();
      this.engine.ydoc = this.engine.createYDoc();
      this.engine.ydoc.once('update', () => {
        this.engine.store = this.engine.createStore();
      });
    }

    console.log('beforeInitConnect', {
      event,
      originSyncId,
      engineStore: this.engine.store,
    });

    // build socket.io connection
    const resp = await client.init(event);
    if (!resp?.syncId) {
      return false;
    }

    console.log('afterInitConnect', {
      resp,
      originSyncId,
      thisSyncId: this.getSyncId(),
    });

    if (this.getSyncId() !== originSyncId) {
      return false;
    }

    this.setSyncId(resp.syncId);
    this.engine.setOrigin(api.getStateApiUrl());
    this.engine.setAuth(EngineClient.getInstance().getAuthToken());
    // build websocket connection
    return this.engine.connectCollab(this.getSyncId());
  }

  getStateJSON(): Record<string, unknown> {
    return this.engine?.core.state.toJSON();
  }

  getAuth(): string {
    const { engine } = useOpdStateEngine();

    return engine.core.getContext().auth?.jwt || '';
  }
}

export { EngineBase };
