import { defineConfig } from 'windicss/helpers';

export default defineConfig({
  darkMode: false,
  extract: {
    //#region windicss
    include: ['src/**/*.{vue,html,jsx,tsx}', 'node_modules/@asus-aics/xhis-form-builder-v1/dist/*.js'],
    //#endregion windicss
  },
});
