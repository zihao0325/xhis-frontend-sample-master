<template>
  <div class="x-fe-tag-group">
    <XTooltip v-if="item.catastrophic" content="重大傷病" :options="{ placement: 'top', theme: 'tag-group' }">
      <XTag theme="red" outline>重</XTag>
    </XTooltip>
    <XTooltip v-if="item.chronic" content="慢性疾病" :options="{ placement: 'top', theme: 'tag-group' }">
      <XTag theme="red" outline>慢</XTag>
    </XTooltip>
    <div v-if="item.prob" class="xfe-icd-tag-prob x-tag" :style="probStyle">
      {{ probText }}
    </div>
    <XTag v-if="item.version === '9'" theme="orange">ICD 9</XTag>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { XTag, XTooltip } from '@asus-aics/xui';

export default defineComponent({
  name: 'TagGroup',
  components: { XTag, XTooltip },
  props: {
    item: {
      default: () => ({}),
      type: Object as PropType<any>,
    },
  },
  setup(props) {
    const probStyle = computed(() => {
      const prob = Math.floor(props.item.prob ?? 0);
      if (prob <= 20) {
        return { backgroundColor: 'var(--xv-violet--50)' };
      } else if (prob <= 50) {
        return { backgroundColor: 'var(--xv-violet--100)' };
      } else if (prob <= 80) {
        return { backgroundColor: 'var(--xv-violet--200)' };
      } else {
        return { backgroundColor: 'var(--xv-violet--300)' };
      }
    });
    const probText = computed(() => {
      const prob = Math.floor(props.item.prob ?? 0);
      return `${prob < 20 ? '<20' : prob}%`;
    });

    return { probStyle, probText };
  },
});
</script>

<style lang="scss" scoped>
.xfe-icd-tag-prob {
  font-weight: 600;
  color: var(--xv-text--high-emphasis-text);
}
.x-fe-tag-group {
  display: flex;
  flex-wrap: nowrap;
  gap: 4px;
}
.tippy-box[data-theme~='tag-group'] {
  white-space: pre-wrap;
}
</style>
