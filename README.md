# 开心元元个人粉丝站（kxyy）

> 偶像「开心元元」的非官方个人粉丝站。纯静态站点，原生 HTML/CSS/JS，无构建工具、无后端。

## 项目简介

- **类型**：静态粉丝站（PC / 移动端自适应）
- **技术栈**：原生 HTML5 + CSS3 + 原生 JavaScript（ES5 严格模式 + 部分 IIFE 封装）
- **数据**：硬编码于 `assets/js/data.js`，留言通过浏览器 `localStorage` 持久化
- **资源**：统一收纳于 `assets/`（图片 `assets/img/`、音频 `assets/music/`、视频 `assets/video/`、样式 `assets/css/`、脚本 `assets/js/`、子页面 `pages/`）

## ⚠️ 全局要求（贯穿所有需求与改动）

> **PC 大屏模式 与 手机小屏模式 必须同时兼顾。**

1. **问题分析**：定位任何 BUG 或体验问题时，需分别在大屏（桌面浏览器）与小屏（手机 / 移动端视口）两种模式下复现与验证，不得只以单一模式为准。
2. **需求执行方案**：任何功能、样式、交互的改动方案，必须同步说明并验证其对 **PC 大屏** 与 **手机小屏** 两种模式的影响，确保两端均达到预期效果。
3. **验收标准**：改动完成与否，以两种模式下均通过测试为最终判定依据。

## 目录结构

```
kxyy/
├── index.html          # 首页（单页切换式导航）＝ 素材库（脚本 gallery.js / initGallery）
├── pages/              # 独立子页面（整页跳转）
│   ├── album.html      # 相册（导航第一项，原 works.html，脚本 album.js / initAlbum）
│   ├── video.html      # 视频播放（原 music.html，脚本 video.js / initVideo）
│   ├── growth.html     # 成长历程
│   ├── profile.html    # 个人资料
│   └── message.html    # 留言册
├── assets/             # 资源文件总目录（已全部迁移完成，见「资源文件调整」R1~R9）
│   ├── css/style.css    # 全局样式（由根 css/ 迁入）
│   ├── js/              # 功能脚本（由根 js/ 迁入）
│   │   ├── data.js         # 数据源（图片/音乐/视频/作品）
│   │   ├── main.js         # 首页核心逻辑
│   │   ├── nav-player.js   # 导航 + 播放器常驻
│   │   ├── gallery.js / video.js / album.js / growth.js / profile.js / message.js / comment.js
│   │   ├── common-ui.js / loading.js / feathers.js / nav-switch.js
│   ├── img/
│   │   ├── global/      # 全局 / 样式相关图片（logo、bg、loading、favicon、feather、pattern）
│   │   ├── works/       # 作品 / 相册图片（00~21.jpg）
│   │   ├── growth/      # 成长历程图片（当前复用 works/，目录预留）
│   │   └── avatar/      # 作者头像
│   ├── video/           # 视频资源
│   └── music/           # 音频资源
├── docs/               # 规范文档（开发规范 / 建议 / 需求）
├── .editorconfig       # 编辑器风格统一
└── .gitignore          # 忽略大体积资源与临时文件
```

## 资源迁移需求（已执行）

> 将分散在根目录的静态资源统一收纳到 `assets/`，规范目录结构。本需求与 R2~R5（图片分类迁移）互补，共同归属 R1「整体资源迁移至 `assets/`」。

四类根目录（`css/`、`js/`、`video/`、`music/`）已分别移入 `assets/` 下对应子目录，并同步更新全部引用路径：
- 所有 `.html` 中 `<link>` / `<script>` 路径改为 `assets/css/`、`assets/js/`（子页面用 `../assets/...`）；
- `data.js` 中 `videoUrl` / `audioUrl` 改为 `../assets/video/`、`../assets/music/`；
- 图片引用统一 `assets/img/global/`、`assets/img/works/`、`assets/img/avatar/`。

## 本地运行

直接用浏览器打开 `index.html` 即可（建议通过本地静态服务器，如 `python -m http.server`，以避免 `localStorage`/AJAX 的 file:// 协议限制）。

