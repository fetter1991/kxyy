<script setup lang="ts">
// 首页（T08）：个人资料 + 外链 + 各模块概览入口
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useDataStore } from '@/stores/data'
import { useAssetUrl } from '@/utils/asset'

const { profile, galleries, albums, music } = storeToRefs(useDataStore())
</script>

<template>
  <section class="home">
    <div v-if="profile" class="profile">
      <img :src="useAssetUrl(profile.avatar)" alt="头像" class="avatar" />
      <div class="links">
        <a :href="profile.links.douyin" target="_blank" rel="noopener">抖音主页</a>
        <a :href="profile.links.live" target="_blank" rel="noopener">直播间</a>
      </div>
    </div>

    <h2>素材合集 · {{ galleries.length }}</h2>
    <ul class="cards">
      <li v-for="g in galleries" :key="g.id"><RouterLink :to="`/gallery`">{{ g.title }}</RouterLink> · {{ g.author }}</li>
    </ul>

    <h2>作品 · {{ albums.length }}</h2>
    <ul class="cards">
      <li v-for="a in albums" :key="a.id"><RouterLink :to="`/works`">{{ a.title }}</RouterLink> · {{ a.likes }}</li>
    </ul>

    <h2>常驻音乐 · {{ music.length }}</h2>
    <ul class="cards">
      <li v-for="m in music" :key="m.id">{{ m.title }} - {{ m.artist }}</li>
    </ul>
  </section>
</template>

<style scoped>
.home { text-align: left; }
.profile { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
.avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; }
.links { display: flex; gap: 12px; }
.links a { color: var(--accent); text-decoration: none; }
.cards { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 12px; }
.cards li { background: var(--accent-bg); padding: 8px 12px; border-radius: 8px; }
.cards a { color: var(--text-h); text-decoration: none; }
</style>
