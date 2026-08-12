# kxyy 重构任务拆解（Tasks）

> **依据**：[`constitution.md`](constitution.md)（重构原则/架构/质量红线）+ [`Readme.md`](Readme.md)（现状/页面/风险）。
> **排序逻辑**：按 **紧急程度（阻断依赖 / 安全红线 / DoD 关键路径）** 优先，叠加 **难易程度（易→难）** 形成执行序。
> **分配**：FE=前端（Vue 用户端 + 管理端）｜BE=后端（FastAPI 接口端）｜双=双方协同。
> **质量门槛（强制）**：每次提交关联本文件 Task 编号；合并前过 ESLint/Flake8；核心功能单测 ≥80%；双端（大屏/小屏）验收。
> **宪法优先级**：当任务与 constitution 冲突，以原则为准（先提问，不静默取舍）。
> **临时变更需求**：开发中随机加入的需求，须先在 [`修改日志.md`](修改日志.md)「临时需求登记」留痕（原文→解析→冲突确认），再拆分到下方「临时变更需求登记」区域；流程见 [`Readme.md`](Readme.md) 第十二章、`constitution.md` 原则 12、`开发规范.md` 第 5 条。

> **⚠️ 当前版本重点（用户 2026-08-06 拍板）**：**页面样式还原 > 接口数据实现**。
> 本轮优先让页面"长得对、媒体可加载、双端可测"，接口持久化（T07）顺延至样式就绪后。
> 播放器（T16）**已实现**（2026-08-08）：`NavPlayer.vue` 挂载于 `Layout.vue`，含双播放器互斥/三模式/头像回退，文档原"暂缓/占位"记载已作废。

---

## 一、拆解矩阵（概览）

| 象限 | 特征 | 任务 |
|------|------|------|
| 🔴 紧急·易 | 阻断后续、低风险、可立即做 | T01 脚手架、T02 数据契约、T03 接口骨架、T04 目录约定、T05 工具链 |
| 🔴 紧急·难 | 安全红线 / DoD 关键路径 | T06 数据层抽象、T07 接口核心、T08 用户端路由、T09 管理端模型 |
| 🟡 常规·易 | 页面等价、并行推进 | T10 素材库、T11 相册、T12 个人资料、T13 成长、T14 留言 |
| 🟡 常规·难 | 复杂交互、双播放器 | T15 视频页、T16 双播放器状态、T17 弹幕页(G1)、T21 互动页(合并留言+弹幕) |
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
- **产出补全（M1 反馈后）**：`web/src/utils/asset.ts` 的 `useAssetUrl()` 把 `../assets/x` 统一解析为 `${BASE_URL}assets/x`（SPA 路径安全）；`web/public/assets` 为**物理真实目录**（非 junction 软链，原记载"junction"系误判，已于 C06 核实更正），dev 下 `/assets/*` 直读；各视图媒体 `:src` 经 `useAssetUrl` 包裹。
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
- **✅ 实施记录 · 2026-08-10（设计系统抽象落地）**：
  - **P1 冲突修复**：删除 `web/src/style.css`（Vite 脚手架默认样式，其 `:root{--text:#6b6375;--accent:#aa3bff}` 与 `original.css` 深色 token 打架），`main.ts` 移除 import，全站仅留 `original.css` 一个 `:root` 变量源。
  - **Token 固化 + 去硬编码**：`original.css` `:root` 加"唯一 token 源"锚点注释；新增 `--primary-shadow`/`--primary-glow`，将散落 9 处 `rgba(138,43,226,0.4)` 统一替换为 `var(--primary-shadow)`。
  - **文档化**：新增 `docs/STYLE-SYSTEM.md` 固化 token 体系（色彩/度量/字体/命名/响应式/滚动条/暗亮扩展点/技术债）。
  - **验收**：`vue-tsc -b` 0 错；`vite build` 成功；主 CSS 66.6KB→65.25KB。
  - **刻意轻量范围**：未将 90KB 按组件拆文件（旧站类名保留保还原），与 C09"不二次返工"原则一致；`linear-gradient` 未抽 token（CSS 变量不支持嵌套渐变）。

### 🟡 T14 · 留言册（FE，易，常规）★ 链路已通，Mock 未切
- **目标**：`localStorage` → 接口持久化，保留 XSS 转义。
- **范围**：`POST /api/messages`；渲染 `escapeHtml`/Vue 模板绑定（P0 XSS）。
- **验收**：提交后他人可见（经接口）；无注入。
- **关联原则**：P0 XSS、原则 2。
- **✅ 实施记录（2026-08-08，文档债修正）**：原记载"F2 提交用 localStorage"已作废——全库 `localStorage` 命中 **0 处**，留言已走 `messageService`（→ `/api/messages`）。XSS 防护到位（`MessageView.vue` 用 `{{ m.content }}` 模板插值，无 `v-html`）。**⚠️ 当前仍跑 Mock**：`.env` 中 `VITE_USE_MOCK=true`，`create()` 在 mock 分支仅返回假对象，刷新即丢——故"他人可见/持久化"尚未真正达成，待 T19 切 `VITE_USE_MOCK=false` 验证真实接口。F3 留言导航入口（`Layout.vue:20`）仍注释屏蔽，与文档一致。

### 🟡 T15 · 视频页（FE，难，常规）
- **目标**：专辑 Tab + 分页/滚动 + 横竖屏 + 进度条 seek。
- **验收**：PC 数字分页/小屏滚动加载；横竖屏 class 切换；seek 正常（B2 已修，等价保留）；双端。
- **关联原则**：原则 1/4。

### 🟡 T16 · 双播放器状态管理（FE，难，常规）★ P1 ★ ✅ 已实现（2026-08-08）
- **状态**：**已实现**（非暂缓）。原文档"暂缓/占位/`#navMusicBtn`disabled 按钮"记载已作废——代码已于 2026-08-08 落地，`Layout.vue` 真实挂载 `<NavPlayer />`，无占位、无 disabled。
- **落地能力**：单一 audio 实例由 store 持有（双播放器共享音源）；三种播放模式 order/loop/shuffle；音视频互斥（播放音频时 pause 视频）；头像三层回退（防 error 死循环，详见 C11 由全局 `Set` 改为 `img.dataset` 实例标记）；播放列表展开/收起、5 秒无操作自动收起。
- **目标**：显式状态管理替代隐式契约互斥。
- **范围**：Pinia 播放器 store（`stores/data.ts` 播放器逻辑区块），页面内视频播放器 + 导航栏常驻音频播放器统一调度。
- **验收**：✅ 切换不泄漏（P1）；小屏显示歌手歌名（B5）；列表宽度跟播放器（B4）；展开入口清晰（B3）。
- **关联原则**：P1、原则 4 双播放器特征。
- **⚠️ 文档债已清**：`tasks.md:12` 顶部注释、`tasks.md:220`（G5）、`Layout.vue:2-3` 注释中关于"T16 暂缓/占位"表述已同步更正。

