<script setup lang="ts">
// 404（T08）：全局兜底，禁止白屏（原则 10 P0）
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="nf">
    <h2>页面不存在</h2>
    <p>你访问的页面走丢了，回到首页继续吧。</p>
    <RouterLink to="/" class="back">返回首页</RouterLink>
  </section>
</template>

<style scoped>
.nf { text-align: center; padding: 60px 20px; }
.back { display: inline-block; margin-top: 16px; color: var(--accent); text-decoration: none; }
</style>
