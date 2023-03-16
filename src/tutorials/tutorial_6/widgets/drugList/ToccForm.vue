<template>
  <XButton @click="onClick">顯示 TOCC</XButton>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { WidgetProps } from '@asus-aics/xhis-widget-framework';
import { XButton } from '@asus-aics/xui';
import { useForm } from '../../composable/useForm';
import { LoadMode } from '@asus-aics/xhis-form-builder-v1';
export default defineComponent({
  name: 'ToccForm',
  components: { XButton },
  props: WidgetProps, // WidgetProps is required, do not remove
  setup() {
    const { fillForm } = useForm();
    const onClick = async () => {
      // #region formResult
      const result = await fillForm({
        formId: 'tutorial-TOCC',
        // #region loadMode
        loadMode: LoadMode.Valid,
        // #endregion loadMode
        data: {},
      });
      console.log('form result:', result);
      // #endregion formResult
    };
    return {
      onClick,
    };
  },
});
</script>

<style lang="scss"></style>
