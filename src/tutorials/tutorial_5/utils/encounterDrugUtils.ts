import { nanoid } from 'nanoid';
import { EncounterDrugSchema } from '@asus-aics/xhis-schema';

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

export const getColumnValue = <T>(
  item: EncounterDrugSchema | undefined,
  col: keyof EncounterDrugSchema
): T | undefined => {
  return item[col]?.value as T;
};

export const getItemId = (item: EncounterDrugSchema): string => {
  let id = getColumnValue<string>(item, 'itemId');
  if (!id) {
    id = nanoid();
    updateColumn(item, 'itemId', id);
  }
  return id;
};

export const genColumn = <T>(value: T): DrugColumnProperty<T> => {
  return {
    value,
    previous: value,
  };
};

export const updateColumn = <T>(item: EncounterDrugSchema, col: keyof EncounterDrugSchema, newValue: T): void => {
  if (item[col] === undefined) {
    item[col] = genColumn(newValue);
  } else {
    item[col].value = newValue;
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

  item[col][property] = value;
};
