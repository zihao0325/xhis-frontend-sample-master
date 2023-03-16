import type { WidgetConfig } from '@/utils/tool';

const config: WidgetConfig = {
  name: 'w-demo-navbar', // name of the widget, must match this format ^w-[a-z0-9.]+-[a-z0-9.]+$
  displayName: 'Navbar', // display name of the widget for layout editor
  description: 'Navbar', // description to display on widget selector
  w: 16, // default width
  h: 1, // default height
  minW: 1, // min width on resizing
  minH: 1, // min height on resizing
  maxH: 9, // max width on resizing
  maxW: 16, // max height on resizing
  extra: {}, // extra properties if needed
};

export default config;
