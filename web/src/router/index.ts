// 用户端路由（T08）：消除单页/整页两套跳转技术债，统一 vue-router（宪法原则 7.1 SPA 导航）
// 双端导航结构一致：web 用户端 6 页 + admin 管理端（后续独立）。
// 导航顺序：相册 /gallery | 素材库 / | 个人资料 /profile | 视频 /video | 成长历程 /growth | 留言 /message
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'gallery', component: () => import('../views/GalleryView.vue'), meta: { title: '素材库' } },
  { path: '/gallery', name: 'album', component: () => import('../views/WorksView.vue'), meta: { title: '相册' } },
  { path: '/profile', name: 'profile', component: () => import('../views/ProfileView.vue'), meta: { title: '个人资料' } },
  { path: '/video', name: 'video', component: () => import('../views/VideoView.vue'), meta: { title: '视频' } },
  { path: '/growth', name: 'growth', component: () => import('../views/GrowthView.vue'), meta: { title: '成长历程' } },
  { path: '/message', name: 'message', component: () => import('../views/MessageView.vue'), meta: { title: '留言' } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue'), meta: { title: '页面不存在' } },
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
  document.title = to.meta.title ? `开心元元 · ${to.meta.title}` : '开心元元'
})

export default router
