<template>
  <XDialogue :show="show" v-bind="dialoguePosition">
    <FormRenderer
      v-if="formAttrs.formId"
      v-bind="formAttrs"
      v-model="formData"
      @loaded="onLoaded"
      @update:click="onButtonClicked"
    />
  </XDialogue>
</template>

<script lang="ts">
import { MaybeRef, XDialogue } from '@asus-aics/xui';
import emitter from '@asus-aics/x-fe-emitter';
import { ButtonEvent, FormOptions, FormRenderer, FormWidth, LoadMode } from '@asus-aics/xhis-form-builder-v1';
import { computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref, unref } from 'vue';
import { ShowFormResult } from '@asus-aics/xhis-rule-schema';
import dayjs from 'dayjs';
import engineSet from '@asus-aics/x-fe-engine';

export const SHOW_FORM_EVENT = 'showForm';

export function useModalSize(formWidth: MaybeRef<string>) {
  const width = computed(() => {
    const int = parseInt(unref(formWidth));
    return isNaN(int) ? 768 : int;
  });

  const dialoguePosition = computed(() => {
    return {
      'fit-content': true,
      width: width.value + 2,
    };
  });

  return {
    dialoguePosition,
  };
}

export type ShowFormPayload = Partial<ShowFormResult> & {
  formId: string;
  data: any;
  loadMode?: LoadMode;
  options?: FormOptions;
};

// temporary solution for patchConfig from v0
const convertPatchConfig = (v0PatchConfig: any[]): any[] => {
  return v0PatchConfig.map((patch) => {
    const [_, name, property] = patch.path.split('.');
    return {
      id: name,
      property: property,
      value: patch.value,
    };
  });
};

export default defineComponent({
  components: { XDialogue, FormRenderer },
  setup() {
    const width = ref('768px');
    const show = ref(false);
    let expireTime;
    const formData = ref({});
    const formAttrs = reactive({
      key: 0, // to re-trigger `setup` of FormRenderer
      formId: '',
      patientId: '',
      accessIdentity: {},
      loadExisting: false,
      loadMode: undefined as undefined | LoadMode,
      options: {} as FormOptions,
      getExpireTime: () => expireTime,
    });

    let resolvePromise;
    let patchConfig;
    const encounter = engineSet.useEncounterStateEngine();
    const onShowForm = async (showFormPayload: ShowFormPayload) => {
      const { formId, patchConfig: _patchConfig, loadExisting, loadMode, options } = showFormPayload;
      patchConfig = _patchConfig;
      formAttrs.options = options ?? {};
      formAttrs.options.patchConfig = convertPatchConfig(patchConfig ?? []);
      formAttrs.formId = formId;
      formAttrs.patientId = encounter.reactStore.context.patientId;

      formAttrs.loadExisting = loadExisting;
      formAttrs.loadMode = loadMode;
      if (showFormPayload.expireTime !== undefined) {
        expireTime = dayjs(showFormPayload.expireTime).toDate();
      }
      formAttrs.key += 1;

      // should await button action here
      const event = await new Promise((resolve) => (resolvePromise = resolve));
      show.value = false;
      return { ...event, data: formData.value };
    };
    const onButtonClicked = (event: ButtonEvent) => {
      if (event.close) {
        resolvePromise(event);
      }
    };
    const onLoaded = (payload) => {
      show.value = true;
      width.value = FormWidth[payload.form.config.form.size];
    };
    onMounted(() => {
      emitter.on(SHOW_FORM_EVENT, onShowForm);
    });
    onBeforeUnmount(() => {
      emitter.off(SHOW_FORM_EVENT, onShowForm);
    });

    const { dialoguePosition } = useModalSize(width);

    return {
      formAttrs,
      formData,
      width,
      show,
      onLoaded,
      dialoguePosition,
      onButtonClicked,
    };
  },
});
</script>
