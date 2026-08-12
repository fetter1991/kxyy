<script setup lang="ts">
/**
 * C03 · 首屏加载遮罩（组件化自 assets/js/loading.js + index.html:16-21）
 *
 * 与旧实现的差异说明：
 * 1. 旧站每个 .html 都会重新执行一次 loading；SPA 下仅首屏触发一次，
 *    路由切换不重复播放（由 App.vue 单例挂载天然保证）。
 * 2. 旧站用 setTimeout 链式递归 + DOM appendChild 逐字插入；
 *    这里改为响应式数组渲染，避免手工操作 DOM。
 * 3. 所有定时器在 onBeforeUnmount 统一清理（原则 10 P1 防泄漏）。
 * 4. 样式不内联：.page-loading / .loading-* 已全量存在于 styles/original.css
 *    （1863 起），由 main.ts 全局引入，此处复用类名即命中原站视觉。
 */
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useAssetUrl } from '@/utils/asset'
import { useDataStore } from '@/stores/data'

const store = useDataStore()

const CN_TEXT = '开心元元'
const EN_TEXT = 'KAIXINYUANYUAN'
const CN_SPEED = 280 // 旧站 loading.js:41
const EN_SPEED = 120 // 旧站 loading.js:58
const START_DELAY = 300 // 旧站 loading.js:66
const CN_TO_EN_GAP = 400 // 旧站 loading.js:46
const MAX_DURATION = 8000 // 兜底：接口超时才强制收起，避免偶发长加载（反馈③）

const loadingGif = useAssetUrl('assets/img/global/loading.gif')

const visible = ref(true)
const cnChars = ref<string[]>([])
const enChars = ref<string[]>([])
const cnCursor = ref(false)
const enCursor = ref(false)

const timers: number[] = []
function later(fn: () => void, ms: number) {
  timers.push(window.setTimeout(fn, ms))
}

function typeCn(i = 0) {
  if (i < CN_TEXT.length) {
    cnChars.value.push(CN_TEXT[i])
    later(() => typeCn(i + 1), CN_SPEED)
  } else {
    cnCursor.value = true
    later(() => typeEn(0), CN_TO_EN_GAP)
  }
}

function typeEn(j = 0) {
  if (j < EN_TEXT.length) {
    enChars.value.push(EN_TEXT[j])
    later(() => typeEn(j + 1), EN_SPEED)
  } else {
    enCursor.value = true
  }
}

// 数据加载完成（store.loading true→false）才收起遮罩；
// 另设 MAX_DURATION 兜底，防止接口卡死导致遮罩永不消失。
function dismiss() {
  visible.value = false
}

onMounted(() => {
  later(() => typeCn(0), START_DELAY)
  later(dismiss, MAX_DURATION) // 兜底超时
  // store.loadAll 在 App.vue 已触发；这里等其结束。若已结束则立即收起。
  if (!store.loading) dismiss()
  else watch(() => store.loading, (v) => { if (!v) dismiss() })
})

onBeforeUnmount(() => {
  timers.forEach((t) => window.clearTimeout(t))
  timers.length = 0
})
</script>

<template>
  <div v-if="visible" class="page-loading show">
    <div class="loading-screen-effect"></div>
    <img :src="loadingGif" alt="loading" class="loading-gif" />
    <div class="loading-typewriter">
      <div class="loading-line loading-line-cn">
        <span v-for="(c, i) in cnChars" :key="`cn-${i}`" class="loading-char">{{ c }}</span>
        <span v-if="cnCursor" class="loading-cursor"></span>
      </div>
      <div class="loading-line loading-line-en">
        <span v-for="(c, i) in enChars" :key="`en-${i}`" class="loading-char">{{ c }}</span>
        <span v-if="enCursor" class="loading-cursor"></span>
      </div>
    </div>
  </div>
</template>
