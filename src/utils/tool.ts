export function sleep(ms = 0): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
export type WidgetConfig = {
  /** should be w-aics-"widgetname", where "widgetname" can only contains number and english char */
  name: string;
  displayName: string;
  description: string;
  minW: number;
  minH: number;
  maxW: number;
  maxH: number;
  w: number;
  h: number;
  extra: object;
};
