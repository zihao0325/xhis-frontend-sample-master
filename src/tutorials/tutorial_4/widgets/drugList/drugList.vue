<template>
  <div class="drug-order">
    <div class="drug-order-header">
      <p>藥囑</p>
      <XInputText
        ref="inputRef"
        v-model="searchText"
        fill
        type="search"
        placeholder="輸入學名、商品名"
        :input-style="{
          width: width,
        }"
      />
      <div
        ref="scrollListRef"
        class="x-fe-drug-item-ul x-scroll-bar"
        :class="{
          'x-fe-drug-item-ul--hide': !searchText,
        }"
        :style="{ 'max-width': resultWidth, 'max-height': resultHeight, left: '320px' }"
      >
        <div v-if="isLoading" class="x-fe-drug-search-loading x-flex-center">
          <XIcon icon="spinner" color="var(--xv-text--medium-emphasis-text)" class="x-fe-drug-search-loading-icon" />
        </div>
        <div v-else-if="!drugList?.length" class="x-fe-drug-search-no-item">
          {{ searchText ? '查無相關藥物' : '輸入文字以搜尋新增藥品' }}
        </div>
        <div v-else>
          <section class="x-w-drug-item-group">
            <ul class="x-w-drug-item-ul">
              <li
                v-for="item in drugList"
                :key="item.drugCode"
                class="x-fe-drug-item-li x-fe-drug-item-li-action"
                :class="{
                  'x-fe-drug-item-li-action--active': false,
                }"
                @click="onSelectDrug(item)"
              >
                <div class="x-fe-drug-item-name x-ellipsis">
                  {{ item.drugDisplay ?? '--' }}
                </div>
                <div class="x-fe-drug-item-type x-ellipsis">
                  {{ item.drugGenericDisplay ?? '--' }}
                </div>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
    <div class="x-w-drug-order-table">
      <XTable key-index="itemId" :data="selectedDrug" :options="drugTableOptions">
        <template #cell-drugDisplay="{ item }">
          <div class="x-w-drug-order-name-cell">
            <div :style="{ display: 'flex', alignItems: 'center' }">
              <XIconButton
                size="sm"
                icon="dismiss"
                data-testid="delete"
                style="margin: 4px 0"
                @click="onDeleteDrug(getItemId(item))"
              />
              <div :key="item.drugCode" :item="item">
                <div class="x-fe-drug-item-name x-ellipsis">
                  {{ item.drugDisplay ?? '--' }}
                </div>
                <div class="x-fe-drug-item-type x-ellipsis">
                  {{ item.drugGenericDisplay ?? '--' }}
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-for="col in tableEditableCols" :key="col.index" #[`cell-${col.index}`]="{ item, index }">
          <div
            class="x-w-drug-order-table-center"
            :class="{
              'x-w-drug-order-table-cell': !!col.editComponent,
            }"
            data-qa-widget="drugEditor"
            :data-qa-key="index"
          >
            <div
              :class="{
                'x-w-drug-order-table-cell-replica': true,
                [`x-w-drug-order-table-cell-replica-${col.align || ''}`]: true,
                [col.replicaDivClass || '']: true,
              }"
            >
              {{ getDisplayText(item, index) }}
            </div>
            <component
              :is="col.editComponent"
              v-bind="col.editComponentProps?.(item, index)"
              class="x-w-drug-order-table-cell-edit-el"
              :class="{
                'x-w-drug-order-table-cell-editing': isEditing(item, index),
              }"
            />
          </div>
        </template>
      </XTable>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, computed, markRaw, onMounted, ref } from 'vue';
import { XAutocomplete, XInputText, XTable, XTableEntryOption, XIcon, XIconButton, XButton } from '@asus-aics/xui';
import { WidgetProps } from '@asus-aics/xhis-widget-framework';
import { DrugSchema, EncounterDrugSchema } from '@asus-aics/x-fe-engine';
import { DrugOptionCategory, DrugOptionItem, EditCellType, useEditComponent } from './utils/drugOrderEditComponent';
import { getItemId } from '../../utils/encounterDrugUtils';
import { nanoid } from 'nanoid';
import useDrugOptions from './compossable/useDrugOptions';
import useDrugList from './compossable/useDrugList';
import { useOpdInfo } from '../patientList/composable/useOpdInfo';

interface DrugTableEntryOption extends XTableEntryOption {
  editable?: boolean;
  editComponent?: Component;
  editComponentProps?: (item: EncounterDrugSchema, index: keyof EncounterDrugSchema) => Record<string, unknown>;
  editComponentEventHandler?: (item: EncounterDrugSchema, index: keyof EncounterDrugSchema) => Record<string, unknown>;
  replicaDivClass?: string;
}

const editableCellStyle = { padding: '0 1px' };
const editableHeadStyle = { padding: '0 8px', zIndex: '2' };

