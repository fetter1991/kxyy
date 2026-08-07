<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useDataStore } from '../stores/data'
import { useAssetUrl } from '../utils/asset'

const store = useDataStore()
const music = computed(() => store.music)
const current = computed(() => store.currentMusicIndex)
const isPlaying = computed(() => store.musicPlaying)
const currentTrack = computed(() => music.value[current.value] || null)

const expanded = ref(false)
const playlistOpen = ref(false)
const rotating = ref(false)
const audioEl = ref<HTMLAudioElement | null>(null)
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
const coverUrl = computed(() => {
  const t = currentTrack.value
  return t && t.cover ? useAssetUrl(t.cover) : ''
})

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
  store.setMusicPlaying(!isPlaying.value)
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
  store.setCurrentMusic(i)
  store.setMusicPlaying(true)
  resetIdleTimer()
}

// 当播放状态/曲目变化时同步 <audio>
watch(
  [isPlaying, current, currentTrack],
  () => {
    const a = audioEl.value
    if (!a) return
    const t = currentTrack.value
    if (t && t.src) {
      const url = useAssetUrl(t.src)
      if (a.src !== url) a.src = url
    }
    if (isPlaying.value) {
      a?.play().catch(() => {
        // 自动播放可能被浏览器拦截，保持状态但不报错
      })
    } else {
      a?.pause()
    }
  },
  { immediate: true }
)

function onAudioEnded() {
  store.nextMusic()
  store.setMusicPlaying(true)
}

onMounted(() => {
  // 初次挂载触发一次同步
  const a = audioEl.value
  if (a && currentTrack.value?.src) {
    a.src = useAssetUrl(currentTrack.value.src)
  }
  document.addEventListener('click', onDocClick, true)
})

onBeforeUnmount(() => {
  audioEl.value?.pause()
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
      <img v-if="coverUrl" class="music-btn-avatar" :src="coverUrl" alt="cover" />
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
            <span class="nav-pl-duration">{{ t.duration || '' }}</span>
          </div>
        </div>
      </div>
    </div>

    <audio ref="audioEl" @ended="onAudioEnded"></audio>
  </div>
</template>
