# 开心元元个人粉丝站（kxyy）

> 偶像「开心元元」的非官方个人粉丝站。纯静态站点，原生 HTML/CSS/JS，无构建工具、无后端。

## 项目简介

- **类型**：静态粉丝站（PC / 移动端自适应）
- **技术栈**：原生 HTML5 + CSS3 + 原生 JavaScript（ES5 严格模式 + 部分 IIFE 封装）
- **数据**：硬编码于 `js/data.js`，留言通过浏览器 `localStorage` 持久化
- **资源**：图片 `img/`、音频 `music/`、视频 `video/`、样式 `css/`、脚本 `js/`、子页面 `pages/`

## ⚠️ 全局要求（贯穿所有需求与改动）

> **PC 大屏模式 与 手机小屏模式 必须同时兼顾。**

1. **问题分析**：定位任何 BUG 或体验问题时，需分别在大屏（桌面浏览器）与小屏（手机 / 移动端视口）两种模式下复现与验证，不得只以单一模式为准。
2. **需求执行方案**：任何功能、样式、交互的改动方案，必须同步说明并验证其对 **PC 大屏** 与 **手机小屏** 两种模式的影响，确保两端均达到预期效果。
3. **验收标准**：改动完成与否，以两种模式下均通过测试为最终判定依据。

## 目录结构

```
kxyy/
├── index.html          # 首页（单页切换式导航）
├── pages/              # 独立子页面（整页跳转）
│   ├── gallery.html    # 相册
│   ├── music.html      # 音乐/视频播放
│   ├── works.html      # 作品
│   ├── growth.html     # 成长历程
│   ├── profile.html    # 个人资料
│   └── message.html    # 留言册
├── css/style.css       # 全局样式（含主题变量）
├── js/                 # 功能脚本（按模块拆分）
│   ├── data.js         # 数据源（图片/音乐/视频/作品）
│   ├── main.js         # 首页核心逻辑
│   ├── nav-player.js   # 导航 + 播放器常驻
│   ├── gallery.js / music.js / works.js / growth.js / profile.js / message.js / comment.js
│   ├── common-ui.js / loading.js / feathers.js / nav-switch.js
├── assets/             # 资源文件总目录（已全部迁移完成，见「资源文件调整」R1~R9）
│   ├── css/style.css    # 全局样式（由根 css/ 迁入）
│   ├── js/              # 功能脚本（由根 js/ 迁入）
│   ├── img/
│   │   ├── global/      # 全局 / 样式相关图片（logo、bg、loading、favicon、feather、pattern）
│   │   ├── works/       # 作品 / 相册图片（00~21.jpg）
│   │   ├── growth/      # 成长历程图片（当前复用 works/，目录预留）
│   │   └── avatar/      # 作者头像（由 img/avatar/ 迁入）
│   ├── video/           # 视频资源（由根 video/ 迁入）
│   └── music/           # 音频资源（由根 music/ 迁入）
├── docs/               # 规范文档（开发规范 / 建议 / 需求）
├── .editorconfig       # 编辑器风格统一
└── .gitignore          # 忽略大体积资源与临时文件
```

## 资源迁移需求（本次新增）

> 将当前分散在根目录的静态资源统一收纳到资源文件夹 `assets/`，规范目录结构，便于维护与后续构建工具接入。本需求与 R2~R5（图片分类迁移）互补，共同归属 R1「整体资源迁移至 `assets/`」的统筹目标。

### 迁移范围

| 当前路径 | 目标路径 | 说明 |
|----------|----------|------|
| `css/` | `assets/css/` | 全局样式 |
| `js/` | `assets/js/` | 功能脚本（按模块拆分） |
| `video/` | `assets/video/` | 视频资源 |
| `music/` | `assets/music/` | 音频资源 |

（图片资源 `img/` 已在 R2~R5 规划迁移至 `assets/img/`，本次不重复定义，纳入统一统筹。）

### 修改要求

