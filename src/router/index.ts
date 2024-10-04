import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../login/login.vue';
import TaskTable from '../components/TaskTable.vue';
import RegisterPage from '../login/register.vue';

const routes = [
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  {
    path: '/app',
    component: TaskTable,
  },
  { path: '/:pathMatch(.*)*', redirect: '/login' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
