<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useDataStore } from '@/stores/data'
import type { GrowthItem } from '@/types'

const store = useDataStore()
// Pinia state 必须用 storeToRefs 保持响应性；直接 const growth = store.growth 在赋值替换时不会更新
const { growth } = storeToRefs(store)

// 直链进入（非导航切换）时，store 可能尚未加载完成，确保本页数据可用
if (!store.loading && growth.value.length === 0) {
  store.loadAll()
}

const scrollRef = ref<HTMLElement | null>(null)
const navRef = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
const clickIndex = ref<number | null>(null)
const detailItem = ref<GrowthItem | null>(null)
const isScrolling = ref(false)
const wheelLock = ref(false)

function itemHeight() {
  return scrollRef.value?.clientHeight || window.innerHeight
}

function goTo(index: number, smooth = true) {
  if (index < 0) index = 0
  if (index >= growth.length) index = growth.length - 1
  activeIndex.value = index
  const el = scrollRef.value
  if (!el) return
  isScrolling.value = true
  el.scrollTo({
    top: index * itemHeight(),
    behavior: smooth ? 'smooth' : 'auto'
  })
  // 滚动动画结束后解锁；兜底 800ms
  const unlock = () => { isScrolling.value = false }
  el.addEventListener('scrollend', unlock, { once: true })
  setTimeout(() => {
    el.removeEventListener('scrollend', unlock)
    unlock()
  }, 800)
}

function next() {
  goTo(activeIndex.value + 1)
}

function prev() {
  goTo(activeIndex.value - 1)
}

function onScroll() {
  if (isScrolling.value) return
  const el = scrollRef.value
  if (!el) return
  const h = itemHeight()
  const idx = Math.round(el.scrollTop / h)
  const bounded = Math.max(0, Math.min(growth.length - 1, idx))
  if (bounded !== activeIndex.value) {
    activeIndex.value = bounded
  }
}

function onWheel(e: WheelEvent) {
  e.preventDefault()
  if (wheelLock.value) return
  wheelLock.value = true
  if (e.deltaY > 0) next()
  else prev()
  setTimeout(() => { wheelLock.value = false }, 700)
}

function onKeyDown(e: KeyboardEvent) {
  if (detailItem.value) return
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    e.preventDefault()
    next()
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    e.preventDefault()
    prev()
  } else if (e.key === 'Escape') {
    closeDetail()
  }
}

function handleNavClick(idx: number) {
  clickIndex.value = idx
  goTo(idx)
  setTimeout(() => { clickIndex.value = null }, 600)
}

function openDetail(item: GrowthItem) {
  detailItem.value = item
}

function closeDetail() {
  detailItem.value = null
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}/${m}/${day}`
}

// 保证当前导航点可见
watch(activeIndex, (idx) => {
  nextTick(() => {
    const nav = navRef.value
    if (!nav) return
    const point = nav.querySelectorAll('.growth-nav-point')[idx] as HTMLElement | undefined
    if (point) {
      const offset = point.offsetLeft + point.offsetWidth / 2 - nav.clientWidth / 2
      nav.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' })
    }
  })
})

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})

// 数据加载完成后（含直链进入场景）初始化滚动定位到第一项
watch(
  () => growth.value.length,
  (len) => {
    if (len > 0) {
      nextTick(() => goTo(0, false))
    }
  },
  { immediate: true }
)
</script>

<template>
  <section class="page-section growth-fullscreen-wrap">
    <div
      ref="scrollRef"
      class="growth-fullscreen-scroll"
      @scroll="onScroll"
      @wheel.prevent="onWheel"
    >
      <div class="growth-fullscreen-list">
        <div
          v-for="(item, idx) in growth"
          :key="item.id"
          class="growth-fullscreen-item"
          :class="{ active: activeIndex === idx }"
        >
          <div class="growth-fullscreen-bg">
            <img :src="item.cover" :alt="item.title" />
          </div>
          <div class="growth-fullscreen-content">
            <div class="growth-fs-date">{{ formatDate(item.date) }}</div>
            <div class="growth-fs-title-row">
              <h2 class="growth-fs-title">{{ item.title }}</h2>
            </div>
            <p class="growth-fs-desc">{{ item.desc }}</p>
            <button class="growth-fs-btn" @click="openDetail(item)">
              查看详情
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div ref="navRef" class="growth-timeline-nav">
      <div class="growth-nav-track">
        <button
          v-for="(item, idx) in growth"
          :key="item.id"
          class="growth-nav-point"
          :class="{ active: activeIndex === idx, clicking: clickIndex === idx }"
          @click="handleNavClick(idx)"
        >
          <span class="growth-nav-diamond"></span>
          <span class="growth-nav-label">{{ item.shortTitle || item.title }}</span>
        </button>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div v-if="detailItem" class="growth-modal" @click.self="closeDetail">
      <div class="growth-modal-content">
        <div class="growth-modal-header">
          <div class="growth-modal-title">
            {{ detailItem.title }} · {{ formatDate(detailItem.date) }}
          </div>
          <button class="growth-modal-close" @click="closeDetail">×</button>
        </div>
        <div class="growth-modal-body">
          <div class="growth-detail-image">
            <img
              :src="detailItem.content?.image || detailItem.cover"
              :alt="detailItem.title"
            />
            <div class="growth-detail-caption">{{ detailItem.content?.caption }}</div>
          </div>
          <p class="growth-detail-text">
            {{ detailItem.content?.text || detailItem.desc }}
          </p>

          <div v-if="detailItem.content?.video" class="growth-detail-media">
            <div class="growth-media-title">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              {{ detailItem.content.video.title }}
            </div>
            <div class="growth-video-player">
              <video :src="detailItem.content.video.videoUrl" controls></video>
            </div>
          </div>

          <div v-if="detailItem.content?.music" class="growth-detail-media">
            <div class="growth-media-title">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M9 18V6l12-3v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm12-3a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              {{ detailItem.content.music.title }}
            </div>
            <div class="growth-audio-player">
              <audio :src="detailItem.content.music.audioUrl" controls></audio>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.growth-fullscreen-scroll,
.growth-fullscreen-list {
  height: 100%;
}
.growth-fullscreen-item {
  height: 100%;
  min-height: 100%;
}
</style>
