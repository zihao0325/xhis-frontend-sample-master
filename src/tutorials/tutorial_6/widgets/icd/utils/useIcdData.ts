import emitter from '@asus-aics/x-fe-emitter';
import { IcdSchema, boxed, engineSet, useEncounterStateEngine, useOpdStateEngine } from '@asus-aics/x-fe-engine';
import { XNotificationNewCaller, XNotificationType } from '@asus-aics/xui';
import { computed, reactive, shallowReactive, ShallowReactive } from 'vue';
import C from './constants';
import { IcdCategory } from './schema/icdSchema';
import { api } from '@/utils/api';
import { TriggerTypes } from '@asus-aics/xhis-rule-schema';
import { SHOW_FORM_EVENT } from '@/tutorials/tutorial_6/FormDialog.vue';
import { ShowFormAction } from '@asus-aics/x-fe-rule';
/**
 * ICD search management
 */

// state
interface IcdSearchStateSchema {
  searchText: string;
  searchResults: IcdSchema[];
  isLoading: boolean;
  searchSectionText: string;
  searchSectionTextStack: string[];
  currentOption: number;
}
export const initIcdSearchState = (): IcdSearchStateSchema => ({
  searchText: '',
  searchResults: [],
  isLoading: false,
  searchSectionText: '',
  searchSectionTextStack: [],
  currentOption: 0,
});
export const icdSearchState = reactive<IcdSearchStateSchema>(initIcdSearchState());

const useIcdSearch = () => {
  // state
  const state = icdSearchState;

  // actions
  const resetState = () => {
    state.searchSectionText = '';
    state.searchSectionTextStack = [];
    state.currentOption = 0;
  };

  const searchIcd = async (text: string): Promise<void> => {
    state.searchResults.length = 0;
    const res = (await api.searchIcd({
      query: text,
      category: IcdCategory.CM,
    })) as IcdSchema[];

    state.searchResults.push(...res.filter((icd) => icd.active !== false));
  };

  const fetchIcdItems = async () => {
    state.isLoading = true;
    if (state.searchSectionText !== '') {
      await searchIcd(state.searchSectionText);
    } else {
      await searchIcd(state.searchText);
    }
    state.isLoading = false;
  };

  // mutations
  const nextSection = (item: IcdSchema): void => {
    state.searchSectionTextStack.push(state.searchSectionText);
    state.searchSectionText = item.code;
    state.currentOption = 0;
  };
  const prevSection = (): void => {
    state.searchSectionText = state.searchSectionTextStack.pop() || '';
    state.currentOption = 0;
  };

  // getters
  const isIcd9 = (item: IcdSchema): boolean => item.version === '9';
  const isSection = (item: IcdSchema): boolean => item.billable === false && item.version === '10';
  const isCurrentSection = (item: IcdSchema): boolean => isSection(item) && item.code === state.searchSectionText;
  const isRoot = (): boolean => state.searchSectionTextStack.length <= 0;
  const hasNext = (item: IcdSchema): boolean =>
    isSection(item) && !isCurrentSection(item) && item.code != state.searchText.toUpperCase();
  const hasPrev = (item: IcdSchema): boolean => !isRoot() && isCurrentSection(item);
  const filteredOptions = computed(() => {
    if (!isRoot()) {
      // move current section to firse
      return [
        ...state.searchResults.filter((item) => isCurrentSection(item)),
        ...state.searchResults.filter((item) => !isCurrentSection(item)),
      ];
    }
    return state.searchResults;
  });

  return {
    resetState,
    fetchIcdItems,
    nextSection,
    prevSection,
    isIcd9,
    isSection,
    isCurrentSection,
    isRoot,
    hasNext,
    hasPrev,
    filteredOptions,
  };
};

/**
 * ICD item list management
 */
const selectingIcdList: ShallowReactive<IcdSchema[]> = shallowReactive<IcdSchema[]>([]);

