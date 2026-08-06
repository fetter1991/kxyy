# kxyy 数据契约（API Contract）

> **Task 归属**：[`tasks.md`](tasks.md) T02 · 数据契约定义（双，易，紧急）★ 接口前置依赖
> **宪法依据**：原则 2（渲染与数据分离）、原则 3（三端单向依赖）、原则 5（先思考）、7.2（前后端分离）
> **来源**：`assets/js/data.js` 现有数据集（`galleryData` / `musicData` / `videoAlbums` / `worksData` / `messageData` / `growthData` + `galleryImages` 扁平索引）。
> **地位**：本文件是前后端并行的"口头契约"唯一真相。T03/T06/T09 及 Mock 均须对齐本契约；字段语义与现状保持一致（原则 2）。**修改须双方评审**，并更新本文件版本号。

---

## 0. 通用约定

### 0.1 媒体 URL 策略（呼应 T04）
- 契约中所有图片/音频/视频字段只返回 **URL 字符串**，前端仅消费 URL，不感知 `assets/` 物理路径（原则 2、7.2）。
- 过渡期：接口端可返回相对/绝对 `assets/*` 路径（与现状 `../assets/img/works/00.jpg` 等价）；接口持久化后统一为 `/media/*`（T04/T19）。
- URL 拼接逻辑集中在 service 层，组件无感（T06）。

### 0.2 统一响应信封（Envelope）
所有 `GET /api/*` 列表/详情端点返回统一结构，便于前端统一处理 loading/error（原则 10 P2）：

```jsonc
// 成功
{ "code": 0, "message": "ok", "data": <任意模型或数组> }
// 失败（含 4xx/5xx）
{ "code": 404, "message": "资源不存在", "data": null }
```

> **设计说明**：`code=0` 表示业务成功，HTTP 状态码仍保留（200/404/500）。前端统一拦截 `code !== 0` 进入错误态（T18 降级 UI 基础）。

### 0.3 时间字段
- `createdAt` / `time` / `date` 统一为 **ISO 8601 字符串**（`YYYY-MM-DD` 或 `YYYY-MM-DDTHH:mm:ssZ`）。
- 现状 `data.js` 中 `time: "2026-06-20"`、`date: "2025/12/28"` 在接口端归一化为 `YYYY-MM-DD`，避免前端多格式解析（原则 6 简单优先）。

### 0.4 错误态约定（原则 10 P0）
- `404`：资源/列表为空 → 返回 `code=404` + 友好 message，前端禁止整页白屏（T18）。
- `500`：服务端异常 → 返回 `code=500`，前端展示降级提示。
- 字段校验失败（Pydantic）→ `422` + 字段级错误（7.3）。

---

## 1. 数据模型（OpenAPI Schema 草案）

> 字段命名采用 **camelCase**（前端 JSON 约定）；接口端用 Pydantic 模型，序列化输出 camelCase（7.3）。
> `?` 表示可选字段；现状未出现但重构需要的字段，标注 **[新增]**。

### 1.1 GalleryItem（素材合集 / G3/G4/G5）
覆盖 `data.js` 的 `galleryData` 结构（合集 = 标题/作者/分类/封面/说明/图片列表）。

```jsonc
GalleryItem {
  "id":         "string",          // [新增] 稳定主键（现状用数组下标，接口端需显式 id）
  "title":      "string",          // 合集标题，如 "时尚大片"
  "author":     "string",          // 作者，如 "开心元元"
  "category":   "string",          // 分类筛选键（现状 filter: fashion/style/scene/vibe）
  "cover":      "string",          // 封面 URL
  "desc":       "string",          // 合集说明
  "images": [                     // 合集内图片列表
    { "url": "string", "caption": "string" }  // caption 为图片说明
  ]
}
```

**分类枚举（category）**：`fashion`(时尚大片) / `style`(简约风格) / `scene`(休闲日常) / `vibe`(清新氛围) — 与现状 `filter` 一一对应。

### 1.2 AlbumItem（作品 / 相册，统一 worksData）
现状 `worksData` 与 `galleryData` 结构接近但语义不同（works 含 `likes/views` 热度）。统一为 `AlbumItem`，消除技术债 4（命名混乱）。

```jsonc
AlbumItem {
  "id":         "string",          // [新增] 主键
  "title":      "string",          // 作品标题，如 "春日街拍特辑"
  "cover":      "string",          // 封面 URL
  "desc":       "string",          // 作品说明
  "likes":      "string",          // 点赞数展示（现状为 "12.3万" 字符串，保留原文）
  "views":      "string",          // 播放/浏览数展示（现状 "89.5万"）
  "images": [                     // 作品内图片列表
    { "url": "string", "caption": "string" }
  ]
}
```

