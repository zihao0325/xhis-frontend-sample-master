import type { WidgetConfig } from '@/utils/tool';

const config: WidgetConfig = {
  name: 'w-demo-patientlist', // name of the widget, must match this format ^w-[a-z0-9.]+-[a-z0-9.]+$
  displayName: '病患清單', // display name of the widget for layout editor
  description: 'Patient List', // description to display on widget selector
  w: 6, // default width
  h: 9, // default height
  minW: 4, // min width on resizing
  minH: 5, // min height on resizing
  maxH: 8, // max width on resizing
  maxW: 10, // max height on resizing
  extra: {}, // custom properties for each widgets
};

export default config;
