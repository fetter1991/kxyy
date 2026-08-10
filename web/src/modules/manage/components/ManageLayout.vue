<script setup lang="ts">
// 管理端布局骨架（C05）：与用户端完全隔离，不复用 original.css 的站点视觉。
import { RouterLink, RouterView } from 'vue-router'

const nav = [{ to: '/manage', label: '概览' }]
</script>

<template>
  <div class="manage-root">
    <aside class="manage-side">
      <div class="manage-brand">开心元元 · 管理端</div>
      <nav>
        <RouterLink v-for="item in nav" :key="item.to" :to="item.to" class="manage-nav-link">
          {{ item.label }}
        </RouterLink>
      </nav>
    </aside>
    <main class="manage-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.manage-root {
  display: grid;
  grid-template-columns: 220px 1fr;
  min-height: 100svh;
  background: #f5f6f8;
  color: #1f2329;
}
.manage-side {
  background: #1f2329;
  color: #e8eaed;
  padding: 20px 14px;
}
.manage-brand {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 18px;
}
.manage-nav-link {
  display: block;
  padding: 9px 12px;
  border-radius: 6px;
  color: #c3c7cd;
  text-decoration: none;
  font-size: 14px;
}
.manage-nav-link:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}
.manage-nav-link.router-link-exact-active {
  background: #3370ff;
  color: #fff;
}
.manage-main {
  padding: 24px;
}
@media (max-width: 768px) {
  .manage-root {
    grid-template-columns: 1fr;
  }
}
</style>