1. **移动目录**：将上述四类根目录分别移入 `assets/` 下对应子目录。
2. **更新全部引用**：
   - 所有 `.html`（`index.html` 及 `pages/*.html`）中 `<link rel="stylesheet" href="css/...">`、`<script src="js/...">` 路径改为 `assets/css/`、`assets/js/`（注意子页面需用 `../assets/...` 层级）；
   - `data.js` 中 `audioUrl` / `videoUrl` 等媒体路径（`../music/`、`../video/`、`music/`、`video/`）改为 `../assets/music/`、`../assets/video/`（按页面层级补全前缀）；
   - 图片引用（`img/...`）统一改为 `assets/img/global/`（UI 资源）、`assets/img/works/`（作品图）、`assets/img/avatar/`（头像），CSS `url(../img/...)` 同步改为 `assets/img/global/...`；
   - `feathers.js` 中 `img/featherX.png` 改为 `assets/img/global/featherX.png`；
   - `growth.js` 中 `../img/pattern.svg` 改为 `../assets/img/global/pattern.svg`。
3. **双模式验证**：迁移后须在 PC 大屏与手机小屏两种模式下确认样式、脚本、音视频均正常加载（全局要求第 3 条）。
4. **不破坏既有功能**：已通过的进度条、播放列表、滚动条、吸附、封面显示等改动不受影响。

### 验收标准

- 根目录不再残留 `css/`、`js/`、`video/`、`music/` 文件夹；
- 全站资源经 `assets/` 加载，无 404；
- 大屏 / 小屏两种模式均通过。

## 本地运行

直接用浏览器打开 `index.html` 即可（建议通过本地静态服务器，如 `python -m http.server`，以避免 `localStorage`/AJAX 的 file:// 协议限制）。

---

## 需求 ↔ 实现状态对照表

> 目的：避免需求文档与代码脱节（见 `docs/suggest.md` 第 3.5 节）。
> 状态图例：✅ 已实现 ｜ 🔶 部分实现 / 待验证 ｜ ⬜ 未实现 ｜ ❓ 待确认 ｜ 🐛 已确认为 BUG

---

### 全局 / 新增页面

| # | 需求 | 状态 | 备注 |
|---|------|------|------|
| G1 | 新增「建议」页：B站弹幕风格（右→左缓慢滚动 + 显示点赞数） | ⬜ | 需新建 `pages/suggest.html` + 弹幕动画组件 |
| G2 | 所有页面统一使用作品页滚动条样式（以成长历程页 `growth-fullscreen-scroll` 为基准：细、半透明白色、透明轨道） | 🔶 | 全局已有 `::-webkit-scrollbar`（6px 半透明白色），`.work-modal-body` 已应用；**需覆盖范围包括**：① `html, body`（Firefox `scrollbar-width:thin; scrollbar-color`） ② 各子页面主滚动容器（profile.html、gallery.html 等） ③ 所有弹窗（`.work-modal-body`, `.growth-modal-body`, `.nav-playlist-body`, `.message-list` 等） ④ 灯箱 `.lightbox` |

### 视频页优化（music.html）

| # | 需求 | 状态 | 备注 |
|---|------|------|------|
| V1 | 视频播放器增加 Tab 选项卡切换专辑（参考截图：原唱歌曲 / AI翻唱 / 直播翻唱） | ⬜ | 当前播放列表无专辑分类，需新增 Tab 组件 + 数据分组 |
| V2 | 播放列表分页方案差异化：PC 大屏用数字分页按钮，小屏用滚动加载 | 🔶 | 当前仅实现了滚动加载（`renderPlaylist()` + scroll 监听），PC 端数字分页未做 |
| V3 | 视频播放器自动适配横屏/竖屏 | ✅ | CSS 已有 `.orientation-landscape`(16:9) 与 `.orientation-portrait`(9:16)，`loadTrack()` 根据 data 切换 class |
| V4 | **BUG**：点击视频列表其他项后，选中样式（playing 类）仍停留在第一项 | 🐛 | **涉及两个播放器**：① `main.js`（music.html 页面播放器）：`loadTrack()` 调用 `renderPlaylist()` 会重绘整个列表并重置 `renderedCount=0`，若目标项不在首页则 DOM 中无该项的 `.playing`；且重绘后滚动位置归顶 ② `nav-player.js`（导航栏常驻播放器）：**图1所示为此播放器**，当前代码中 `loadTrack()`/`playTrack()` 直接调用 `renderPlaylist()` 全量重绘（含 `isActive = i === currentTrack`），但缺少 `refreshPlaylistActive()` 函数来保存/恢复 scrollTop；需确认全量重绘后 `.playing` 类是否正确应用到目标项 |
| V5 | **BUG**：进度条点击大于当前进度可跳转、小于当前进度无法跳转 | 🐛 | 根因：click handler 只更新了 `currentSec` 与 `progressBar.style.width`，但未 seek 视频/音频的 `currentTime`；且 `playTrack()` 的 `setInterval` 每秒覆盖 `progressBar.style.width`，导致"回跳"被立即追回 |

