import { nanoid } from 'nanoid';
import { DrugSchema, EncounterDrugSchema } from '@asus-aics/xhis-schema';

export interface DrugColumnProperty<T> {
  value: T;
  required?: boolean;
  editable?: boolean;
  enable?: boolean;
  valid?: boolean;
  previous?: T;
  error?: string;
  disableOptions?: [];
}

export const isEncounterDrug = (x: unknown): x is EncounterDrugSchema => {
  return (x as EncounterDrugSchema).source !== undefined && (x as EncounterDrugSchema).drugCode?.value !== undefined;
};

export const genColumn = <T>(value: T): DrugColumnProperty<T> => {
  return {
    value,
    previous: value,
  };
};

export const genColumnPerObjectKey = (obj: Record<string, unknown>): Record<string, DrugColumnProperty<unknown>> => {
  const result: Record<string, DrugColumnProperty<unknown>> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = genColumn(value);
  }
  return result;
};

export const updateColumn = <T>(item: EncounterDrugSchema, col: keyof EncounterDrugSchema, newValue: T): void => {
  if (item[col] === undefined) {
    item[col] = genColumn(newValue);
  } else {
    (item[col] as DrugColumnProperty<T>).value = newValue;
  }
};

export const updateColumnProperty = (
  item: EncounterDrugSchema,
  col: keyof EncounterDrugSchema,
  property: keyof DrugColumnProperty<unknown>,
  value: unknown
): void => {
  if (item[col] === undefined) {
    item[col] = genColumn(undefined);
  }
  // TODOITEM: don't know how to fix this type QQ
  (item[col] as DrugColumnProperty<unknown>)[property] = value;
};

export const getColumnValue = <T>(
  item: EncounterDrugSchema | undefined,
  col: keyof EncounterDrugSchema
): T | undefined => {
  return (item?.[col] as DrugColumnProperty<T>)?.value;
};

export const getColumnDefaultValue = <T>(
  item: EncounterDrugSchema | undefined,
  col: keyof DrugSchema
): T | undefined => {
  if (item?.source === undefined) {
    // fallback to item values if source is not found (which should not happen)
    return getColumnValue(item, col);
  }

  const res = item?.source?.[col];
  // @ts-expect-error: res might be yjs array with toJSON fn
  return res?.toJSON?.() ?? (res as T);
};

/**
 * Return the itemId of this item or generate one if not exists
 *
 * @param item
 * @returns {string} original item id or the generated one
 */
export const getItemId = (item: EncounterDrugSchema): string => {
  let id = getColumnValue<string>(item, 'itemId');
  if (!id) {
    id = nanoid();
    updateColumn(item, 'itemId', id);
  }
  return id;
};

/**
 * Get default value from EncounterDrugSchema or DrugSchema
 */
export const getDefaultValue = <T>(item: EncounterDrugSchema | DrugSchema, col: string): T | undefined => {
  if (isEncounterDrug(item)) {
    return getColumnDefaultValue<T>(item, col);
  }

  const res = item[col];
  // @ts-expect-error: res might be yjs array with toJSON fn
  return res?.toJSON?.() ?? (res as T);
};