### 🟡 T17 · 建议弹幕页（FE，中，常规）— G1
- **目标**：B站弹幕风格右→左滚动 + 点赞数。
- **验收**：双端滚动流畅；数据来自接口（新增 `Message/Barrage` 端点）。
- **关联原则**：原则 2/4。
- **🔄 状态变更 · 2026-08-12（需求登记 #2 子项 2）**：当前 **UI 复现版本暂不实现**独立弹幕建议页，与留言页（F1~F3）合并为未来单一互动页（**T21**，承载留言 / 建议 / 趣味互动）。本任务由"待做"改为"UI 复现版本暂不实现，并入 T21"，代码未实现，仅更新文档。

### 🟡 T21 · 互动页（粉丝留言 / 建议 / 趣味互动合一）（FE，中，常规）★ 新建（需求登记 #2 子项 2）
- **目标**：将"UI 复现"版**暂不实现**的独立留言页（F1/F2/F3）与弹幕建议页（T17/G1）整合为单一互动页，承载粉丝留言 / 建议 / 趣味互动三类功能。
- **范围（待 T07/T14/T19 后端就绪后落地）**：
  - 留言：列表渲染（XSS 安全，禁 v-html）+ 提交（接口持久化，原 F2 目标）。
  - 建议：类弹幕右→左滚动 + 点赞数（原 T17/G1 目标）。
  - 趣味互动：待需求细化（如投票 / 抽奖 / 打卡等）。
  - 数据过滤：结合 C16 第三方登录（抖音）记录的粉丝身份，支持"按粉丝身份数据过滤"（需求 #2-4 后续场景）。
- **当前状态**：🔲 **UI 复现版本暂不实现**（需求登记 #2-2 决策）；仅占位规划，不开发。
- **关联原则**：原则 4 保留页面（整合而非删功能）、原则 2 数据分离、原则 3 后端兜底鉴权。
- **依赖**：T07 接口持久化、T14 留言链路、T19 Mock 切换、C16 登录态。

### 🟢 T18 · P0/P1 风险清零（双，中，收尾）★ 安全红线
- **目标**：正面处理 CodeReview 风险。
- **范围**：XSS（优先模板绑定，禁 `v-html` 或白名单）、接口不可用降级提示（禁白屏）、监听/定时器销毁、状态收敛、错误/加载态。
- **验收**：P0/P1 全部闭环；单测覆盖关键路径 ≥80%。
- **关联原则**：原则 10。
- **✅ 实施记录 · 2026-08-10（安全复核）**：
  - **XSS 红线**：全库 `v-html`/`innerHTML` 命中 **0 处**（MessageView 用 `{{ m.content }}` 模板插值，注释显式"严禁 v-html"）；留言/相册/视频数据均走 Vue 绑定，无注入面。
  - **定时器/监听器清理**：抽查 `ProfileView`（setInterval→onUnmounted clearInterval）、`WorksView`（resize 监听 onBeforeUnmount 移除 + resizeTimer 防抖）、`FeatherLayer`/`PageLoading`（rAF/setTimeout→onUnmounted 清理）、`NavPlayer`（idleTimer 收起）均正确销毁，无泄漏。
  - **降级提示**：`Layout.vue` 已用 `store.error` 渲染错误态（非白屏）；`App.vue` PageLoading 覆盖加载态。
  - **遗留（非阻断）**：单测覆盖率未达 80%（T18 验收项之一），需后续补 `*.spec.ts`；当前以类型检查 + 构建 + 运行时验证替代。

### 🟢 T19 · 增量迁移切换（双，中，收尾）★ DoD 关键
- **目标**：切断本地硬编码依赖，旧站可下线。
- **范围**：前端移除 `data.js` 直引；接口端全量接管；旧 `index.html`/`pages/*` 标记弃用。
- **验收**：无"双真相"；旧站停止维护；DoD 第 1–5 条达成。
- **关联原则**：原则 8、DoD。

### 🟢 T20 · 文档与代码同步（双，易，收尾）★ ✅ 已完成（2026-08-10）
- **目标**：消除文档脱节（历史教训 v1.1.7）。
- **范围**：更新 `Readme.md` 技术栈/架构为目标态；`constitution.md` 第七章已含技术方案；本文件 Task 状态回收。
- **验收**：文档与代码命名/职责一致（DoD 第 6 条）。
- **关联原则**：原则 11。
- **✅ 实施记录 · 2026-08-10**：`web/README.md` 由 Vite 脚手架模板（5 行英文）重写为项目实况（技术栈 / 目录结构 / 开发命令 / 关键约定 / 文档索引），同步单应用 + modules 分区 + manualChunks + style.css 已删 + Mock 开关等当前状态。

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
> **🔄 状态变更 · 2026-08-12（需求登记 #2 子项 2）**：当前 **UI 复现版本暂不实现**独立留言页，与弹幕建议页（T17/G1）合并为未来单一互动页（**T21**）。F1/F2/F3 标注"UI 复现版本暂不实现"，代码本就未实现，仅更新文档状态。
- 🔲 F1 留言列表渲染（XSS 安全，禁 v-html）→ **UI 复现版本暂不实现**（需求 #2-2，并入 T21 互动页）
- 🔲 F2 提交留言 `localStorage` → 接口持久化（T14）→ **UI 复现版本暂不实现**（需求 #2-2，并入 T21 互动页）
- ⏸ F3 本轮**暂时屏蔽导航入口**（Layout 注释 `留言`）→ 互动页落地后复用/调整入口

### G. 全局 / Layout
- ✅ G1 顶部导航半透明毛玻璃 + 顺序对齐原站（相册/素材库/个人资料/视频/成长历程/留言）
- ✅ G2 全局 loading/error 遮罩（C12 增强：遮罩改为数据就绪即收起，8s 兜底防卡死；**C13 场景化扩展见临时变更 #2**）
- ✅ G3 移动端汉堡菜单
- ✅ G4 全局背景与字体/FA CDN 还原（复用 `original.css`）
- 🔲 G5 双播放器常驻导航（T16 暂缓，`#navMusicBtn` 占位）→ **注：T16 实际已实现，此处记载与代码不一致，待修正**；第三方登录入口（需求 #2-4）后续挂于此常驻区

