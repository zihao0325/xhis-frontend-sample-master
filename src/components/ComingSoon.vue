<template>
  <div class="container">
    <div>Comming Soon ...</div>
    <XButton display="text" icon="arrow-left" @click="$router.push('/')">Go Back to Tutorials</XButton>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { XButton } from '@asus-aics/xui';

export default defineComponent({
  name: 'ComingSoon',
  components: {
    XButton,
  },
  setup() {
    return {};
  },
});
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  height: 100vh;
  width: 100vw;

  font-size: 50px;
  gap: 1rem;
}
</style>