> **说明**：`likes`/`views` 现状为带"万"的中文字符串，非数值。契约保留字符串以等价呈现，避免前端二次格式化（原则 6）。若后续需排序，[新增] `likesNum`/`viewsNum` 数值字段（不在本期强制）。

### 1.3 VideoAlbum（视频专辑）+ VideoItem
覆盖 `data.js` 的 `videoAlbums`（按专辑分组）+ `galleryImages` 封面引用。

```jsonc
VideoItem {
  "id":          "string",         // [新增] 主键
  "title":       "string",         // 视频标题
  "url":         "string",         // 视频文件 URL
  "cover":       "string",         // 封面 URL
  "orientation": "string",         // "portrait"(竖屏) | "landscape"(横屏)
  "desc":        "string",         // 视频说明
  "durationSec": "integer"         // [新增] 时长秒数（现状 durationSec，便于 seek/进度条）
}
VideoAlbum {
  "name":   "string",              // 专辑 Tab 名，如 "作品集"/"日常记录"/"国风写真"
  "videos": [ VideoItem ]          // 该专辑下视频列表
}
```

### 1.4 MusicTrack（音乐 / 常驻音频播放器）
覆盖 `data.js` 的 `musicData`（导航栏常驻音频播放器数据源，原则 4 双播放器特征）。

```jsonc
MusicTrack {
  "id":         "string",          // [新增] 主键
  "title":      "string",          // 曲目名，如 "小宇"
  "artist":     "string",          // 艺术家，如 "张震岳"
  "audioUrl":   "string",          // 音频文件 URL
  "avatar":     "string",          // 歌手头像 URL
  "durationSec":"integer"          // [新增] 时长秒数（现状 durationSec，用于播放器进度）
}
```

> **说明**：现状 `duration` 为 `"03:47"` 展示串、`type: "audio"` 恒为 audio。契约用 `durationSec` 数值驱动播放器，展示串由前端格式化（原则 6）。`type` 字段现状恒为 `"audio"`，无区分价值，**废弃不纳入**。

### 1.5 Message（留言 / XSS 红线）
覆盖 `data.js` 的 `messageData`。**P0 XSS 约束**：`content` 渲染必须用 Vue 模板绑定（禁 `v-html` 或白名单转义，原则 10 P0）。

```jsonc
Message {
  "id":        "string",           // [新增] 主键
  "user":      "string",           // 昵称（现状 nick）
  "content":   "string",           // 留言内容（现状 text）
  "createdAt": "string"            // ISO 日期，如 "2026-06-20"（现状 time）
}
```

> **字段重命名**：`nick`→`user`、`text`→`content`、`time`→`createdAt`，语义更通用，且 `user/content` 对齐行业标准。前端 Mock 映射时做键名转换（T04 4.2）。

### 1.6 Profile（个人资料 / 外链 + 倒计时）
现状数据分散在页面（头像、抖音/直播外链、直播倒计时）。契约集中为单一对象。

```jsonc
Profile {
  "avatar":   "string",            // 头像 URL
  "links": {                       // 外链（原则 4 外部链接须延续）
    "douyin": "string",            // 抖音主页 URL
    "live":   "string"             // 直播间 URL
  },
  "countdown"?: {                  // [新增] 直播倒计时（可选，无则不展示）
    "target": "string",            // ISO 时间，如 "2026-08-10T20:00:00+08:00"
    "label":  "string"             // 倒计时文案，如 "下一场直播"
  }
}
```

> **说明**：现状倒计时逻辑在页面硬编码（如固定日期）。契约将目标时间外提为数据，组件只渲染，满足原则 2。

### 1.7 GrowthItem（成长历程 / 时间轴）
覆盖 `data.js` 的 `growthData`。结构含 `content` 多态（video/article/music/image 四种 type）。

```jsonc
GrowthContent {
  "image":   "string",             // 配图 URL
  "caption": "string",             // 配图说明
  "text":    "string",             // 正文
  "video"?:  { "title": "string", "videoUrl": "string" },       // type=video 时存在
  "music"?:  { "title": "string", "artist": "string",            // type=music 时存在
               "audioUrl": "string", "duration": "string" }
}
GrowthItem {
  "id":         "string",          // [新增] 主键
  "date":       "string",          // ISO 日期 "2025-12-28"
  "title":      "string",          // 标题
  "shortTitle"?: "string",         // 简短标题（时间轴节点用）
  "desc":       "string",          // 列表/卡片描述
  "status"?:    "string",          // 状态标签，如 "最新"/"已结束"/""（空不展示）
  "cover":      "string",          // 封面 URL
  "type":       "string",          // "video" | "article" | "music" | "image"
  "content":     GrowthContent     // 详情内容（多态）
}
```