export default {
  name: 'DrugOrderSearch',
  components: { XInputText, XTable, XIcon, XIconButton, XButton },
  props: {
    ...WidgetProps,
    width: {
      type: String,
      default: '254px',
    },
    resultWidth: {
      type: String,
      default: '640px',
    },
    resultHeight: {
      type: String,
      default: '400px',
    },
  },
  setup() {
    const searchText = ref('');

    const selectedDrug = ref<DrugSchema[]>([]);
    const { frequencyOptions, getDrugOptions } = useDrugOptions();
    const { roomInfo } = useOpdInfo();
    const { getAutocompleteProps, getInputProps, isEditing } = useEditComponent();
    const { drugList, isLoading } = useDrugList(searchText, roomInfo, '', '');

    const drugTableOptions = computed<DrugTableEntryOption[]>(() => {
      const res: DrugTableEntryOption[] = [
        {
          index: 'drugDisplay',
          title: '藥名',
          align: 'left',
          width: 'minmax(352px, max-content)',
          cellClass: 'x-fe-drug-display-name x-fe-drug-table-first-cell',
          headClass: 'x-fe-drug-table-first-cell',
          headStyle: {
            zIndex: '3', // larger than other cell's header
            paddingLeft: '32px',
          },
          cellStyle: { justifyContent: 'space-between', paddingLeft: '0' },
        },
        {
          index: 'doseQuantity',
          title: '用量',
          align: 'right',
          cellStyle: editableCellStyle,
          headStyle: editableHeadStyle,
          editComponent: markRaw(XInputText),
          editComponentProps: (item, index) => getInputProps(item, index),
        },
        {
          title: '頻次',
          index: 'frequencyCode',
          align: 'left',
          cellStyle: editableCellStyle,
          headStyle: editableHeadStyle,
          replicaDivClass: 'x-w-drug-order-space-for-icon',
          editComponent: markRaw(XAutocomplete),
          editComponentProps: (item, index) =>
            getAutocompleteProps(item, index, EditCellType.TEXT, DrugOptionCategory.FREQUENCY, {
              options: frequencyOptions.value,
            }),
        },
        {
          title: '天數',
          index: 'supplyDays',
          align: 'right',
          cellStyle: editableCellStyle,
          headStyle: editableHeadStyle,
          editComponent: markRaw(XInputText),
          editComponentProps: (item, index) => getInputProps(item, index),
        },
        {
          title: '總量',
          align: 'right',
          index: 'totalQuantity',
          cellStyle: editableCellStyle,
          headStyle: editableHeadStyle,
          editComponent: markRaw(XInputText),
          editComponentProps: (item, index) => getInputProps(item, index),
        },
      ];
      return res;
    });

    const editableColsSet = new Set(['doseQuantity', 'frequencyCode', 'supplyDays', 'totalQuantity']);
    const tableEditableCols = drugTableOptions.value.filter((option) => editableColsSet.has(option.index));

    const getDisplayText = (item: EncounterDrugSchema, index: DrugTableEntryOption['index']) => {
      const fallbackText = '--';
      const value = item?.[index] as any;
      let text = value;

      switch (index) {
        case 'doseQuantity':
          if (typeof value !== 'number') {
            console.warn('[drugeditor] Wrong data type of doseQuantity');
          }
          text = (value as number).toFixed?.(2) ?? value;
          break;
        case 'frequencyCode':
          const option = frequencyOptions.value?.filter((option) => (option as DrugOptionItem).code === value)[0];
          if (option) {
            text = option.code ?? (value as string);
          }
          break;
      }
      return text ?? fallbackText;
    };

    const onSelectDrug = (drug: DrugSchema) => {
      drug.itemId = nanoid();
      selectedDrug.value.push(drug);
      drugList.value = [];
      searchText.value = '';
    };

    const onDeleteDrug = (id: string) => {
      const idx = selectedDrug.value?.findIndex((v) => getItemId(v) === id);
      if (idx !== undefined && idx !== -1) {
        selectedDrug.value.splice(idx, 1);
      }
      return idx;
    };

    onMounted(async () => {
      await getDrugOptions();
    });

    return {
      searchText,
      drugTableOptions,
      isLoading,
      drugList,
      onSelectDrug,
      selectedDrug,
      tableEditableCols,
      getDisplayText,
      isEditing,
      getItemId,
      onDeleteDrug,
    };
  },
};
</script>