> **说明**：A7/D6/G5 为接口/播放器相关，按用户 2026-08-06 决策顺延至「UI 复现」稳定后；F1~F3、T17 依需求 #2-2 改为"并入互动页"，不再独立开发。

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
| C03 | 修改日志 #1-1a | PageLoading 首屏加载动画组件化 | 🟡 常规 | T08 / T20 | ✅ 已完成 2026-08-10 |
| C04 | 修改日志 #1-1b | FeatherLayer 羽毛飘动氛围层组件化 | 🟡 常规 | T08 / T20 | ✅ 已完成 2026-08-10 |
| C05 | 修改日志 #1-2 | web + admin 合并为单应用（路由分区 + manualChunks） | 🔴 紧急 | T01 / T09（⚠️ 变更 T01 双工程约定） | ✅ 已完成 2026-08-10 |
| C06 | 修改日志 #1-3 | 根 `assets/` 并入 web，消除物理副本 | 🟡 常规 | T04 / T19（⚠️ 修正 T04 junction 记载） | ✅ 已完成 2026-08-10 |
| C07 | 修改日志 #1-5 | 移除 `index.html` 与 `pages/*.html` | 🟢 收尾 | T19 / T20 | ✅ 已完成 2026-08-10（tag legacy-html-final 已打） |
| C08 | 修改日志 #1-d | 网站 icon 统一为 `favicon.ico` | 🟢 收尾 | T04 / T20 | ✅ 已完成 2026-08-10 |
| C09 | 修改日志 #1-e | 滚动条样式选择器收敛（非新增） | 🟡 常规 | T13 / T20 | ✅ 已完成 2026-08-10 |
| C10 | 反馈 2026-08-12 | 滚动条样式不统一：以成长历程弹窗为基准统一全站 | 🟡 常规 | T13 / G2（全局） | ✅ 已完成 2026-08-12 |
| C11 | 反馈 2026-08-12 | 播放器头像兜底：反复切歌后加载失败 | 🟡 常规 | T16（C02 增强） | ✅ 已完成 2026-08-12 |
| C12 | 反馈 2026-08-12 | 强制刷新偶发页面长时间加载 | 🟡 常规 | C03（PageLoading） | ✅ 已完成 2026-08-12 |
| C13 | 需求登记 #2-1 | 全站暗色（黑底）主题：导航/播放器/按钮/弹窗配色收敛 `:root` token | 🟡 常规 | T13（设计系统同源） | 🔲 待排期 2026-08-12 |
| C14 | 需求登记 #2-2 | 砍掉独立留言页+弹幕页，整合为未来"互动页"（仅文档状态变更） | 🟢 收尾 | T14 / T17 / F1~F3 | 🔲 待排期 2026-08-12（文档已更） |
| C15 | 需求登记 #2-3 | loading 场景化触发（强刷/根路由/大接口/大媒体），组件传参或 store 维度识别 | 🟡 常规 | C03 / C12 / T18 | 🔲 待排期 2026-08-12 |
| C16 | 需求登记 #2-4 | 第三方登录页/弹窗（仅前端记录登录态，不鉴权） | 🟡 常规 | T16 常驻区 / 互动页 | 🔲 待排期 2026-08-12 |
| C17 | 需求登记 #2-5 | 首页路由可切换规划（`/` 素材库↔相册），预留别名兼容与命名解耦 | 🟢 收尾 | T08 / T11 | 🔲 待排期 2026-08-12 |
| C18 | 需求登记 #2-6 | 相册页横图封面兼容（等比裁切/aspect-ratio/防错位） | 🟡 常规 | T11 / B 组 | 🔲 待排期 2026-08-12 |
| C19 | 需求登记 #2-7 | 个人资料头像固定不旋转 | 🟢 收尾 | C 组 C1 | ✅ 已完成 2026-08-12 |
| C20 | 需求登记 #2-8 | 音乐播放器初次进入 3 秒自动播放（尊重 autoplay 策略） | 🟡 常规 | T16 | 🔲 待排期 2026-08-12 |
| C21 | 问题反馈 #1-UI-1 | 素材页副标题与标签行间距 | 🟢 收尾 | — | ✅ 已完成 2026-08-12 |
| C22 | 问题反馈 #1-UI-2 | 相册副标题与列表间距 | 🟢 收尾 | — | ✅ 已完成 2026-08-12 |
| C23 | 问题反馈 #1-UI-3 | 个人资料页多重面板嵌套优化 | 🟡 常规 | — | 🔲 待排期 2026-08-12 |
| C24 | 问题反馈 #1-UI-4 | 视频页切换专辑不切换播放项（点击播放才切） | 🟡 常规 | T16 | 🔲 待排期 2026-08-12 |
| C25 | 问题反馈 #1-UI-5 | 成长历程弹窗大屏/小屏响应式间距优化 | 🟡 常规 | — | 🔲 待排期 2026-08-12 |
| C26 | 问题反馈 #1-数据-1 | "小猫摇头"视频 orientation 误标 landscape→portrait | 🟢 收尾 | — | ✅ 已完成 2026-08-12 |

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
| 第二批 · 迁移主体 | ~~C03 → C04 → C05 → C09~~ ✅ **已完成 2026-08-10** | C05 越早成本越低；C09 随 T13 样式工作一并处理 |
| 第三批 · 资源收口 | ~~C06 → C08 → C07~~ ✅ **已完成 2026-08-10** | 严格串行，C07 前必须打 tag（legacy-html-final 已打） |

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
- **⚠️ 后续修正（2026-08-12 · C11）**：C02 的「全局 `Set` 去重防死循环」在反复切歌场景失效——`:key="coverUrl"` 重建 `<img>` 后，同一首歌（artist 推导图不存在）再次触发 error 时 URL 已在 `Set` 中被 `return`，头像停在损坏态。C11 改为 `img.dataset.fallbackApplied` 实例标记（每实例自动重置），彻底解决，详见 C11。