> **说明**：`content` 按 `type` 决定 `video`/`music` 子对象是否存在，前端按 `type` 条件渲染（原则 4 成长页功能等价）。

---

## 2. 端点清单（RESTful，7.2）

### 2.1 用户端只读（GET）
| 方法 | 路径 | 响应 `data` | 说明 |
|------|------|-------------|------|
| GET | `/api/galleries` | `GalleryItem[]` | 素材合集（G3/G4/G5） |
| GET | `/api/albums` | `AlbumItem[]` | 作品/相册（统一 worksData） |
| GET | `/api/videos` | `VideoAlbum[]` | 视频专辑分组 |
| GET | `/api/music` | `MusicTrack[]` | 音乐列表（常驻播放器） |
| GET | `/api/profile` | `Profile` | 个人资料与外链 |
| GET | `/api/messages` | `Message[]` | 留言列表（倒序，新在前） |
| GET | `/api/growth` | `GrowthItem[]` | 成长历程时间轴（按 date 倒序） |

### 2.2 用户端写入
| 方法 | 路径 | 请求体 | 响应 `data` | 说明 |
|------|------|--------|-------------|------|
| POST | `/api/messages` | `{ user: string, content: string }` | `Message` | 新增留言；`content` 入库前服务端做 XSS 净化/转义（P0 双重防护） |

### 2.3 管理端（写入，原则 3 只写接口端）
> 管理端 CRUD 端点，T09 实现。路径前缀 `/admin`，仅管理端调用。

| 方法 | 路径 | 说明 |
|------|------|------|
| GET/POST | `/admin/galleries` | 合集列表 / 新增 |
| PUT/DELETE | `/admin/galleries/{id}` | 改 / 删 |
| GET/POST | `/admin/albums` | 作品列表 / 新增 |
| PUT/DELETE | `/admin/albums/{id}` | 改 / 删 |
| GET/POST | `/admin/videos` | 视频专辑列表 / 新增 |
| PUT/DELETE | `/admin/videos/{id}` | 改 / 删 |
| GET/POST | `/admin/music` | 音乐列表 / 新增 |
| PUT/DELETE | `/admin/music/{id}` | 改 / 删 |
| GET/POST | `/admin/profile` | 资料获取 / 更新 |
| GET/POST | `/admin/growth` | 成长列表 / 新增 |
| PUT/DELETE | `/admin/growth/{id}` | 改 / 删 |

> 管理端模型与 1.x 用户端模型 **字段一致**（仅多 `id` 管控），避免双真相（原则 8）。

---

## 3. Mock 对齐说明（T04 4.2 临时方案）

- 前端 `src/mock/*.json` 字段须严格映射本契约（含 `id` 等 [新增] 字段，Mock 可自造稳定 id 如 `"g1"`）。
- `data.js` → Mock 键名映射：
  - `galleryData` → `galleries.json`（结构同 GalleryItem）
  - `worksData` → `albums.json`（结构同 AlbumItem）
  - `videoAlbums` → `videos.json`（结构同 VideoAlbum）
  - `musicData` → `music.json`（结构同 MusicTrack，丢 `duration`/`type` 展示串，补 `durationSec` 已存在）
  - `messageData` → `messages.json`（`nick`→`user`、`text`→`content`、`time`→`createdAt`）
  - `growthData` → `growth.json`（结构同 GrowthItem）
  - 个人资料 `profile.json`：[新增] 由页面外链/头像/倒计时硬编码提取
- 接口端 T03 先返回与 Mock **同结构**内存数据，保证 Swagger 可调；T07 接管持久化后结构不变（原则 8 渐进）。

---

## 4. 版本与评审

| 项 | 值 |
|----|----|
| 契约版本 | v0.1.0（T02 草案，决策已固化） |
| 评审状态 | ✅ 前端确认 ✅ 后端确认（按原则 6 等价优先默认决策） |
| 下次变更 | 字段调整须同步更新本文件 +  bump 版本号 |

**开放问题决策记录**（原则 5/6，已按等价优先默认拍板）：
1. `likes`/`views` 本期**保留字符串**（"12.3万"），不加数值字段（避免前端二次格式化）。
2. `profile.countdown` 本期**预留 `string?` 字段**，T12 填充具体目标时间。
3. 管理端 `id` 类型统一为 `string`，具体生成策略（UUID/自增/业务键）由 T07 定，契约先留 `string`。
