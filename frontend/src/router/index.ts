import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { useAuthStore } from '@/stores/authStore'

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
      meta: { layout: 'AdminLayout', requiresAuth: true },
    },
    {
      path: '/admin/categorias',
      name: 'admin-categorias',
      component: () => import('@/views/CategoriasListView.vue'),
      meta: { layout: 'AdminLayout', requiresAuth: true },
    },
    {
      path: '/admin/asignaturas',
      name: 'admin-asignaturas',
      component: () => import('@/views/AsignaturasListView.vue'),
      meta: { layout: 'AdminLayout', requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      next({ name: 'login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
