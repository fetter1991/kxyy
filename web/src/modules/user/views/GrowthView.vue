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

// 容器可视高度，用于设置每项高度、计算滚动位置
const itemHeightPx = ref(0)
let initialized = false

function updateItemHeight() {
  const el = scrollRef.value
  if (!el) return
  itemHeightPx.value = el.clientHeight
}

function setItemHeights() {
  updateItemHeight()
  const items = scrollRef.value?.querySelectorAll<HTMLElement>('.growth-fullscreen-item')
  items?.forEach((item) => {
    item.style.height = `${itemHeightPx.value}px`
  })
}

function itemHeight() {
  return itemHeightPx.value || scrollRef.value?.clientHeight || window.innerHeight
}

// 时间轴自适应滚动：前 N/2 靠左、后 N/2 靠右、中间居中
function centerTimeline(idx: number) {
  const nav = navRef.value
  if (!nav) return
  const points = nav.querySelectorAll<HTMLElement>('.growth-nav-point')
  if (!points[idx]) return
  const track = nav.querySelector<HTMLElement>('.growth-nav-track')
  if (!track) return

  const containerWidth = nav.clientWidth
  const trackWidth = track.scrollWidth
  if (trackWidth <= containerWidth) {
    nav.scrollTo({ left: 0, behavior: 'smooth' })
    return
  }

  const pointWidth = points[0]?.offsetWidth || 100
  const visibleCount = Math.max(1, Math.floor(containerWidth / pointWidth))
  const half = Math.max(1, Math.floor(visibleCount / 2))

  let targetLeft = 0
  if (idx < half) {
    targetLeft = 0
  } else if (idx >= points.length - half) {
    targetLeft = trackWidth - containerWidth
  } else {
    targetLeft = points[idx].offsetLeft + pointWidth / 2 - containerWidth / 2
  }

  const maxLeft = trackWidth - containerWidth
  targetLeft = Math.max(0, Math.min(targetLeft, maxLeft))
  nav.scrollTo({ left: targetLeft, behavior: 'smooth' })
}

let animating = false
let animTimer = 0

function scrollToItem(idx: number, smooth = true) {
  const el = scrollRef.value
  if (!el || growth.value.length === 0) return
  const clamped = Math.max(0, Math.min(growth.value.length - 1, idx))

  activeIndex.value = clamped
  clickIndex.value = clamped
  animating = true
  window.clearTimeout(animTimer)

  el.scrollTo({ top: clamped * itemHeight(), behavior: smooth ? 'smooth' : 'auto' })
  centerTimeline(clamped)

  // 兜底解锁：若浏览器不触发 scrollend，定时释放
  animTimer = window.setTimeout(() => {
    animating = false
    clickIndex.value = null
  }, smooth ? 800 : 0)
}

function syncActiveFromScroll() {
  const el = scrollRef.value
  if (!el) return
  const h = itemHeight()
  if (!h) return
  const idx = Math.max(0, Math.min(growth.value.length - 1, Math.round(el.scrollTop / h)))
  if (idx !== activeIndex.value) {
    activeIndex.value = idx
    centerTimeline(idx)
  }
}

function onScroll() {
  if (animating) return
  syncActiveFromScroll()
}

function onScrollEnd() {
  animating = false
  window.clearTimeout(animTimer)
  syncActiveFromScroll()
  clickIndex.value = null
}

// 滚轮：累加 delta，每约 60px 一步，单次最多翻 3 格
let wheelAccum = 0
let wheelTimer = 0

function processWheel() {
  window.clearTimeout(wheelTimer)
  wheelTimer = 0
  if (!wheelAccum || growth.value.length === 0) return
  const sign = wheelAccum > 0 ? 1 : -1
  const steps = Math.max(1, Math.min(3, Math.round(Math.abs(wheelAccum) / 60)))
  wheelAccum = 0
  if (animating) return
  scrollToItem(activeIndex.value + sign * steps)
}

function onWheel(e: WheelEvent) {
  e.preventDefault()
  if (animating || detailItem.value) return
  wheelAccum += e.deltaY
  if (!wheelTimer) {
    wheelTimer = window.setTimeout(processWheel, 80)
  }
}

// 键盘：一次按键一次切换，长按不连续触发
let keyLocked = false

function onKeyDown(e: KeyboardEvent) {
  if (detailItem.value) return
  if (e.key === 'Escape') {
    closeDetail()
    return
  }
  if (keyLocked) return
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    e.preventDefault()
    keyLocked = true
    if (!animating) scrollToItem(activeIndex.value + 1)
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    e.preventDefault()
    keyLocked = true
    if (!animating) scrollToItem(activeIndex.value - 1)
  }
}

function onKeyUp(e: KeyboardEvent) {
  if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    keyLocked = false
  }
}

// 移动端触摸滑动
let touchStartY = 0
let touchLocked = false

function onTouchStart(e: TouchEvent) {
  touchStartY = e.touches[0].clientY
}

function onTouchEnd(e: TouchEvent) {
  if (touchLocked || detailItem.value) return
  const diff = touchStartY - e.changedTouches[0].clientY
  if (Math.abs(diff) < 40) return
  touchLocked = true
  const dir = diff > 0 ? 1 : -1
  if (!animating) scrollToItem(activeIndex.value + dir)
  setTimeout(() => {
    touchLocked = false
  }, 800)
}

function handleNavClick(idx: number) {
  scrollToItem(idx)
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

let resizeObs: ResizeObserver | null = null

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)

  updateItemHeight()
  setItemHeights()
  if (growth.value.length > 0) {
    scrollToItem(0, false)
  }

  if (scrollRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObs = new ResizeObserver(() => {
      updateItemHeight()
      setItemHeights()
      if (!animating) scrollToItem(activeIndex.value, false)
    })
    resizeObs.observe(scrollRef.value)
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  window.clearTimeout(animTimer)
  window.clearTimeout(wheelTimer)
  resizeObs?.disconnect()
})

// 数据异步加载完成（含直链进入场景）
watch(
  () => growth.value.length,
  (len) => {
    if (len > 0) {
      nextTick(() => {
        updateItemHeight()
        setItemHeights()
        if (!initialized) {
          initialized = true
          scrollToItem(0, false)
        }
      })
    }
  }
)
</script>

<template>
  <section class="page-section growth-fullscreen-wrap">
    <div
      ref="scrollRef"
      class="growth-fullscreen-scroll"
      @scroll="onScroll"
      @scrollend="onScrollEnd"
      @wheel.prevent="onWheel"
      @touchstart.passive="onTouchStart"
      @touchend="onTouchEnd"
    >
      <div class="growth-fullscreen-list">
        <div
          v-for="(item, idx) in growth"
          :key="item.id"
          class="growth-fullscreen-item"
          :class="{ active: activeIndex === idx }"
          :style="{ height: itemHeightPx ? `${itemHeightPx}px` : undefined }"
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
