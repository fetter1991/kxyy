// 数据 store（T06 + 原则 10 P2）：状态收敛，统一 loading/error
// 组件只调 store action，不直接接触 service/axios。
import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as svc from '../services/data'
import type {
  AlbumItem, GalleryItem, GrowthItem, Message, MusicTrack, Profile, VideoAlbum,
} from '../types'

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

  // 播放器状态（G5 顶部导航播放器）
  const currentMusicIndex = ref(0)
  const musicPlaying = ref(false)

  function setCurrentMusic(i: number) {
    if (i < 0 || i >= music.value.length) return
    currentMusicIndex.value = i
  }
  function nextMusic() {
    if (music.value.length === 0) return
    currentMusicIndex.value = (currentMusicIndex.value + 1) % music.value.length
  }
  function prevMusic() {
    if (music.value.length === 0) return
    currentMusicIndex.value =
      (currentMusicIndex.value - 1 + music.value.length) % music.value.length
  }
  function setMusicPlaying(v: boolean) {
    musicPlaying.value = v
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
    currentMusicIndex, musicPlaying,
    setCurrentMusic, nextMusic, prevMusic, setMusicPlaying,
    loadAll, addMessage,
  }
})