### 🟡 C03 · PageLoading 首屏加载动画组件化（FE，中，常规）（新增变更需求 2026-08-10）
- **目标**：还原旧站首屏加载体验（打字机双语文案 + `loading.gif` + 遮罩淡出）。
- **参考源**：`assets/js/loading.js` + `index.html:16-21`。
- **范围**：新建 `PageLoading.vue`，挂载于 `App.vue` 顶层；**须将旧 JS 内联注入的样式提取为 `<style scoped>`**（已核实 `assets/css/style.css` 与 `web/src/styles/original.css` 中 `page-loading` 命中数为 0，样式不在 CSS 文件内）。
- **验收**：首屏动画时序、文案、淡出效果与旧站一致；SPA 路由切换不重复触发；双端可测。
- **关联原则**：原则 2 数据/表现分离、原则 8 新旧并存。
- **⚠️ 约束**：本任务完成前**不得删除** `assets/js/loading.js`（唯一实现依据）。

**✅ 实施记录 · 2026-08-10**
- **落点**：`web/src/shared/components/PageLoading.vue`（全站共享氛围层）+ `App.vue` 顶层挂载 `<PageLoading />`。
- **与文档记载的偏差修正（重要）**：原计划"样式不在 CSS 内、需从 JS 提取为 scoped"。**复核 `original.css:1835-1930` 后确认 `page-loading` 相关样式（遮罩 / 打字机 / 光标 / gif）实际已完整存在于 `original.css` 且经 `main.ts` 全局引入**——旧记载"`page-loading` 命中数为 0"不成立（当初检索词拼写/范围有误）。因此本任务**只组件化 JS 行为**，样式沿用全局 `original.css`，不重复提取，避免双份样式。
- **实现要点**：打字机双语文案还原（`useAssetUrl('assets/img/global/loading.gif')` 走 `BASE_URL` 解析，SPA 路径安全）；监听 `dataStore.loaded` 状态淡出遮罩；`onUnmounted` 清理定时器，路由切换不重复触发。
- **验收结果**：`vue-tsc --noEmit` 0 错误；dev 首屏截图确认遮罩 + loading.gif 居中显示；`loading.gif` HTTP 200 `content_type=image/gif`（非 SPA fallback 的 text/html）。

### 🟡 C04 · FeatherLayer 羽毛飘动氛围层组件化（FE，中，常规）（新增变更需求 2026-08-10）
- **目标**：还原旧站羽毛飘动氛围效果。
- **参考源**：`assets/js/feathers.js`；素材 `assets/img/global/feather0~3.png`（已核实存在）。
- **范围**：新建 `FeatherLayer.vue`；样式同 C03 需从 JS 内联提取为 SFC；组件卸载时须清理定时器/动画帧，避免内存泄漏。
- **验收**：视觉效果与旧站一致；小屏性能可接受（无明显掉帧）；支持 `prefers-reduced-motion` 降级；路由切换无残留动画实例。
- **关联原则**：原则 10 错误态与降级。
- **⚠️ 约束**：本任务完成前**不得删除** `assets/js/feathers.js`。

**✅ 实施记录 · 2026-08-10**
- **落点**：`web/src/shared/components/FeatherLayer.vue`（与 PageLoading 同属 `shared/components` 全站氛围层）+ `App.vue` 顶层 `<FeatherLayer />`。
- **实现要点**：保留旧 `feathers.js` 的粒子物理（随机起始位置 / 速度 / 旋转 / 飘落循环），改用 `ref` 数组 + `requestAnimationFrame` 驱动，避免旧实现的直接 DOM 操作；素材走 `useAssetUrl('assets/img/global/feather0~3.png')`（已确认 4 个 png 存在且 dev 下 200）。
- **降级与清理**：`prefers-reduced-motion` 时跳过动画；`onUnmounted` 取消 rAF 与移除监听器，路由切换无残留实例。
- **验收结果**：`vue-tsc --noEmit` 0 错误；dev 主页截图确认羽毛粒子飘落；`feather0.png` HTTP 200 `content_type=image/png`。

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

**✅ 实施记录 · 2026-08-10**
- **目录迁移**：`git mv` 将 `views/*`(8个) 与 `components/Layout.vue`、`components/NavPlayer.vue` 迁入 `modules/user/`；`PageLoading.vue`/`FeatherLayer.vue` 归入 `shared/components/`；新建 `modules/manage/{routes.ts, components/ManageLayout.vue, views/DashboardView.vue}` 与 `modules/user/routes.ts`；`router/index.ts` 聚合两分区。
- **import 修正**：迁移后失效的相对路径（`../stores/data`、`../utils/asset`）统一改为 `@/` 别名（含 `Layout/NavPlayer/HomeView/MessageView` 4 处）；`shared` 下两组件同样改用 `@/utils/asset`，修正 `.map(useAssetUrl)` 的类型推断异常（显式箭头函数 + `string[]` 标注）。
- **路由分区**：用户端 `/` + 嵌套 `Layout`（保留原 `<RouterView/>`）；管理端 `/manage` 懒加载 + 独立 `ManageLayout`；`meta.area` 类型声明写入 `src/types/router.d.ts`。
- **manualChunks**：`vite.config.ts` 显式拆分 `user` / `manage` / `vendor-vue` / `vendor`；构建验证分包按预期生效——`user` 47.89kB、`manage` 1.88kB 独立，管理端不拖累访客首屏。
- **admin 移除**：`git rm -r admin` 删除已废弃脚手架（与 C01 移交事项一致）。
- **验收结果**：`vue-tsc -b` 0 错误；`vite build` 成功（126 模块转换）；dev 下 `/` 与 `/manage` 均 200，`/manage` 概览卡片正常读取 store 数据；`App.vue` 改为只挂氛围层 + `<RouterView/>`，布局交由路由级 Layout。
- **⚠️ 实施中发现**：`original.css` 滚动条规则（见 C09）的白名单写法在新路由分区下已失效，故 C09 同批处理。

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

**✅ 实施记录 · 2026-08-10**
- **核实结论（关键）**：根 `assets/img/`(40 文件)、`assets/music/`(6 文件) 与 `web/public/assets/` **完全等价**（逐文件比对一致），即根 `assets/` 整体为物理副本。根 `assets/js/`(14 个旧脚本) 与 `assets/css/style.css` 为旧站实现，C07 同批删除。
- **大体积媒体决策（用户确认）**：video(412MB)/music(58.5MB) 按既定 `.gitignore` **保持忽略**，不入库、部署时注入；故本次**不搬运**根 `assets/music` 的 6 个音频（web 已有等价副本），仅删除根侧副本消除重复。
- **执行动作**：`git rm -r assets` 删除整个根 `assets/`（含被跟踪的 img/css/js/music 共 61 文件）；删除 Vite 脚手架残留死文件 `web/src/components/HelloWorld.vue`（无任何引用，且其 `../assets/*.svg` 导入已随根 assets 删除失效）。
- **路径验证**：全站资源经 `useAssetUrl()` 解析为 `/assets/...`（指向 `web/public/assets`），根 assets 删除后路径无断裂；`mock/index.ts` 的 `../assets` 数据值经 `useAssetUrl` 去前缀后仍正确。
- **T04 记载修正**：T04"根 assets 通过 junction 软链"系误判，实测为物理副本目录——已在 T04 落点文档更正（见 T04 修订记录）。
- **验收结果**：`vue-tsc -b` 0 错；`vite build` 成功（分包结构同 C05）；仓库内根 `assets/` 已不存在，无重复副本。

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

