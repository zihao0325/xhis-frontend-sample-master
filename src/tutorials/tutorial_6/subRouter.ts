import DynamicLayout from './DynamicLayout.vue';
import Begin from './Begin.vue';
import Preload from './Preload.vue';
import PreLogin from './PreLogin.vue';
import Launcher from './Launcher.vue';
import Bind from './Bind.vue';
import Login from './Login.vue';
import Icd from './Icd.vue';
import Drug from './Drug.vue';

const pathPrefix = '/tutorial-6';
const namePostfix = 'T6';

const subRouts = [
  { path: '/', name: 'begin', component: Begin },
  { path: '/launcher', name: 'launcher', component: Launcher },
  { path: '/preload', name: 'preload', component: Preload },
  { path: '/preLogin', name: 'preLogin', component: PreLogin },
  { path: '/login', name: 'login', component: Login },
  { path: '/bind', name: 'bind', component: Bind },
  { path: '/icd', name: 'icd', component: Icd },
  { path: '/drug', name: 'drug', component: Drug },
  { path: '/patientList', name: 'patientList', component: DynamicLayout },
].map((route) => ({
  ...route,
  path: pathPrefix + route.path,
  name: route.name + namePostfix,
}));
export { subRouts, pathPrefix };
