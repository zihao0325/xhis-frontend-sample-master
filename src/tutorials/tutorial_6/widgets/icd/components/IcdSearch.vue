<template>
  <div>
    <!-- input -->
    <XInputText
      ref="inputRef"
      v-model="icdSearchState.searchText"
      type="search"
      placeholder="輸入 ICD、關鍵字"
      fill
      @focusin="showMenu?.()"
    />

    <!-- menu -->
    <div ref="menuRef" class="xfe-icd-search x-scroll-bar" @mousedown="focusInput()">
      <div v-if="!icdSearchState.isLoading" class="xfe-icd-search-header">根據SOAP進行AI推薦:</div>
      <div v-if="icdSearchState.isLoading" class="xfe-icd-search-center">
        <XIcon icon="spinner" color="var(--xv-text--medium-emphasis-text)" class="xfe-icd-search-loading-icon" />
      </div>
      <div v-if="!icdSearchState.isLoading && filteredOptions.length === 0" class="xfe-icd-search-center">
        試著調整篩選條件以找到資料
      </div>
      <div
        v-for="(item, i) in filteredOptions"
        :key="item.code"
        class="xfe-icd-search-item"
        :class="{
          'xfe-icd-search-item--disabled': hasSelected(item),
          'xfe-icd-search-item--current': icdSearchState.currentOption === i,
          'xfe-icd-search-item--secion': isSection(item),
        }"
        @mousedown="onClickOption(item)"
      >
        <div class="xfe-icd-search-item-code">
          <div v-if="hasPrev(item)" class="x-flex-center xfe-icd-search-item-code-arrow">
            <XIcon icon="arrow-left" color="var(--xv-neutral--700)" class="xfe-icd-search-arrow-icon" />
          </div>
          <div v-if="isSection(item)" class="x-flex-center xfe-icd-search-item-code-text">
            {{ item.code }}
          </div>
          <IcdCodeTag v-else :icd-code="item.code" :has-selected="hasSelected(item)" />
        </div>
        <div class="xfe-icd-search-item-name">
          <div class="xfe-icd-search-item-name-en x-ellipsis">
            {{ item.enDisplay }}
          </div>
          <div class="xfe-icd-search-item-name-ch x-ellipsis">
            {{ item.chDisplay }}
          </div>
        </div>
        <div v-if="hasNext(item)">
          <XIcon icon="chevron-down" color="var(--xv-neutral--900)" class="xfe-icd-search-arrow-icon" />
        </div>
        <div v-else class="xfe-icd-search-item-tags">
          <TagGroup :item="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import { XInputText, XIcon, useTippy, unrefElement } from '@asus-aics/xui';
import IcdCodeTag from './IcdCodeTag.vue';
import TagGroup from './TagGroup.vue';
import type { IcdSchema } from '@asus-aics/x-fe-engine';
import { useWidgetConfig } from '../utils/useWidgetConfig';
import { icdSearchState, useIcdSearch, useIcdList } from '../utils/useIcdData';

export default defineComponent({
  name: 'IcdSearch',
  components: {
    XInputText,
    XIcon,
    IcdCodeTag,
    TagGroup,
  },
  emits: ['appendItem'],
  setup(props, { emit }) {
    // widget config
    const widgetConfigExtra = useWidgetConfig().getWidgetConfig();

    const {
      resetState: resetSearchState,
      fetchIcdItems,
      nextSection,
      prevSection,
      isIcd9,
      isSection,
      hasNext,
      hasPrev,
      filteredOptions,
    } = useIcdSearch();
    const { appendIcd, hasSelected } = useIcdList();

    // search result popover
    const {
      content: menuRef,
      target: inputRef,
      showTippy: showMenu,
      hideTippy: hideMenu,
      tippyInstance,
    } = useTippy(undefined, undefined, {
      theme: 'icd-search-box',
      placement: 'right-start',
      trigger: 'manual',
      interactive: true,
      hideOnClick: false,
      arrow: false,
      offset: [0, 3],
      zIndex: 100,
      onShow: () => {
        fetchIcdItems();
      },
      onClickOutside: () => {
        hideMenu();
      },
    });

    // events
    const onClickOption = async (item: IcdSchema) => {
      if (isIcd9(item)) {
        return;
      }
      // for section: search next or previous item
      if (isSection(item)) {
        if (hasNext(item)) {
          nextSection(item);
          fetchIcdItems();
        } else if (hasPrev(item)) {
          prevSection();
          fetchIcdItems();
        }
        return;
      }
      // before show rule dialog: should blur input
      await blurInput();
      // for icd item: append to selected icd
      if (await appendIcd(item)) {
        emit('appendItem');
      } else {
        await focusInput();
        return;
      }
      // post processing
      resetInput();
    };

    const focusInput = async () => {
      await new Promise((res) => setTimeout(res, 1));
      unrefElement(inputRef)?.querySelector('input')?.focus?.({ preventScroll: true });
    };
    const blurInput = async () => {
      await new Promise((res) => setTimeout(res, 1));
      unrefElement(inputRef)?.querySelector('input')?.blur?.();
    };
    const resetInput = async () => {
      await focusInput();
      icdSearchState.searchText = '';
    };

    watch(
      () => icdSearchState.searchText,
      () => {
        resetSearchState();
        fetchIcdItems();
        // make sure show menu when inserting
        if (icdSearchState.searchText.length > 0) {
          showMenu();
        }
      }
    );

    return {
      widgetConfigExtra,
      icdSearchState,
      isSection,
      hasNext,
      hasPrev,
      filteredOptions,
      inputRef,
      menuRef,
      hasSelected,
      showMenu,
      hideMenu,
      onClickOption,
      focusInput,
      resetInput,
      tippyInstance,
    };
  },
});
</script>

<style lang="scss">
.tippy-box[data-theme~='icd-search-box'] {
  background-color: transparent;
  border-radius: 0;
  > .tippy-content {
    padding: 0;
  }
}

.xfe-icd-search {
  z-index: 999;
  width: 528px;
  height: 320px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background: #ffffff;
  overflow-y: auto;
  box-shadow: 0px 4px 10px rgba(117, 117, 117, 0.5);

  &-header {
    display: flex;
    align-items: center;
    min-height: 50px;
    padding: 0 16px;
    font-size: 16px;
    color: var(--xv-neutral--400);
  }

  &-center {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    text-align: center;
    font-weight: 500;
    font-size: 18px;
    color: var(--xv-text--low-emphasis-text);
  }

  &-item {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 60px;
    padding: 0 16px;
    border-bottom: 1px solid var(--xv-neutral--100);
    background: var(--xv-container--surface);
    cursor: pointer;

    &--disabled {
      cursor: default;
    }
    &--secion {
      background: var(--xv-teal--50);
    }
    &--current {
      background: var(--xv-container--area-active);
    }
    &:hover {
      background: var(--xv-container--area);
    }

    &-code {
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-shrink: 0;
      width: 88px;

      &-arrow {
        width: 20px;
        height: 20px;
        margin-right: 2px;
      }

      &-text {
        flex-grow: 1;
        font-weight: 600;
        font-size: 14px;
        color: var(--xv-neutral--700);
      }
    }

    &-name {
      flex-grow: 1;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      &-en {
        color: var(--xv-text--high-emphasis-text);
      }
      &-ch {
        color: var(--xv-text--medium-emphasis-text);
      }
    }
  }

  &-arrow-icon {
    width: 16px;
    height: 16px;
  }

  &-loading-icon {
    width: 40px;
    height: 40px;
    animation: x-btn-loading-spin 0.5s linear infinite;
  }
}
</style>