### 相册页（gallery.html）

| # | 需求 | 状态 | 备注 |
|---|------|------|------|
| A1 | 作品列表改为每行 4 个，统一高度 | 🔶 | 首页 `.works-grid` 在 ≥1024px 时未明确指定列数（CSS 中缺省可能非 4 列）；需改为 `grid-template-columns: repeat(4, 1fr)` 并统一行高 |
| A2 | 封面图片比例 9:16，按宽度比例显示 | ⬜ | 当前 `.work-cover` 使用 `aspect-ratio: 4/3`，需改为 `9 / 16` |

### 数据层优化（data.js）

| # | 需求 | 状态 | 备注 |
|---|------|------|------|
| D1 | **videoData**：根据 `video/` 文件夹实际媒体文件生成数据 | ⬜ | 当前手动维护，需考虑自动化脚本或构建时生成 |
| D2 | **videoData**：横竖屏标识寻找更便捷方式（替代手动 orientation 字段） | ⬜ | 可考虑：文件名约定（如 `_v`/`_h` 后缀）、或读取视频 metadata 自动判断 |
| D3 | **videoData**：去掉 `artist` 字段，新增 `desc` 描述字段 | ⬜ | 数据结构调整 |
| D4 | **musicData**：全部为音乐，可忽略 `type` 字段 | 🔶 | 若确认后续不再混入视频类型，可清理 `type` 字段以简化逻辑 |
| D5 | **musicData.avatar**：歌手头像放 `img/avatar/` 下，与 artist 同名 + `.png` 后缀（如 `张震岳.png`、`宋冬野.png`） | ⬜ | 需建目录 + 改路径规则 |
| D6 | **musicData.avatar 兜底**：当 `img/avatar/{artist}.png` 不存在时，使用 `img/avatar/VA.png` 作为默认头像（**注意：不是 `avatar.png`**） | ⬜ | 需在 `nav-player.js` 的 `loadTrack()` 中加 `onerror` fallback 逻辑：先尝试 `{artist}.png`，失败时回退到 `VA.png` |

### 资源文件调整

| # | 需求 | 状态 | 备注 |
|---|------|------|------|
| R1 | 新增统一资源文件夹 `assets/`，集中存放图片、js、视频、音频等文件 | ✅ | css/js/video/music/img 全部迁入 `assets/`，根目录不再残留旧资源目录 |
| R2 | 图片分类为 `global/`（全局 / 样式相关图片：logo、bg、loading、favicon、feather、pattern 等） | ✅ | `bg.png` `logo.png` `loading.gif` `favicon.ico` `feather0~3.png` `pattern.svg` 已迁入 `assets/img/global/` 并更新引用 |
| R3 | 图片分类为「作品 / 相册图片」文件夹（`works/`） | ✅ | `img/00.jpg~21.jpg` 已迁入 `assets/img/works/`，`galleryData` 路径已更新 |
| R4 | 图片分类为「成长历程图片」文件夹（`growth/`） | ✅ | 成长历程图片当前复用 `works/` 资源，`assets/img/growth/` 目录预留；`growth.js` 中 `pattern.svg` 已改为 `assets/img/global/` |
| R5 | 作者头像文件夹 `avatar/`（已存在 `img/avatar/`） | ✅ | `img/avatar/` 已归入 `assets/img/avatar/`（VA.png、宋冬野.png、张震岳.png），引用已更新 |

> 迁移注意事项：资源目录调整后,需同步更新 `css/style.css` 与 `js/data.js` 中的所有资源引用路径(如 `url(../img/...)`、galleryData/musicData 的 `url` 字段),避免 404。

### 历史需求（来自早期 README）

#### 相册页面
| # | 需求 | 状态 | 备注 |
|---|------|------|------|
| H1 | 作品布局改为 9:16 并运用到相册 | 🔶 | `pages/gallery.html` 已独立；首页相册是否同步 9:16 待核对 |
| H2 | 增加日期和标题的搜索方式 | ❓ | 代码内未见明确搜索 UI，需确认 |

