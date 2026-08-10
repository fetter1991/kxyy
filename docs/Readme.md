# 开心元元个人粉丝站（kxyy）

> 偶像「开心元元」的**非官方**个人粉丝站 · 纯静态 · 原生 HTML/CSS/JS · 无构建工具、无后端、PC / 移动端自适应。
>
> ⚠️ 本项目已启动重构（目标：Vue 三端分离）。本文件描述**现状**；目标架构与技术栈落地见 [`constitution.md`](constitution.md)（其第七章已并入技术方案），任务拆解见 [`tasks.md`](tasks.md)。

[![类型](https://img.shields.io/badge/type-static%20site-blue)](#)
[![技术栈](https://img.shields.io/badge/stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-orange)](#)
[![License](https://img.shields.io/badge/license-mit-green)](#)

---

## 📖 目录

- [一、整体规划](#一整体规划)
- [二、快速开始](#二快速开始)
- [三、项目结构](#三项目结构)
- [四、页面与功能逻辑](#四页面与功能逻辑)
- [五、数据层与资源](#五数据层与资源)
- [六、编码规范](#六编码规范)
- [七、待实现功能点](#七待实现功能点)
- [八、现存问题与风险](#八现存问题与风险)
- [九、文档导航](#九文档导航)
- [十、重构需求与目标](#十重构需求与目标)
- [十一、数据契约（API Contract）](#十一数据契约api-contract)

---

## 一、整体规划

### 1.1 项目定位

| 项 | 说明 |
|----|------|
| 目标用户 | 偶像「开心元元」的粉丝群体，以**手机端访问为主** |
| 内容形态 | 相册图集、视频播放、成长历程、个人资料、粉丝留言 |
| 部署形态 | 纯静态资源，可托管于任意静态服务器 / GitHub Pages / OSS |
| 核心约束 | **PC 大屏 与 手机小屏 两种模式必须同时兼顾**（全局硬性要求） |

### 1.2 设计原则

> ⚠️ **双端覆盖是验收底线**：任何 BUG 定位、功能/样式/交互改动，都须分别在大屏（桌面）与小屏（移动视口）复现、验证，两端均通过才算完成。

- **原生优先**：不引入框架与构建链，降低维护与托管成本。
- **资源集中**：所有资源统一收纳于 `assets/`，按类型分层（css/js/img/music/video）。
- **数据硬编码 + 浏览器持久化**：站内数据写死在 `data.js`，留言通过 `localStorage` 持久化。
- **最小改动**：编码遵循「简单优先、精准改动、目标驱动」（见 [`开发规范.md`](开发规范.md)）。

### 1.3 技术栈

- **前端**：HTML5 + CSS3 + 原生 JavaScript（ES5 严格模式 `'use strict'`，部分模块用 IIFE 封装）
- **路由**：首页单页切换显隐（`index.html`）+ 子页面整页跳转（`nav-switch.js` AJAX 注入 HTML）
- **样式**：单一全局 `assets/css/style.css`，主题色用 `:root` CSS 变量管理
- **无依赖**：当前无 npm 依赖、无打包步骤（后续若引入 JSZip 等需评估）

---

## 二、快速开始

### 2.1 本地预览（推荐）

因 `localStorage` 与 AJAX 在 `file://` 协议下受限，**建议用本地静态服务器**：

```bash
# 进入项目根目录
cd kxyy

# Python 3
python -m http.server 8000

# 或 Node
npx serve .
```

浏览器访问 `http://localhost:8000`。

### 2.2 直接打开

双击 `index.html` 亦可运行（部分功能因协议限制可能受限）。

---

## 三、项目结构

```
kxyy/
├── index.html              # 首页「素材库」（单页切换式导航）
├── pages/                  # 独立子页面（整页跳转）
│   ├── album.html          # 相册（导航第 1 项，原 works.html）
│   ├── video.html          # 视频播放（原 music.html）
│   ├── growth.html         # 成长历程
│   ├── profile.html        # 个人资料
│   └── message.html        # 留言册
├── assets/                 # 资源总目录
│   ├── css/
│   │   └── style.css       # 全局样式
│   ├── js/                 # 功能脚本（14 个模块，见下表）
│   ├── img/
│   │   ├── global/         # logo / bg / loading / favicon / feather / pattern
│   │   ├── works/          # 作品 / 相册图（00~21.jpg）
│   │   ├── growth/         # 成长历程图（当前复用 works，目录预留）
│   │   └── avatar/         # 歌手 / 作者头像
│   ├── video/              # 视频资源
│   └── music/              # 音频资源（.mp3 / .aac）
├── docs/                   # 规范 / 日志 / 需求文档 / 宪法
├── .editorconfig           # 编辑器风格统一
└── .gitignore              # 忽略大体积资源与临时文件
```

### 3.1 脚本模块职责

| 文件 | 职责 |
|------|------|
| `data.js` | 数据源：图片 `galleryData`、音乐 `musicData`、视频 `videoAlbums`、作品 `worksData`、留言 `commentData` |
| `main.js` | 首页核心逻辑（导航、画廊、灯箱、音乐播放器、成长/作品/留言渲染） |
| `nav-player.js` | 导航栏常驻音频播放器（独立功能）+ 播放列表 |
| `nav-switch.js` | 子页面 AJAX 拉取整页 HTML 并注入 `<main>`，维护 `PAGE_MAP` / `INIT_MAP` |
| `gallery.js` | 首页「素材库」入口（`initGallery`），图集渲染 |
| `video.js` | 视频页（`initVideo`），专辑 Tab + 分页/滚动加载 |
| `album.js` | 相册页（`initAlbum`），网格 + 灯箱 |
| `growth.js` | 成长历程（`initGrowth`），时间轴 + 滚动吸附 |
| `profile.js` | 个人资料（`initProfile`），头像 + 倒计时 + 外链 |
| `message.js` / `comment.js` | 留言册（`initMessage`），`localStorage` 持久化 + XSS 转义 |
| `common-ui.js` | 公共 UI（回到顶部、灯箱、Esc 关闭等） |
| `loading.js` | 加载遮罩与打字机动画 |
| `feathers.js` | 装饰性羽毛飘落动画（requestAnimationFrame） |

---

## 四、页面与功能逻辑

> 导航顺序：**相册 → 素材库（首页）→ 个人资料 → 视频 → 成长历程 → 留言**

| 页面 | 入口 | 核心功能 | 交互要点 |
|------|------|---------|---------|
| **首页 · 素材库** | `index.html` / `gallery.js` | 图集筛选展示、灯箱预览 | 顶部分类 Tab 筛选；点击图片开灯箱；单页切换式导航 |
| **相册** | `pages/album.html` / `album.js` | 作品网格（≥1024px 每行 4 个，统一高度） | 封面按真实宽高比显示（圆角 10px、`object-position: top`）；点击开灯箱看大图 |
| **视频** | `pages/video.html` / `video.js` | 视频播放 + 专辑 Tab + 列表 | 专辑 Tab 切换（作品集/日常记录/国风写真）；PC 数字分页（每页 8）、小屏滚动加载「加载更多」；横竖屏自动适配（`.orientation-landscape/portrait`）；进度条可点击 seek |
| **个人资料** | `pages/profile.html` / `profile.js` | 头像、简介、抖音外链、直播倒计时 | 头像固定 `works/00.jpg`；按钮跳转抖音主页/直播间；倒计时 |
| **成长历程** | `pages/growth.html` / `growth.js` | 时间轴时间线 + 全屏滚动 | `scroll-snap` 吸附对齐（大屏/手机均生效）；时间线节点 + 弹窗查看 |
| **留言册** | `pages/message.html` / `message.js` | 粉丝留言发布与展示 | 数据存 `localStorage`；渲染做 `escapeHtml` 防 XSS；自定义滚动条 |

### 4.1 关键技术约定

- **双播放器架构**：`main.js`（页面内视频播放器）与 `nav-player.js`（导航栏常驻音频播放器）为两套独立实现，涉及播放器需求须明确指定哪一侧。
- **SPA 注入**：`nav-switch.js` 拉取整页 HTML 注入 `<main>`；业务 JS 暴露 `window.initXxx`，由导航切换后显式调用（详见[现存问题 P1](#现存问题与风险)）。
- **横竖屏适配**：`loadTrack()` 根据数据切换 `.orientation-landscape`(16:9) / `.orientation-portrait`(9:16)。

---

## 五、数据层与资源

### 5.1 数据源（`assets/js/data.js`）

| 变量 | 用途 | 说明 |
|------|------|------|
| `galleryData` | 首页素材库图集 | 含 `url` / `title` / `category` 等 |
| `musicData` | 导航栏音频播放器 | 含 `audioUrl` / `avatar`；头像兜底 `VA.png` |
| `videoAlbums` | 视频页（分专辑） | `[{ name, videos:[...] }]`，已去 `artist`、加 `desc` |
| `worksData` | 相册数据 | ⚠️ 变量名与页面「相册」语义不一致（历史包袱，建议改 `albumData`） |
| `commentData` | 留言册初始数据 | 实际以 `localStorage` 为准 |

### 5.2 资源目录约定

- 图片：`global/`（全局）、`works/`（作品）、`growth/`（成长，复用 works）、`avatar/`（头像）
- 媒体：视频 `assets/video/`、音频 `assets/music/`（注意 `data.js` 路径前缀：首页 `assets/...`、子页 `../assets/...`）
- 头像缺失时由 `nav-player.js` 的 `normalizeAvatarPath()` 回退至 `VA.png`

### 5.3 外部链接（个人资料页）

| 类型 | 地址 |
|------|------|
| 抖音主页 | `https://www.douyin.com/user/MS4wLjABAAAAnx...` |
| 直播间 | `https://live.douyin.com/KXyy12345678` |

> ⚠️ 第三方链接可能随平台策略失效，需定期核对更新。

---

## 六、编码规范

完整准则见 [`开发规范.md`](开发规范.md)，要点：

1. **动手前先思考** —— 不臆测、主动暴露权衡、不确定就提问。
2. **简单优先** —— 最小代码量解决问题，不做推测性功能与过度抽象。
3. **精准改动** —— 只动必要部分，匹配现有风格，不"顺手改进"无关代码。
4. **目标驱动** —— 把任务转成可验证目标，循环验证直到达成。

### 项目约定补充

- 脚本统一 `'use strict'`，全局变量集中放 `data.js`，业务模块用 IIFE 或显式 `window.initXxx` 暴露。
- 图片普遍 `loading="lazy"`；关键交互带 `aria-label`，弹窗支持 `Esc` 关闭、键盘左右切换。
- 动态 HTML 拼接须做转义（`escapeHtml`），避免 XSS。
- 样式用 `:root` 变量管理主题色，区块用 `/* ===== 标题 ===== */` 注释分隔。
- 提交前建议用 Prettier + ESLint 保证风格一致；`.editorconfig` 统一缩进。

### 架构改进方向（详见 [第十章 · 重构需求](#十重构需求与目标)）

| 优先级 | 方向 |
|--------|------|
| 🔴 高 | 去重 + 模块化（灯箱/播放器/loading 抽独立模块，消除 `main.js` 巨型文件与复制粘贴） |
| 🔴 高 | 统一路由架构（消除「单页切换」与「整页跳转」两套机制并存） |
| 🟡 中 | 数据解耦（媒体 URL 独立管理，语义化图片命名） |
| 🟢 低 | 文档归档与工程配置（`.editorconfig`、`.gitignore`、校验链） |

---

## 七、待实现功能点

> 状态：✅ 已实现 ｜ 🔶 部分/待验证 ｜ ⬜ 未实现 ｜ ❓ 待确认

### 7.1 功能新增

| # | 功能 | 状态 | 说明 |
|---|------|------|------|
| G1 | 「建议」弹幕页（右→左滚动 + 点赞数） | ⬜ | 需新建 `pages/suggest.html` + 弹幕动画 |
| G3 | 素材库保留顶部分类 Tab | ⬜ | 筛选维度按"合集" |
| G4 | 素材卡片 16:9、每行 4 张合集 | ⬜ | `galleryData` 重组为合集结构 |
| G5 | 素材合集弹窗（大图 + 标题/作者/列表/说明/打包下载） | ⬜ | 引入 JSZip 打包下载 |
| A3/A4 | 相册封面点击改平铺瀑布流（保留灯箱） | ⬜ | `album.js` 去弹窗、当前页展开 |
| D1 | videoData 按 `video/` 文件夹自动生成 | ⬜ | 需自动化脚本 |
| D2 | 横竖屏标识自动化（文件名/metadata） | ⬜ | 替代手动标注 |

### 7.2 待确认 / 历史需求

| # | 项 | 状态 |
|---|----|------|
| H2 | 相册日期 + 标题搜索 | ❓ 未见明确 UI |
| H9 | 视频无声 / 显示不完整 | ❓ 需实机验证 |
| H10 | 成长历程滚轮自动加载下一页 | ❓ `scroll-snap` 行为待确认 |
| A2 | 封面强制 9:16 | 🔶 已改为按真实宽高比，是否强制待核对 |
| D4 | 清理 `musicData.type` | 🔶 暂缓（main.js 依赖） |

---

## 八、现存问题与风险

### 8.1 已确认 BUG（待修复）

| # | 描述 | 位置 | 状态 |
|---|------|------|------|
| B3 | 导航播放器展开列表入口不明显 | `nav-player.js` | 🐛 待修复（大/小屏） |
| B4 | 播放列表宽度未跟随播放器 | `nav-player.js` | 🐛 待修复（大/小屏） |
| B5 | 小屏播放器未显示歌手与歌名 | `nav-player.js` 小屏布局 | 🐛 待修复 |

> B1（列表选中态）、B2（进度条 seek）已修复。

### 8.2 代码审查风险

> 完整 P0~P3 风险清单已并入 [`项目说明书.md`](项目说明书.md) §六（遗留问题）。以下为等级摘要（冲突裁决与详细建议以项目说明书为准）。

| 等级 | 数量 | 关键项 |
|------|------|--------|
| **P0** | 2 | ① 动态 HTML 拼接存在 XSS 风险（建议新增 `dom-util.js` 统一转义）② `data.js` 缺失会导致全站白屏 —— **⚠️ 注意事项**：审查时 `data.js` 曾被判定缺失，但当前 `assets/js/data.js` 实际存在；该条已过时，仅作历史记录保留 |
| **P1** | 4 | SPA 切换事件监听/定时器泄漏；`innerHTML` 注入后子页 `<script>` 不执行；双播放器互斥靠隐式契约；`loading.js` 硬编码 5 秒遮罩 |
| **P2** | 4 | 模块级可变状态污染；`nav-switch.js` 缺并发/缓存/错误态；视频页 `playingIndex` 索引语义错乱；倒计时未 `clearInterval` |
| **P3** | 6 | 可维护性/性能/安全打磨（CSP、SRI、错误上报、`defer`、feathers 可见性暂停等） |

### 8.3 技术债

1. 各页面 `head` / 导航 / loading 遮罩复制粘贴，缺公共模板。
2. `main.js` 与 `gallery.js` / `video.js` 重复实现灯箱、画廊渲染。
3. 媒体 URL 与类型耦合（`avatar` 引用 `galleryData[0].url`）。
4. `worksData` 语义漂移（页面叫相册，变量叫 works），建议统一 `albumData`。
5. 导航顺序与命名曾经历重命名（v1.1.7），部分文档仍引用旧名（旧需求原稿已并入 [`项目说明书.md`](项目说明书.md)，旧名对照见其历史背景小节）。

---

## 九、文档导航

| 文档 | 内容 |
|------|------|
| [`Readme.md`](Readme.md) | 本文档：站点现状说明（规划 / 结构 / 功能 / 规范 / 待办 / 问题）+ 重构需求（第十章）+ 数据契约（第十一章） |
| [`constitution.md`](constitution.md) | 重构核心原则（宪法，最高优先级） |
| [`constitution.md`](constitution.md) §七 | 开发人员初步技术方案（技术栈落地，`技术方案.md` 内容已全文并入本章） |
| [`tasks.md`](tasks.md) | 重构任务拆解与人员分配 |
| [`开发规范.md`](开发规范.md) | 编码行为准则（精简版，源自 Claude.md） |
| [`项目说明书.md`](项目说明书.md) | 旧项目说明书：旧页面功能/交互图谱/拓扑/遗留问题（整合自原需求说明、页面描述、pages 图谱、CodeReview） |
| [`修改日志.md`](修改日志.md) | 版本迭代记录（v1.1.0 ~ v1.1.7） |

> 📌 **文档整合说明**：
> - `Refactoring.md`、`api-contract.md` 已删除，内容**全文并入本文件**第十章、第十一章。
> - [`需求说明.md`](需求说明.md)、[`suggest.md`](suggest.md)、[`页面描述.md`](页面描述.md)、[`pages.md`](pages.md) 已删除，内容分别并入 [`项目说明书.md`](项目说明书.md) 或本文第十章（架构改进建议表）。
> - [`CodeReview.md`](CodeReview.md) 已清空，其 P0~P3 风险清单已并入 [`项目说明书.md`](项目说明书.md) §六（遗留问题），本文 §8.2 仍保留风险等级摘要。

---

<p align="center">本站为非官方粉丝向项目，与偶像本人及经纪公司无隶属关系。</p>

---

## 十、重构需求与目标

> 本章为重构需求与目标设想，与本文 §1.3 / §4.1 / §8.2 的**现状描述**并行不悖：前者是"为什么重构 / 想达成什么"，后者是"现在已经做成什么样"。相关内容亦并入 [`项目说明书.md`](项目说明书.md)。

### 10.1 重构目标

1. 重构为 Vue 页面，实现页面跳转、数据展示、页面交互等功能。
2. 保留现有页面内容，实现**页面渲染与数据获取分离**（对应 `constitution.md` 原则 2）。
3. 实现**管理端**，用于替换 `data.js` 的存 JS/JSON 形式数据获取。
4. 实现**接口端**，用于获取管理端录入的数据，并提供接口供用户端调用。

### 10.2 初步设想结构（架构三端）

> 区分说明：**业务双端（PC / 移动）**是现状验收底线（§1.2）；**架构三端（用户端 / 管理端 / 接口端）**是重构目标拆分，二者正交、不冲突。

| 端 | 职责 | 现状状态 |
|----|------|---------|
| **用户端** | 展示数据、实现交互（当前 `index.html` + `pages/` 下页面） | ✅ 已存在（原生静态站） |
| **管理端** | 数据管理界面、简单录入功能，替换 `data.js` 的存 JS/JSON 形式数据获取 | ⬜ 当前没有 |
| **接口端** | 获取管理端录入的数据，并提供接口供用户端调用 | ⬜ 当前没有 |

> 📌 重构背景知识：本文档（Readme）、`constitution.md`、`开发规范.md` 共同作为后续 AI 解析与代码生成的"背景知识"，确保产出不偏离大方向。

### 10.3 重构动机（源自现状痛点）

> 以下痛点直接驱动了 §10.1 / §10.2 的重构目标，亦对应 [`项目说明书.md`](项目说明书.md) §六遗留问题。

- **SPA 切页缺陷（P1）**：`nav-switch.js` 设计意图为无刷新切页（AJAX 注入 `<main>` + 显式调用 `window.initXxx`），但 `gallery/profile/growth/message.js` **未暴露 `window.initXxx`**，导致切到相册/成长/资料/留言页时交互脚本不执行、功能失效。这是"统一路由架构"（§六 架构改进方向 🔴 高）的核心动因之一。
- **重复与巨型文件**：`main.js` 超 1000 行集所有逻辑于一体，与 `gallery.js / video.js / album.js` 大量重复（灯箱、渲染两处定义）；各页面 `head`/导航/loading 复制粘贴。
- **全局污染**：未包裹的全局变量（如 `lightbox`、`workModal`）在 `main.js` 与 `gallery.js` 重复声明，依赖脚本加载顺序。
- **脆弱时序**：`setTimeout(hidePageLoading, 5000)` 用固定 5 秒掩盖真实加载；多段 `setTimeout(trySetScrollLeft)` 补偿布局。
- **数据管理混乱**：图片顺序编号语义缺失；`avatar` 引用 `galleryData[0].url` 隐式耦合；`马马嘟嘟骑` 的 `audioUrl` 误指向 `video/`。

### 10.4 附录 · 架构改进建议

> 以下为重构前的现状痛点与改进方向，作为 `constitution.md` 架构约束（原则 2/3/8、技术债）的补充依据。2026-08-05 文档整理时由 `suggest.md` 并入（原 `suggest.md` 已删除）。

#### 一、现状痛点
- **重复与巨型文件**：`main.js` 超 1000 行集所有逻辑于一体，与 `gallery.js / video.js / album.js` 大量重复（灯箱、渲染两处定义）；各页面 `head`/导航/loading 复制粘贴。
- **全局污染**：未包裹的全局变量（如 `lightbox`、`workModal`）在 `main.js` 与 `gallery.js` 重复声明，依赖脚本加载顺序。
- **路由不一致**：首页"单页切换"与 `pages/`"整页跳转 + AJAX 注入"两套机制并存；`switchPage()` 中 `pageName === 'ihan'` 为魔法字符串残留。
- **脆弱时序**：`setTimeout(hidePageLoading, 5000)` 用固定 5 秒掩盖真实加载；`centerTimelinePoint` 硬编码 `pointWidth=100` 等数值；多段 `setTimeout(trySetScrollLeft)` 补偿布局。
- **数据管理混乱**：图片顺序编号语义缺失；`avatar` 引用 `galleryData[0].url` 隐式耦合；`马马嘟嘟骑` 的 `audioUrl` 误指向 `video/`。
- **命名/归档**：`video.zip` 置根目录、`Claude.md`/`开发规范.md`/`suggest.md` 与源码混放（已随文档整理移入 `docs/`）。

#### 二、改进方向（与宪法对齐）
| 优先级 | 方向 | 对应宪法 |
|--------|------|----------|
| 🔴 高 | 去重 + 模块化（灯箱/播放器/loading 抽独立模块，消除 `main.js` 巨型文件） | 技术债 1/2、原则 7 |
| 🔴 高 | 统一路由架构（消除"单页切换"与"整页跳转"并存，消除魔法字符串） | 原则 8、Readme 技术债 🔴 |
| 🟡 中 | 数据解耦（媒体 URL 独立管理，语义化图片命名，修正错误归类） | 原则 2、技术债 3 |
| 🟢 低 | 工程配置（`.editorconfig`、`.gitignore`、Prettier+ESLint 校验链） | 原则 10 |

> 以上建议遵循「最小改动、精准改动」原则，在现有结构基础上小步重构，避免一次性大规模重写导致回归。具体技术栈落地见 `constitution.md` 第七章。

---

## 十一、数据契约（API Contract）

> 本章为 T02 数据契约定义（接口前置依赖）。与本文 §5 数据层（现状 `data.js` 硬编码）互补：§5 描述"现在数据怎么存"，本章描述"重构后前后端怎么约定"。

**宪法依据**：原则 2（渲染与数据分离）、原则 3（三端单向依赖）、原则 5（先思考）、7.2（前后端分离）。
**来源**：`assets/js/data.js` 现有数据集（`galleryData` / `musicData` / `videoAlbums` / `worksData` / `messageData` / `growthData` + `galleryImages` 扁平索引）。
**地位**：前后端并行的"口头契约"唯一真相。T03/T06/T09 及 Mock 均须对齐本契约；字段语义与现状保持一致（原则 2）。**修改须双方评审**，并更新版本号。

### 11.0 通用约定

#### 0.1 媒体 URL 策略（呼应 T04）
- 契约中所有图片/音频/视频字段只返回 **URL 字符串**，前端仅消费 URL，不感知 `assets/` 物理路径（原则 2、7.2）。
- 过渡期：接口端可返回相对/绝对 `assets/*` 路径（与现状 `../assets/img/works/00.jpg` 等价）；接口持久化后统一为 `/media/*`（T04/T19）。
- URL 拼接逻辑集中在 service 层，组件无感（T06）。

#### 0.2 统一响应信封（Envelope）
所有 `GET /api/*` 列表/详情端点返回统一结构，便于前端统一处理 loading/error（原则 10 P2）：

```jsonc
// 成功
{ "code": 0, "message": "ok", "data": <任意模型或数组> }
// 失败（含 4xx/5xx）
{ "code": 404, "message": "资源不存在", "data": null }
```

> **设计说明**：`code=0` 表示业务成功，HTTP 状态码仍保留（200/404/500）。前端统一拦截 `code !== 0` 进入错误态（T18 降级 UI 基础）。

#### 0.3 时间字段
- `createdAt` / `time` / `date` 统一为 **ISO 8601 字符串**（`YYYY-MM-DD` 或 `YYYY-MM-DDTHH:mm:ssZ`）。
- 现状 `data.js` 中 `time: "2026-06-20"`、`date: "2025/12/28"` 在接口端归一化为 `YYYY-MM-DD`，避免前端多格式解析（原则 6 简单优先）。

#### 0.4 错误态约定（原则 10 P0）
- `404`：资源/列表为空 → 返回 `code=404` + 友好 message，前端禁止整页白屏（T18）。
- `500`：服务端异常 → 返回 `code=500`，前端展示降级提示。
- 字段校验失败（Pydantic）→ `422` + 字段级错误（7.3）。

### 11.1 数据模型（OpenAPI Schema 草案）

> 字段命名采用 **camelCase**（前端 JSON 约定）；接口端用 Pydantic 模型，序列化输出 camelCase（7.3）。`?` 表示可选字段；重构需要但现状未出现的字段，标注 **[新增]**。

#### 11.1.1 GalleryItem（素材合集 / G3/G4/G5）
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

#### 11.1.2 AlbumItem（作品 / 相册，统一 worksData）
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

#### 11.1.3 VideoAlbum（视频专辑）+ VideoItem
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

#### 11.1.4 MusicTrack（音乐 / 常驻音频播放器）
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

#### 11.1.5 Message（留言 / XSS 红线）
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

#### 11.1.6 Profile（个人资料 / 外链 + 倒计时）
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

#### 11.1.7 GrowthItem（成长历程 / 时间轴）
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

### 11.2 端点清单（RESTful，7.2）

#### 11.2.1 用户端只读（GET）
| 方法 | 路径 | 响应 `data` | 说明 |
|------|------|-------------|------|
| GET | `/api/galleries` | `GalleryItem[]` | 素材合集（G3/G4/G5） |
| GET | `/api/albums` | `AlbumItem[]` | 作品/相册（统一 worksData） |
| GET | `/api/videos` | `VideoAlbum[]` | 视频专辑分组 |
| GET | `/api/music` | `MusicTrack[]` | 音乐列表（常驻播放器） |
| GET | `/api/profile` | `Profile` | 个人资料与外链 |
| GET | `/api/messages` | `Message[]` | 留言列表（倒序，新在前） |
| GET | `/api/growth` | `GrowthItem[]` | 成长历程时间轴（按 date 倒序） |

#### 11.2.2 用户端写入
| 方法 | 路径 | 请求体 | 响应 `data` | 说明 |
|------|------|--------|-------------|------|
| POST | `/api/messages` | `{ user: string, content: string }` | `Message` | 新增留言；`content` 入库前服务端做 XSS 净化/转义（P0 双重防护） |

#### 11.2.3 管理端（写入，原则 3 只写接口端）
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

### 11.3 Mock 对齐说明（T04 4.2 临时方案）

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

### 11.4 版本与评审

| 项 | 值 |
|----|----|
| 契约版本 | v0.1.0（T02 草案，决策已固化） |
| 评审状态 | ✅ 前端确认 ✅ 后端确认（按原则 6 等价优先默认决策） |
| 下次变更 | 字段调整须同步更新本文件 + bump 版本号 |

**开放问题决策记录**（原则 5/6，已按等价优先默认拍板）：
1. `likes`/`views` 本期**保留字符串**（"12.3万"），不加数值字段（避免前端二次格式化）。
2. `profile.countdown` 本期**预留 `string?` 字段**，T12 填充具体目标时间。
3. 管理端 `id` 类型统一为 `string`，具体生成策略（UUID/自增/业务键）由 T07 定，契约先留 `string`。
