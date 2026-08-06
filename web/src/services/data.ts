// 数据服务层（T06）：封装取数，组件只调 service（原则 2）
// Mock 与真实路径在此切换，组件无感。失败抛出由 store 捕获进入错误态。
import { apiClient } from './apiClient'
import * as mock from '../mock'
import type {
  AlbumItem, GalleryItem, GrowthItem, Message, MusicTrack, Profile, VideoAlbum,
} from '../types'

export const galleryService = {
  list: () => apiClient.useMock
    ? apiClient.mock<GalleryItem[]>(mock.galleries)
    : apiClient.get<GalleryItem[]>('/galleries'),
}

export const albumService = {
  list: () => apiClient.useMock
    ? apiClient.mock<AlbumItem[]>(mock.albums)
    : apiClient.get<AlbumItem[]>('/albums'),
}

export const videoService = {
  list: () => apiClient.useMock
    ? apiClient.mock<VideoAlbum[]>(mock.videos)
    : apiClient.get<VideoAlbum[]>('/videos'),
}

export const musicService = {
  list: () => apiClient.useMock
    ? apiClient.mock<MusicTrack[]>(mock.music)
    : apiClient.get<MusicTrack[]>('/music'),
}

export const profileService = {
  get: () => apiClient.useMock
    ? apiClient.mock<Profile>(mock.profile)
    : apiClient.get<Profile>('/profile'),
}

export const growthService = {
  list: () => apiClient.useMock
    ? apiClient.mock<GrowthItem[]>(mock.growth)
    : apiClient.get<GrowthItem[]>('/growth'),
}

export const messageService = {
  list: () => apiClient.useMock
    ? apiClient.mock<Message[]>(mock.messages)
    : apiClient.get<Message[]>('/messages'),
  create: (user: string, content: string) => apiClient.useMock
    ? apiClient.mock<Message>({
        id: `msg${Date.now()}`, user, content,
        createdAt: new Date().toISOString().slice(0, 10),
      })
    : apiClient.post<Message>('/messages', { user, content }),
}
