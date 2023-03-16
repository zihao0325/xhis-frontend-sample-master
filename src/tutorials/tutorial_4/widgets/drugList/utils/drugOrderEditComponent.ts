import { reactive } from 'vue';
import { EncounterDrugSchema } from '@asus-aics/x-fe-engine';
import { DrugColumnProperty, getColumnValue, getItemId, updateColumn } from '../../../utils/encounterDrugUtils';

export type DrugOptionItem = {
  code: string | number;
  display: string;
  drugDailyFrequency?: number;
  drugNewFrequency?: string;
  drugFrequencyDisplay?: string;
  drugMethod?: string;
  active: boolean;
  isGroupLabel?: boolean;
};
export type DrugOptions = Array<DrugOptionItem | number>;
export type DrugOptionsMap = Record<string, DrugOptions>;

export enum DrugOptionCategory {
  FREQUENCY = 'medicationFrequency',
  ROUTE = 'medicationRoute',
  PAYMENT_TYPE = 'paymentType',
  GRINDING_GROUP = 'grindingGroup',
  RP_LENGTH = 'rpLength',
  TAKE_ALL_DRUGS = 'takeAllDrugs',
}
export enum EditCellType {
  TEXT = 'text',
  NUMBER = 'number',
}

const getColumnKey = (item: EncounterDrugSchema, index: string) => {
  return `${getItemId(item)}-${index}`;
};

const updateItem = (
  item: EncounterDrugSchema,
  col: keyof EncounterDrugSchema,
  newValue: typeof item[typeof col],
  options = { doDependencyCheck: true, runRule: true }
): void => {
  const { doDependencyCheck = true, runRule = true } = options;
  const storedValue = newValue;
  const prev = (item?.[col] as { value: any })?.value;

  if (storedValue !== prev) {
    // updateColumnProperty(item, col, 'previous', prev);
    updateColumn(item, col, storedValue);

    // if (doDependencyCheck) {
    //   checkDependency(item, col);
    // }
    // if (needToRunRule.value && runRule) {
    //   runEditRule([{ item, col, property: 'value' }]);
    // }
  }
};

export const useEditComponent = () => {
  const columnEditState = reactive<Record<string, boolean>>({});
  const columnTmpValue: Record<string, unknown> = {};

  const isEditing = (item: EncounterDrugSchema, index: string) => {
    return !!columnEditState[getColumnKey(item, index)];
  };

  const isValid = (item: EncounterDrugSchema, index: string): boolean => {
    return (item[index] as DrugColumnProperty<unknown>)?.valid !== false;
  };

  const isEditable = (item: EncounterDrugSchema, index: string): boolean => {
    return (item[index] as DrugColumnProperty<unknown>)?.editable !== false;
  };

  const handleCellBlur = (item: EncounterDrugSchema, index: string) => {
    if (columnTmpValue[getColumnKey(item, index)] !== undefined) {
      updateItem(item, index, columnTmpValue[getColumnKey(item, index)]);
    }
    clearEdit(item, index);
  };
  const handleCellFocus = (item: EncounterDrugSchema, index: string) => {
    columnEditState[getColumnKey(item, index)] = true;
  };

  const clearEdit = (item: EncounterDrugSchema, index: string) => {
    columnEditState[getColumnKey(item, index)] = false;
    delete columnTmpValue[getColumnKey(item, index)];
  };

  const getAutocompleteProps = (
    item: EncounterDrugSchema,
    index: keyof EncounterDrugSchema,
    cellType: EditCellType,
    optionCategory: DrugOptionCategory,
    extra = {}
  ) => {
    const commonProps = {
      keyIndex: 'code',
      getOptionLabel: (option: DrugOptionItem) => option.code,
      getOptionValue: (option: DrugOptionItem) => option.code,
      size: 'sm',
      blurOnSelect: true,
      combobox: isEditing(item, index),
      disabled: !isEditable(item, index),
      error: !isValid(item, index),
      onBlur: () => {
        handleCellBlur(item, index);
        // // TODOITEM: consider a better way to merge onBlur callback
        // (inputPropsForRule?.onBlur as () => void)?.();
      },
      onFocus: () => {
        handleCellFocus(item, index);
        // // TODOITEM: consider a better way to merge onFocus callback
        // (inputPropsForRule?.onFocus as () => void)?.();
      },
      modelValue: getColumnValue(item, index),
      'onUpdate:modelValue': (value: unknown) => {
        columnTmpValue[getColumnKey(item, index)] = value;
      },
      tippyOptions: {
        appendTo: (document.getRootNode() as Document)?.body,
      },
      sort: optionCategory === DrugOptionCategory.FREQUENCY,
      sortWithKey: optionCategory === DrugOptionCategory.FREQUENCY ? 'drugFrequencyDisplay' : '',
      ...extra,
    };

    if (cellType === EditCellType.NUMBER) {
      return {
        inputAttrs: {
          borderless: true,
          inputAttrs: {
            style: {
              textAlign: 'right',
            },
          },
        },
        ...commonProps,
      };
    } else {
      return {
        inputAttrs: {
          borderless: true,
        },
        ...commonProps,
      };
    }
  };

  const getInputProps = (item: EncounterDrugSchema, index: keyof EncounterDrugSchema, extra = {}) => {
    return {
      type: 'number',
      size: 'sm',
      borderless: true,
      inputAttrs: {
        style: {
          textAlign: 'right',
        },
      },
      error: !isValid(item, index),
      modelValue: getColumnValue(item, index) + '',
      onFocusout: () => handleCellBlur(item, index),
      onFocusin: (event: Event) => {
        handleCellFocus(item, index);
        (event?.target as HTMLInputElement)?.select();
      },
      'onUpdate:modelValue': (value: string) => {
        columnTmpValue[getColumnKey(item, index)] = Number(value);
      },
      ...extra,
    };
  };

  return {
    getAutocompleteProps,
    getInputProps,
    isEditing,
  };
};
