<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDataStore } from '@/stores/data'
import type { VideoItem } from '@/types'

const store = useDataStore()
// Pinia state 必须用 storeToRefs 保持响应性；直接 const videoAlbums = store.videos 在赋值替换时不会更新
const { videos: videoAlbums, loading: storeLoading } = storeToRefs(store)

// 直接刷新时 store 可能尚未加载完成，确保本页数据可用
if (!storeLoading.value && videoAlbums.value.length === 0) {
  store.loadAll()
}

const currentAlbumIndex = ref(0)
const currentPage = ref(1)
const pageSize = 8
const mobilePageSize = 4
const displayedCount = ref(mobilePageSize)
const currentVideo = ref<VideoItem | null>(null)
const currentVideoIndex = ref(-1)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const isDragging = ref(false)
const playMode = ref<'order' | 'loop' | 'shuffle'>('order')
const isMobile = ref(false)

// 播放器控制层显隐
const controlsVisible = ref(true)
let controlsHideTimer: number | null = null
const isHoveringStage = ref(false)

const videoRef = ref<HTMLVideoElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)

function clearHideTimer() {
  if (controlsHideTimer) {
    clearTimeout(controlsHideTimer)
    controlsHideTimer = null
  }
}

function scheduleHideControls(delay = 2000) {
  clearHideTimer()
  if (!isPlaying.value) return
  controlsHideTimer = window.setTimeout(() => {
    controlsHideTimer = null
    if (isPlaying.value && !isDragging.value) {
      controlsVisible.value = false
    }
  }, delay)
}

function showControls() {
  controlsVisible.value = true
}

// PC：鼠标进入舞台立即显示；鼠标离开且播放中则延迟隐藏
function onStageMouseEnter() {
  isHoveringStage.value = true
  clearHideTimer()
  showControls()
}

function onStageMouseLeave() {
  isHoveringStage.value = false
  if (isPlaying.value && !isMobile.value) {
    scheduleHideControls(2000)
  }
}

// 移动端：点击文档其他区域隐藏控制层
function onDocumentClickHideControls(e: MouseEvent | TouchEvent) {
  if (!isMobile.value) return
  const target = e.target as HTMLElement
  if (stageRef.value && !stageRef.value.contains(target)) {
    controlsVisible.value = false
  }
}

const currentAlbumVideos = computed(() => videoAlbums.value[currentAlbumIndex.value]?.videos || [])

// 播放器未选视频时，展示当前专辑首条缩略图（默认第一个专辑首条）
const stageCover = computed(() => {
  if (currentVideo.value) return currentVideo.value.cover
  return currentAlbumVideos.value[0]?.cover || videoAlbums.value[0]?.videos[0]?.cover || ''
})

const totalPages = computed(() => Math.ceil(currentAlbumVideos.value.length / pageSize))

const paginatedVideos = computed(() => {
  if (isMobile.value) {
    return currentAlbumVideos.value.slice(0, displayedCount.value)
  }
  const start = (currentPage.value - 1) * pageSize
  return currentAlbumVideos.value.slice(start, start + pageSize)
})

function resetToFirstVideo(autoPlay = false) {
  const list = currentAlbumVideos.value
  if (!list.length) {
    currentVideo.value = null
    currentVideoIndex.value = -1
    return
  }
  currentVideo.value = list[0]
  currentVideoIndex.value = 0
  currentTime.value = 0
  duration.value = 0
  isPlaying.value = false
  controlsVisible.value = true
  if (autoPlay) {
    isPlaying.value = true
    setTimeout(() => {
      const v = videoRef.value
      if (v) {
        v.load()
        v.play().catch(() => { isPlaying.value = false })
      }
    }, 0)
  }
}

function switchAlbum(idx: number) {
  currentAlbumIndex.value = idx
  currentPage.value = 1
  displayedCount.value = mobilePageSize
  resetToFirstVideo(false)
}

function playVideo(video: VideoItem, idxInPage: number) {
  const globalIdx = isMobile.value
    ? idxInPage
    : (currentPage.value - 1) * pageSize + idxInPage
  currentVideo.value = video
  currentVideoIndex.value = globalIdx
  isPlaying.value = true
  currentTime.value = 0
  duration.value = 0
  controlsVisible.value = true
  // 让视频元素加载后自动播放
  setTimeout(() => {
    const v = videoRef.value
    if (v) {
      v.load()
      v.play().catch(() => { isPlaying.value = false })
    }
  }, 0)
}

