import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // C05 分包：用户端与管理端代码互不牵连，
        // 普通访客不会下载管理端 chunk（合并为单应用的前提条件）。
        manualChunks(id: string) {
          if (id.includes('/node_modules/')) {
            if (/[\\/]node_modules[\\/](vue|vue-router|pinia|@vue)[\\/]/.test(id)) return 'vendor-vue'
            return 'vendor'
          }
          if (id.includes('/src/modules/manage/')) return 'manage'
          if (id.includes('/src/modules/user/')) return 'user'
          return undefined
        },
      },
    },
  },
})
