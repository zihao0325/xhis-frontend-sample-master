import { inject, InjectionKey, provide } from 'vue';

export const xhisWidgetConfigExtra = {
  // IcdEditor
  enableIcdCpoe: true,
  enableIcdSelectedLimit: true,
  enableIcdItemChineseDisplay: false,
};

export type WidgetConfigExtra = typeof xhisWidgetConfigExtra;

const widgetConfigExtraKey = Symbol('widgetConfigExtraKey') as InjectionKey<WidgetConfigExtra>;

export const useWidgetConfig = () => {
  const setWidgetConfig = (extra: Record<string, unknown> | undefined) => {
    provide(widgetConfigExtraKey, {
      ...xhisWidgetConfigExtra,
      ...(extra ?? {}),
    });
  };

  const getWidgetConfig = (): WidgetConfigExtra => {
    return {
      ...xhisWidgetConfigExtra,
      ...inject(widgetConfigExtraKey, {}),
    };
  };

  return {
    setWidgetConfig,
    getWidgetConfig,
  };
};
