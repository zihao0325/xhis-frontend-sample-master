import PortalView from './components/PortalView.vue';
import ComingSoon from './components/ComingSoon.vue';
import PageNotFound from './components/PageNotFound.vue';
import HelloWorld from './tutorials/tutorial_1/HelloWorld.vue';
import PatientList from './tutorials/tutorial_2/PatientList.vue';
import PatientListV2 from './tutorials/tutorial_3/PatientList.vue';
import { subRouts as T4Routes } from './tutorials/tutorial_4/subRouter';
import { subRouts as T5Routes } from './tutorials/tutorial_5/subRouter';
import { subRouts as T6Routes } from './tutorials/tutorial_6/subRouter';
import Program from './views/Program.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', name: 'PortalView', component: PortalView },
  { path: '/coming-soon', name: 'ComingSoon', component: ComingSoon },
  { path: '/tutorial-1', name: 'HellowWorld', component: HelloWorld },
  { path: '/tutorial-2', name: 'PatientList', component: PatientList },
  { path: '/tutorial-3', name: 'PatientListV2', component: PatientListV2 },
  ...T4Routes,
  ...T5Routes,
  ...T6Routes,
  { path: '/views', name: 'Program', component: Program },
  { path: '/tutorial-7', redirect: '/coming-soon' },
  { path: '/tutorial-8', redirect: '/coming-soon' },
  { path: '/tutorial-9', redirect: '/coming-soon' },
  { path: '/:pathMatch(.*)*', name: 'PageNotFound', component: PageNotFound },
  { path: '/:pathMatch(.*)*', name: 'PageNotFound', component: PageNotFound },
];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

export default router;
