<script setup lang="ts">
// 管理端概览（C05 骨架）：复用用户端 data store 只读展示内容规模，
// 不引入写操作，避免在无鉴权前提下暴露修改入口。
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useDataStore } from '@/stores/data'

const store = useDataStore()
const { loading, error } = storeToRefs(store)

const stats = computed(() => [
  { label: '相册', value: store.albums.length },
  { label: '素材库', value: store.galleries.length },
  { label: '视频合集', value: store.videos.length },
  { label: '成长历程', value: store.growth.length },
  { label: '音乐曲目', value: store.music.length },
  { label: '留言', value: store.messages.length },
])
</script>

<template>
  <section>
    <h1 class="page-title">概览</h1>
    <p v-if="loading" class="hint">加载中…</p>
    <p v-else-if="error" class="hint error">加载失败：{{ error }}</p>
    <div v-else class="stat-grid">
      <div v-for="s in stats" :key="s.label" class="stat-card">
        <div class="stat-value">{{ s.value }}</div>
        <div class="stat-label">{{ s.label }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page-title {
  font-size: 20px;
  margin: 0 0 16px;
}
.hint {
  color: #646a73;
}
.hint.error {
  color: #d83931;
}
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 14px;
}
.stat-card {
  background: #fff;
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  padding: 16px;
}
.stat-value {
  font-size: 26px;
  font-weight: 600;
}
.stat-label {
  margin-top: 6px;
  font-size: 13px;
  color: #646a73;
}
</style>
