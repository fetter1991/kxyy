<script setup lang="ts">
import Layout from './components/Layout.vue'
import { useDataStore } from './stores/data'

// 全局初始化加载（仅一次）；路由切换不重复拉全量（原则 10 P1 状态复用）
const store = useDataStore()
store.loadAll()
</script>

<template>
  <Layout />
</template>
