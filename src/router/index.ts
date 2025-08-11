import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Главная' },
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/ChatGeminiView.vue'),
    alias: ['/talk'],
    meta: { title: 'Gemini Chat' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const suffix = 'Gemini Vue TS'
  document.title = to.meta?.title ? `${to.meta.title} • ${suffix}` : suffix
})

export default router
