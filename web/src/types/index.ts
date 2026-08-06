// 数据模型类型（对齐 docs/api-contract.md 第 1 节）
// 由接口端 Pydantic 模型序列化，前端仅消费，不感知 assets 物理路径（原则 2）

export interface ImageItem {
  url: string
  caption: string
}

export interface GalleryItem {
  id: string
  title: string
  author: string
  category: 'fashion' | 'style' | 'scene' | 'vibe'
  cover: string
  desc: string
  images: ImageItem[]
}

export interface AlbumItem {
  id: string
  title: string
  cover: string
  desc: string
  category: string
  likes: string
  views: string
  images: ImageItem[]
}

export interface VideoItem {
  id: string
  title: string
  artist: string
  url: string
  cover: string
  orientation: 'portrait' | 'landscape'
  desc: string
  durationSec: number
}

export interface VideoAlbum {
  name: string
  videos: VideoItem[]
}

export interface MusicTrack {
  id: string
  title: string
  artist: string
  audioUrl: string
  avatar: string
  durationSec: number
}

export interface Message {
  id: string
  user: string
  content: string
  createdAt: string
}

export interface Profile {
  avatar: string
  name: string
  englishName: string
  tagline: string
  bio: string
  info: {
    height: string
    weight: string
    birthday: string
    hometown: string
    zodiac: string
    birthYear: string
  }
  links: { douyin: string; live: string }
  countdown: string | null
}

export interface GrowthContent {
  image: string
  caption: string
  text: string
  video?: { title: string; videoUrl: string }
  music?: { title: string; artist: string; audioUrl: string; duration: string }
}

export interface GrowthItem {
  id: string
  date: string
  title: string
  shortTitle?: string
  desc: string
  status?: string
  cover: string
  type: 'video' | 'article' | 'music' | 'image'
  content: GrowthContent
}

// 统一响应信封（api-contract.md 0.2）
export interface ApiEnvelope<T> {
  code: number
  message: string
  data: T
}
