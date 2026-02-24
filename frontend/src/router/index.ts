import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { layout: 'MainLayout' },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { layout: 'AuthLayout' },
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: () => import('@/views/AdminDashboardView.vue'),
      meta: { layout: 'AdminLayout' },
    },
    {
      path: '/admin/categorias',
      name: 'admin-categorias',
      component: () => import('@/views/CategoriasListView.vue'),
      meta: { layout: 'AdminLayout' },
    },
    {
      path: '/admin/asignaturas',
      name: 'admin-asignaturas',
      component: () => import('@/views/AsignaturasListView.vue'),
      meta: { layout: 'AdminLayout' },
    },
  ],
})

export default router
