# 开心元元个人粉丝站（kxyy）

> 偶像「开心元元」的非官方个人粉丝站。纯静态站点，原生 HTML/CSS/JS，无构建工具、无后端。

## 项目简介

- **类型**：静态粉丝站（PC / 移动端自适应）
- **技术栈**：原生 HTML5 + CSS3 + 原生 JavaScript（ES5 严格模式 + 部分 IIFE 封装）
- **数据**：硬编码于 `js/data.js`，留言通过浏览器 `localStorage` 持久化
- **资源**：图片 `img/`、音频 `music/`、视频 `video/`、样式 `css/`、脚本 `js/`、子页面 `pages/`

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
├── assets/             # 资源文件总目录（规划中，见「资源文件调整」R1）
│   ├── img/
│   │   ├── global/      # 全局 / 样式相关图片（logo、bg、loading、favicon、feather、pattern）
│   │   ├── works/       # 作品 / 相册图片
│   │   ├── growth/      # 成长历程图片
│   │   └── avatar/      # 作者头像（已在用）
│   ├── js/              # 脚本资源（与根 js/ 合并或迁移）
│   ├── video/           # 视频资源（当前在根 video/）
│   └── music/           # 音频资源（当前在根 music/）
├── img/  music/  video/   # 媒体资源（现状，待迁移至 assets/）
├── docs/               # 规范文档（开发规范 / 建议 / 需求）
├── .editorconfig       # 编辑器风格统一
└── .gitignore          # 忽略大体积资源与临时文件
```

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
| G2 | 所有页面统一使用作品页滚动条样式 | 🔶 | 全局已有 `::-webkit-scrollbar`（6px 半透明白色），`.work-modal-body` 已应用；需确认是否所有可滚动容器均生效 |

### 视频页优化（music.html）

| # | 需求 | 状态 | 备注 |
|---|------|------|------|
| V1 | 视频播放器增加 Tab 选项卡切换专辑（参考截图：原唱歌曲 / AI翻唱 / 直播翻唱） | ⬜ | 当前播放列表无专辑分类，需新增 Tab 组件 + 数据分组 |
| V2 | 播放列表分页方案差异化：PC 大屏用数字分页按钮，小屏用滚动加载 | 🔶 | 当前仅实现了滚动加载（`renderPlaylist()` + scroll 监听），PC 端数字分页未做 |
| V3 | 视频播放器自动适配横屏/竖屏 | ✅ | CSS 已有 `.orientation-landscape`(16:9) 与 `.orientation-portrait`(9:16)，`loadTrack()` 根据 data 切换 class |
| V4 | **BUG**：点击视频列表其他项后，选中样式（playing 类）仍停留在第一项 | 🐛 | 根因：`loadTrack()` 内调用 `renderPlaylist()` 会重绘整个列表并重置 `renderedCount=0`，若目标项不在首页则 DOM 中无该项；且重绘后滚动位置归顶 |
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
| D5 | **musicData.avatar**：歌手头像放 `img/avatar/` 下，与 artist 同名 + `.png` 后缀 | ⬜ | 需建目录 + 改路径规则 |
| D6 | **musicData.avatar 兜底**：头像不存在时使用默认 `img/avatar.png` | ⬜ | 需加 JS fallback 逻辑（`onerror` → 默认图） |

### 资源文件调整

| # | 需求 | 状态 | 备注 |
|---|------|------|------|
| R1 | 新增统一资源文件夹 `assets/`，集中存放图片、js、视频、音频等文件 | ⬜ | 当前资源散落在根 `img/` `js/` `music/` `video/`，需规划迁移路径 |
| R2 | 图片分类为 `global/`（全局 / 样式相关图片：logo、bg、loading、favicon、feather、pattern 等） | ⬜ | 现状：`img/` 根目录下混放 `bg.png` `logo.png` `loading.gif` `favicon.ico` `feather0~3.png` `pattern.svg` 及作品图 `00~21.jpg`,需迁移分类 |
| R3 | 图片分类为「作品 / 相册图片」文件夹（`works/`） | ⬜ | 现状：`img/00.jpg~21.jpg` 等作品图混在根目录,需移至 `assets/img/works/` |
| R4 | 图片分类为「成长历程图片」文件夹（`growth/`） | ⬜ | 成长历程图片需独立目录,避免与作品图混淆 |
| R5 | 作者头像文件夹 `avatar/`（已存在 `img/avatar/`） | ✅ | 当前 `img/avatar/` 已就位,迁移时归入 `assets/img/avatar/` |

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
| H3 | 头像不应动态（固定不随轮播变化） | ✅ | `profile.html` 使用固定 `img/00.jpg`，未引用 gallery 轮播 |
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

## 执行路线图（按修改难度排序）

> 目的：帮助排期，从「低成本高确定」到「高成本需设计」逐步推进。难度基于**改动范围、是否需新建结构、是否触及数据架构**综合评估。
> 标注：`[BUG]` 表示已知缺陷修复；`(G/V/A/D/R/H/B + 编号)` 对应上方对照表条目。

### 🟢 第一梯队：极简改动（单行/纯 CSS，低风险，可立即执行）

| 顺序 | 任务 | 难度 | 对应条目 | 改动说明 |
|------|------|------|----------|----------|
| 1 | 修复进度条回跳 BUG | 极易 | V5 / B2 | 在进度条 click handler 增加 `media.currentTime = currentSec` 单行 |
| 2 | 修复列表选中样式 BUG | 极易 | V4 / B1 | `renderPlaylist()` 改为增量更新 active 类，或重绘后滚动到当前项 |
| 3 | 统一滚动条样式到所有页面 | 易 | G2 | 确认全局 `::-webkit-scrollbar` 已覆盖所有可滚动容器，补齐遗漏选择器 |
| 4 | 作品列表每行 4 个 + 统一高度 | 易 | A1 | CSS `.works-grid` 加 `grid-template-columns: repeat(4, 1fr)` 并固定行高 |
| 5 | 封面比例改为 9:16 | 易 | A2 | CSS `.work-cover` 的 `aspect-ratio` 由 `4/3` 改为 `9 / 16` |
| 6 | 验证横竖屏自动适配 | 易 | V3 | 已实现的 CSS class 切换，仅需实测确认无遗漏场景 |
| 7 | 清理 musicData 的 `type` 字段 | 易 | D4 | 确认不再混入视频后，删除 `type:"music"` 冗余字段 |
| 8 | avatar 兜底默认图 | 易 | D6 | 头像 `<img>` 加 `onerror` 回退到 `img/avatar.png` |

### 🟡 第二梯队：中等改动（需新建组件 / 数据结构微调 / 局部迁移）

| 顺序 | 任务 | 难度 | 对应条目 | 改动说明 |
|------|------|------|----------|----------|
| 9 | videoData 去 `artist`、加 `desc` | 中 | D3 | 调整数据对象结构，同步修改渲染处字段引用 |
| 10 | musicData avatar 路径规范化 | 中 | D5 | 建立 `img/avatar/{artist}.png` 命名规则，更新 data.js 路径 |
| 11 | 资源图片分类迁移（avatar） | 中 | R5 | `img/avatar/` 已就位，归入 `assets/img/avatar/` 并改引用 |
| 12 | 资源图片分类迁移（global） | 中 | R2 | 将 logo/bg/loading/favicon/feather/pattern 移入 `assets/img/global/`，更新 CSS `url()` |
| 13 | 资源图片分类迁移（works） | 中 | R3 | 作品图 `00~21.jpg` 移入 `assets/img/works/`，更新 data.js `url` |
| 14 | 资源图片分类迁移（growth） | 中 | R4 | 成长历程图独立目录，更新 growth.js 引用 |
| 15 | PC 端视频列表数字分页 | 中 | V2 | 在 ≥1024px 下用数字按钮替换滚动加载，需新增分页状态逻辑 |

### 🔴 第三梯队：较难改动（新页面 / 架构调整 / 自动化）

| 顺序 | 任务 | 难度 | 对应条目 | 改动说明 |
|------|------|------|----------|----------|
| 16 | 视频播放器 Tab 专辑切换 | 难 | V1 | 新增 Tab 组件 + 按专辑分组数据 + 切换时重渲染播放列表 |
| 17 | 新增「建议」弹幕页 | 难 | G1 | 新建 `pages/suggest.html` + 弹幕动画（右→左滚动、点赞数展示）组件 |
| 18 | videoData 按文件夹自动生成 | 难 | D1 | 需引入构建脚本或前端读取目录，替代手动维护 |
| 19 | 横竖屏标识自动化 | 难 | D2 | 通过文件名约定或读取视频 metadata 自动判断，去除手动字段 |
| 20 | 整体资源迁移至 `assets/` | 难 | R1 | 统筹 R2~R5，统一调整目录结构与全部引用路径，建议配合构建工具 |

### 排期建议
- **冲刺 1（快速见效）**：完成第一梯队 1~8，消除所有 BUG 与明显样式偏差，约 0.5~1 天。
- **冲刺 2（结构优化）**：完成第二梯队 9~15，规范数据与资源分类，约 1~2 天。
- **冲刺 3（功能增强）**：完成第三梯队 16~20，新增弹幕页与专辑 Tab，约 3~5 天（含联调）。
- **历史需求（H 系列）** 中已实现的（H3/H4/H6）无需处理；待确认项（H1/H2/H5/H7/H9/H10）建议在执行对应新需求（A2/V1/G2 等）时一并核对闭环。
