import { IcdSchema, boxed, engineSet } from '@asus-aics/x-fe-engine';
import { XNotificationNewCaller, XNotificationType } from '@asus-aics/xui';
import { computed, reactive, ref, shallowReactive, ShallowReactive } from 'vue';
import C from './constants';
import { IcdCategory } from './schema/icdSchema';
import { api } from '@/utils/api';

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
const selectedIcdList = ref<IcdSchema[]>([]);

const useIcdList = () => {
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

    return true;
  };
  const removeAt = (index: number) => {
    if (selectedIcdList.value.length > index) {
      selectedIcdList.value.splice(index, 1);
    }
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
