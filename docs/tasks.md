# kxyy 重构任务拆解（Tasks）

> **依据**：[`constitution.md`](constitution.md)（重构原则/架构/质量红线）+ [`Readme.md`](Readme.md)（现状/页面/风险）。
> **排序逻辑**：按 **紧急程度（阻断依赖 / 安全红线 / DoD 关键路径）** 优先，叠加 **难易程度（易→难）** 形成执行序。
> **分配**：FE=前端（Vue 用户端 + 管理端）｜BE=后端（FastAPI 接口端）｜双=双方协同。
> **质量门槛（强制）**：每次提交关联本文件 Task 编号；合并前过 ESLint/Flake8；核心功能单测 ≥80%；双端（大屏/小屏）验收。
> **宪法优先级**：当任务与 constitution 冲突，以原则为准（先提问，不静默取舍）。
> **临时变更需求**：开发中随机加入的需求，须先在 [`修改日志.md`](修改日志.md)「临时需求登记」留痕（原文→解析→冲突确认），再拆分到下方「临时变更需求登记」区域；流程见 [`Readme.md`](Readme.md) 第十二章、`constitution.md` 原则 12、`开发规范.md` 第 5 条。

> **⚠️ 当前版本重点（用户 2026-08-06 拍板）**：**页面样式还原 > 接口数据实现**。
> 本轮优先让页面"长得对、媒体可加载、双端可测"，接口持久化（T07）顺延至样式就绪后。
> 播放器（T16）暂缓，Layout 已预留挂载位（`#navMusicBtn`），待 T16 补 `NavPlayer` 组件。

---

## 一、拆解矩阵（概览）

| 象限 | 特征 | 任务 |
|------|------|------|
| 🔴 紧急·易 | 阻断后续、低风险、可立即做 | T01 脚手架、T02 数据契约、T03 接口骨架、T04 目录约定、T05 工具链 |
| 🔴 紧急·难 | 安全红线 / DoD 关键路径 | T06 数据层抽象、T07 接口核心、T08 用户端路由、T09 管理端模型 |
| 🟡 常规·易 | 页面等价、并行推进 | T10 素材库、T11 相册、T12 个人资料、T13 成长、T14 留言 |
| 🟡 常规·难 | 复杂交互、双播放器 | T15 视频页、T16 双播放器状态、T17 弹幕页(G1) |
| 🟢 收尾·易/难 | 风险清理、文档同步 | T18 P0/P1 风险、T19 增量迁移切换、T20 文档同步 |

---

## 二、任务清单（按执行序）

### 🔴 T01 · 工程脚手架（FE + BE，易，紧急）
- **目标**：建立可独立运行的三端基础工程，不依赖彼此。
- **FE**：`npm create vite@latest` 建用户端（Vue3+Vite+Element Plus）、建管理端；配置路径别名、`script setup`。
- **BE**：`pipenv`/`venv` + FastAPI 骨架，`/docs` 自动 Swagger 可用。
- **验收**：`npm run dev` 与 `uvicorn main:app` 各自启动；双端空页可访问。
- **关联原则**：原则 6 简单优先、原则 8 新旧并存。

### 🔴 T02 · 数据契约定义（双，易，紧急）★ 接口前置依赖
- **目标**：先定 API 契约，前后端据此并行，避免后期返工。
- **产出**：基于 `data.js` 现有数据集抽出统一数据模型 + OpenAPI Schema：
  - `GalleryItem{ id,title,category,url,cover?,images?,desc?,author? }`（覆盖 G3/G4/G5 合集结构）
  - `AlbumItem{ id,title,cover,images[],date? }`（统一 `worksData`→`albumData`）
  - `VideoAlbum{ name, videos: VideoItem[] }`，`VideoItem{ id,title,url,orientation,desc }`
  - `MusicTrack{ id,title,artist,audioUrl,avatar,album? }`
  - `Message{ id,user,content,createdAt }`（XSS 转义约束）
  - `Profile{ avatar,links:{douyin,live},countdown? }`