#### 个人资料
| # | 需求 | 状态 | 备注 |
|---|------|------|------|
| H3 | 头像不应动态（固定不随轮播变化） | ✅ | `profile.html` 使用固定 `assets/img/works/00.jpg`，未引用 gallery 轮播 |
| H4 | 修改按钮链接（抖音主页/直播间） | ✅ | 链接见下方「外部链接」章节 |

#### 音乐界面（历史）
| # | 需求 | 状态 | 备注 |
|---|------|------|------|
| H5 | 下拉显示音乐播放列表 | 🔶 | `music.html` 含列表结构，下拉交互待验证 |
| H6 | 播放器改为只播放视频 | ✅ | `data.js` 使用 `type:"video"`，`main.js` 切换到 `playerVideo` |
| H7 | 增加专辑/合集/作品列表操作 | ❓ | 暂无明确合集分类 UI（本轮 V1 需求将覆盖此条） |
| H8 | 点击进度条无法修改播放进度 | 🐛 | 已在本轮 V5 中精确定位根因 |
| H9 | 播放视频无声且显示不完整 | ❓ | 建议实际设备验证音轨与裁切 |

#### 成长历程
| # | 需求 | 状态 | 备注 |
|---|------|------|------|
| H10 | 滚轮滚动直接加载到下一内容页 | ❓ | 当前为时间轴 + 弹窗查看，`scroll-snap` 行为待确认 |

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
2. `main.js` 与 `gallery.js` / `music.js` 存在重复实现（灯箱、画廊渲染），需抽离（建议 2）。
3. 媒体资源 URL 与类型分类耦合（`avatar` 引用 `galleryData[0].url`），建议独立 `media.js`（建议 4）。
4. `Claude.md` / `开发规范.md` / `suggest.md` 已归档至 `docs/`，避免在根目录与源码混放。

---

## BUG 汇总与根因定位

> 以下为经代码审查确认的 BUG，均标注了根因位置。

| # | BUG 描述 | 根因 | 定位 |
|---|---------|------|------|
| B1 | 视频列表点击其他项后选中样式仍停留在第一项 | `loadTrack()` 内调用 `renderPlaylist()` 重绘整个列表并重置 `renderedCount=0`；若目标项不在首页则 DOM 中无该项的 `.playing` 类 | `main.js:403` 调用 → `main.js:322` 判断逻辑 |
| B2 | 进度条点击小于当前进度无法跳转 | click handler 只更新 UI（`progressBar.style.width`），未执行 `playerVideo.currentTime = currentSec` 或 `playerAudio.currentTime = currentSec`；且 `playTrack()` 的 `setInterval` 每秒覆盖回原值 | `main.js:472-478` 缺少 seek 调用 |

### 建议修复方向
- **B1**：`renderPlaylist()` 应支持增量更新（仅修改 active 状态而非重绘 innerHTML），或在重绘后自动滚动到当前项
- **B2**：在进度条 click handler 中增加 `playerVideo.currentTime = currentSec`（或对应媒体元素），并在 seek 后立即刷新 UI

---

## 需求描述差异记录

> 以下为经图片对比 + 代码审查后发现的**需求文档描述不够详细 / 与实际需求存在偏差**的条目。
> 每次迭代后如有新发现，在此追加记录，避免同类问题重复出现。

| # | 涉及条目 | 文档原始描述 | 实际需求（经图片/用户确认） | 差异类型 | 补充/修正 |
|---|---------|------------|---------------------|---------|-----------|
| Diff-1 | V4 / B1（列表选中样式） | 仅描述 `main.js` 的 `renderPlaylist()` 重绘问题 | **图1显示的是 `nav-player.js` 导航栏播放器**，非页面播放器；nav-player 缺少 `refreshPlaylistActive()` 函数来保存/恢复 scrollTop | 需求范围遗漏 | 已更新 V4 备注，明确区分两个播放器的修复方案 |
| Diff-2 | G2（全局滚动条统一） | "确认是否所有可滚动容器均生效"，未列出具体覆盖范围 | 图2（成长历程页细白滚动条）vs 图3（其他页面粗深色滚动条）；需覆盖：① html/body Firefox 属性 ② 各子页面主容器 ③ 所有弹窗 ④ 灯箱 | 描述过于笼统 | 已更新 G2 备注，列出完整覆盖范围清单 |
| Diff-3 | D6（avatar 兜底路径） | 兜底文件写为 `img/avatar.png` | 实际兜底文件应为 **`img/avatar/VA.png`**；且需明确路径构造规则：`img/avatar/{artist}.png` → onerror → `VA.png` | 值错误 | 已修正 D6 备注为 `VA.png`，补充 JS fallback 逻辑说明 |

