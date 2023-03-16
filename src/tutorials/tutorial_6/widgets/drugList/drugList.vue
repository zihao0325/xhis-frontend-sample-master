<template>
  <div>
    <div>
      <ToccForm />
    </div>

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
        <XTable key-index="itemId" :data="tableData" :options="drugTableOptions">
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
                <div :key="item.drugCode.value" :item="item">
                  <div class="x-fe-drug-item-name x-ellipsis">
                    {{ item.drugDisplay.value ?? '--' }}
                  </div>
                  <div class="x-fe-drug-item-type x-ellipsis">
                    {{ item.drugGenericDisplay.value ?? '--' }}
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

      <XDialogue id="rule-dialog" :show="showDialogue" :width="dialogWidth" fit-content>
        <!-- TODOITEM: id should be removed when rule dialog has added in opd -->
        <XCard id="rule-dialog-x-card">
          <XCardIcon class="x-rule-dialog-icon">
            <svg
              v-if="dialogProps.level === RuleLevel.WARNING"
              width="72"
              height="72"
              viewBox="0 0 72 72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="72" height="72" rx="36" fill="#FBEBEC" />
              <path
                d="M33.5462 13.0099C35.8857 11.7141 38.8063 12.467 40.2414 14.6754L40.4277 14.9855L57.8853 46.5041C58.3011 47.2548 58.5193 48.0989 58.5193 48.957C58.5193 51.6365 56.4377 53.8297 53.8034 54.0078L53.4568 54.0195H18.5463C17.6884 54.0195 16.8445 53.8015 16.094 53.3859C13.7543 52.0903 12.843 49.2153 13.9535 46.8271L14.1175 46.5046L31.5703 14.986C32.0305 14.155 32.7152 13.4702 33.5462 13.0099ZM54.933 48.1394L37.4753 16.6208C37.0237 15.8055 35.9968 15.5107 35.1815 15.9622C34.9737 16.0773 34.7934 16.2345 34.6515 16.4227L34.5228 16.621L17.0701 48.1396C16.6186 48.9549 16.9135 49.9818 17.7289 50.4333C17.9165 50.5372 18.1217 50.6041 18.3331 50.631L18.5463 50.6445H53.4568C54.3888 50.6445 55.1443 49.889 55.1443 48.957C55.1443 48.7425 55.1034 48.5306 55.0245 48.3325L54.933 48.1394ZM36.0011 42.754C37.2421 42.754 38.2481 43.76 38.2481 45.001C38.2481 46.242 37.2421 47.248 36.0011 47.248C34.7601 47.248 33.7541 46.242 33.7541 45.001C33.7541 43.76 34.7601 42.754 36.0011 42.754ZM35.9916 25.874C36.846 25.8733 37.5525 26.5076 37.6649 27.3312L37.6805 27.5601L37.6886 37.6887C37.6893 38.6207 36.9344 39.3768 36.0024 39.3776C35.1481 39.3783 34.4416 38.744 34.3292 37.9204L34.3136 37.6914L34.3055 27.5628C34.3048 26.6309 35.0597 25.8747 35.9916 25.874Z"
                fill="#E15E69"
              />
            </svg>
            <svg
              v-if="dialogProps.level === RuleLevel.NOTICE"
              width="72"
              height="72"
              viewBox="0 0 72 72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="72" height="72" rx="36" fill="#FEF5E8" />
              <path
                d="M36.0001 13.4977C48.4284 13.4977 58.5036 23.5728 58.5036 36.0012C58.5036 48.4295 48.4284 58.5047 36.0001 58.5047C23.5717 58.5047 13.4966 48.4295 13.4966 36.0012C13.4966 23.5728 23.5717 13.4977 36.0001 13.4977ZM36.0001 16.8727C25.4357 16.8727 16.8716 25.4368 16.8716 36.0012C16.8716 46.5655 25.4357 55.1297 36.0001 55.1297C46.5644 55.1297 55.1286 46.5655 55.1286 36.0012C55.1286 25.4368 46.5644 16.8727 36.0001 16.8727ZM35.9919 32.624C36.8462 32.6234 37.5526 33.2578 37.6649 34.0814L37.6805 34.3104L37.6886 46.689C37.6892 47.621 36.9342 48.377 36.0022 48.3776C35.1479 48.3781 34.4414 47.7438 34.3291 46.9202L34.3136 46.6912L34.3055 34.3126C34.3049 33.3806 35.0599 32.6246 35.9919 32.624ZM36.0011 24.754C37.2421 24.754 38.2481 25.76 38.2481 27.001C38.2481 28.242 37.2421 29.248 36.0011 29.248C34.7601 29.248 33.7541 28.242 33.7541 27.001C33.7541 25.76 34.7601 24.754 36.0011 24.754Z"
                fill="#E8891C"
              />
            </svg>
          </XCardIcon>

          <XCardHeader class="x-rule-dialog-header">
            {{ dialogProps.title }}
          </XCardHeader>

          <XCardBody class="x-rule-dialog-body">
            {{ dialogProps.description }}
          </XCardBody>

          <XCardFooter>
            <XButton
              v-for="(button, buttonType) in dialogProps.buttons"
              :key="buttonType"
              size="lg"
              class="x-rule-dialog-btn"
              :class="`x-rule-dialog-btn--${buttonType}`"
              v-bind="convertProps(button.theme)"
              @click="handleCallback(button.callbacks)"
            >
              {{ button.text }}
            </XButton>
          </XCardFooter>
        </XCard>
      </XDialogue>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, computed, markRaw, onMounted, reactive, ref } from 'vue';
