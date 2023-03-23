<template>
  <div class="container">
    <div class="header">Tutorials</div>
    <div class="body">
      <ul>
        <li v-for="({ path, label }, index) in routes" :key="index" class="list-item">
          <a :href="path">{{ label }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PortalView',
  setup() {
    const routes = [
      {
        path: '/tutorial-1',
        label: 'Tutorial 1: environment setup',
      },
      {
        path: '/tutorial-2',
        label: 'Tutorial 2: basic Vue programming + xUI components',
      },
      {
        path: '/tutorial-3',
        label: 'Tutorial 3: advanced Vue programming + xUI components',
      },
      {
        path: '/tutorial-4',
        label: 'Tutorial 4: Layout Editor',
      },
      {
        path: '/tutorial-5',
        label: 'Tutorial 5: Rule Engine',
      },
      {
        path: '/tutorial-6',
        label: 'Tutorial 6: Form Builder',
      },
      {
        path: '/views',
        label: 'Program',
      },
    ];

    return {
      routes,
    };
  },
});
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  height: 100%;
  width: 100%;
}
.header {
  font-size: 50px;
  text-align: center;
  margin: 20px;
}

.body {
  .list-item {
    margin: 0.5rem;
  }
}
</style>
