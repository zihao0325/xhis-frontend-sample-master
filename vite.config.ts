import { fileURLToPath, URL } from 'node:url';
import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import XuiJson from './node_modules/@asus-aics/xui/package.json';
import WindiCSS from 'vite-plugin-windicss';
import OpdJson from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  mode: 'production',
  // #region windicss
  plugins: [vue(), WindiCSS()],
  // #endregion windicss
  server: {
    port: 5173,
  },
  define: {
    __XUI_VER__: JSON.stringify(XuiJson.version),
    __OPD_VER__: JSON.stringify(OpdJson.version),
  },
  build: {
    assetsDir: 'opd-assets',
    sourcemap: true,
  },
  resolve: {
    // if change alias, you should also change alias in src/scripts/build.config.mjs
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@xui': path.resolve(__dirname, 'node_modules', '@asus-aics/xui'),
    },
    dedupe: ['vue'],
  },
});
