<script setup lang="ts">
// 公共布局（T08 + T13 样式还原）：class 对齐原站，直接命中 original.css
// 音乐播放器位预留（T16 暂缓，待补 NavPlayer 组件挂到 #navMusicBtn）
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useDataStore } from '../stores/data'

const route = useRoute()
const { loading, error } = storeToRefs(useDataStore())
const menuOpen = ref(false)

const nav = [
  { to: '/gallery', label: '相册' },
  { to: '/', label: '素材库' },
  { to: '/profile', label: '个人资料' },
  { to: '/video', label: '视频' },
  { to: '/growth', label: '成长历程' },
  { to: '/message', label: '留言' },
]
</script>

<template>
  <div class="app-root">
    <!-- 全局加载/错误遮罩（原则 10 P0/P2） -->
    <div v-if="loading" class="overlay">加载中…</div>
    <div v-else-if="error" class="overlay error">加载失败：{{ error }}</div>

    <nav class="navbar" id="navbar">
      <div class="nav-inner">
        <div class="nav-logo">
          <RouterLink to="/">
            <span class="logo-text"><img src="/assets/img/global/logo.png" alt="开心元元" /></span>
          </RouterLink>
        </div>
        <ul class="nav-menu" :class="{ open: menuOpen }">
          <li v-for="item in nav" :key="item.to">
            <RouterLink
              :to="item.to"
              class="nav-link"
              :class="{ active: route.path === item.to || (item.to !== '/' && route.path.startsWith(item.to)) }"
              @click="menuOpen = false"
            >
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
        <div class="nav-controls">
          <button class="nav-music-btn" id="navMusicBtn" title="播放音乐" aria-label="播放音乐" disabled>
            <i class="fa-solid fa-music"></i>
          </button>
          <button class="nav-toggle" aria-label="展开菜单" @click="menuOpen = !menuOpen">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>

    <main id="pageContainer">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-root { min-height: 100svh; }
.overlay {
  position: fixed; inset: 0; display: grid; place-items: center;
  background: var(--bg); opacity: 0.92; z-index: 2000; font-size: 18px; color: var(--text);
}
.overlay.error { color: #ff8a8a; }
/* 导航激活态由 original.css .nav-link.active 处理；此处补 scoped 兜底 */
.nav-link.active { color: var(--accent); }
</style>
