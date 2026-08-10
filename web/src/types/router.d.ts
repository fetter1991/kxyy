// 路由 meta 类型声明（C05）：为分区标识与标题提供类型约束，
// 避免各处 route.meta.xxx 退化成 any。
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** 页面标题（用于 document.title） */
    title?: string
    /** 分区标识：用户端 / 管理端 */
    area?: 'user' | 'manage'
  }
}

export {}