import {
  XAutocomplete,
  XInputText,
  XTable,
  XTableEntryOption,
  XIcon,
  XIconButton,
  XButton,
  XDialogue,
  XCard,
  XCardHeader,
  XCardBody,
  XCardFooter,
  XCardIcon,
} from '@asus-aics/xui';
import { WidgetProps } from '@asus-aics/xhis-widget-framework';
import engineSet, { DrugSchema, EncounterDrugSchema } from '@asus-aics/x-fe-engine';
import { DrugOptionCategory, DrugOptionItem, EditCellType, useEditComponent } from './utils/drugOrderEditComponent';
import { genColumn, getItemId } from '../../utils/encounterDrugUtils';
import { nanoid } from 'nanoid';
import useDrugOptions from './compossable/useDrugOptions';
import useDrugList from './compossable/useDrugList';
import { useOpdInfo } from '../patientList/composable/useOpdInfo';
import { api } from '@/utils/api';
import { PrescribeMode, ShowFormAction, ShowFormResult, TriggerTypes } from '@asus-aics/xhis-rule-schema';
import { useEncounterStateEngine, useOpdStateEngine } from '@asus-aics/x-fe-engine';
import { omit } from 'lodash';
import { DialogButtonType, RuleLevel } from '@asus-aics/x-fe-rule/src/result';
import emitter from '@asus-aics/x-fe-emitter';
import ToccForm from './ToccForm.vue';