---

## 需求 ↔ 实现状态对照表

> 状态图例：✅ 已实现 ｜ 🔶 部分实现 / 待验证 ｜ ⬜ 未实现 ｜ ❓ 待确认 ｜ 🐛 已确认为 BUG

---

### 全局 / 新增页面

| # | 需求 | 状态 | 备注 |
|---|------|------|------|
| G1 | 新增「建议」页：B站弹幕风格（右→左缓慢滚动 + 显示点赞数） | ⬜ | 需新建 `pages/suggest.html` + 弹幕动画组件 |
| G2 | 所有页面统一使用作品页滚动条样式（细、半透明白色、透明轨道） | 🔶 | 全局已有 `::-webkit-scrollbar`（6px 半透明白色），`.album-modal-body`（原 `.work-modal-body`）已应用；**需覆盖范围包括**：① `html, body`（Firefox `scrollbar-width:thin; scrollbar-color`） ② 各子页面主滚动容器（profile.html、album.html 等） ③ 所有弹窗（`.album-modal-body`, `.growth-modal-body`, `.nav-playlist-body`, `.message-list` 等） ④ 灯箱 `.lightbox` |

### 视频页优化（video.html，原 music.html）

| # | 需求 | 状态 | 备注 |
|---|------|------|------|
| V1 | 视频播放器增加 Tab 选项卡切换专辑（原唱歌曲 / AI翻唱 / 直播翻唱） | ✅ | 已新增专辑 Tab 组件 + `videoAlbums` 分专辑数据；见修改日志 v1.1.6 / 任务 20 |
| V2 | 播放列表分页差异化：PC 大屏数字分页，小屏滚动加载 | ✅ | ≥1024px 数字胶囊分页（每页 8 条）+ 专辑 Tab 组合；小屏保留滚动加载；见任务 15 |
| V3 | 视频播放器自动适配横屏/竖屏 | ✅ | CSS `.orientation-landscape`(16:9) 与 `.orientation-portrait`(9:16)，`loadTrack()` 根据 data 切换 class |
| V4 | **BUG**：点击视频列表其他项后选中样式仍停留在第一项 | ✅ 已修复 | 见 B1：改为增量更新 active 类，重绘后滚动到当前项（nav-player / 页面播放器均已覆盖） |
| V5 | **BUG**：进度条点击小于当前进度无法跳转 | ✅ 已修复 | 见 B2：click handler 增加 `media.currentTime = currentSec` 并刷新 UI |

### 相册页（album.html，原 works.html）

| # | 需求 | 状态 | 备注 |
|---|------|------|------|
| A1 | 作品列表改为每行 4 个，统一高度 | ✅ | `.album-grid` 在 ≥1024px 使用 `grid-template-columns: repeat(4, 1fr)` 并固定行高 |
| A2 | 封面图片比例 9:16 | ⬜ | 实际未采用 9:16：任务 10 已**去掉**强制比例，封面高度由图片真实宽高比决定（圆角 10px、`object-position: top`） |

### 数据层优化（data.js）

| # | 需求 | 状态 | 备注 |
|---|------|------|------|
| D1 | **videoData**：根据 `video/` 文件夹实际媒体文件生成数据 | ⬜ | 当前手动维护，需考虑自动化脚本 |
| D2 | **videoData**：横竖屏标识寻找更便捷方式 | ⬜ | 可考虑文件名约定或读取 metadata |
| D3 | **videoData（现 videoAlbums）**：去掉 `artist`，新增 `desc` | ✅ | 已调整数据对象结构，同步修改渲染处字段引用 |
| D4 | **musicData**：全部为音乐，可忽略 `type` 字段 | 🔶 | 暂缓：main.js 多处依赖 `track.type === 'video'` 分支 |
| D5 | **musicData.avatar**：歌手头像放 `assets/img/avatar/` | ✅ | 已随任务 8 规范化路径 |
| D6 | **musicData.avatar 兜底**：不存在时用 `VA.png`（非 `avatar.png`） | ✅ | 头像 `<img>` 加 `onerror` 回退 `VA.png` |

### 资源文件调整