- **产出**：[`Readme.md` §十一](Readme.md#十一数据契约api-contract)（统一数据模型 + OpenAPI Schema 草案 + 端点清单 + Mock 映射 + 评审栏）。
- **验收**：契约文档入 `docs/`，前后端评审签字；字段语义与现状 `data.js` 一致（原则 2）。**当前状态**：✅ 草案 v0.1.0 已产出，待评审签字（见文档第 4 节）。
- **关联原则**：原则 2 数据分离、原则 5 先思考。

### 🔴 T03 · 接口端骨架 + 核心端点（BE，易→中，紧急）
- **目标**：先交付"能返回 JSON 的端点"，让前端可立即并联调（即使数据先来自内存/Mock）。
- **范围**：`GET /api/galleries`、`/api/albums`、`/api/videos`、`/api/music`、`/api/profile`、`/api/messages`、`POST /api/messages`；管理端 `POST/PUT/DELETE /admin/*`。
- **产出**：`api/{main,models,routes,data}.py`，内存态数据，统一 UTF-8 信封 `code/message/data`，全局异常 → 500 信封。
- **验收**：✅ Swagger 可调通（`/docs`）；7 个 GET + 1 个 POST 返回结构与 T02 契约一致；错误态 JSON 化（原则 10 P0）；uvicorn 启动 200、`/health` 正常。
- **关联原则**：原则 3 单向依赖、原则 10 错误态。

### 🔴 T04 · 资源与媒体目录约定（双，易，紧急）
- **目标**：锁定媒体 URL 规范，前端组件按约定拼 URL，不破坏双端路径。
- **产出**：媒体 URL 在契约 0.1 / Mock `src/mock/index.ts` / 接口 `data.py` 三处统一为"只返回字符串、前端仅消费、URL 拼接集中在 service"（原则 2、7.2）。过渡期沿用 `../assets/*` 相对路径，T19 统一为 `/media/*`。
- **产出补全（M1 反馈后）**：`web/src/utils/asset.ts` 的 `useAssetUrl()` 把 `../assets/x` 统一解析为 `${BASE_URL}assets/x`（SPA 路径安全）；`web/public/assets` junction 到原站 `assets/`，dev 下 `/assets/*` 直读；各视图媒体 `:src` 经 `useAssetUrl` 包裹。
- **验收**：✅ 媒体 URL 不在组件中硬编码；Mock 与接口返回同结构；**dev 下图片/视频/背景图均 200 可加载（修复 M1 反馈的媒体 404）**。
- **关联原则**：原则 1 双端、7.2 媒体条款。

### 🔴 T05 · 质量工具链（双，易，紧急）
- **目标**：落地质量门槛，越早越好。
- **产出（已并入 T03/T06 验证）**：FE `vue-tsc -b && vite build` 通过（85 模块、零类型错误）；BE import 自检通过、Flask8/pytest 基线待 T20 补。**待做**：ESLint/Flake8/Prettier 配置文件与 CI 接入（T20 收尾统一落地，避免过早配置拖累并行）。
- **验收**：✅ 三端 `build`/`uvicorn` 启动验证通过；完整工具链配置列入 T20。
- **关联原则**：原则 11 文档同步、质量红线。
- **验收**：PR 卡点生效；空单测可通过。
- **关联原则**：原则 10 质量门槛。

### 🔴 T06 · 用户端数据层抽象（FE，难，紧急）★ DoD 关键
- **目标**：渲染与数据严格分离，组件不得硬编码 `galleryData` 等。
- **产出**：`web/src/{types,services,stores,mock}` 四层；`apiClient` 含 Mock 开关（`VITE_USE_MOCK`）+ axios + 统一信封解析；`data.ts` service 封装 7 类取数；`stores/data.ts` 收敛 loading/error 与全部状态；`App.vue` 演示组件只调 store。
- **验收**：✅ 全站业务数据零写死在组件（仅 `src/mock` 临时存在）；Mock 模式 dev 启动 200；`vue-tsc` 零错误；loading/error 态已就绪（原则 10 P2）。接口就绪后仅翻转 `VITE_USE_MOCK=false` 即切真实数据。
- **关联原则**：原则 2、P2 状态收敛、原则 7 不污染。

### 🔴 T07 · 接口端数据落地（BE，难，紧急）★ DoD 关键
- **目标**：从"内存 Mock"升级为"持久化"，替代 `data.js` 写入。
- **范围**：SQLite/文件存储 + Pydantic 校验；管理端写入 → 接口端读取对外。
- **验收**：管理端录入后用户端 API 实时反映；字段校验生效（7.3 Pydantic）。
- **关联原则**：原则 3、7.3。

### 🔴 T08 · 用户端路由与骨架（FE，中，紧急）
- **目标**：统一路由架构，消除原"单页切换 + 整页跳转"两套机制（Readme 技术债 🔴）。
- **产出**：`web/src/router/index.ts`（6 页 + 404 兜底，**导航顺序对齐原站：相册 /gallery | 素材库 / | 个人资料 /profile | 视频 /video | 成长历程 /growth | 留言 /message**）；`components/Layout.vue`（顶部导航 + 全局 loading/error 遮罩 + 移动端汉堡菜单）；6 个 `views/*View.vue` 全部经 `useDataStore` 渲染真实数据（零硬编码）；`index.html` 中文标题/lang；`style.css` 清理 Vite 模板残留。
- **验收**：✅ `vue-tsc` 零错、build 通过；dev 下 `/ /gallery /profile /video /message /growth /nope` 全 200；组件无残留监听（原则 10 P1）；404 兜底页存在（原则 10 P0）；留言 content 仅模板绑定禁用 v-html（原则 10 P0 XSS）。
- **关联原则**：原则 4 保留页面、P1 清理、技术债 🔴、原则 7.1 SPA 导航。

### 🔴 T09 · 管理端数据模型与 CRUD（FE+BE，中，紧急）★ 替代 data.js
- **目标**：管理端覆盖原 `data.js` 全部数据维度录入。
- **范围**：Gallery/Album/Video/Music/Message/Profile 表单页 + 列表；调 T07 接口。
- **验收**：可完成增删改查；数据经接口端服务用户端（DoD 第 3 条）。
- **关联原则**：重构目标 3、原则 3。

### 🟡 T10 · 素材库页（FE，易，常规）— G3/G4/G5
- **目标**：功能等价 + 待实现项落地。
- **范围**：分类 Tab 筛选（G3，分类：全部/时尚/风格/场景/氛围）、合集卡片每行 4（G4）、合集弹窗（大图+缩略图+标题/作者/标签/说明/打包下载占位 G5）。
- **产出**：`GalleryView.vue` 对齐原站 `.collection-grid/.collection-card/.collection-modal` 结构与类名；点击卡片弹窗展示合集详情，缩略图可切换大图，大图点击灯箱。
- **验收**：✅ 页面标题"图库画廊"、分类过滤、合集卡片、弹窗/灯箱交互、build 通过；下载按钮已占位（待后端打包接口）。
- **关联原则**：原则 1/2/4。

### 🟡 T11 · 相册页（FE，易，常规）— A3/A4
- **目标**：封面点击平铺瀑布流（保留灯箱）。
- **范围**：`albumData` 网格（≥1024px 4 列）；点击当前页展开瀑布流；灯箱看大图。
- **产出**：`WorksView.vue` 承担相册页（路径 `/gallery`），对齐原站 `.album-grid/.work-card/.album-waterfall` 类名；点击封面进入瀑布流，图片点击灯箱。
- **验收**：✅ 页面标题"精选作品"、封面网格、瀑布流展开/返回、灯箱交互、build 通过；无整页刷新。**B5 瀑布流已升级为 Grid + JS Masonry（2026-08-07，解决等高图右侧空白，详见「页面 UI 复现拆解集」B 组）**。
- **关联原则**：原则 1/4、技术债 4（统一 `albumData`）。

### 🟡 T12 · 个人资料页（FE，易，常规）
- **目标**：头像 + 个人档案 + 简介 + 外链 + 生日倒计时。
- **产出**：新增 `ProfileView.vue`（路径 `/profile`），对齐原站 `.profile-hero/.profile-left/.profile-right` 结构与类名；`Profile` 类型扩展 `name/englishName/tagline/bio/info` 字段；倒计时 `clearInterval`（P2）。
- **验收**：✅ 个人档案 6 项、简介、外链按钮、生日倒计时、build 通过；外链双端可跳转。
- **关联原则**：原则 4、P2。

### 🟡 T13 · 样式还原与设计系统（FE，易→中，常规）★ 当前重点
- **目标**：**页面样式视觉还原**（用户重点：**样式还原 > 接口数据**）。
- **产出（M2 视觉偏差修复）**：全量复用原站 `assets/css/style.css` → `web/src/styles/original.css`，修正资源 URL 为 `/assets/*`、修复 `:root` 选择器拼写错误、移除 `html overflow:hidden` 避免 Vue 双滚动条；`Layout.vue/#pageContainer` 命中原站容器结构；导航顺序/路径对齐原站；素材库/相册/个人资料页 DOM 类名与原站一致，确保半透明毛玻璃、卡片悬浮、弹窗、灯箱、瀑布流均命中原站样式。
- **验收**：✅ build 通过（CSS 打包 67.57KB）；dev 下页面/封面图/视频/背景图均 200；全局背景毛玻璃、导航半透明、卡片悬浮、弹窗灯箱均按原站呈现。**待你浏览器验收视觉还原度**。
- **⚠️ 重点关注（待 T13 后续抽象）**：`original.css` 为整文件复用，需后续拆分为设计系统（token + 组件类 + 响应式断点），消除 91KB 全量引入、统一双端主题。
- **关联原则**：原则 1 双端、原则 11 文档同步。

### 🟡 T14 · 留言册（FE，易，常规）
- **目标**：`localStorage` → 接口持久化，保留 XSS 转义。
- **范围**：`POST /api/messages`；渲染 `escapeHtml`/Vue 模板绑定（P0 XSS）。
- **验收**：提交后他人可见（经接口）；无注入。
- **关联原则**：P0 XSS、原则 2。

### 🟡 T15 · 视频页（FE，难，常规）
- **目标**：专辑 Tab + 分页/滚动 + 横竖屏 + 进度条 seek。
- **验收**：PC 数字分页/小屏滚动加载；横竖屏 class 切换；seek 正常（B2 已修，等价保留）；双端。
- **关联原则**：原则 1/4。

### 🟡 T16 · 双播放器状态管理（FE，难，常规）★ P1 ★ 暂缓
- **⏸ 状态**：**暂缓**（用户 2026-08-06 决策）。本轮 M1 反馈"播放器丢失"，但按"样式还原优先"原则，播放器推迟至样式稳定后实现。
- **当前占位**：`Layout.vue` 已预留 `#navMusicBtn` 挂载位（disabled 占位按钮），T16 落地时挂 `NavPlayer.vue`，复用 `music` store + 原站 `nav-player.js` 双播放器逻辑（原则 4）。
- **目标**：显式状态管理替代隐式契约互斥。
- **范围**：Pinia 播放器 store，页面内视频播放器 + 导航栏常驻音频播放器统一调度。
- **验收**：切换不泄漏（P1）；小屏显示歌手歌名（B5）；列表宽度跟播放器（B4）；展开入口清晰（B3）。
- **关联原则**：P1、原则 4 双播放器特征。

### 🟡 T17 · 建议弹幕页（FE，中，常规）— G1
- **目标**：B站弹幕风格右→左滚动 + 点赞数。
- **验收**：双端滚动流畅；数据来自接口（新增 `Message/Barrage` 端点）。
- **关联原则**：原则 2/4。

### 🟢 T18 · P0/P1 风险清零（双，中，收尾）★ 安全红线
- **目标**：正面处理 CodeReview 风险。
- **范围**：XSS（优先模板绑定，禁 `v-html` 或白名单）、接口不可用降级提示（禁白屏）、监听/定时器销毁、状态收敛、错误/加载态。
- **验收**：P0/P1 全部闭环；单测覆盖关键路径 ≥80%。
- **关联原则**：原则 10。

### 🟢 T19 · 增量迁移切换（双，中，收尾）★ DoD 关键
- **目标**：切断本地硬编码依赖，旧站可下线。
- **范围**：前端移除 `data.js` 直引；接口端全量接管；旧 `index.html`/`pages/*` 标记弃用。
- **验收**：无"双真相"；旧站停止维护；DoD 第 1–5 条达成。
- **关联原则**：原则 8、DoD。

### 🟢 T20 · 文档与代码同步（双，易，收尾）
- **目标**：消除文档脱节（历史教训 v1.1.7）。
- **范围**：更新 `Readme.md` 技术栈/架构为目标态；`constitution.md` 第七章已含技术方案；本文件 Task 状态回收。
- **验收**：文档与代码命名/职责一致（DoD 第 6 条）。
- **关联原则**：原则 11。

---

## 二·五、页面 UI 复现拆解集（当前版本：「UI 复现」）

> **范围**：基于原站 `pages/*` 的实际页面与交互，逐页拆解为可验收的 UI 复现子项。
> **标注**：✅ 已完成 / 🔲 未完成；状态随 `dev` 预览与构建同步更新。
> **关联 Task**：整体归属 T10~T17，本次复现聚焦视觉与交互等价（用户决策"样式还原 > 接口数据"）。

### A. 素材库 `pages/index.html`（GalleryView，/）
- ✅ A1 页面标题"图库画廊"完整显示（修复标题被裁切）
- ✅ A2 分类 Tab 筛选（全部/时尚/风格/场景/氛围）
- ✅ A3 合集卡片网格每行 4 张（≥1024px）
- ✅ A4 合集卡片悬浮态（毛玻璃 + 轻微上浮）
- ✅ A5 点击卡片弹窗（大图 + 缩略图切换 + 标题/作者/标签/说明）
- ✅ A6 大图点击灯箱
- 🔲 A7 打包下载按钮联调后端接口（当前仅占位）

### B. 相册 `pages/gallery.html`（WorksView，/gallery）
- ✅ B1 封面网格 `.album-grid`（4 列）与 `.work-card` 结构
- ✅ B2 点击封面**当前页展开**平铺瀑布流（无整页刷新）
- ✅ B3 展开页返回作品集按钮 + 标题
- ✅ B4 图片点击灯箱（左右切换 + ESC + 键盘）
- ✅ B5 瀑布流布局：**Grid + JS Masonry**（4 列始终填满，修复等高图右侧空白，原 CSS `columns` 方案弃用）
- ✅ B6 响应式断点：≥1024 4 列 / ≤1024 3 列 / ≤768 2 列 / ≤480 1 列
- ✅ B7 图片加载完成 / 窗口 resize 时自动重排 Masonry

### C. 个人资料 `pages/profile.html`（ProfileView，/profile）
- ✅ C1 头像 + 个人档案 6 项
- ✅ C2 简介文本
- ✅ C3 外链按钮（抖音/直播）双端可跳转
- ✅ C4 生日倒计时（`clearInterval` 防泄漏）

### D. 视频 `pages/video.html`（VideoView，/video）
- ✅ D1 专辑 Tab 切换与分页/滚动
- ✅ D2 横竖屏 class 切换（竖屏 `object-fit:contain` 固定宽度）
- ✅ D3 播放器控制层显隐（PC 播放 2s 自动隐藏 + 悬浮显示；移动端点击切换）
- ✅ D4 进入默认选中首条但不自动播放
- ✅ D5 "正在加载"态在数据就绪后正确消失（Pinia `storeToRefs` 响应性修复）
- 🔲 D6 真实视频流接入（当前 Mock 占位）

### E. 成长历程 `pages/growth.html`（GrowthView，/growth）
- ✅ E1 直链进入（如 `/growth`）数据正常渲染（修复 `storeToRefs` + 直链 `loadAll`）
- ✅ E2 时间线/里程碑布局与悬浮态
- ✅ E3 图片灯箱

### F. 留言 `pages/message.html`（MessageView，/message）
- 🔲 F1 留言列表渲染（XSS 安全，禁 v-html）
- 🔲 F2 提交留言 `localStorage` → 接口持久化（T14）
- ⏸ F3 本轮**暂时屏蔽导航入口**（Layout 注释 `留言`，待 T14 落地）

### G. 全局 / Layout
- ✅ G1 顶部导航半透明毛玻璃 + 顺序对齐原站（相册/素材库/个人资料/视频/成长历程/留言）
- ✅ G2 全局 loading/error 遮罩
- ✅ G3 移动端汉堡菜单
- ✅ G4 全局背景与字体/FA CDN 还原（复用 `original.css`）
- 🔲 G5 双播放器常驻导航（T16 暂缓，`#navMusicBtn` 占位）

> **说明**：A7/D6/F1~F3/G5 为接口/播放器相关，按用户 2026-08-06 决策顺延至「UI 复现」稳定后。

---

## 三、人员分配总表

| 角色 | 主负责 Task | 协同 |
|------|-------------|------|
| **前端 A**（用户端） | T01(FE)、T06、T08、T10、T11、T12、T13、T14、T15、T16、T17 | T02、T04、T18、T19、T20 |
| **前端 B**（管理端） | T01(FE)、T09(管理端部分) | T02、T07、T09 |
| **后端** | T01(BE)、T03、T05(BE)、T07、T09(接口部分) | T02、T04、T18、T19 |

> 并行要点：T02 契约先定 → FE 走 T06/T08/T10~T17（**用临时方案取数**），BE 走 T03/T07（真实接口），二者经 T19 汇合。

---

## 四、并行开发·接口延迟的临时方案（Mock 策略）

> 宪法原则 8 允许"接口端上线前，前端暂以本地 JSON Mock 运行"。以下为**可落地的临时取数方案**，确保前端不阻塞、且接口就绪后零成本切换。

### 4.1 临时数据源（前端）
- 将现有 `assets/js/data.js` 导出为 **JSON 文件** 置于 `src/mock/*.json`（字段对齐 T02 契约）。
- 实现 `src/services/apiClient`，通过**环境开关**切换：
  - `VITE_USE_MOCK=true` → 读本地 JSON（或 `setTimeout` 模拟延迟，验证 loading/error 态）。
  - `VITE_USE_MOCK=false` → 真实请求 `import.meta.env.VITE_API_BASE`。
- **切换零成本**：组件只依赖 service 层，Mock/真实对组件透明（满足原则 2 数据分离）。

### 4.2 接口约定的"口头契约"
- 在 T02 契约未签字前，前端**先用 data.js 现有结构**做 Mock；契约确定后仅改 `src/mock` 字段映射，**不动组件**。
- BE 在 T03 先返回与 Mock **同结构**的内存数据，保证 Swagger 可调；T07 再接管持久化。

### 4.3 媒体资源临时方案
- 接口延迟时，前端直接引用 `assets/` 相对路径（与现状一致），不受影响（原则 1）。
- 接口就绪后改为消费 `/media/*` URL（T04/T19），URL 拼接逻辑集中在 service，组件无感。

### 4.4 降级与兜底（呼应 P0 白屏风险）
- 即使真实接口不可用，前端因走 Mock 仍可独立运行、双端可验证。
- T18 要求在真实接口路径上实现"接口异常 → 友好错误页/Toast，禁止整页白屏"；Mock 阶段即可用模拟 500 提前验证该降级 UI。

### 4.5 临时方案退出条件
- T07 接口持久化完成 + T03 端点与契约一致 → 置 `VITE_USE_MOCK=false`，删除 `src/mock`（或保留为测试 fixture）；完成 T19。

---

## 五、里程碑建议

| 里程碑 | 包含 Task | 退出标准 |
|--------|-----------|----------|
| **M1 地基** | T01~T05 | 三端可启动、契约定稿、工具链卡点生效 |
| **M2 数据闭环** | T06、T07、T09 | 管理端录入 → 接口 → 用户端展示，Mock 可切真实 |
| **M3 页面等价** | T08、T10~T17 | 6 页功能等价 + 双端验收 + G/A 待办落地 |
| **M4 红线与收尾** | T18、T19、T20 | P0/P1 清零、旧依赖切断、文档同步、DoD 达成 |

---

## 五、进度里程碑（随进展追加，原则 11）

| 日期 | 里程碑 | 完成项 | 备注 |
|------|--------|--------|------|
| 2026-08-05 | **M0 数据与通道打通** | T01/T02/T03/T04/T05(部分)/T06 | 三端脚手架就绪；契约签字；接口 7GET+1POST 内存态可跑（UTF-8 信封）；web 数据层四层 + Mock 开关；`vue-tsc` 零错。T05 完整工具链配置延至 T20 统一落地。 |
| 2026-08-06 | **M1 用户端骨架成形** | T08 | 6 路由 + 公共 Layout + 6 视图经 store 渲染真实 Mock 数据；`/nope` 404 兜底；XSS 红线（禁 v-html）；build 通过、全路由 200。**至此已可进行初步前端测试（见下）**。 |
| 2026-08-06 | **M1.5 视觉还原修复** | T04(补)/T13/T16(标记) | 据用户测试反馈（样式全丢/媒体 404/播放器缺失）调整：**T04 媒体解析**（`useAssetUrl` + public junction，图片/视频/背景图均 200）；**T13 样式还原**（复用原站 91KB `original.css` 深色玻璃拟态 + 字体/FA CDN，Layout 对齐原站 class，**当前重点**）；**T16 标记暂缓**（Layout 预留 `#navMusicBtn`）。决策：当前版本"样式还原 > 接口数据"，T07 顺延。 |
| 2026-08-07 | **M1.6 页面 UI 复现拆解 / 相册瀑布流修复** | T11(B2~B7)/T13 | 新增「页面 UI 复现拆解集」（当前版本标注「UI 复现」，A~G 逐项 ✅/🔲）；相册展开由 CSS `columns` 改为 **Grid + JS Masonry**（B5），解决 6 张等高图右侧空白；提交 `8316dbd`。 |

---

<p align="center">任务状态随进展在本文件更新；每次提交关联 Task 编号（原则 10）。</p>

---

## 六、临时变更需求登记

> **进入本区域的任务，均须先在 [`修改日志.md`](修改日志.md)「临时需求登记」完成「原文 → 解析 → 冲突确认」三步。**
> 每条任务备注 `（新增变更需求 YYYY-MM-DD）`；紧急性由 AI 按内容判断，或按需求备注的「紧急程度」分类（🔴 紧急 / 🟡 常规 / 🟢 收尾）。
> 流程定义：[`Readme.md`](Readme.md) 第十二章 ｜ [`constitution.md`](constitution.md) 原则 12 ｜ [`开发规范.md`](开发规范.md) 第 5 条。

| # | 关联登记 | 任务描述 | 紧急度 | 落点/关联 Task | 状态 |
|---|----------|----------|--------|----------------|------|
| C01 | 修改日志 #1-4 | 分层配置三份 `.gitignore`（根 / web / api） | 🔴 紧急 | 新增 · 无前置 | ✅ 已完成 2026-08-10 |
| C02 | 修改日志 #1-1c | NavPlayer 兜底头像三层回退 | 🔴 紧急 | T16 | ✅ 已完成 2026-08-10 |
| C03 | 修改日志 #1-1a | PageLoading 首屏加载动画组件化 | 🟡 常规 | T08 / T20 | 🔲 待排期 |
| C04 | 修改日志 #1-1b | FeatherLayer 羽毛飘动氛围层组件化 | 🟡 常规 | T08 / T20 | 🔲 待排期 |
| C05 | 修改日志 #1-2 | web + admin 合并为单应用（路由分区 + manualChunks） | 🔴 紧急 | T01 / T09（⚠️ 变更 T01 双工程约定） | 🔲 待排期 |
| C06 | 修改日志 #1-3 | 根 `assets/` 并入 web，消除物理副本 | 🟡 常规 | T04 / T19（⚠️ 修正 T04 junction 记载） | 🔲 待排期（前置 C02/C03/C04） |
| C07 | 修改日志 #1-5 | 移除 `index.html` 与 `pages/*.html` | 🟢 收尾 | T19 / T20 | 🔲 待排期（前置 C03/C04/C06 + 打 tag） |
| C08 | 修改日志 #1-d | 网站 icon 统一为 `favicon.ico` | 🟢 收尾 | T04 / T20 | 🔲 待排期（前置 C06） |
| C09 | 修改日志 #1-e | 滚动条样式选择器收敛（非新增） | 🟡 常规 | T13 / T20 | 🔲 待排期（与 T13 同源） |

**依赖链（执行序，不可随意调整）**

```
C01 ──（独立，可立即执行）
C02 → C03 → C04 ──┐
                  ├─→ C06 ──┬─→ C07（须先打 tag: legacy-html-final）
                            └─→ C08（路径依赖 C06 最终结果）
C05 ──（独立，但建议尽早：admin 空壳期成本最低）
C09 ──（独立，但须与 T13 样式抽象同批，避免二次返工）
```

**排期建议（9 项分三批）**

| 批次 | 任务 | 说明 |
|------|------|------|
| 第一批 · 立即可做 | ~~C01 → C02~~ ✅ **已完成 2026-08-10** | 零风险 / 最小工作量，无前置 |
| 第二批 · 迁移主体 | C03 → C04 → C05 → C09 | C05 越早成本越低；C09 随 T13 样式工作一并处理 |
| 第三批 · 资源收口 | C06 → C08 → C07 | 严格串行，C07 前必须打 tag |

---

### 🔴 C01 · 分层配置三份 .gitignore（双，易，紧急）（新增变更需求 2026-08-10）
- **目标**：按职责分层管理忽略规则，避免根目录单文件承载全部规则导致的规则重叠与误伤。
- **范围**：
  - **根 `.gitignore`**：通用规则 —— OS 产物（`.DS_Store`/`Thumbs.db`）、IDE（`.idea/`/`.vscode/`）、日志、`.env*`、大体积媒体（沿用现有 `video/`、`music/` 约定）。
  - **`web/.gitignore`**：`node_modules/`、`dist/`、`dist-ssr/`、`.vite/`、`*.local`、构建缓存。
  - **`api/.gitignore`**：`venv/`、`.venv/`、`__pycache__/`、`*.py[cod]`、`.pytest_cache/`、`*.egg-info/`、`api.log`。
- **核查结论（已完成）**：经 `git ls-files` 全库排查，**不存在**应忽略却已被跟踪的文件；`api/` 下仅跟踪 `data.py`/`main.py`/`models.py`/`requirements.txt`/`routes.py` 共 5 个源码文件。**无需执行 `git rm --cached`**（用户已授权但无需动用）。
- **验收**：三份文件各司其职、规则不重复；`git status --ignored` 输出符合预期；`git ls-files` 中无构建产物/虚拟环境/日志文件。
- **关联原则**：原则 6 简单优先。
- **备注**：`admin/.gitignore` 随 C05 一并移除。

**✅ 实施记录 · 2026-08-10**
- 落地文件：`.gitignore`（重写）、`web/.gitignore`（重写）、`api/.gitignore`（新建）。
- 验收结果：`git ls-files -i -c --exclude-standard` 输出为空（无已跟踪文件被误伤）；跟踪文件总数 194 保持不变；`git check-ignore -v` 抽样确认各规则命中预期层级。
- **⚠️ 实施中发现并修正的问题 1 —— 通配目录规则误伤站点素材**
  初版沿用旧约定写下 `video/`、`music/`，验收时发现 Git 的无斜杠模式会匹配**任意层级**同名目录，导致 `assets/music/` 下 **6 个已入库音频**（`xiaoyu.mp3`、`anheqiao.aac` 等）被判定为忽略。这些是站点实际播放资源，一旦忽略后续变更将无法追踪。
  修正：改为前置斜杠锚定写法 `/video/`、`/music/`，仅约束仓库根部素材暂存目录。已在文件内注释说明该陷阱，避免后续误改。
- **⚠️ 实施中发现的问题 2 —— 约 624MB 媒体处于未跟踪状态**
  `web/public/assets/video/`(≈412MB)、`web/public/assets/music/`(≈58.5MB)、`web/src/assets/music/`(≈58.5MB，与 public 重复)、根 `video.zip`(94.9MB) 均未入库。若被误 `git add`，将永久撑大仓库历史且无法简单回退。
  处置：在 `web/.gitignore` 与根 `.gitignore` 中显式拦截，并加注说明。
  **遗留待决**：这批媒体的正式管理方案（Git LFS / 对象存储 / 部署时注入）尚未确定，且 `src/assets/music` 与 `public/assets/music` 内容重复，**移交 C06 资源归并时一并决策**。
- 授权留痕：用户已授权 `git rm --cached`，但经核查无需动用（仓库内不存在应忽略却已跟踪的文件），故未执行任何破坏性操作。

### 🔴 C02 · NavPlayer 兜底头像三层回退（FE，易，紧急）（新增变更需求 2026-08-10）
- **目标**：恢复旧播放器的头像容错能力，避免封面加载失败导致的空白/破图。
- **现状缺陷**：`web/src/components/NavPlayer.vue:40-43` 的 `coverUrl` 仅做 `v-if` 判空；`:src` 无 `@error` 处理。旧实现 `assets/js/nav-player.js:110-125` 的三层保护全部丢失。
- **范围**：① `avatar` 缺失时按 `{artist}.png` 推导；② 加载失败回退 `VA.png`；③ 以一次性标志位（等价旧 `dataset.fallbackApplied`）防止 error 事件死循环。
- **验收**：三种场景（有 avatar / 无 avatar 有 artist / 全部失效）均正确显示，且 `VA.png` 本身失效时不产生无限 error 循环；双端一致。
- **关联原则**：原则 10 错误态。
- **优先级说明**：工作量最小、价值确定、风险最低，建议作为本批次首个开发项。

**✅ 实施记录 · 2026-08-10**
- 落地文件：`web/src/components/NavPlayer.vue`（`coverUrl` 计算属性改造 + 新增 `onCoverError` + 模板绑定 `@error`）。
- 实现要点：
  1. 第 1/2 层在 `coverUrl` 内完成（`avatar` → `{artist}.png` 推导）；第 3 层由 `@error` 触发回退 `VA.png`。
  2. 防死循环采用**双重保险**：① 失败 URL 记入 `fallbackApplied` Set，同一 URL 只回退一次；② 若失败的正是 `AVATAR_FALLBACK` 本身则直接返回，确保 `VA.png` 缺失时不产生无限 error 循环。
  3. 选用 `Set` 而非旧站的布尔标志位（`dataset.fallbackApplied`）：Vue 中 `<img>` 节点会被复用，布尔量在切歌后不会重置，将导致后续歌曲失去回退能力。
  4. 模板加 `:key="coverUrl"`：强制切歌时重建 `<img>` 节点，避免 Vue 复用节点导致上一首的兜底 `src` 残留。
- 验收结果：`vue-tsc --noEmit` 类型检查 0 错误；dev server 启动正常；`VA.png` 返回 `image/png` 55154B 可达。
- **⚠️ 实施中发现 —— 本任务价值高于预期**
  `web/src/mock/index.ts:110-116` 共 7 首曲目引用头像，但 `web/public/assets/img/avatar/` 下**仅存在 3 个文件**（`VA.png`、`宋冬野.png`、`张震岳.png`）。即 `Sasablue`、`王菲`、`周深`、`鞠婧祎`、`郭斯与帆` **5 首（占比 5/7）头像缺失**，修复前均为破图。
- **⚠️ 需注意的 dev 环境特性**
  缺失图片经 Vite SPA fallback 会返回 **HTTP 200 + `text/html`（1058B 的 index.html）**，而非 404。实测 `Sasablue.png` 即为此情形。浏览器解码 HTML 为图片失败仍会触发 `error` 事件，故回退逻辑有效；但**不能依赖 HTTP 状态码判断资源是否存在**，排查同类问题时需看 `content_type`。
- **遗留建议**：缺失的 5 个头像素材需补齐或确认长期以 `VA.png` 兜底，属素材缺口而非代码缺陷，建议在 C06 资源归并时一并核实。

### 🟡 C03 · PageLoading 首屏加载动画组件化（FE，中，常规）（新增变更需求 2026-08-10）
- **目标**：还原旧站首屏加载体验（打字机双语文案 + `loading.gif` + 遮罩淡出）。
- **参考源**：`assets/js/loading.js` + `index.html:16-21`。
- **范围**：新建 `PageLoading.vue`，挂载于 `App.vue` 顶层；**须将旧 JS 内联注入的样式提取为 `<style scoped>`**（已核实 `assets/css/style.css` 与 `web/src/styles/original.css` 中 `page-loading` 命中数为 0，样式不在 CSS 文件内）。
- **验收**：首屏动画时序、文案、淡出效果与旧站一致；SPA 路由切换不重复触发；双端可测。
- **关联原则**：原则 2 数据/表现分离、原则 8 新旧并存。
- **⚠️ 约束**：本任务完成前**不得删除** `assets/js/loading.js`（唯一实现依据）。

### 🟡 C04 · FeatherLayer 羽毛飘动氛围层组件化（FE，中，常规）（新增变更需求 2026-08-10）
- **目标**：还原旧站羽毛飘动氛围效果。
- **参考源**：`assets/js/feathers.js`；素材 `assets/img/global/feather0~3.png`（已核实存在）。
- **范围**：新建 `FeatherLayer.vue`；样式同 C03 需从 JS 内联提取为 SFC；组件卸载时须清理定时器/动画帧，避免内存泄漏。
- **验收**：视觉效果与旧站一致；小屏性能可接受（无明显掉帧）；支持 `prefers-reduced-motion` 降级；路由切换无残留动画实例。
- **关联原则**：原则 10 错误态与降级。
- **⚠️ 约束**：本任务完成前**不得删除** `assets/js/feathers.js`。

### 🔴 C05 · web + admin 合并为单应用（FE，中→难，紧急）（新增变更需求 2026-08-10）
- **目标**：消除双工程带来的重复依赖树、重复构建配置与重复 CI，统一类型与 API 客户端为单一事实源。
- **前提核实**：`admin/src` 当前仅 Vite 脚手架模板（`App.vue`/`main.ts`/`HelloWorld.vue`），**无业务代码**，此刻合并成本近乎为零。
- **目标结构**：
  ```
  web/src/
  ├── modules/user/    # 用户端 views / components / routes.ts
  ├── modules/manage/  # 管理端 views / components / routes.ts
  ├── shared/          # 双端共享 components / composables / utils / types
  ├── services/        # apiClient 统一（沿用现有）
  ├── stores/
  └── router/index.ts  # 聚合两个分区路由
  ```
- **技术决策（已确认 · fetter1991 · 2026-08-10）**：
  | 决策项 | 采纳方案 |
  |--------|----------|
  | 构建产物 | 单产物单域名（放弃 Vite 多入口） |
  | 打包隔离 | `manualChunks` 显式将 manage 拆为独立 chunk |
  | 路由 | 用户端 `/`、管理端 `/manage`，各自独立 Layout，manage 整体懒加载 |
  | 鉴权 | 前端守卫 `meta:{requiresAuth,role:'manage'}` + **后端强制校验兜底** |
  | UI 框架 | 管理端可引组件库，但必须分包，不得污染用户端体积 |
- **范围**：现有 `web/src/views/*` 迁入 `modules/user/views/`，批量更新 import 路径（现仅 8 个视图，成本可控）；删除 `admin/` 整个目录。
- **验收**：`npm run dev` 单命令启动双端；`/` 与 `/manage` 均可访问；构建产物中 manage chunk 独立且用户端首屏体积**不增加**；未登录访问 `/manage` 被拦截且后端同样拒绝。
- **关联原则**：原则 3 单向依赖、原则 6 简单优先。
- **⚠️ 变更影响**：作废 T01「建用户端、建管理端」双工程约定，T09 管理端模型落点改为 `modules/manage/`；T20 需同步文档。
- **⚠️ 安全提示**：单应用同源意味着管理端漏洞可能波及用户端；上述结构保留了"后期拆分独立域名"的余地，若管理端后续涉及高敏操作应重新评估。

### 🟡 C06 · 根 assets/ 并入 web（双，中，常规）（新增变更需求 2026-08-10）
- **目标**：消除根 `assets/` 与 `web/public/assets/` 的双份物理副本（含 `bg.png` 20MB、`loading.gif` 3MB 等，重复体积 20MB+）。
- **现状核实**：`web/public/assets` 为**物理真实目录，非 junction**（`dir /a` 无 `<JUNCTION>` 标记）——与 T04 文档记载不符，须一并修正。
- **范围**：① 静态原样引用（图片/音视频/favicon）归 `web/public/assets/`，保持 URL 路径稳定；② 需参与构建的样式/脚本归 `web/src/assets/` 或 `web/src/styles/`；③ 删除根 `assets/` 及旧命令式脚本 `assets/js/*.js`；④ 修正 T04 中关于 junction 的表述。
- **验收**：全站媒体资源加载无 404；仓库内无重复副本；`useAssetUrl()` 解析路径保持不变。
- **关联原则**：原则 2 数据分离、原则 7.2。
- **⚠️ 前置依赖（强）**：必须在 **C02/C03/C04 完成并验收后**执行——三个旧 JS 是迁移的唯一参考源，顺序颠倒将永久丢失实现依据。
- **附带建议**：评估 `bg.png`(20MB) 压缩方案，当前对首屏是显著负担。
- **📌 C01/C02 移交的待决事项（2026-08-10 追加）**：
  1. **大体积媒体管理方案**：`web/public/assets/video/`(≈412MB)、`web/public/assets/music/`(≈58.5MB)、根 `video.zip`(94.9MB) 目前均未入库，已由 `.gitignore` 临时拦截。需在本任务确定正式方案（Git LFS / 对象存储 / 部署时注入），并同步调整 `.gitignore`。
  2. **`src/assets/music` 与 `public/assets/music` 内容重复**（各 9 个文件、各 58.5MB），需确认保留哪一处。
  3. **头像素材缺口**：`mock/index.ts` 引用 7 个歌手头像，实际仅 3 个存在，缺 `Sasablue`/`王菲`/`周深`/`鞠婧祎`/`郭斯与帆`。C02 已实现 `VA.png` 兜底不致破图，此处需决策是补齐素材还是长期兜底。
  4. **`favicon.ico` 与 `logo.png` 体积同为 37,557 B**，疑似同文件双份，一并核实去重。

### 🟢 C07 · 移除 index.html 与 pages/*.html（双，易，收尾）（新增变更需求 2026-08-10）
- **目标**：完成向 SPA 的收口，移除旧静态站点入口。
- **风险判定**：技术上**无风险**（Vue 应用不依赖这些文件）；风险全部来自**信息资产丢失**：
  | 风险 | 等级 | 缓解措施 |
  |------|------|----------|
  | UI 复现基准丢失（旧 HTML 是唯一像素级验收基准） | 高 | 全页面截图存档 + Git tag 冻结 |
  | 未迁移功能永久丢失（C03/C04 即为例证） | 高 | C02/C03/C04 必须先完成并验收 |
  | 静态资源引用断链 | 中 | 与 C06 协同执行 |
- **强制前置条件**：① C02/C03/C04 迁移完成并验收；② C06 资源归并完成；③ 打 Git tag `legacy-html-final` 冻结旧版本（使风险降为可恢复）。
- **验收**：SPA 全路由可访问；无死链；tag 可检出还原旧站。
- **关联原则**：原则 8 新旧并存（收口）、原则 12 临时需求留痕。

### 🟢 C08 · 网站 icon 统一为 favicon.ico（FE，易，收尾）（新增变更需求 2026-08-10）
- **目标**：站点图标与旧站一致，移除 Vite 脚手架默认图标。
- **现状核实**：
  - `web/index.html:5` 为脚手架默认 `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`
  - 旧站 `index.html:7` 为 `<link rel="icon" type="image/x-icon" href="assets/img/global/favicon.ico">`
  - `favicon.ico`(37,557 B) 在根 `assets/img/global/` 与 `web/public/assets/img/global/` 均已存在，**无需新增素材**
- **范围**：① 修改 `web/index.html` 的 icon 引用为 `favicon.ico`（路径以 C06 归并后的最终结构为准）；② 删除脚手架遗留的 `web/public/favicon.svg`；③ C05 完成后确认管理端入口同样生效。
- **验收**：浏览器标签页、书签、新标签页均显示正确图标；无 404；仓库内无残留 `favicon.svg`。
- **关联原则**：原则 7.2 资源归位。
- **⚠️ 前置依赖**：排在 **C06 之后**。若先改引用再归并资源，路径会二次变更造成返工。
- **附注**：`favicon.ico` 与 `logo.png` 体积同为 37,557 B，疑似同一文件双份存放，C06 执行时可一并核实去重。

### 🟡 C09 · 滚动条样式选择器收敛（FE，中，常规）（新增变更需求 2026-08-10）
- **⚠️ 范围修正（重要）**：需求描述为"需补充滚动条样式"，但**经核实样式并未缺失**——`web/src/styles/original.css` 已由 `main.ts:3` 全局引入，其滚动条规则数与旧站 `assets/css/style.css` **完全一致（均 61 处匹配）**。故本任务**不是补样式，而是改机制**。
- **真实缺口**：旧实现采用**固定类名白名单**选择器：
  ```
  ::-webkit-scrollbar, html::…, body::…, .work-modal-body::…, .growth-modal-body::…,
  .nav-playlist-body::…, .message-list::…, .lightbox::…, .playlist::…,
  .video-playlist::…, .growth-timeline-scroll::…, .page-container::…, #pageContainer::…
  ```
  Vue 组件若使用新类名或 `<style scoped>`，即落在白名单外，滚动条样式不生效。Firefox 分支（`scrollbar-width` / `scrollbar-color`，`original.css:2601-2602`）同样为白名单制。
- **目标样式基线**（沿用旧站 G2 规范，`original.css:2531-2585`）：宽/高 6px、轨道 `transparent`、滑块 `rgba(255,255,255,.4)` + `border-radius:3px` + `min-height:120px`、hover `rgba(255,255,255,.6)`、`scrollbar-button` 隐藏、`scrollbar-corner` 透明。
- **范围**：① 以通配符 `*::-webkit-scrollbar` 系列作为全局兜底，替代类名白名单枚举；② 取值收敛为 CSS 变量（如 `--sb-size`/`--sb-thumb`/`--sb-thumb-hover`）；③ 移除堆叠的 `!important`（旧实现几乎每条都带，与原则 6 冲突）；④ 保留 `.growth-fullscreen-scroll`、`.growth-timeline-nav`、`.album-tab-scroll` 等**刻意隐藏滚动条**的例外规则，勿被通配符覆盖。
- **验收**：主页面、子页面、弹窗、灯箱、播放列表、新增 Vue 组件容器滚动条视觉一致；Firefox 与 Chromium 表现一致；三处例外容器仍保持无滚动条；`!important` 数量显著下降。
- **关联原则**：原则 6 简单优先、原则 2 表现分离。
- **⚠️ 排期约束**：与 **T13「original.css 抽象为设计系统」同源**，须同批处理。若先独立改造再做 T13 抽象，会二次返工。
- **⚠️ 技术风险**：`<style scoped>` 中伪元素选择器存在作用域限制，滚动条规则建议置于**全局样式层**而非组件 scoped 块内。

---

> 以上 C01–C09 为「需求登记 #1」的拆分结果（C08/C09 为 2026-08-10 补充并入子项 1），均处于 🔲 待排期状态。
> 用户 2026-08-10 明确本轮**仅登记与拆分，暂不开发**。开发启动前须再次确认排期。
