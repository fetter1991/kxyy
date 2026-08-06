"""Pydantic 数据模型（constitution.md 7.3）。

字段命名 camelCase，与 api-contract.md 第 1 节一致。
内存态数据由 data.py 提供；T07 接管持久化后此处模型不变（原则 8 渐进）。
"""
from __future__ import annotations

from typing import List, Literal, Optional

from pydantic import BaseModel, Field


# ---------- 通用 ----------
class ImageItem(BaseModel):
    url: str
    caption: str


# ---------- 1.1 GalleryItem（素材合集） ----------
class GalleryItem(BaseModel):
    id: str
    title: str
    author: str
    category: str  # fashion/style/scene/vibe
    cover: str
    desc: str
    images: List[ImageItem]


# ---------- 1.2 AlbumItem（作品/相册，统一 worksData） ----------
class AlbumItem(BaseModel):
    id: str
    title: str
    cover: str
    desc: str
    likes: str  # 展示串，如 "12.3万"，本期保留字符串（契约决策 1）
    views: str
    images: List[ImageItem]


# ---------- 1.3 VideoAlbum + VideoItem ----------
class VideoItem(BaseModel):
    id: str
    title: str
    url: str
    cover: str
    orientation: Literal["portrait", "landscape"]
    desc: str
    durationSec: int


class VideoAlbum(BaseModel):
    name: str
    videos: List[VideoItem]


# ---------- 1.4 MusicTrack ----------
class MusicTrack(BaseModel):
    id: str
    title: str
    artist: str
    audioUrl: str
    avatar: str
    durationSec: int


# ---------- 1.5 Message ----------
class Message(BaseModel):
    id: str
    user: str
    content: str
    createdAt: str  # YYYY-MM-DD


class MessageCreate(BaseModel):
    user: str = Field(min_length=1, max_length=32)
    content: str = Field(min_length=1, max_length=500)


# ---------- 1.6 Profile ----------
class Profile(BaseModel):
    avatar: str
    links: dict  # { douyin, live }
    countdown: Optional[str] = None  # 预留，T12 填充（契约决策 2）


# ---------- 1.7 GrowthItem（多态 content） ----------
class GrowthVideo(BaseModel):
    title: str
    videoUrl: str


class GrowthMusic(BaseModel):
    title: str
    artist: str
    audioUrl: str
    duration: str


class GrowthContent(BaseModel):
    image: str
    caption: str
    text: str
    video: Optional[GrowthVideo] = None
    music: Optional[GrowthMusic] = None


class GrowthItem(BaseModel):
    id: str
    date: str
    title: str
    shortTitle: Optional[str] = None
    desc: str
    status: Optional[str] = None
    cover: str
    type: Literal["video", "article", "music", "image"]
    content: GrowthContent