function togglePlay() {
  const v = videoRef.value
  if (!v) return
  if (v.paused || v.ended) {
    v.play().then(() => {
      isPlaying.value = true
      showControls()
      scheduleHideControls(2000)
    }).catch(() => {})
  } else {
    v.pause()
    isPlaying.value = false
    showControls()
  }
}

function onVideoClick() {
  if (isMobile.value) {
    // 移动端：点击视频区域切换控制层显隐，不直接控制播放
    controlsVisible.value = !controlsVisible.value
    return
  }
  // PC：点击视频切换播放/暂停；播放后自动隐藏控制层
  togglePlay()
  scheduleHideControls(2000)
}

function onTimeUpdate() {
  if (isDragging.value) return
  const v = videoRef.value
  if (!v) return
  currentTime.value = v.currentTime
  duration.value = v.duration || duration.value
}

function onLoadedMeta() {
  const v = videoRef.value
  if (v) duration.value = v.duration || 0
}

function onEnded() {
  isPlaying.value = false
  next()
}

function seekFromEvent(e: MouseEvent) {
  const v = videoRef.value
  if (!v || !duration.value) return
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  v.currentTime = ratio * duration.value
  currentTime.value = v.currentTime
}

function startDrag(e: MouseEvent) {
  isDragging.value = true
  clearHideTimer()
  seekFromEvent(e)
}

function onDrag(e: MouseEvent) {
  if (!isDragging.value) return
  seekFromEvent(e)
}

function stopDrag() {
  isDragging.value = false
  if (isPlaying.value && !isHoveringStage.value && !isMobile.value) {
    scheduleHideControls(2000)
  }
}

function prev() {
  const list = currentAlbumVideos.value
  if (!list.length) return
  let idx = currentVideoIndex.value
  if (idx <= 0) idx = list.length - 1
  else idx -= 1
  playVideo(list[idx], idx)
}

function next() {
  const list = currentAlbumVideos.value
  if (!list.length) return
  let idx = currentVideoIndex.value
  if (idx < 0 || idx >= list.length - 1) idx = 0
  else idx += 1
  playVideo(list[idx], idx)
}

function toggleFullscreen() {
  const el = stageRef.value
  if (!el) return
  if (!document.fullscreenElement) {
    el.requestFullscreen?.().catch(() => {})
  } else {
    document.exitFullscreen?.().catch(() => {})
  }
}

function toggleMode() {
  if (playMode.value === 'order') playMode.value = 'loop'
  else if (playMode.value === 'loop') playMode.value = 'shuffle'
  else playMode.value = 'order'
}

const modeIcon = computed(() => {
  if (playMode.value === 'order') return '顺序'
  if (playMode.value === 'loop') return '循环'
  return '随机'
})

const modeIconPath = computed(() => {
  // SVG path strings for 顺序 / 循环 / 随机
  if (playMode.value === 'order') {
    return 'M4 6h16M4 12h16M4 18h16'
  }
  if (playMode.value === 'loop') {
    return 'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15'
  }
  return 'M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l-4 4M4 4l5 5'
})

const progressPercent = computed(() => {
  if (!duration.value) return 0
  return (currentTime.value / duration.value) * 100
})

function formatTime(seconds: number) {
  if (!isFinite(seconds) || seconds < 0) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function loadMore() {
  displayedCount.value += mobilePageSize
}

function checkMobile() {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('click', onDocumentClickHideControls)
})

onUnmounted(() => {
  clearHideTimer()
  window.removeEventListener('resize', checkMobile)
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('click', onDocumentClickHideControls)
})

// 数据加载完成后：默认选中当前专辑第一个视频，但不自动播放
watch(storeLoading, (loading) => {
  if (!loading && currentVideo.value === null && currentAlbumVideos.value.length > 0) {
    resetToFirstVideo(false)
  }
}, { immediate: true })

watch(currentAlbumIndex, () => {
  // 切换专辑后已统一由 switchAlbum 重置到首条
})
</script>

