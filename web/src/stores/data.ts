// 数据 store（T06 + 原则 10 P2）：状态收敛，统一 loading/error
// 组件只调 store action，不直接接触 service/axios。
import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as svc from '../services/data'
import { useAssetUrl } from '../utils/asset'
import type {
  AlbumItem, GalleryItem, GrowthItem, Message, MusicTrack, Profile, VideoAlbum,
} from '../types'

export type PlayMode = 'order' | 'loop' | 'shuffle'

export const useDataStore = defineStore('data', () => {
  // 加载/错误态（P2：接口须有错误态与加载态）
  const loading = ref(false)
  const error = ref<string | null>(null)

  const galleries = ref<GalleryItem[]>([])
  const albums = ref<AlbumItem[]>([])
  const videos = ref<VideoAlbum[]>([])
  const music = ref<MusicTrack[]>([])
  const profile = ref<Profile | null>(null)
  const growth = ref<GrowthItem[]>([])
  const messages = ref<Message[]>([])

  // ===== 播放器状态（T16 双播放器共享，单一真实 audio 实例）=====
  const currentMusicIndex = ref(0)
  const musicPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(0.8)
  const playMode = ref<PlayMode>('order')
  // 媒体互斥：同一时刻只允许一种媒体在播（音频/视频互斥）
  const activeMedia = ref<'none' | 'audio' | 'video'>('none')
  // 视频播放器注册暂停回调，供音频播放时调用暂停视频
  let videoPauser: (() => void) | null = null
  function registerVideoPauser(fn: () => void) {
    videoPauser = fn
  }
  function pauseVideo() {
    videoPauser?.()
  }
  function pauseAudio() {
    musicPlaying.value = false
    audio?.pause()
  }
  // 单一 audio 实例由 store 持有，所有播放器组件共享同一音源与进度
  let audio: HTMLAudioElement | null = null

  function ensureAudio(): HTMLAudioElement {
    if (!audio) {
      audio = new Audio()
      audio.volume = volume.value
      bindAudioEvents(audio)
    }
    return audio
  }

  function currentTrack(): MusicTrack | null {
    return music.value[currentMusicIndex.value] || null
  }

  function syncSrc() {
    const t = currentTrack()
    const a = ensureAudio()
    if (t && t.audioUrl) {
      const url = useAssetUrl(t.audioUrl)
      if (a.src !== url) a.src = url
    }
  }

  function bindAudioEvents(a: HTMLAudioElement) {
    a.addEventListener('timeupdate', () => {
      currentTime.value = a.currentTime
    })
    a.addEventListener('loadedmetadata', () => {
      duration.value = a.duration || 0
    })
    a.addEventListener('ended', () => handleEnded())
    a.addEventListener('play', () => {
      musicPlaying.value = true
    })
    a.addEventListener('pause', () => {
      // 仅当真正暂停（非切歌）才置 false
      if (!a.ended) musicPlaying.value = false
    })
  }

  function handleEnded() {
    if (playMode.value === 'loop') {
      const a = ensureAudio()
      a.currentTime = 0
      a.play().catch(() => {})
    } else if (playMode.value === 'shuffle') {
      if (music.value.length <= 1) return
      let n = currentMusicIndex.value
      while (n === currentMusicIndex.value) {
        n = Math.floor(Math.random() * music.value.length)
      }
      setCurrentMusic(n)
      play()
    } else {
      nextMusic()
      play()
    }
  }

  function setCurrentMusic(i: number) {
    if (i < 0 || i >= music.value.length) return
    if (i === currentMusicIndex.value) return
    currentMusicIndex.value = i
    syncSrc()
    currentTime.value = 0
    duration.value = 0
    if (musicPlaying.value) play()
  }
  function nextMusic() {
    if (music.value.length === 0) return
    currentMusicIndex.value = (currentMusicIndex.value + 1) % music.value.length
    syncSrc()
    currentTime.value = 0
    duration.value = 0
    if (musicPlaying.value) play()
  }
  function prevMusic() {
    if (music.value.length === 0) return
    currentMusicIndex.value =
      (currentMusicIndex.value - 1 + music.value.length) % music.value.length
    syncSrc()
    currentTime.value = 0
    duration.value = 0
    if (musicPlaying.value) play()
  }
  function setMusicPlaying(v: boolean) {
    if (v) play()
    else pause()
  }
  function play() {
    const a = ensureAudio()
    syncSrc()
    // 音频与视频互斥：播放音频前暂停视频
    pauseVideo()
    activeMedia.value = 'audio'
    a.play().catch(() => {
      // 自动播放可能被浏览器拦截，保持 paused 状态但不报错
      musicPlaying.value = false
    })
  }
  function pause() {
    ensureAudio().pause()
    musicPlaying.value = false
  }
  function togglePlay() {
    if (musicPlaying.value) pause()
    else play()
  }
  function seek(time: number) {
    const a = ensureAudio()
    a.currentTime = Math.max(0, Math.min(time, duration.value || a.duration || 0))
    currentTime.value = a.currentTime
  }
  function setVolume(v: number) {
    volume.value = Math.max(0, Math.min(1, v))
    ensureAudio().volume = volume.value
  }
  function togglePlayMode() {
    const order: PlayMode[] = ['order', 'loop', 'shuffle']
    const idx = order.indexOf(playMode.value)
    playMode.value = order[(idx + 1) % order.length]
  }

  async function loadAll() {
    loading.value = true
    error.value = null
    try {
      const [g, a, v, m, p, gr, msg] = await Promise.all([
        svc.galleryService.list(), svc.albumService.list(), svc.videoService.list(),
        svc.musicService.list(), svc.profileService.get(), svc.growthService.list(),
        svc.messageService.list(),
      ])
      galleries.value = g
      albums.value = a
      videos.value = v
      music.value = m
      profile.value = p
      growth.value = gr
      messages.value = msg
    } catch (e) {
      error.value = e instanceof Error ? e.message : '数据加载失败'
    } finally {
      loading.value = false
    }
  }

  async function addMessage(user: string, content: string) {
    const msg = await svc.messageService.create(user, content)
    messages.value = [msg, ...messages.value]
    return msg
  }

  return {
    loading, error,
    galleries, albums, videos, music, profile, growth, messages,
    currentMusicIndex, musicPlaying, currentTime, duration, volume, playMode,
    activeMedia,
    currentTrack, setCurrentMusic, nextMusic, prevMusic,
    setMusicPlaying, togglePlay, play, pause, pauseAudio, registerVideoPauser,
    seek, setVolume, togglePlayMode,
    loadAll, addMessage,
  }
})
