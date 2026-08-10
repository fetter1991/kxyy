<script setup lang="ts">
// 应用根组件（C05 合并后）：只负责全站级职责，
// 布局下沉到各分区（modules/user/components/Layout.vue、modules/manage/components/ManageLayout.vue），
// 由嵌套路由的父级 component 挂载，避免管理端被套进用户端导航栏。
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PageLoading from '@/shared/components/PageLoading.vue' // C03 首屏加载遮罩
import FeatherLayer from '@/shared/components/FeatherLayer.vue' // C04 羽毛氛围层
import { useDataStore } from '@/stores/data'

// 全局初始化加载（仅一次）；路由切换不重复拉全量（原则 10 P1 状态复用）
const store = useDataStore()
store.loadAll()

const route = useRoute()
// 氛围层（加载动画/羽毛）属站点视觉，管理端不需要
const isUserArea = computed(() => route.meta.area !== 'manage')
</script>

<template>
  <template v-if="isUserArea">
    <PageLoading />
    <FeatherLayer />
  </template>
  <RouterView />
</template>
