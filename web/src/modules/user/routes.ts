// 用户端路由分区（C05）
// 保持合并前的全部路径不变，确保外链/书签不失效（原则 3 兼容性）。
// 导航顺序：相册 /gallery | 素材库 / | 个人资料 /profile | 视频 /video | 成长历程 /growth | 留言 /message
import type { RouteRecordRaw } from 'vue-router'

export const userRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('./components/Layout.vue'),
    children: [
      { path: '', name: 'gallery', component: () => import('./views/GalleryView.vue'), meta: { title: '素材库', area: 'user' } },
      { path: 'gallery', name: 'album', component: () => import('./views/WorksView.vue'), meta: { title: '相册', area: 'user' } },
      { path: 'profile', name: 'profile', component: () => import('./views/ProfileView.vue'), meta: { title: '个人资料', area: 'user' } },
      { path: 'video', name: 'video', component: () => import('./views/VideoView.vue'), meta: { title: '视频', area: 'user' } },
      { path: 'growth', name: 'growth', component: () => import('./views/GrowthView.vue'), meta: { title: '成长历程', area: 'user' } },
      { path: 'message', name: 'message', component: () => import('./views/MessageView.vue'), meta: { title: '留言', area: 'user' } },
    ],
  },
]
