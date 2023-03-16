import { ComponentDefinition } from '@asus-aics/xhis-widget-framework';
export function getWidgets(): ComponentDefinition[] {
  const widgets = import.meta.globEager(`../widgets/*/index.ts`);
  return [...Object.values(widgets)] as ComponentDefinition[];
}