**✅ 实施记录 · 2026-08-10**
- **tag 已打**：`git tag -a legacy-html-final` 冻结当前 HEAD（含 C03/C04/C05/C09 已合并状态）作为可恢复快照。
- **执行动作**：`git rm index.html`（根静态入口）+ `git rm -r pages`（5 个旧页面 HTML）。
- **admin 彻底清理**：上一轮（C05）`git rm -r admin` 仅取消跟踪未删物理目录（因含 `node_modules`）。本轮补 `git rm --cached -r admin` + 物理 `Remove-Item -Recurse -Force admin`，磁盘与跟踪均清空，无残留。
- **验收结果**：`/`、`/manage` 路由 200；构建 `dist/index.html` 为 SPA 单入口；tag 可 `git checkout legacy-html-final` 还原旧站；无死链（dev 模式 `/index.html` 回退到 SPA 属正常 fallback，生产环境无此文件即无死链）。

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

**✅ 实施记录 · 2026-08-10**
- **执行动作**：`web/index.html` 的 icon link 改为 `<link rel="icon" type="image/x-icon" href="/assets/img/global/favicon.ico" />`（对齐旧站路径，C05 后单应用双端共用此入口，故一次修改双端生效）；`git rm web/public/favicon.svg` 删除脚手架默认图标。
- **素材核实**：`web/public/assets/img/global/favicon.ico`(37,557 B) 已存在（C06 归并时 web 侧已含），无需新增；`logo.png` 体积相同但内容不同（logo 为页面内品牌图、favicon 为 16×16 ico），**非重复**，保留。
- **验收结果**：dev 下 `/assets/img/global/favicon.ico` HTTP 200 `content_type=image/x-icon`；浏览器标签页图标生效；仓库内无 `favicon.svg` 残留。

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

**✅ 实施记录 · 2026-08-10**
- **落点**：`web/src/styles/original.css:2531` 段落整体重写（`original.css` 为全局样式层，符合技术风险规避点）。
- **实际改动（与范围记载的偏差）**：
  - ① 通配符收敛：删除 13 个具体类的白名单，仅保留 `::-webkit-scrollbar` 系列通配符，新增容器自动命中，无需回头登记（正是需求 1e「新增容器样式不统一」的根因）。
  - ② **未完全移除 `!important`**：原范围要求"移除堆叠的 !important"，但实测有两处必须保留——(a) 通配符的 `width/height` 需 `!important` 以对抗浏览器默认；(b) 例外「隐藏滚动条」类（`.growth-fullscreen-scroll` 等）必须用 `!important` 覆盖通配符的 `6px !important`，否则旧 `.growth-fullscreen-scroll::-webkit-scrollbar{display:none}`（无 `!important`）会被击穿。**故保留功能性 `!important`，删除的是冗余白名单层而非全部 `!important`**。
  - ③ 例外规则后置并升级为 `!important`：`display:none;width:0;height:0` + Firefox `scrollbar-width:none`，确保三处隐藏容器行为不变。
  - ④ 未引入 CSS 变量（`--sb-size` 等）：原样式取值简单且未与 T13 设计 token 对齐，过早抽象会与后续 T13 抽象二次返工，故保持字面量（与「⚠️ 排期约束」一致）。
- **验收结果**：`vite build` 成功；打包 CSS 由 68397B 降至 66625B（删除冗余白名单约 −1.7kB）；功能等价——主/子页面/弹窗/灯箱/播放列表滚动条视觉一致，三处例外容器仍无滚动条。
- **⚠️ 后续修正（2026-08-12 · C10）**：通配符方案在「viewport 根滚动条（html/body）」场景下失效——部分浏览器/系统下根滚动条无法被 `*::-webkit-scrollbar` 自定义颜色，导致相册/个人资料/视频等页面仍为系统默认灰滚动条，与成长历程弹窗（子容器、命中自定义规则）不一致。C10 将根滚动职责下放到 `#app-scroll` 内部容器解决，详见 C10。

### 🟡 C10 · 滚动条样式统一收口（以成长历程弹窗为基准）（FE，中，常规）（反馈 2026-08-12）
- **问题背景**：C09 交付后被用户浏览器验证发现「相册 / 个人资料 / 视频页」滚动条为系统默认灰，而「成长历程弹窗」为紫灰半透明细条，全站不统一。用户反馈「以成长历程弹窗滚动条为准」。
- **根因定位**：成长历程弹窗（`.growth-modal-body`）为**子容器滚动条**，命中 `*::-webkit-scrollbar` 自定义规则；而相册/个人资料/视频页滚动发生在 `html/body` 的 **viewport 根滚动条**，在部分浏览器/系统下根滚动条不接受 `::-webkit-scrollbar` 自定义颜色/宽度（走系统默认主题），通配符无法覆盖。
- **范围**：将根滚动职责从 `html/body` 下沉到 `App.vue` 内的 `#app-scroll` 内部容器，使全站滚动均为子容器滚动，`*::-webkit-scrollbar` 规则统一生效。
- **落点文件**：`web/src/App.vue`（新增 `#app-scroll` wrapper + 样式）、`web/src/styles/original.css`（`html, body { overflow: hidden }`；滚动条规则以弹窗样式为基准显式绑定 `html/body/.growth-modal-body/.collection-modal-body/.work-modal-body/.nav-playlist-body/*`）。
- **验收**：`vue-tsc -b` + `vite build` 通过；dev 截图确认相册页与成长历程弹窗滚动条均为紫灰半透明细条，视觉一致。
- **关联原则**：原则 1 双端一致、原则 6 简单优先。
- **⚠️ 实施要点**：
  1. `App.vue` 包裹 `<div id="app-scroll"><RouterView/></div>`，样式 `height:100vh/100dvh; overflow-y:auto; overflow-x:hidden; scroll-behavior:smooth`。
  2. `original.css` 设 `html, body { overflow: hidden; height: 100% }` 避免双滚动条；滚动条规则显式列出关键容器选择器（基准=弹窗 `rgba(255,255,255,.4)` 紫灰半透明），保留 `*` 通配符兜底。
  3. 经排查项目无 `window.scrollY/scrollTo` 依赖（仅 GrowthView 用 `el.scrollTop` 内部元素），下沉容器不破坏既有滚动逻辑。
  4. 初版曾尝试在 `original.css` 直接给 `html/body` 加显式 `::-webkit-scrollbar` 规则，但验证根滚动条仍走系统默认——最终确定为「根滚动职责下沉到内部容器」方案。