<template>
  <section class="page-section video-page">
    <div class="page-header">
      <h1 class="page-title">视频合集</h1>
      <p class="page-subtitle">记录每一个精彩瞬间</p>
    </div>

    <div v-if="storeLoading || videoAlbums.length === 0" class="video-loading">
      正在加载视频…
    </div>

    <template v-else>
      <div class="video-panel">
        <div
          ref="stageRef"
          class="video-player-stage"
          :class="currentVideo ? `orientation-${currentVideo.orientation}` : 'orientation-landscape'"
          @mouseenter="onStageMouseEnter"
          @mouseleave="onStageMouseLeave"
        >
          <div v-if="!currentVideo" class="player-placeholder" @click.stop="onVideoClick">
            <img :src="stageCover" alt="视频缩略图" />
          </div>

          <div v-else class="player-video-wrap">
            <video
              ref="videoRef"
              class="player-video"
              :src="currentVideo.url"
              :poster="currentVideo.cover"
              preload="metadata"
              @click.stop="onVideoClick"
              @timeupdate="onTimeUpdate"
              @loadedmetadata="onLoadedMeta"
              @ended="onEnded"
            ></video>
          </div>

          <div class="player-info" :class="{ visible: controlsVisible }">
            <div class="player-title">{{ currentVideo?.title || '未选择视频' }}</div>
            <div class="player-artist">{{ currentVideo?.artist || '请选择列表中的视频' }}</div>

            <div class="player-progress" @mousedown="startDrag">
              <div class="progress-bar" :style="{ width: progressPercent + '%' }"></div>
            </div>
            <div class="player-time">
              <span>{{ formatTime(currentTime) }}</span>
              <span>{{ formatTime(duration) }}</span>
            </div>

            <div class="player-controls">
              <button class="ctrl-btn" title="上一个" @click.stop="prev">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
                </svg>
              </button>
              <button class="ctrl-btn play-btn" title="播放/暂停" @click.stop="togglePlay">
                <svg v-if="!isPlaying" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <svg v-else viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M6 19h4V5H6zm8-14v14h4V5z" />
                </svg>
              </button>
              <button class="ctrl-btn" title="下一个" @click.stop="next">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M6 18l8.5-6L6 6zm9.5-12h2v12h-2z" />
                </svg>
              </button>
              <button class="ctrl-btn fullscreen-btn" title="全屏" @click.stop="toggleFullscreen">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M7 14H5v5h5v-2H7zm-2-4h2V7h3V5H5zm12 7h-3v2h5v-5h-2zM14 5v2h3v3h2V5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="video-playlist-wrapper">
          <div class="album-tab-bar">
            <div class="album-tab-scroll">
              <button
                v-for="(album, idx) in videoAlbums"
                :key="album.name"
                class="album-tab"
                :class="{ active: currentAlbumIndex === idx }"
                @click="switchAlbum(idx)"
              >
                {{ album.name }}
              </button>
            </div>
            <button class="album-tab-menu" :title="`切换播放模式：${modeIcon}`" @click="toggleMode">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path :d="modeIconPath" />
              </svg>
            </button>
          </div>

          <div class="video-playlist">
            <div
              v-for="(video, idx) in paginatedVideos"
              :key="video.id"
              class="playlist-item"
              :class="{ playing: currentVideo?.id === video.id }"
              @click="playVideo(video, idx)"
            >
              <div v-if="currentVideo?.id !== video.id" class="pl-index">
                {{ (currentPage - 1) * pageSize + idx + 1 }}
              </div>
              <div v-else class="pl-play-icon">
                <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div class="pl-thumb">
                <img :src="video.cover" :alt="video.title" />
              </div>
              <div class="pl-info">
                <div class="pl-name">{{ video.title }}</div>
              </div>
              <div class="pl-hover-play">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- PC 分页 -->
          <div v-if="!isMobile && totalPages > 1" class="video-pagination">
            <button
              class="page-btn"
              :class="{ disabled: currentPage === 1 }"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              上一页
            </button>
            <button
              v-for="p in totalPages"
              :key="p"
              class="page-btn"
              :class="{ active: currentPage === p }"
              @click="currentPage = p"
            >
              {{ p }}
            </button>
            <button
              class="page-btn"
              :class="{ disabled: currentPage === totalPages }"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              下一页
            </button>
          </div>

          <!-- 移动端加载更多 -->
          <button
            v-if="isMobile && displayedCount < currentAlbumVideos.length"
            class="playlist-load-more"
            @click="loadMore"
          >
            加载更多
          </button>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.video-panel {
  max-width: 1000px;
  margin: 0 auto 80px;
  padding: 32px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 32px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
}

.video-playlist-wrapper {
  margin-top: 24px;
}

.player-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}
.player-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-loading {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-secondary);
  font-size: 14px;
}

@media (max-width: 768px) {
  .video-panel {
    padding: 16px;
    border-radius: 20px;
    margin-bottom: 60px;
  }
}
</style>
