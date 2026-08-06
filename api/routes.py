"""API 路由（T03）：用户端只读 + 留言写入。

统一响应信封 { code, message, data }（api-contract.md 0.2）。
错误态：404/500 返回 code!=0 + 友好 message，前端禁止白屏（原则 10 P0）。
管理端 /admin/* 由 T09 实现；此处先留 TODO。
"""
from __future__ import annotations

from fastapi import APIRouter
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from data import (
    albums, galleries, growth, messages, music, profile, videos,
)
from models import Message, MessageCreate

router = APIRouter(prefix="/api")

# 统一 UTF-8 中文响应（关闭 ensure_ascii，提升可读性与原则 11 对外清晰）
def _json(payload: dict) -> JSONResponse:
    return JSONResponse(
        content=payload,
        media_type="application/json; charset=utf-8",
    )


def ok(data) -> JSONResponse:
    return _json({"code": 0, "message": "ok", "data": jsonable_encoder(data)})


def fail(code: int, message: str) -> JSONResponse:
    return _json({"code": code, "message": message, "data": None})


@router.get("/galleries")
def get_galleries() -> dict:
    """素材合集列表（G3/G4/G5）。"""
    return ok(galleries)


@router.get("/albums")
def get_albums() -> dict:
    """作品/相册列表（统一 worksData）。"""
    return ok(albums)


@router.get("/videos")
def get_videos() -> dict:
    """视频专辑分组列表。"""
    return ok(videos)


@router.get("/music")
def get_music() -> dict:
    """音乐列表（常驻音频播放器）。"""
    return ok(music)


@router.get("/profile")
def get_profile() -> dict:
    """个人资料与外链。"""
    return ok(profile)


@router.get("/messages")
def get_messages() -> dict:
    """留言列表（倒序，新在前）。"""
    return ok(list(reversed(messages)))


@router.post("/messages", response_model=dict, status_code=201)
def create_message(payload: MessageCreate) -> dict:
    """新增留言（P0：content 入库前服务端净化由 T07 落地，本期仅存）。"""
    new_msg = Message(
        id=f"msg{len(messages) + 1}",
        user=payload.user,
        content=payload.content,
        createdAt=__import__("datetime").date.today().isoformat(),
    )
    messages.append(new_msg)
    return ok(new_msg)


# ---- 占位：管理端（T09 实现） ----
# POST/PUT/DELETE /admin/galleries|albums|videos|music|profile|growth
