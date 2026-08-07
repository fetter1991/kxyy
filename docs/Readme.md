# 开心元元个人粉丝站（kxyy）

> 偶像「开心元元」的**非官方**个人粉丝站 · 纯静态 · 原生 HTML/CSS/JS · 无构建工具、无后端、PC / 移动端自适应。
>
> ⚠️ 本项目已启动重构（目标：Vue 三端分离）。本文件描述**现状**；目标架构见 [`constitution.md`](constitution.md) 与 [`技术方案.md`](技术方案.md)，任务拆解见 [`tasks.md`](tasks.md)。

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

---

## 一、整体规划

### 1.1 项目定位

| 项 | 说明|
|----|----|
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

### 架构改进方向（详见 [`suggest.md`](suggest.md)）

| 优先级 | 方向 |
|--------|------|
| 🔴 高 | 去重 + 模块化（灯箱/播放器/loading 抽独立模块，消除 `main.js` 巨型文件与复制粘贴） |
| 🔴 高 | 统一路由架构（消除「单页切换」与「整页跳转」两套机制并存） |
| 🟡 中 | 数据解耦（媒体 URL 独立 `media.js`，语义化图片命名） |
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

### 8.2 代码审查风险（详见 [`CodeReview.md`](CodeReview.md)）

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
5. 导航顺序与命名曾经历重命名（v1.1.7），部分文档仍引用旧名（见 [`需求说明.md`](需求说明.md)）。

---

## 九、文档导航

| 文档 | 内容 |
|------|------|
| [`Readme.md`](Readme.md) | 本文档：站点现状说明（规划 / 结构 / 功能 / 规范 / 待办 / 问题） |
| [`constitution.md`](constitution.md) | 重构核心原则（宪法，最高优先级） |
| [`技术方案.md`](技术方案.md) | 开发人员初步技术方案（技术栈落地） |
| [`tasks.md`](tasks.md) | 重构任务拆解与人员分配 |
| [`Refactoring.md`](Refactoring.md) | 重构需求与目标设想（来源） |
| [`需求说明.md`](需求说明.md) | 历史需求原稿：需求 ↔ 实现对照表、执行路线图、重命名映射 |
| [`开发规范.md`](开发规范.md) | 编码行为准则（精简版，源自 Claude.md） |
| [`suggest.md`](suggest.md) | 架构与工程化改进建议 |
| [`CodeReview.md`](CodeReview.md) | 生产级代码审查报告（P0~P3 风险清单） |
| [`修改日志.md`](修改日志.md) | 版本迭代记录（v1.1.0 ~ v1.1.7） |

---

<p align="center">本站为非官方粉丝向项目，与偶像本人及经纪公司无隶属关系。</p>
