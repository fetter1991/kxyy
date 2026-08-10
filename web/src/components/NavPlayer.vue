<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useDataStore } from '../stores/data'
import { useAssetUrl } from '../utils/asset'

const store = useDataStore()
const music = computed(() => store.music)
const current = computed(() => store.currentMusicIndex)
const isPlaying = computed(() => store.musicPlaying)
const currentTrack = computed(() => store.currentTrack())

const expanded = ref(false)
const playlistOpen = ref(false)
const rotating = ref(false)
const zoneEl = ref<HTMLElement | null>(null)
let idleTimer: number | undefined

// 展开后 5 秒无操作自动收起（音乐继续播放）
function resetIdleTimer() {
  if (idleTimer) window.clearTimeout(idleTimer)
  if (expanded.value || playlistOpen.value) {
    idleTimer = window.setTimeout(() => {
      collapse()
    }, 5000)
  }
}
function collapse() {
  expanded.value = false
  playlistOpen.value = false
  if (idleTimer) window.clearTimeout(idleTimer)
}
// 点击页面其他地方收起
function onDocClick(e: MouseEvent) {
  if (zoneEl.value && !zoneEl.value.contains(e.target as Node)) {
    collapse()
  }
}

// 收起态头像（当前无封面时用占位渐变，展开后显示封面）
// C02 兜底头像三层回退（对齐原站 assets/js/nav-player.js:110-125）：
//   1) track.avatar 存在        → 直接使用
//   2) avatar 缺失但有 artist   → 推导 assets/img/avatar/{artist}.png
//   3) 上述图片加载失败         → 回退 VA.png（仅一次，防 error 死循环）
const AVATAR_FALLBACK = useAssetUrl('assets/img/avatar/VA.png')

// 记录已回退过的 URL：等价原站 img.dataset.fallbackApplied，
// 用 Set 而非布尔量，确保切歌后新封面仍能各自触发一次回退。
const fallbackApplied = ref<Set<string>>(new Set())

const coverUrl = computed(() => {
  const t = currentTrack.value
  if (!t) return ''
  // 第 1 层：显式 avatar
  if (t.avatar) return useAssetUrl(t.avatar)
  // 第 2 层：按 artist 推导
  if (t.artist) return useAssetUrl(`assets/img/avatar/${t.artist}.png`)
  // 第 3 层：无 avatar 也无 artist，直接兜底
  return AVATAR_FALLBACK
})

// 第 3 层：加载失败回退。同一 URL 只回退一次，且兜底图自身失败时不再处理，
// 双重保险避免 VA.png 缺失导致 error 事件无限循环。
function onCoverError(e: Event) {
  const img = e.target as HTMLImageElement
  if (!img) return
  const failed = img.getAttribute('src') || ''
  if (failed === AVATAR_FALLBACK || fallbackApplied.value.has(failed)) return
  fallbackApplied.value.add(failed)
  img.src = AVATAR_FALLBACK
}

const trackText = computed(() => {
  const t = currentTrack.value
  if (!t) return ''
  return `${t.title} - ${t.artist}`
})

function toggleExpand() {
  expanded.value = !expanded.value
  if (expanded.value) {
    rotating.value = true
    window.setTimeout(() => (rotating.value = false), 320)
    resetIdleTimer()
  } else {
    playlistOpen.value = false
    if (idleTimer) window.clearTimeout(idleTimer)
  }
}

function togglePlaylist() {
  playlistOpen.value = !playlistOpen.value
  resetIdleTimer()
}

function togglePlay() {
  store.togglePlay()
  resetIdleTimer()
}

function prev() {
  store.prevMusic()
  resetIdleTimer()
}
function next() {
  store.nextMusic()
  resetIdleTimer()
}
function selectTrack(i: number) {
  // 点同一首则切换播放/暂停，否则切歌并播放
  if (i === current.value) {
    store.togglePlay()
  } else {
    store.setCurrentMusic(i)
    store.setMusicPlaying(true)
  }
  resetIdleTimer()
}

onMounted(() => {
  document.addEventListener('click', onDocClick, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick, true)
  if (idleTimer) window.clearTimeout(idleTimer)
})
</script>

<template>
  <div
    ref="zoneEl"
    class="nav-player-zone"
    :class="{ expanded: expanded || playlistOpen, 'playlist-open': playlistOpen }"
  >
    <!-- 左侧控制条：播放列表 / 上一曲 / 播放暂停 / 下一曲 -->
    <div class="nav-player-left-section" :class="{ expanded: expanded }">
      <div class="nav-player-card-left">
        <button class="nav-ctrl-btn" title="播放列表" @click="togglePlaylist">
          <i class="fa-solid fa-list"></i>
        </button>
        <button class="nav-ctrl-btn" title="上一曲" @click="prev">
          <i class="fa-solid fa-backward-step"></i>
        </button>
        <button class="nav-ctrl-btn nav-play-btn" :title="isPlaying ? '暂停' : '播放'" @click="togglePlay">
          <i :class="isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"></i>
        </button>
        <button class="nav-ctrl-btn" title="下一曲" @click="next">
          <i class="fa-solid fa-forward-step"></i>
        </button>
      </div>
    </div>

    <!-- 圆形头像按钮（收起态白色半透明渐变 + 音符图标；展开态显示封面） -->
    <button
      class="nav-music-btn"
      :class="{ expanded: expanded, playing: isPlaying, rotating: rotating }"
      :title="expanded ? '收起播放器' : '展开播放器'"
      @click="toggleExpand"
    >
      <img
        v-if="coverUrl"
        :key="coverUrl"
        class="music-btn-avatar"
        :src="coverUrl"
        alt="cover"
        @error="onCoverError"
      />
      <i class="fa-solid fa-music"></i>
    </button>

    <!-- 右侧信息条：歌名 - 歌手 -->
    <div class="nav-player-right-section" :class="{ expanded: expanded }">
      <div class="nav-player-card-right">
        <div class="nav-player-info">
          <span class="nav-player-track-text">{{ trackText }}</span>
        </div>
      </div>
    </div>

    <!-- 播放列表下拉 -->
    <div class="nav-player-playlist" :class="{ open: playlistOpen }">
      <div class="nav-playlist-body">
        <div
          v-for="(t, i) in music"
          :key="i"
          class="nav-playlist-item"
          :class="{ playing: i === current }"
          @click="selectTrack(i)"
        >
          <span class="nav-pl-index">{{ String(i + 1).padStart(2, '0') }}</span>
          <div class="nav-pl-info">
            <span class="nav-pl-name">{{ t.title }}</span>
            <span class="nav-pl-duration">{{ t.durationSec ? formatSec(t.durationSec) : '' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
function formatSec(s: number): string {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}
</script>
