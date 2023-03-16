import { DialoguePlugin } from '@asus-aics/xui';
import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import './assets/main.css';
import * as ExtXFeEngine from '@asus-aics/x-fe-engine';
import { api } from '@asus-aics/x-fe-utils';
// #region windicss
import 'virtual:windi.css';
import '@asus-aics/xhis-widget-framework/dist/style.css';
// #endregion windicss
import '@asus-aics/xui/xui.css';
import '@asus-aics/xhis-form-builder-v1/style.css';
import { FormBuilderPlugin } from '@asus-aics/xhis-form-builder-v1';
import { api as localAPI } from '@/utils/api';

const apiURL = import.meta.env.VITE_WIDGET_SDK_BACKEND_URL + '/api';
// do not change this or update fe util api target for localhost
api.client = api.initClient(apiURL);
api.setJwtToken(import.meta.env.VITE_WIDGET_SDK_DEV_TOKEN);
localAPI.setJwtToken(import.meta.env.VITE_WIDGET_SDK_DEV_TOKEN);

const app = createApp(App);
app.use(router);
app.use(DialoguePlugin);
app.use(FormBuilderPlugin);
app.mount('#app');

declare global {
  interface Window {
    ExtXFeEngine?: unknown;
  }
}
window.ExtXFeEngine = ExtXFeEngine;