const useIcdList = () => {
  const { reactStore } = engineSet.useEncounterStateEngine();
  const { engine: encounterEngine } = useEncounterStateEngine();
  const { engine } = useOpdStateEngine();
  const selectedIcdList = computed<IcdSchema[]>({
    get: () => reactStore?.context?.icdList ?? [],
    set: (val) => {
      if (reactStore?.context.icdList) {
        reactStore.context.icdList = val;
      }
    },
  });

  // mutations
  const beforeAppendIcd = (icdItem: IcdSchema): boolean => {
    let errorMessage = '';
    if (!icdItem.code) {
      errorMessage = C.MESSAGE.ERROR.SCHEMA_NOT_FIT;
    } else if (hasSelected(icdItem)) {
      errorMessage = C.MESSAGE.ERROR.DUPLICATE_ICD;
    }
    if (errorMessage !== '') {
      XNotificationNewCaller({
        type: XNotificationType.Alert,
        title: errorMessage,
      });
      return false;
    }
    return true;
  };

  const handler = new Map<string, (payload, resultData) => void>();
  handler['NoResult'] = (payload, resultData) => {
    const ruleId = resultData.ruleId;
    const code = resultData.rulePath.replace('icdList[code=', '').replace(']', '');
    for (let i = 0; i < selectedIcdList.value.length; i++) {
      const origin = selectedIcdList.value[i].value;
      if (code === origin.code) {
        const origin = selectedIcdList.value[i].value;
        const errIndex = origin.errorList?.findIndex((err) => err.ruleId === ruleId);
        if (errIndex >= 0) {
          const errorList = origin.errorList;
          errorList.splice(errIndex, 1);
          selectedIcdList.value.splice(
            i,
            1,
            boxed({
              ...origin,
              errorList,
            }) as any
          );
          const newSelectedIcdList = [...selectedIcdList.value];
          selectedIcdList.value = newSelectedIcdList;
        }
      }
    }
  };
  handler['ShowNotification'] = (payload, resultData) => {
    const code = resultData.rulePath.replace('icdList[code=', '').replace(']', '');
    const icd = reactStore?.context.icdList;
    console.log('icd', icd);
    const index = reactStore?.context.icdList.findIndex((icd) => icd.value.code === code);

    if (index >= 0) {
      console.log('index', index);
      const origin = selectedIcdList.value[index].value;
      let errorList: { ruleId: string; message: string }[] = origin.errorList;
      if (!errorList) {
        errorList = [];
      }

      // check already added
      const exists = errorList.findIndex((err) => err.ruleId === resultData.ruleId) >= 0;
      if (!exists) {
        errorList.push({
          ruleId: resultData.ruleId,
          message: resultData.result.message,
        });

        selectedIcdList.value.splice(
          index,
          1,
          boxed({
            ...origin,
            errorList,
          }) as any
        );
        const newSelectedIcdList = [...selectedIcdList.value];
        selectedIcdList.value = newSelectedIcdList;
      }

      // selectedIcdList.value = selectedIcdList.value;
    }
  };
  handler['ShowForm'] = async (path, action: ShowFormAction) => {
    await emitter.emitAsync(SHOW_FORM_EVENT, action.result);
  };

  const handleAction = async (result) => {
    Object.keys(result).forEach((payload) => {
      const ruleResults = result[payload];
      ruleResults.forEach(async (ruleResult) => {
        const actionHandler = handler[ruleResult.action];
        console.log('handle', ruleResult.action, actionHandler);
        await actionHandler(payload, ruleResult);
      });
    });
  };
  const runAddIcdRules = async (icd) => {
    const genPath = (item: IcdSchema) => `@add/icdList[code=${item.code}]`;
    const resp = await api.runRule({
      encounterSyncId: encounterEngine.core.getSyncId(),
      opdSyncId: engine.core.getSyncId(),
      triggers: [
        {
          type: TriggerTypes.AddIcd,
          payload: [icd].map((icdItem) => ({
            [genPath(icdItem)]: icdItem,
          })),
        },
      ],
    });

    handleAction(resp.data.result);
  };

  const runUpdateIcdRules = async () => {
    const resp = await api.runRule({
      encounterSyncId: encounterEngine.core.getSyncId(),
      opdSyncId: engine.core.getSyncId(),
      triggers: [
        {
          type: TriggerTypes.UpdateIcd,
        },
      ],
    });

    handleAction(resp.data.result);
  };
  const fetchIcdItems = async (icdItems: IcdSchema[]): Promise<IcdSchema[]> => {
    const icdUniqueKeys = icdItems.map((icdItem) => ({
      code: icdItem.code,
      version: icdItem.version,
      category: icdItem.category,
    }));
    const fetchedIcdList = (await api.postIcdInfo(icdUniqueKeys)) as IcdSchema[];
    return fetchedIcdList.filter((icdItem) => icdItem);
  };
  // TODOITEM: appendIcd -> appendIcds?
  const appendIcd = async (icdItem: IcdSchema, isIllnessAppend = false): Promise<boolean> => {
    if (!beforeAppendIcd(icdItem)) {
      return false;
    }

    // fetch from icd info api and run rule
    const resolveIcdList = await fetchIcdItems([icdItem]);
    if (resolveIcdList.length <= 0) {
      return false;
    }

    await runAddIcdRules(icdItem);
    // box and push to encounter store
    resolveIcdList.forEach((item) => {
      if (beforeAppendIcd(item)) {
        if (isIllnessAppend) {
          const newSelectedIcdList = [...selectedIcdList.value];
          newSelectedIcdList.splice(3, 0, boxed(item as any) as any);
          newSelectedIcdList.splice(6);
          selectedIcdList.value = newSelectedIcdList;
        } else {
          selectedIcdList.value.push(boxed(item as any) as any);
        }
      }
    });

    await runUpdateIcdRules();
    return true;
  };
  const removeAt = async (index: number) => {
    if (selectedIcdList.value.length > index) {
      selectedIcdList.value.splice(index, 1);
    }
    await runUpdateIcdRules();
  };

  // getters
  // TODOITEM: move isIcd9 and isChapter to icd global utils
  const isIcd9 = (item: IcdSchema): boolean => item.version === '9';
  const isChapter = (item: IcdSchema): boolean => item.billable === false && item.version === '10';
  // TODOITEM: any type issue (boxed IcdSchema)
  const isInIcdList = (icdItem: IcdSchema, icdList: IcdSchema[] | any[]): boolean => {
    return icdList?.find((icd) => (icd.code || icd.value?.code) === icdItem.code) !== undefined;
  };

  const hasSelected = (icdItem: IcdSchema): boolean => {
    return isInIcdList(icdItem, [...selectedIcdList.value]);
  };

  const icdListErrors = computed(() => []);

  return {
    runUpdateIcdRules,
    selectingIcdList,
    selectedIcdList,
    appendIcd,
    removeAt,
    isIcd9,
    isChapter,
    hasSelected,
    icdListErrors,
  };
};

export { useIcdSearch, useIcdList };