| # | 需求 | 状态 | 备注 |
|---|------|------|------|
| R1 | 新增统一资源文件夹 `assets/` | ✅ | css/js/video/music/img 全部迁入，根目录不再残留旧资源目录 |
| R2 | 图片分类 `global/` | ✅ | logo/bg/loading/favicon/feather/pattern 已迁入并更新引用 |
| R3 | 图片分类 `works/` | ✅ | 作品图已迁入，`galleryData` 路径已更新 |
| R4 | 图片分类 `growth/` | ✅ | 复用 `works/` 资源，`assets/img/growth/` 预留 |
| R5 | 作者头像 `avatar/` | ✅ | 已归入 `assets/img/avatar/` |

### 历史需求（来自早期 README）

#### 相册页面（现 album.html）
| # | 需求 | 状态 | 备注 |
|---|------|------|------|
| H1 | 作品布局改为 9:16 并运用到相册 | 🔶 | 任务 10 已改为按真实宽高比显示，是否强制 9:16 待核对 |
| H2 | 增加日期和标题的搜索方式 | ❓ | 代码内未见明确搜索 UI，需确认 |

#### 个人资料
| # | 需求 | 状态 | 备注 |
|---|------|------|------|
| H3 | 头像固定不随轮播变化 | ✅ | 使用固定 `assets/img/works/00.jpg` |
| H4 | 修改按钮链接（抖音主页/直播间） | ✅ | 见「外部链接」 |

#### 视频界面（原音乐界面，现 video.html）
| # | 需求 | 状态 | 备注 |
|---|------|------|------|
| H5 | 下拉显示视频播放列表 | 🔶 | video.html 含列表结构，下拉交互待验证 |
| H6 | 播放器改为只播放视频 | ✅ | `data.js` 使用 `type:"video"`，main.js 切换到 `playerVideo` |
| H7 | 增加专辑/合集/作品列表操作 | ✅ | 已由 V1 专辑 Tab 覆盖 |
| H8 | 点击进度条无法修改播放进度 | ✅ 已修复 | 见 V5 / B2 |
| H9 | 播放视频无声且显示不完整 | ❓ | 建议实际设备验证音轨与裁切 |

#### 成长历程
| # | 需求 | 状态 | 备注 |
|---|------|------|------|
| H10 | 滚轮滚动直接加载到下一内容页 | ❓ | 时间轴 + 弹窗查看，`scroll-snap` 行为待确认 |

---

## 外部链接（个人资料页使用）

- **头像**：`https://p3-pc.douyinpic.com/img/aweme-avatar/tos-cn-avt-0015_ea31bc7492e451602f427faa63afe079~c5_300x300.jpeg`
- **抖音主页**：`https://www.douyin.com/user/MS4wLjABAAAAnxjd0mpwX3nH09pR9a8G9he9twYL_Zdoz4S58qkmJGbbi0Bcczqd9xYaopGAKj67`
- **直播间**：`https://live.douyin.com/KXyy12345678`

> ⚠️ 以上为第三方平台链接，可能随平台策略失效，请定期核对更新。

---

## 开发规范

- 详细编码准则见 [`docs/开发规范.md`](docs/开发规范.md)
- 架构改进建议见 [`docs/suggest.md`](docs/suggest.md)

---

## 已知技术债（建议优先处理）

1. 首页 `index.html` 与 `pages/*` 的 head / 导航 / loading 遮罩为复制粘贴，缺乏公共模板（见 `docs/suggest.md` 建议 2）。
2. `main.js` 与 `gallery.js` / `video.js` 存在重复实现（灯箱、画廊渲染），需抽离（建议 2）。
3. 媒体资源 URL 与类型分类耦合（`avatar` 引用 `galleryData[0].url`），建议独立 `media.js`（建议 4）。
4. `data.js` 中 `worksData` 变量名未随页面重命名（页面为 album.html，变量仍叫 worksData），语义漂移，建议后续统一为 `albumData` 以降低理解成本（见下方一致性分析）。
5. `Claude.md` / `开发规范.md` / `suggest.md` 已归档至 `docs/`，避免在根目录与源码混放。

