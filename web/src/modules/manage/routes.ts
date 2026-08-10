// 管理端路由分区（C05）
// 现状：admin/ 原为 create-vue 脚手架模板，无业务代码，故此处只建可运行骨架，
// 具体管理功能（内容/媒体/留言审核）另行立项，不在本次合并范围内。
// 所有管理端路由统一 /manage 前缀 + meta.area='manage'，便于后续加权限守卫。
import type { RouteRecordRaw } from 'vue-router'

export const manageRoutes: RouteRecordRaw[] = [
  {
    path: '/manage',
    component: () => import('./components/ManageLayout.vue'),
    children: [
      {
        path: '',
        name: 'manage-dashboard',
        component: () => import('./views/DashboardView.vue'),
        meta: { title: '概览', area: 'manage' },
      },
    ],
  },
]