### 改进建议（避免后续同类问题）
1. **涉及双播放器架构的需求**：必须明确指定是 `main.js`（music.html 页面播放器）还是 `nav-player.js`（导航栏常驻播放器），或两者均需修改
2. **视觉类需求**：应附参考截图并标注"目标效果"与"当前效果"的对比
3. **文件路径/命名规则**：需给出完整示例（如 `{artist}.png` → `张震岳.png`），避免歧义
4. **兜底/fallback 逻辑**：必须明确写出完整判断链（尝试 A → 失败 → 回退 B），不能只写"默认图"

---

## 执行路线图（按修改难度排序）

> 目的：帮助排期，从「低成本高确定」到「高成本需设计」逐步推进。难度基于**改动范围、是否需新建结构、是否触及数据架构**综合评估。
> 标注：`[BUG]` 表示已知缺陷修复；`(G/V/A/D/R/H/B + 编号)` 对应上方对照表条目。

### 🟢 第一梯队：极简改动（单行/纯 CSS，低风险，可立即执行）

> 修改状态：✅ 已修改并测试通过 ｜ ❌ 已修改但测试未通过 ｜ ⏳ 已修改待测试 ｜ ⏸ 暂缓执行
> 详细修改记录见 [`docs/修改日志.md`](docs/修改日志.md)

| 顺序 | 状态 | 任务 | 难度 | 对应条目 | 改动说明 |
|------|------|------|------|----------|----------|
| 1 | ✅ | 修复进度条回跳 BUG | 极易 | V5 / B2 | 在进度条 click handler 增加 `media.currentTime = currentSec` 单行 |
| 2 | ✅ | 修复列表选中样式 BUG | 极易 | V4 / B1 | `renderPlaylist()` 改为增量更新 active 类，或重绘后滚动到当前项（已补 `js/music.js` 大屏路径） |
| 3 | ✅ | 统一滚动条样式到所有页面 | 易 | G2 | 全站滚动条统一为无背景色、宽 6px、滑块高 120px；采用单滚动容器方案（`html{overflow:hidden}`+`body{overflow-y:auto}`），具体类 + `!important` 强制覆盖所有容器 |
| 4 | ✅ | 作品列表每行 4 个 + 统一高度 | 易 | A1 | CSS `.works-grid` 加 `grid-template-columns: repeat(4, 1fr)` 并固定行高 |
| 5 | ✅ | 封面比例改为 9:16 | 易 | A2 | CSS `.work-cover` 的 `aspect-ratio` 由 `4/3` 改为 `9 / 16` |
| 6 | ✅ | 验证横竖屏自动适配 | 易 | V3 | 已实现的 CSS class 切换，仅需实测确认无遗漏场景 |
| 7 | ⏸ | 清理 musicData 的 `type` 字段 | 易 | D4 | **暂缓**：main.js 多处依赖 `track.type === 'video'` 分支，待确认后统一处理 |
| 8 | ✅ | avatar 兜底默认图 | 易 | D6 | 头像 `<img>` 加 `onerror`：先尝试 `img/avatar/{artist}.png`，失败时回退到 `img/avatar/VA.png`（**注意：不是 `avatar.png`**）；本轮一并完成 D5 路径规范化 |
| 9 | ✅ | 成长历程滚动条吸附对齐 | 极易 | 新增 | 拖动成长历程页滚动条时，内容模块须完整吸附到视口，禁止出现半截卡在两个模块之间的状态（见图1）；方案：`.growth-fullscreen-item` 加 `scroll-snap-align: start` + `scroll-snap-stop: always` |
| 10 | ✅ | 作品页封面图完整显示 | 极易 | 新增/A2 | 保持 `.works-grid` 当前 4 列，封面图按图片宽度完整显示；同步优化：① 圆角 20px→10px；② `object-position: top` 消除顶部空白；③ `.work-body` 上内边距 20px→12px 缩小封面到标题距离；④ **去掉 `.work-cover` 的 9:16 强制比例，封面高度由图片真实宽高比决定** |

### 🟡 第二梯队：中等改动（需新建组件 / 数据结构微调 / 局部迁移）