---

## BUG 汇总与根因定位

| # | BUG 描述 | 根因 | 定位 | 状态 |
|---|---------|------|------|------|
| B1 | 视频列表点击其他项后选中样式仍停留在第一项 | `renderPlaylist()` 重绘整个列表并重置 `renderedCount=0`；目标项不在首页则 DOM 中无 `.playing` | `main.js` 调用链 | ✅ 已修复（增量更新 active 类） |
| B2 | 进度条点击小于当前进度无法跳转 | click handler 只更新 UI 未执行 `media.currentTime = currentSec`，且 `setInterval` 每秒覆盖回原值 | `main.js` 进度条 handler | ✅ 已修复（增加 seek 调用） |

### 建议修复方向
- **B1**：`renderPlaylist()` 支持增量更新（仅修改 active 状态而非重绘 innerHTML），或重绘后自动滚动到当前项
- **B2**：在进度条 click handler 中增加 `media.currentTime = currentSec`，并在 seek 后立即刷新 UI

---

## 需求描述差异记录

| # | 涉及条目 | 文档原始描述 | 实际需求（经图片/用户确认） | 差异类型 | 补充/修正 |
|---|---------|------------|---------------------|---------|-----------|
| Diff-1 | V4 / B1 | 仅描述页面播放器 `renderPlaylist()` 重绘问题 | 图为导航栏常驻播放器（nav-player.js），缺 `refreshPlaylistActive()` | 需求范围遗漏 | 已区分两个播放器修复方案 |
| Diff-2 | G2 | "确认是否所有可滚动容器均生效" | 需覆盖：① html/body Firefox ② 各子页面主容器 ③ 所有弹窗 ④ 灯箱 | 描述笼统 | 已列出完整覆盖范围 |
| Diff-3 | D6 | 兜底文件写为 `img/avatar.png` | 实际应为 `img/avatar/VA.png` | 值错误 | 已修正为 VA.png |

### 改进建议
1. 涉及双播放器架构的需求必须明确指定 `main.js` 还是 `nav-player.js`
2. 视觉类需求应附参考截图并标注"目标/当前"对比
3. 文件路径/命名规则需给出完整示例
4. fallback 逻辑必须写出完整判断链

---

## 执行路线图（按修改难度排序）

### 🟢 第一梯队：极简改动

| 顺序 | 状态 | 任务 | 难度 | 对应条目 | 改动说明 |
|------|------|------|------|----------|----------|
| 1 | ✅ | 修复进度条回跳 BUG | 极易 | V5 / B2 | click handler 增加 `media.currentTime = currentSec` |
| 2 | ✅ | 修复列表选中样式 BUG | 极易 | V4 / B1 | `renderPlaylist()` 改为增量更新 active 类 |
| 3 | ✅ | 统一滚动条样式到所有页面 | 易 | G2 | 单滚动容器方案 + `!important` 强制覆盖 |
| 4 | ✅ | 作品列表每行 4 个 + 统一高度 | 易 | A1 | `.album-grid` `grid-template-columns: repeat(4, 1fr)` |
| 5 | ✅ | 封面比例改为 9:16 | 易 | A2 | 后续任务 10 已改为按真实宽高比，未强制 9:16 |
| 6 | ✅ | 验证横竖屏自动适配 | 易 | V3 | CSS class 切换实测 |
| 7 | ⏸ | 清理 musicData 的 `type` 字段 | 易 | D4 | 暂缓：main.js 依赖 `track.type === 'video'` |
| 8 | ✅ | avatar 兜底默认图 | 易 | D6 | `<img>` onerror 回退 `VA.png` |
| 9 | ✅ | 成长历程滚动条吸附对齐 | 极易 | 新增 | `scroll-snap-align: start` + `scroll-snap-stop: always` |
| 10 | ✅ | 作品页封面图完整显示 | 极易 | 新增/A2 | 去掉 9:16 强制比例，圆角 10px，`object-position: top` |

### 🟡 第二梯队：中等改动