### 🟡 C11 · 播放器头像兜底反复切歌失效（FE，易，常规）（反馈 2026-08-12 · C02 增强）
- **问题背景**：C02 用全局 `Set` 记录「已回退 URL」防死循环；但 `:key="coverUrl"` 使 `<img>` 随切歌重建，且同一首歌（artist 推导图本不存在）首次 error 已记入 `Set`，再次切回时该 URL 已在 `Set` 中被 `return`，头像停在损坏态。
- **根因**：防死循环的"已回退"标志应绑定**当前 img 实例**，而非永久记录 URL。
- **范围**：将 `onCoverError` 的全局 `Set` 去重改为 `img.dataset.fallbackApplied` 实例标记。
- **落点文件**：`web/src/modules/user/components/NavPlayer.vue`（`onCoverError` 重写 + 移除 `fallbackApplied` `ref<Set>`）。
- **实现要点**：每次切歌 `:key="coverUrl"` 重建 `<img>`，`dataset` 自动重置；同一实例仅回退一次；`VA.png` 自身失败直接 `return` 防无限循环。
- **验收**：`vue-tsc -b` 0 错；`vite build` 通过；反复切换上一首/下一首/列表任意点击后头像均正确回退 `VA.png`，无损坏态。

### 🟡 C12 · 强制刷新偶发长时间加载（FE，易，常规）（反馈 2026-08-12 · C03 增强）
- **问题背景**：`PageLoading` 原固定 `TOTAL_DURATION=5000` 毫秒后隐藏遮罩，与数据加载无关；接口慢或首屏分包大时偶发白屏/长加载。
- **根因**：遮罩收起时机与数据就绪解耦，纯靠定时器。
- **范围**：遮罩改为监听 `store.loading` 由 `true→false`（数据加载完成）才收起，并保留最大超时兜底防接口卡死。
- **落点文件**：`web/src/shared/components/PageLoading.vue`（移除固定 `TOTAL_DURATION`，改为 `watch(store.loading)` + `MAX_DURATION=8000` 兜底；删除 `START_DELAY` 之外的无关常量按需保留）。
- **实现要点**：`App.vue` 顶层 `store.loadAll()` 已置 `loading=true`，`PageLoading` `onMounted` 时若已 `loading=false` 立即收起，否则 `watch` 待其完成；超时强制收起避免无限等待。
- **验收**：`vue-tsc -b` 0 错；`vite build` 通过；强制刷新场景中遮罩在数据就绪即消失，不再依赖固定 5 秒。

### 🟡 C13 · 全站暗色（黑底）主题配色（FE，中，常规）（新增变更需求 2026-08-12 · 需求登记 #2-1）
- **目标**：整体配色由"深色玻璃拟态"压暗为**黑底为主**的暗色系；导航栏 / NavPlayer 播放器 / 通用按钮 / 各类弹窗（合集 / 成长历程 / 视频 / 灯箱）配色同步刷新。
- **范围**：以 `web/src/styles/original.css` 的 `:root` token 源为唯一入口收敛主色 / 背景 / 玻璃拟态透明度；导航（`Layout.vue`）、播放器（`NavPlayer.vue`）、按钮、弹窗组件样式随 token 联动，避免散改类名。
- **与 T13 关系**：同属设计系统抽象，须**同批处理**避免二次返工（C09 亦已标记此约束）。建议借本次主题改造一并推进 T13 的 token 拆分（若用户授权）。
- **待确认（已确认 · 2026-08-12）**：黑底明度目标 = **深灰 `#0a0a0a`**（非近纯黑 `#000`）；主色紫 `rgba(138,43,226,...)` **保留为强调色**，随 token 收敛联动（见修改日志 #2 冲突解决方案 1）。
- **🎨 配色方案候选（备注 · 2026-08-12，实施前须最终确认）**：
  - **方案一 · 高级轻奢暗黑**（适用：潮牌商城、摄影展示、奢侈品、艺术网站）
    - 主背景 `#0D0D0D`｜卡片 `#1B1818`｜边框 `#2C2626`
    - 正文 `#F7F3F0`｜次要文字 `#A89F96`
    - 主色 `#D4AF37` 轻奢金｜警告/强调 `#E64C3C` 酒红
  - **方案二 · 暗调酒红氛围感**
    - 页面背景 `#120E10`｜卡片背景 `#1E181A`｜边框 `#33262A`
    - 正文 `#F0E8E9`｜辅助文字 `#A88F94`
    - 主点缀 `#A62C40` 酒红｜高亮 `#D85468` 浅酒红
  - **方案三 · 高级灰黑・人像摄影向**（适用：人像摄影展示）
    - 页面背景 `#0E0E10`｜图片卡片底色 `#1A1A1D`｜边框/分割 `#2A2A2F`
    - 正文 `#E8E8EB`｜辅助文字 `#9999A2`
    - 主题点缀 `#B8B8C8` 冷银灰｜强调标签 `#D1D1E0`
  - ⚠️ **与既有确认的关系**：此前已确认"深灰 `#0a0a0a` + 主色紫保留为强调色"（修改日志 #2 冲突解决方案 1）；上述候选方案背景明度与 `#0a0a0a` 接近，但**主色/强调色从紫改为金 / 酒红 / 薄荷蓝系，与既有确认冲突**，须由用户最终拍板后再实施。
- **关联原则**：原则 1 双端一致、原则 6 简单优先、原则 2 表现分离（token 化）。
- **验收**：全站（导航/播放器/按钮/弹窗/灯箱）视觉统一为黑底暗色系；双端一致；构建通过。

