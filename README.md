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
├── img/  music/  video/   # 媒体资源
├── docs/               # 规范文档（开发规范 / 建议 / 需求）
├── .editorconfig       # 编辑器风格统一
└── .gitignore          # 忽略大体积资源与临时文件
```

## 本地运行

直接用浏览器打开 `index.html` 即可（建议通过本地静态服务器，如 `python -m http.server`，以避免 `localStorage`/AJAX 的 file:// 协议限制）。

---

## 需求 ↔ 实现状态对照表

> 目的：避免需求文档与代码脱节（见 `docs/suggest.md` 第 3.5 节）。
> 状态图例：✅ 已实现 ｜ 🔶 部分实现 / 待验证 ｜ ⬜ 未实现 ｜ ❓ 待确认

### 相册页面
| # | 需求 | 状态 | 备注 |
|---|------|------|------|
| 1 | 作品布局改为 9:16 并运用到相册 | 🔶 | `pages/gallery.html` 已独立；首页相册是否同步 9:16 待核对 |
| 2 | 增加日期和标题的搜索方式 | ❓ | 代码内未见明确搜索 UI，需确认 |

### 个人资料
| # | 需求 | 状态 | 备注 |
|---|------|------|------|
| 1 | 头像不应动态（固定不随轮播变化） | ✅ | `profile.html` 使用固定 `img/00.jpg`，未引用 gallery 轮播 |
| 2 | 修改按钮链接（抖音主页/直播间） | ✅ | 链接见下方「外部链接」章节 |

### 音乐界面
| # | 需求 | 状态 | 备注 |
|---|------|------|------|
| 1 | 下拉显示音乐播放列表 | 🔶 | `music.html` 含列表结构，下拉交互待验证 |
| 2 | 播放器改为只播放视频 | ✅ | `data.js` 使用 `type:"video"`，`main.js` 切换到 `playerVideo` |
| 3 | 增加专辑/合集/作品列表操作 | ❓ | 暂无明确合集分类 UI |
| 4 | 点击进度条无法修改播放进度 | 🔶 | `main.js` 存在 `progressBar`/`progressTimer`，拖动逻辑需验证 |
| 5 | 播放视频无声且显示不完整 | ❓ | 建议实际设备验证音轨与裁切 |

### 成长历程
| # | 需求 | 状态 | 备注 |
|---|------|------|------|
| 1 | 滚轮滚动直接加载到下一内容页 | ❓ | 当前为时间轴 + 弹窗查看，`scroll-snap` 行为待确认 |

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