| 顺序 | 任务 | 难度 | 对应条目 | 改动说明 |
|------|------|------|----------|----------|
| 9 | videoData 去 `artist`、加 `desc` | 中 | D3 | ✅ 已调整数据对象结构 |
| 10 | musicData avatar 路径规范化 | 中 | D5 | ✅ 随任务 8 完成 |
| 11 | 资源图片分类迁移（avatar） | 中 | R5 | ✅ |
| 12 | 资源图片分类迁移（global） | 中 | R2 | ✅ |
| 13 | 资源图片分类迁移（works） | 中 | R3 | ✅ |
| 14 | 资源图片分类迁移（growth） | 中 | R4 | ✅ |
| 15 | PC 端视频列表数字分页 | 中 | V2 | ✅ 已验收通过 |
| 16 | 迁移 `css/` → `assets/css/` | 中 | R6 | ✅ |
| 17 | 迁移 `js/` → `assets/js/` | 中 | R7 | ✅ |
| 18 | 迁移 `video/` → `assets/video/` | 中 | R8 | ✅ |
| 19 | 迁移 `music/` → `assets/music/` | 中 | R9 | ✅ |
| 19.1 | 导航顺序调整 + 页面/文件/命名重命名 | 中 | 新增 N1 | ✅ 已执行（见下方「重命名映射总览」） |

### 🔴 第三梯队：较难改动

| 顺序 | 任务 | 难度 | 对应条目 | 改动说明 |
|------|------|------|----------|----------|
| 20 | 视频播放器 Tab 专辑切换 | 难 | V1 | ✅ 已验收通过｜`videoAlbums` 分专辑 + Tab 组件 |
| 21 | 新增「建议」弹幕页 | 难 | G1 | ⏸ 暂缓 |
| 22 | videoData 按文件夹自动生成 | 难 | D1 | ⏸ 暂缓 |
| 23 | 横竖屏标识自动化 | 难 | D2 | ⏸ 暂缓 |

### 重命名映射总览（任务 19.1，修改日志 v1.1.7）

| 项 | 旧 | 新 |
|----|----|----|
| 导航第一项 / 页面 | 作品 works.html | 相册 album.html |
| 首页 | 相册（素材库） | 素材库 index.html（脚本 gallery.js 保留） |
| 视频页文件 | music.html / music.js | video.html / video.js |
| 视频页入口函数 | initMusic | initVideo |
| 视频页 CSS 类 | music-* | video-*（playlist / content / panel） |
| 相册页文件 | works.html / works.js | album.html / album.js |
| 相册页入口函数 | initWorks | initAlbum |
| 相册页 CSS 类 | works-* | album-*（grid / modal / cover） |
| 素材库（首页）CSS 类 | gallery-* | library-* |
| 导航映射 | nav-switch.js 子串 music/works | 改为 video/album，保留 gallery→首页 |
| 孤立文件 | pages/gallery.html | 已删除 |

> 保留项：导航栏常驻音频播放器的 `.nav-music-btn` / `.music-btn-*`（独立功能，未随视频页改名）；`gallery.js` / `initGallery` / `galleryData` 仍作为首页"素材库"脚本与数据源（有意为之，见修改日志 v1.1.7 备注）。

### 排期建议
- **冲刺 1**：第一梯队 1~8，消除 BUG 与样式偏差。
- **冲刺 2**：第二梯队 9~19，规范数据与资源分类。
- **冲刺 3**：第三梯队 20~23，新增弹幕页与专辑 Tab。
- **历史需求（H 系列）** 已实现的（H3/H4/H6/H7/H8）无需处理；待确认项建议在对应新需求执行时一并核对闭环。

---

## 文档与代码一致性分析报告（2026-08-04）

> 分析对象：`docs/需求文档.md`、`docs/修改日志.md`、`docs/suggest.md` 与当前代码 / README 的一致性。
> 结论：**代码侧的导航顺序与文件/函数/类名重命名（任务 19.1）已全部落地且自洽；但文档侧存在脱节，README 工作区文件此前被清空（0 字节），旧版 README 与需求文档仍大量引用重命名前的旧名称。** 本报告已同步修正 README（本文件），需求文档 / 修改日志仍需后续同步。

