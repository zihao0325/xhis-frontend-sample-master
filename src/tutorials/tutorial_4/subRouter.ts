import StaticLayoutT4 from './StaticLayout.vue';
import DynamicLayoutT4 from './DynamicLayout.vue';
import LayoutPlaygroundT4 from './LayoutPlayground.vue';

const pathPrefix = '/tutorial-4';
const namePostfix = 'T4';

const subRouts = [
  { path: '', name: 'DynamicLayout', component: DynamicLayoutT4 },
  { path: '/layout-playground', name: 'LayoutPlayground', component: LayoutPlaygroundT4 },
  { path: '/static', name: 'StaticLayout', component: StaticLayoutT4 },
].map((route) => ({
  ...route,
  path: pathPrefix + route.path,
  name: route.name + namePostfix,
}));
export { subRouts, pathPrefix };