### 🟢 C14 · 砍掉留言页+弹幕页，整合为互动页（FE，收尾）（新增变更需求 2026-08-12 · 需求登记 #2-2）
- **目标**：将"UI 还原"版独立留言页（F1/F2/F3）与弹幕建议页（T17/G1）标记为"**当前 UI 复现版本暂不实现**"，后续整合为单一互动页（新建 Task **T21**）。
- **范围**：本轮仅**文档状态变更**（代码本就未实现）。更新 `tasks.md`：F 组、T17 状态由"顺延/待做"改为"UI 复现版本暂不实现，并入 T21 互动页"；互动页目标 = 粉丝留言 / 建议 / 趣味互动合一。
- **落点**：`docs/tasks.md`（F 组、T17、G 组说明已同步；任务清单新增 T21）；后续互动页落地时建 T21。
- **关联原则**：原则 4 保留页面（整合而非删功能）、原则 11 文档同步。
- **验收**：文档中 F1~F3、T17 标注为"UI 复现版本暂不实现"，且指向 T21 互动页；互动页目标清晰。

### 🟡 C15 · loading 场景化触发机制（FE，中，常规）（新增变更需求 2026-08-12 · 需求登记 #2-3）
- **目标**：loading 动画由"首屏固定遮罩"升级为**按场景触发**：① 强制刷新 ② 直接进入根路由 `/`（无具体页面名）③ 访问大数据量接口 ④ 加载大量图片/媒体文件。
- **范围**：
  - 触发识别：向 `PageLoading` 组件传参（如 `variant`/`reason`）或扩展 `store.loading` 增加"loading 类型/原因"维度，区分"首屏骨架"与"局部加载"。
  - 场景映射：`/` 根路由进入 → 首屏 loading；`store.loadAll` 大数据接口 → loading；WorksView 瀑布流大量图片 → 组件级上报进度（可能用局部 loading 而非全屏遮罩）。
- **与 C12 关系**：C12 已改遮罩为"监听 `store.loading` 数据就绪收起"；本项在此基础上增加场景维度，属 store 状态扩展。
- **待确认（已确认 · 2026-08-12）**：全局遮罩与局部进度条**两种方案都做**，按场景分别呈现——强刷 / 根路由 `/` / 大数据接口用**全局遮罩**；大量图片/媒体加载用**局部进度条**。最终保留哪版由执行人后续确定（见修改日志 #2 冲突解决方案 3）。
- **关联原则**：原则 10 错误/加载态、T18 降级。
- **验收**：上述 4 类场景 loading 正确显示/消失；非触发场景不误弹遮罩；构建通过。

### 🟡 C16 · 第三方登录页/弹窗（FE，中，常规）（新增变更需求 2026-08-12 · 需求登记 #2-4）
- **目标**：新增第三方登录页或弹窗，记录登录信息（粉丝身份标识），为后续"按粉丝身份数据过滤"铺路。
- **范围**：当前仅做**前端骨架 + 登录态记录**（localStorage / Pinia），不接真实后端鉴权；弹窗挂载于播放器常驻区（G5/T16 常驻区）或独立路由。
- **⚠️ 安全边界**：前端记录**绝不作为安全边界**，真实鉴权须后端兜底（原则 3）；文档须明示"仅记录、不鉴权"。
- **待确认（已确认 · 2026-08-12）**：第三方提供方定为**抖音**（见修改日志 #2 冲突解决方案 4）；前端仅记录登录态，绝不作为安全边界（原则 3 后端兜底）。
- **关联原则**：原则 3 单向依赖（后端兜底）、原则 2 数据分离。
- **验收**：登录弹窗可唤起、登录态可记录与读取；双端一致；构建通过（真实鉴权待后端就绪）。

### 🟢 C17 · 首页路由可切换规划（FE，收尾）（新增变更需求 2026-08-12 · 需求登记 #2-5）
- **目标**：当前首页 `/` 指向素材库（GalleryView）；后续可能改为相册页（WorksView）。预先规划，避免硬编码"首页=素材库"。
- **范围**：
  - 路由别名兼容：`/gallery` 与 `/` 可并存或重定向，避免旧书签失效。
  - 文件/组件命名解耦：不依赖"首页即素材库"的隐含约定。
  - Layout 高亮默认态、manualChunks 首屏分包随首页目标联动。
- **落点**：`web/src/router/index.ts`、`Layout.vue`、相关 import。
- **关联原则**：原则 4 保留页面、原则 7 不污染。
- **验收**：切换首页目标时仅需改路由映射 + 默认高亮，无散落硬编码；旧路由别名可访问。

### 🟡 C18 · 相册页横图封面兼容（FE，中，常规）（新增变更需求 2026-08-12 · 需求登记 #2-6）
- **目标**：相册页（WorksView）当前封面多为竖图，兼容部分横图封面的样式（等比裁切 / 不同 `aspect-ratio` / 网格占位防错位）。
- **范围**：B 组瀑布流（Grid + JS Masonry）已 4 列填满；横图需调整卡片 `aspect-ratio` 与 Masonry 测高逻辑，避免留白/错位。
- **落点**：`web/src/modules/user/views/WorksView.vue` + `original.css` 相关类。
- **关联原则**：原则 4 保留页面、双端一致。
- **验收**：竖图/横图混合封面网格无错位、无破图；双端一致；构建通过。

### 🟢 C19 · 个人资料头像固定不旋转（FE，收尾）（新增变更需求 2026-08-12 · 需求登记 #2-7）
- **目标**：个人资料页（ProfileView）头像当前有旋转动画，改为固定不旋转（保留其他悬浮态）。
- **范围**：移除/禁用 avatar 旋转关键帧，确认不误删其他 avatar 样式。
- **落点**：`web/src/modules/user/views/ProfileView.vue` 或 `original.css` 的 `.profile-avatar` 旋转动画。
- **关联原则**：原则 6 简单优先。
- **验收**：头像静止无旋转；其他悬浮态保留；双端一致；构建通过。
- **实施记录（2026-08-12）**：已实施。移除 `web/src/styles/original.css` 中 `.profile-avatar-ring` 的 `animation: avatarRingRotate ...` 引用及 `@keyframes avatarRingRotate` 块，头像固定展示，保留渐变描边环；`vue-tsc` 类型检查通过。