### 一、代码现状核对（已通过工具逐项目验证）

| 核查项 | 结果 |
|--------|------|
| 全站旧文件名残留（music.html / works.html / gallery.html / music.js / works.js） | ✅ 无残留 |
| 旧函数名残留（initMusic / initWorks） | ✅ 无残留 |
| video.js 暴露 `window.initVideo` | ✅ 已暴露 |
| album.js 暴露 `window.initAlbum` | ✅ 已暴露 |
| nav-switch.js `PAGE_MAP` / `INIT_MAP` 映射 | ✅ 已更新为 gallery→首页 / video→video.html / album→album.html |
| data.js 变量 | ✅ `videoAlbums`（替代旧 `videoData`，已分专辑）、`galleryData` / `musicData` / `worksData` 均存在 |
| CSS 旧类残留（works- / gallery- / music-panel / music-playlist / music-content） | ✅ 无残留；保留项 `nav-music-btn` / `music-btn-*` 仍正确存在 |
| pages 目录实际文件 | ✅ album.html / video.html / growth.html / profile.html / message.html（无孤立旧文件） |
| assets/js 实际文件 | ✅ album.js / video.js / gallery.js / 其余模块齐全 |

### 二、遗留问题 / 未修改内容清单

#### 2.1 README 自身（已在本版修正）
1. **README.md 工作区被清空（0 字节）**：git 记录显示相对 HEAD 删除了全部 291 行。本版已基于重命名后的真实代码重建并修正所有旧引用。
2. 旧版引用 `css/`、`js/`、`img/` 根目录路径 → 已改为 `assets/css/`、`assets/js/`、`assets/img/`。
3. 旧版需求对照表 / 路线图中的 `music.html` / `works.html` / `gallery.html(相册)` / `.works-grid` / `.work-cover` / `initMusic` / `music.js` → 已全部替换为 `video.html` / `album.html` / `.album-grid` / `.album-cover` / `initVideo` / `video.js` 等。
4. G2 备注、已知技术债第 2 条引用的过期文件名已更新。
5. V1~V5、A1、H5~H8 等状态标记已与实际执行（任务 15/20 验收、B1/B2 修复）对齐。

#### 2.2 需求文档 `docs/需求文档.md`（本次未直接修改，建议后续同步）
- 仍多处使用重命名前的旧名称：`music.html` / `works.html` / `gallery.html(相册)` / `.works-grid` / `.work-cover` / `initMusic` / `js/music.js` 等。
- 对照表状态标记（V1~V5 / A1 / H 系列）与修改日志及实际代码不一致（如 V1/V2/V4/V5 仍标 ⬜/🐛，实际已实现/修复）。

#### 2.3 修改日志 `docs/修改日志.md`（本次未直接修改）
- v1.1.7 记录了重命名，但**未反向同步**需求文档与 README 的旧名称引用，导致三份文档互相不一致。

#### 2.4 代码侧语义漂移（有意为之，但建议后续收敛）
1. `data.js` 中 `worksData` 变量名与页面 `album.html` 语义不一致（页面叫"相册"，变量叫 works）。当前可正常运行，建议后续统一为 `albumData` 以降低理解成本（已列入"已知技术债"第 4 条）。
2. `gallery.js` / `initGallery` / `galleryData` 仍作为首页"素材库"入口与数据源（v1.1.7 备注为保留项）。命名与"素材库"语义已不完全贴合，属历史包袱，暂不强制改。

### 三、建议的后续动作（按优先级）
1. 【高】同步更新 `docs/需求文档.md`：将旧文件名 / 旧类名 / 旧函数名替换为重命名后名称，并刷新 V1~V5 / A1 / H 系列状态标记。
2. 【中】`data.js` 的 `worksData` → `albumData` 重命名（含所有引用处），消除语义漂移。
3. 【低】评估 `gallery.js` / `galleryData` 是否随"素材库"语义进一步改名（如 `library.js` / `libraryData`），非必须。

---

> 本报告由 2026-08-04 的一致性核查生成。代码本身无功能遗留问题；文档不一致项以上述清单为准，供后续排期。
