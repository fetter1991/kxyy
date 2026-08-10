// 路由总装（C05 单应用路由分区）
// 结构：/*  -> 用户端 modules/user；/manage/* -> 管理端 modules/manage
// 两端各自持有布局组件（嵌套路由的父级 component），App.vue 只保留全站氛围层，
// 避免管理端被套进用户端导航栏（合并前 App.vue 写死 Layout 的技术债）。
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { userRoutes } from '@/modules/user/routes'
import { manageRoutes } from '@/modules/manage/routes'

const routes: RouteRecordRaw[] = [
  ...userRoutes,
  ...manageRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/modules/user/views/NotFoundView.vue'),
    meta: { title: '页面不存在' },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// 路由切换时更新标题（原则 11 对外清晰）
router.afterEach((to) => {
  const base = to.meta.area === 'manage' ? '开心元元 · 管理端' : '开心元元'
  document.title = to.meta.title ? `${base} · ${to.meta.title}` : base
})

export default router
