/* eslint-disable @typescript-eslint/no-explicit-any */
import emitter from '@asus-aics/x-fe-emitter';
import { EngineEvent, NotifyEvent, NotifySource, SocketEvent, SyncEvent } from '@asus-aics/x-fe-engine';
import { EventEmitter2 } from 'eventemitter2';
import { io, Socket } from 'socket.io-client';

export enum EngineChannelEvent {
  Connected = 'engineChannelConnected',
  Disconnected = 'engineChannelDisconnected',
  ServerSync = 'engineChannelServerSync',
}
export class EngineClient extends EventEmitter2 {
  private static instance: EngineClient;
  client?: Socket;
  authToken: string;
  readyPromise: Promise<void>;
  readyResolve?: (value: void) => void;

  constructor() {
    super();

    this.authToken = '';
    this.readyPromise = this.createReadyPromise();
  }

  createReadyPromise(): Promise<void> {
    return new Promise((resolve) => {
      this.readyResolve = resolve;
    });
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  getAuthToken(): string {
    return this.authToken;
  }

  async connect(baseUrl: string): Promise<boolean> {
    if (this.client?.connected) {
      return true;
    }

    const url = new URL(baseUrl);
    let basePath = url.pathname;
    if (basePath.endsWith('/')) {
      basePath = basePath.slice(0, -1);
    }

    return new Promise((resolve, reject) => {
      this.client = io(url.origin, {
        transports: ['websocket'],
        upgrade: false,
        path: `${basePath}/socket.io`,
        auth: {
          token: this.getAuthToken(),
        },
      });

      this.client.once('connect', () => {
        resolve(true);
        this.client?.on('connect', this.handleConnect.bind(this));
      });
      this.client.on('connect_error', (err) => reject(err));
      this.client.on('disconnect', this.handleDisconnect.bind(this));
      this.client.on(SocketEvent.SaveDraftProgress, this.handleSaveDraftProgress.bind(this));
      this.client.on(SocketEvent.Notify, this.handleNotify.bind(this));
      this.client.on(EngineEvent.SYNC, this.handleServerEngineSync.bind(this));
    });
  }

  handleConnect(): void {
    emitter.emit(EngineChannelEvent.Connected);
  }

  handleDisconnect(): void {
    emitter.emit(EngineChannelEvent.Disconnected);
  }

  handleServerEngineSync(event: SyncEvent): void {
    emitter.emit(EngineChannelEvent.ServerSync, event);
  }

  handleSaveDraftProgress(progress: unknown): void {
    emitter.emit(SocketEvent.SaveDraftProgress, progress);
  }

  handleNotify(event: NotifyEvent, source: NotifySource): void {
    emitter.emit(SocketEvent.Notify, event, source);
  }

  /**
   * Init a state machine on server side.
   */
  init(event: SyncEvent): Promise<InitAcked> {
    return new Promise((resolve) => {
      if (!this.client?.connected) {
        throw new Error('init fail, client is disconnected');
      }

      this.client.emit(SocketEvent.Init, event, (resp: InitAcked) => {
        resolve(resp);
      });
    });
  }

  send(event: SyncEvent): void {
    if (!this.client?.connected) {
      return;
    }
    console.log('EngineClient.send', event);
    this.client.emit(SocketEvent.Send, event);
  }

  async leave(syncId: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.client?.connected) {
        resolve(true);
        return;
      }

      this.client.emit(SocketEvent.Leave, syncId, ({ success }: { success: boolean }) => {
        resolve(success);
      });
    });
  }

  async saveDraft(event: SyncEvent): Promise<SaveDraftAcked> {
    return new Promise((resolve) => {
      if (!this.client?.connected) {
        return { success: false };
      }

      this.client.emit(SocketEvent.SaveDraft, event, (acked: SaveDraftAcked) => {
        resolve(acked);
      });
    });
  }

  async completeEncounter(event: SyncEvent): Promise<CompleteEncounterAcked> {
    return new Promise((resolve) => {
      if (!this.client?.connected) {
        return { success: false };
      }

      this.client.emit(SocketEvent.CompleteEncounter, event, (acked: CompleteEncounterAcked) => {
        resolve(acked);
      });
    });
  }

  async abandonCurrentEdit(event: SyncEvent): Promise<AbandonCurrentEditAcked> {
    return new Promise((resolve) => {
      if (!this.client?.connected) {
        return { success: false };
      }

      this.client.emit(SocketEvent.AbandonCurrentEdit, event, (acked: AbandonCurrentEditAcked) => {
        resolve(acked);
      });
    });
  }

  async saveCatastrophicData(event: SyncEvent): Promise<SaveCataAcked> {
    return new Promise((resolve) => {
      if (!this.client?.connected) {
        return { success: false };
      }

      this.client.emit(SocketEvent.SaveCatastrophicData, event, (acked: SaveCataAcked) => {
        resolve(acked);
      });
    });
  }

  async saveDraftInBatch(events: SyncEvent[]): Promise<SaveDraftAcked> {
    return new Promise((resolve) => {
      if (!this.client?.connected) {
        return { success: false };
      }

      this.client.emit(SocketEvent.SaveDraftInBatch, events, (acked: SaveDraftAcked) => {
        resolve(acked);
      });
    });
  }

  async fetch(syncId: string): Promise<any> {
    return new Promise((resolve) => {
      if (!this.client?.connected) {
        throw new Error('fetch fail, client is disconnected');
      }

      this.client.emit(SocketEvent.Fetch, syncId, ({ state }: { state: any }) => {
        resolve(state);
      });
    });
  }

  static getInstance(): EngineClient {
    if (!EngineClient.instance) {
      EngineClient.instance = new EngineClient();
    }
    return EngineClient.instance;
  }
}
