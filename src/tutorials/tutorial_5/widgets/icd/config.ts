import type { WidgetConfig } from '@/utils/tool';

const config: WidgetConfig = {
  name: 'w-demo-icd', // name of the widget, must match this format ^w-[a-z0-9.]+-[a-z0-9.]+$
  displayName: 'ICD', // display name of the widget for layout editor
  description: 'Hello world', // description to display on widget selector
  w: 6, // default width
  h: 6, // default height
  minW: 4, // min width on resizing
  minH: 5, // min height on resizing
  maxH: 8, // max width on resizing
  maxW: 10, // max height on resizing
  extra: {}, // extra properties if needed
};

export default config;