import { XButtonTheme } from '@asus-aics/xui';
import { DialogButtonTheme } from '@asus-aics/x-fe-rule';
import { SHOW_FORM_EVENT } from '../../FormDialog.vue';
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
  components: {
    XInputText,
    XTable,
    XIcon,
    XIconButton,
    XButton,
    XDialogue,
    XCard,
    XCardHeader,
    XCardBody,
    XCardFooter,
    XCardIcon,
    ToccForm,
  },
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
    const dialogProps = ref({
      title: '標題',
      description: '敘述',
      level: 'warning',
      buttons: {
        [DialogButtonType.PRIMARY]: {
          show: true,
          text: '取消',
          theme: 'secondary',
          closeDialog: true,
          callbacks: [
            {
              type: 'none',
            },
          ],
        },
      },
    });
    const dialogWidth = computed(() => {
      if ([RuleLevel.WARNING, RuleLevel.NOTICE].includes(dialogProps.value.level)) {
        return 768;
      } else {
        return 576;
      }
    });
    const convertProps = (theme: DialogButtonTheme) => {
      const themeProps: { outline?: boolean; theme?: XButtonTheme } = {};
      switch (theme) {
        case DialogButtonTheme.PRIMARY:
          themeProps.outline = false;
          themeProps.theme = 'primary';
          break;
        case DialogButtonTheme.SECONDARY:
          themeProps.outline = true;
          themeProps.theme = 'primary';
          break;
        case DialogButtonTheme.TERTIARY:
          themeProps.outline = true;
          themeProps.theme = 'tertiary';
          break;
        case DialogButtonTheme.DANGER_PRIMARY:
          themeProps.outline = false;
          themeProps.theme = 'danger';
          break;
        case DialogButtonTheme.DANGER_SECONDARY:
          themeProps.outline = true;
          themeProps.theme = 'danger';
          break;
        default:
          break;
      }
      return themeProps;
    };

    const searchText = ref('');
    const { reactStore: encounterReactStore } = engineSet.useEncounterStateEngine();
    const encounterDrugList = computed(() => encounterReactStore?.context?.drugList ?? []);
    const tableData = computed(() => encounterDrugList.value.map((data) => JSON.parse(JSON.stringify(data))));

    const { frequencyOptions, getDrugOptions } = useDrugOptions();
    const { roomInfo } = useOpdInfo();
    const { getAutocompleteProps, getInputProps, isEditing } = useEditComponent(encounterDrugList);
    const { drugList, isLoading } = useDrugList(
      searchText,
      roomInfo,
      encounterReactStore.context.encounterId,
      encounterReactStore.context.patientId
    );

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
      const value = item?.[index]?.value as any;
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

    const convertDrug = (drug: DrugSchema) => {
      const convertedDrug = {};
      for (const [key, value] of Object.entries(drug)) {
        convertedDrug[key] = genColumn(value);
      }

      return convertedDrug;
    };

    const showDialogue = ref(false);
    const genPath = (item: EncounterDrugSchema) => `@add/drugList[itemId.value=${item.itemId.value}]`;
    const { engine: encounterEngine } = useEncounterStateEngine();
    const { engine } = useOpdStateEngine();
    const runAddDrugRules = async (drug) => {
      const resp = await api.runRule({
        encounterSyncId: encounterEngine.core.getSyncId(),
        opdSyncId: engine.core.getSyncId(),
        triggers: [
          {
            type: TriggerTypes.AddDrug,
            payload: [drug].map((item) => ({
              // do not pass 'source' to reduce payload size
              [genPath(item)]: omit(item, 'source'),
            })),
            prescribeMode: PrescribeMode.SEARCH,
          },
        ],
      });
      return resp.data.result;
    };
    const handler = new Map<string, (payload, resultData) => void>();
    handler['OpenUrl'] = (payload, resultData) => {
      console.log(arguments);
      const url = resultData.result.url;
      window.open(url);
    };
    handler['OpenURL2'] = (payload, resultData) => {
      console.log(arguments);
      const url = resultData.result.url;
      window.open(url);
    };
    handler['ShowDialog'] = (payload, resultData) => {
      dialogProps.value = resultData.result;
      showDialogue.value = true;
    };
    handler['NoResult'] = (payload, resultData) => {
      console.log('NoResult');
    };

    handler['ShowForm'] = async (path, result: { result: ShowFormAction }) => {
      await emitter.emitAsync(SHOW_FORM_EVENT, result.result);
    };

    const handleCallback = (callbacks) => {
      // handle callbacks
      showDialogue.value = false;
    };
    const onSelectDrug = async (drug: DrugSchema) => {
      console.log('onSelectDrug');

      drug.itemId = nanoid();
      const convertedDrug = convertDrug(drug);
      encounterDrugList.value.push(convertedDrug);

      drugList.value = [];
      searchText.value = '';
      const result: any = await runAddDrugRules(convertedDrug);
      for (const [key, value] of Object.entries(result)) {
        const ruleResults = value;
        for (const ruleResult of ruleResults) {
          const actionHandler = handler[ruleResult.action];
          await actionHandler(key, ruleResult);
        }
      }
    };
    //   Object.keys(result).forEach((payload) => {
    //     const ruleResults = result[payload];
    //     ruleResults.forEach((ruleResult) => {
    //       const actionHandler = handler[ruleResult.action];
    //       actionHandler(payload, ruleResult);
    //     });
    //   });
    // };

    const onDeleteDrug = (id: string) => {
      const idx = encounterDrugList.value?.findIndex((v) => getItemId(v) === id);
      if (idx !== undefined && idx !== -1) {
        encounterDrugList.value.splice(idx, 1);
      }
      return idx;
    };

    onMounted(async () => {
      await getDrugOptions();
    });

    return {
      dialogWidth,
      convertProps,
      RuleLevel,
      dialogProps,
      showDialogue,
      handleCallback,
      searchText,
      drugTableOptions,
      isLoading,
      drugList,
      onSelectDrug,
      tableData,
      encounterDrugList,
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
#rule-dialog-x-card {
  .x-rule-dialog {
    &-header {
      min-height: unset;
      padding: 24px 32px 0 0;
    }

    &-body {
      padding: 8px 32px 8px 0;
      white-space: pre-wrap;
    }

    &-icon {
      padding: 24px 24px 0 32px;
      margin-right: 0px;
    }

    &-btn {
      min-width: 144px;

      &--tertiary {
        order: 0;
        margin-right: auto;
      }
      &--secondary {
        order: 1;
      }
      &--primary {
        order: 2;
      }
    }
  }
}
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
