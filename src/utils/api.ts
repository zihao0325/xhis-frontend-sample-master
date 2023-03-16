import axios, { type AxiosInstance, CancelTokenSource } from 'axios';
import CONSTANTS from './constants';
import { useEncounterStateEngine, useOpdStateEngine } from '@asus-aics/x-fe-engine';

export type InspectData = {
  syncId?: string;
};

class Api {
  serviceClient: AxiosInstance;
  stateClient: AxiosInstance;
  ruleClient: AxiosInstance;
  jwtToken: string;

  private icdSearchCancelToken: CancelTokenSource | null = null;

  constructor() {
    this.serviceClient = this.createClient(import.meta.env.VITE_WIDGET_SDK_BACKEND_URL);
    this.stateClient = this.createClient(this.getStateApiUrl(), '');
    this.ruleClient = this.createClient(this.getRuleApiUrl(), '');
  }

  getJwtToken() {
    return this.jwtToken;
  }

  setJwtToken(token: string) {
    this.jwtToken = token;
  }

  createClient(baseURL: string, path = '/api/'): AxiosInstance {
    const client = axios.create({
      baseURL: `${baseURL}${path}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    client.interceptors.request.use(async (config) => {
      // eslint-disable-next-line no-param-reassign
      config.headers = {
        authorization: this.jwtToken,
        ...config.headers,
      };
      return config;
    });

    return client;
  }

  getWebUrl(): string {
    return import.meta.env.VITE_WIDGET_SDK_BACKEND_URL;
  }

  getServiceBaseUrl(): string {
    return this.getWebUrl();
  }

  getStateApiUrl(): string {
    return `${this.getWebUrl()}/api/state`;
  }

  getRuleApiUrl(): string {
    return `${this.getWebUrl()}/api/rule`;
  }

  async runRule(payload) {
    const { engine: encounterEngine } = useEncounterStateEngine();
    const { engine: opdEngine } = useOpdStateEngine();
    await Promise.all(
      [encounterEngine, opdEngine].map((engine) => {
        if (engine && engine.isCollabConnected()) {
          return engine.isSync();
        }
        return Promise.resolve();
      })
    );
    return this.ruleClient.post('/runner', payload);
  }

  async updateEngineChart(machineId: string, chart: any): Promise<any> {
    console.log('updateEngineChart', chart);
    return this.stateClient.put(`/chart/${machineId}`, chart, {
      params: {
        type: 'dynamic',
      },
    });
  }

  async loadEngineChart(machineId: string): Promise<any> {
    return this.stateClient.get(`/chart/${machineId}`, {
      params: {
        type: 'dynamic',
      },
    });
  }

  async userInformation() {
    return this.serviceClient.get(CONSTANTS.SERVICES.ME, {
      // #region userInformationHeaders
      headers: {
        authorization: `Bearer ${this.jwtToken}`,
      },
      // #endregion userInformationHeaders
    });
  }

  async searchIcd(params: Record<string, string | undefined>) {
    if (this.icdSearchCancelToken) {
      this.icdSearchCancelToken.cancel();
    }
    this.icdSearchCancelToken = axios.CancelToken.source();
    try {
      return (
        await this.serviceClient.get('icd/icd-search', {
          params,
          cancelToken: this.icdSearchCancelToken.token,
        })
      ).data;
    } catch (err) {
      if (axios.isCancel(err)) {
        return [];
      }

      throw err;
    }
  }

  async postIcdInfo(data: Array<Record<string, unknown>>) {
    return (await this.serviceClient.post('icd/icd-info', data)).data;
  }
}

const api = new Api();
export { api, Api };