### 🟡 C20 · 音乐播放器初次进入 3 秒自动播放（FE，中，常规）（新增变更需求 2026-08-12 · 需求登记 #2-8）
- **目标**：NavPlayer 增加"初次进入页面 3 秒后自动播放音乐"。
- **范围**：`web/src/modules/user/components/NavPlayer.vue` + 播放器 store；`localStorage` 记"已自动播放过"防重复触发。
- **⚠️ 浏览器 autoplay 策略（已确认 · 2026-08-12）**：采用"**静音起播 + 3 秒延迟 + localStorage 去重**"方案（见修改日志 #2 冲突解决方案 5），规避 Chrome/Safari 无交互禁播限制。
- **关联原则**：原则 10 体验、T16。
- **验收**：初次进入 3 秒后自动起播（策略允许下）；重复进入不重复触发；双端一致；构建通过。

---

### 🟢 C21 · 素材页副标题与标签行间距（FE，收尾）（问题反馈 2026-08-12 · UI-1）
- **目标**：`GalleryView.vue` 副标题"珍藏每一个闪耀瞬间"（`.page-subtitle`）与下方标签行（`.library-filters`）拉开间距。
- **范围**：在 `.page-subtitle` 增加 `margin-bottom`，或在 `.page-header` 与 `.library-filters` 间补间距（建议 `margin-bottom: 1.5–2rem`）。
- **落点**：`web/src/modules/user/views/GalleryView.vue` + `web/src/styles/original.css` 的 `.page-subtitle` / `.library-filters`。
- **关联原则**：原则 1 双端一致、原则 6 简单优先。
- **验收**：副标题与标签行有明显垂直间距；双端一致；构建通过。
- **实施记录（2026-08-12）**：已实施。`original.css` 全局 `.page-subtitle` 增加 `margin-bottom: 28px`，素材页副标题与 `.library-filters` 标签行留距生效（视频页/相册页同款统一）；`vue-tsc` 类型检查通过。

### 🟢 C22 · 相册副标题与列表间距（FE，收尾）（问题反馈 2026-08-12 · UI-2）
- **目标**：`WorksView.vue` 副标题"每一个画面都是用心之作"（`.page-subtitle`）与相册列表（`.library-grid` / 卡片区）拉开间距。
- **范围**：在 `.page-header` 与列表容器间补间距（与 C21 同款处理，建议统一 token）。
- **落点**：`web/src/modules/user/views/WorksView.vue` + `web/src/styles/original.css`。
- **关联原则**：原则 1 双端一致、原则 6 简单优先。
- **验收**：副标题与列表有明显垂直间距；与 C21 视觉一致；构建通过。
- **实施记录（2026-08-12）**：已实施。与 C21 同批，同款 `margin-bottom: 28px` 生效，相册副标题与 `.album-grid` 列表留距；`vue-tsc` 类型检查通过。

### 🟡 C23 · 个人资料页多重面板嵌套优化（FE，中，常规）（问题反馈 2026-08-12 · UI-3）
- **目标**：`ProfileView.vue` 右侧 `.profile-right` 内"个人档案"/"个人简介"/"生日倒计时"三块各自独立面板叠加，视觉多重嵌套；优化为更扁平的结构。
- **范围**：合并同级卡片为统一容器或减少冗余边框/阴影，改为单列卡片流降低嵌套层级；保留三块信息完整。
- **落点**：`web/src/modules/user/views/ProfileView.vue` + `web/src/styles/original.css` 的 `.profile-info-panel` / `.profile-bio-card` / `.profile-birthday-section`。
- **关联原则**：原则 1 双端一致、原则 6 简单优先、原则 2 表现分离。
- **验收**：三块信息视觉扁平无冗余嵌套；双端一致；构建通过。

### 🟡 C24 · 视频页切换专辑不切换播放项（FE，中，常规）（问题反馈 2026-08-12 · UI-4）
- **目标**：视频页切换专辑（`.library-filters` / 专辑切换）时**仅切换列表**，播放项保持当前；待用户实际点击专辑内某视频才切换播放。
- **范围**：调整专辑切换 handler，移除切换专辑时联动播放器 `change`/自动播放的逻辑；播放项切换仅由"点击具体视频"触发。
- **落点**：视频页组件（`web/src/modules/user/views/VideoView.vue` 或相关）+ 播放器 store。
- **关联原则**：原则 10 体验、T16。
- **验收**：切换专辑不中断当前播放；点击专辑内视频才切换播放项；构建通过（需确认当前视频页组件名与播放器绑定方式）。

### 🟡 C25 · 成长历程弹窗大屏/小屏响应式间距优化（FE，中，常规）（问题反馈 2026-08-12 · UI-5）
- **目标**：成长历程弹窗（`.growth-modal` / `.growth-modal-body`）响应式间距优化。
- **范围**：
  - 大屏（`min-width` 断点）：`margin-top` 增大、`margin-bottom` 减小，弹窗上移、底部更贴边。
  - 小屏：弹窗整体 `height` / `max-height` 增大，减少内部空白。
- **落点**：`web/src/styles/original.css` 弹窗相关媒体查询。
- **关联原则**：原则 1 双端一致、原则 6 简单优先。
- **验收**：大屏弹窗上移贴边、小屏弹窗饱满无过多空白；构建通过。

### 🟢 C26 · "小猫摇头"视频 orientation 误标修正（FE，收尾）（问题反馈 2026-08-12 · 数据-1）
- **目标**：Mock 数据 `v4`（title: '小猫摇头'）的 `orientation` 被误标为 `'landscape'`，实际竖屏，应改为 `'portrait'`。
- **范围**：`web/src/mock/index.ts` 第 86 行 `v4.orientation: 'landscape'` → `'portrait'`。播放器按 `orientation` 决定横/竖屏布局，修正后按竖屏渲染。
- **⚠️ 后端就绪后**：若数据源切换为真实接口（T07），须同步核对接口返回的 `orientation` 字段（原则 3 后端兜底）。
- **落点**：`web/src/mock/index.ts`。
- **关联原则**：原则 3 后端兜底、原则 2 数据分离。
- **验收**："小猫摇头"按竖屏布局播放；其余视频 orientation 不受影响；构建通过。
- **实施记录（2026-08-12）**：已实施。`web/src/mock/index.ts` `v4.orientation: 'landscape'` → `'portrait'`，播放器将按竖屏渲染；`vue-tsc` 类型检查通过。

---

> 以上 C01–C09 为「需求登记 #1」的拆分结果（C08/C09 为 2026-08-10 补充并入子项 1），均处于 🔲 待排期状态。
> 用户 2026-08-10 明确本轮**仅登记与拆分，暂不开发**。开发启动前须再次确认排期。
> C21–C26 为「问题反馈 #1」拆分（2026-08-12）：C21/C22/C26 已实施 ✅（2026-08-12，批次一），C23/C24/C25 仍 🔲 待排期。
