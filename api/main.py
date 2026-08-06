"""kxyy 接口端（FastAPI）入口。

职责（constitution.md 原则 3）：用户端与管理端之间唯一的数据通道。
T01 骨架 -> T03 实现核心端点（内存态）。T07 接管持久化，T09 补管理端 CRUD。
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import router

app = FastAPI(title="kxyy-api", version="0.2.0")

# 允许前端（web 5173 / admin 5174）跨域调用，生产环境收紧
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/health")
def health() -> dict:
    """健康检查，供 CI / 部署探针使用。"""
    return {"status": "ok", "service": "kxyy-api"}


# 全局异常 -> 统一信封（原则 10 P0：禁止裸 500）
@app.exception_handler(Exception)
async def unhandled(_, exc: Exception):
    from fastapi.responses import JSONResponse
    return JSONResponse(
        status_code=500,
        content={"code": 500, "message": "服务器内部错误", "data": None},
        media_type="application/json; charset=utf-8",
    )