<style lang="scss">
.drug-order {
  position: relative;
  width: 1000px;
  margin: 8px;
  padding: 8px;

  &-header {
    height: 40px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 16px;
    white-space: nowrap;
  }

  .x-fe-drug-item-ul {
    position: absolute;
    top: 8px;
    max-height: 400px;
    min-height: 0;
    width: 640px;
    padding: 0;
    background-color: var(--xv-container--surface);
    box-shadow: 0 0 8px 4px #2222;
    border-radius: 8px;
    overflow: auto;
    transition: opacity 0.25s;
    z-index: 999;
    &--hide {
      display: none;
    }

    .x-fe-drug-search-loading {
      height: 60px;
      width: 100%;
      background-color: var(--xv-container--surface);

      &-icon {
        width: 40px;
        height: 40px;
        animation: x-btn-loading-spin 0.5s linear infinite;
      }
    }

    .x-fe-drug-search-no-item {
      height: 60px;
      width: 100%;
      display: flex;
      padding: 0 32px;
      gap: 12px;
      align-items: center;
      background-color: var(--xv-container--disabled-background);
      color: var(--xv-text--disabled-text);
    }

    .x-w-drug-item {
      &-group {
        display: flex;
        flex-direction: column;

        &-header {
          color: var(--xv-text--medium-emphasis-text);
          margin-left: 4px;
          line-height: 1.875;
        }
      }

      &-ul {
        margin: 0;
        padding: 0;
        list-style: none;

        .x-fe-drug-item-li {
          height: 52px;
          padding: 8px;
          border-bottom: 1px solid rgba(38, 38, 38, 0.1);

          &-action {
            &:hover {
              background-color: var(--xv-container--surface-hovered);
            }

            &:active {
              background-color: var(--xv-container--surface-pressed);
            }

            &--active {
              background-color: var(--xv-container--surface-active);
            }

            &:not(:disabled) {
              cursor: pointer;
            }
          }
        }
      }
    }
  }

  .x-fe-drug-item-type {
    color: var(--xv-text--low-emphasis-text);
  }

  .x-w-drug-order-table {
    grid-area: table;
    min-height: 0;
    min-width: 0;
    margin-bottom: 8px;

    .x-input-text-container {
      padding: 0 4px;
      // set transparent bg for replica text be able to show up
      background: transparent;
    }

    .x-input-input {
      width: 100%;
      padding: 0 4px;
      // hide input text by setting color transparent when cell is not editing
      color: transparent;
    }

    &-center {
      margin-top: 6px; // cell margin-top + drug item cell padding
      height: 32px;
      display: flex;
      align-items: center;
    }

    &-cell {
      position: relative;
      width: 100%;
      display: flex;
      cursor: text;
      border-radius: 8px;

      &-replica {
        visibility: inherit;
        width: 100%;
        padding: 0 8px;
        white-space: nowrap;
        line-height: normal;
        display: flex;
        align-items: center;

        &-right {
          justify-content: flex-end;
          // extend column width by set margin on replica text to fit combobox icon
          &.x-w-drug-order-space-for-icon {
            margin-left: 18px;
          }
        }

        &-left {
          justify-content: flex-start;
          &.x-w-drug-order-space-for-icon {
            margin-right: 18px;
          }
        }
      }

      &-edit-el {
        position: absolute;
        width: 100%;
        &.x-w-drug-order-table-cell-editing {
          .x-input-input {
            // show input text when editing
            color: inherit;
          }
          .x-input-text-container {
            background: var(--x-input-bg);
          }
        }
        &.x-select {
          color: transparent;
          background-color: transparent;

          .x-select-text {
            width: 0;
          }
        }
      }
    }

    .x-table {
      --x-table-row-height: 44px;
    }

    &-edit-header {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 2px 0px;
      padding: 2px 12px;
      cursor: pointer;

      &-title {
        margin-right: 4px;
      }

      &-icon {
        width: 14px;
        height: 14px;
      }
    }

    &-edit-header:hover {
      background-color: var(--xv-container--surface-hovered);
      border-radius: 8px;
    }
  }

  .x-w-drug-order-name-cell {
    margin: 2px 0;
    width: 100%;
    color: var(--xv-text--high-emphasis-text);
    display: grid;
    grid-template-areas:
      'item'
      'error';
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;

    &-wt-icon {
      grid-template-areas:
        'icon item'
        'empty error';
      grid-template-columns: 32px 1fr;
      grid-template-rows: auto 1fr;
    }

    &-error {
      grid-area: error;
      // limit the size to prevent expand the cell but overflow directly
      width: 300px;
      margin-left: -4px;
    }

    &-item {
      padding: 4px;
      border-radius: 8px !important;

      &--interactive {
        cursor: pointer;

        &:hover {
          background-color: var(--xv-container--surface-hovered);
        }
        &:active {
          background-color: var(--xv-container--surface-pressed);
        }
      }

      &--notice {
        color: var(--xv-status--warning);
      }

      &--warning {
        color: var(--xv-status--error);
      }

      // might need to think another way to not set this fixed height (for showing corretly in history mode)
      .x-fe-drug-item {
        height: 32px;
      }
    }
  }
}
</style>