| 顺序 | 任务 | 难度 | 对应条目 | 改动说明 |
|------|------|------|----------|----------|
| 9 | videoData 去 `artist`、加 `desc` | 中 | D3 | ✅ 已调整数据对象结构，同步修改渲染处字段引用 |
| 10 | musicData avatar 路径规范化 | 中 | D5 | ✅ 已随第一梯队任务 8 完成（`assets/img/avatar/` 路径） |
| 11 | 资源图片分类迁移（avatar） | 中 | R5 | ✅ `img/avatar/` 已归入 `assets/img/avatar/` 并更新引用 |
| 12 | 资源图片分类迁移（global） | 中 | R2 | ✅ logo/bg/loading/favicon/feather/pattern 已移入 `assets/img/global/`，CSS `url()` 已更新 |
| 13 | 资源图片分类迁移（works） | 中 | R3 | ✅ 作品图 `00~21.jpg` 已移入 `assets/img/works/`，`galleryData` `url` 已更新 |
| 14 | 资源图片分类迁移（growth） | 中 | R4 | ✅ `growth.js` 中 `pattern.svg` 已改为 `assets/img/global/`；`assets/img/growth/` 目录预留 |
| 15 | PC 端视频列表数字分页 | 中 | V2 | ✅ 已验收通过｜在 ≥1024px 下用数字胶囊按钮分页（每页 8 条），与专辑 Tab 组合；小屏保留滚动加载 |
| 16 | 迁移 `css/` → `assets/css/` | 中 | R6 | ✅ 已移动 css 目录，更新所有 html 的 `<link>` 引用（子页面 `../assets/css/`） |
| 17 | 迁移 `js/` → `assets/js/` | 中 | R7 | ✅ 已移动 js 目录，更新所有 html 的 `<script>` 引用（子页面 `../assets/js/`） |
| 18 | 迁移 `video/` → `assets/video/` | 中 | R8 | ✅ 已移动目录，更新 `data.js` 中 `videoUrl` 路径（`../video/` → `../assets/video/`） |
| 19 | 迁移 `music/` → `assets/music/` | 中 | R9 | ✅ 已移动目录，更新 `data.js` 中 `audioUrl` 路径（`../music/` → `../assets/music/`） |

> 资源迁移统筹：第二梯队 11~14（图片 R2~R5）+ 16~19（css/js/video/music R6~R9）共同构成 R1「整体资源迁移至 `assets/`」，执行时建议一次性统筹，避免路径引用割裂；需兼顾 PC 大屏与手机小屏双模式验证（见全局要求）。

### 🔴 第三梯队：较难改动（新页面 / 架构调整 / 自动化）

| 顺序 | 任务 | 难度 | 对应条目 | 改动说明 |
|------|------|------|----------|----------|
| 20 | 视频播放器 Tab 专辑切换 | 难 | V1 | ✅ 已验收通过｜新增专辑 Tab 组件（可扩展、溢出时显示左右箭头）；`videoData` 改为 `videoAlbums` 分专辑结构；切换专辑重渲染列表，继续播放（不在新列表则高亮消失）；PC 端 Tab+分页组合 |
| 21 | 新增「建议」弹幕页 | 难 | G1 | ⏸ 暂缓｜新建 `pages/suggest.html` + 弹幕动画（右→左滚动、点赞数展示）组件 |
| 22 | videoData 按文件夹自动生成 | 难 | D1 | ⏸ 暂缓｜需引入构建脚本或前端读取目录，替代手动维护 |
| 23 | 横竖屏标识自动化 | 难 | D2 | ⏸ 暂缓｜通过文件名约定或读取视频 metadata 自动判断，去除手动字段 |

### 排期建议
- **冲刺 1（快速见效）**：完成第一梯队 1~8，消除所有 BUG 与明显样式偏差，约 0.5~1 天。
- **冲刺 2（结构优化）**：完成第二梯队 9~19，规范数据与资源分类（含资源迁移），约 1~2 天。
- **冲刺 3（功能增强）**：完成第三梯队 20~23，新增弹幕页与专辑 Tab，约 3~5 天（含联调）。
- **历史需求（H 系列）** 中已实现的（H3/H4/H6）无需处理；待确认项（H1/H2/H5/H7/H9/H10）建议在执行对应新需求（A2/V1/G2 等）时一并核对闭环。
