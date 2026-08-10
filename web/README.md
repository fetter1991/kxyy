# 开心元元 · 素材库（kxyy web）

开心元元个人作品站前端 —— 由旧 PHP 静态站（根 `index.html` + `pages/*.html`）迁移而来的 **Vue 3 SPA 单应用**。

> 旧站资源与入口已冻结于 git tag `legacy-html-final`，可 `git checkout legacy-html-final` 还原。

## 技术栈

- **Vue 3** + `<script setup>` SFC + **TypeScript**（`vue-tsc` 严格类型检查）
- **Vite** 构建（含 `manualChunks` 分包：用户端 / 管理端 / vendor 独立）
- **Pinia** 状态管理（数据 store + 播放器逻辑）
- **Vue Router** 路由分区：用户端 `/` + 管理端 `/manage`
- **原始样式复用**：`src/styles/original.css`（旧站 91KB 完整样式 + 设计 token，详见 `docs/STYLE-SYSTEM.md`）

## 目录结构

```
web/
├── index.html              # SPA 单入口（双端共用，favicon 指向 /assets/img/global/favicon.ico）
├── src/
│   ├── main.ts             # 入口：挂载 Pinia + Router，import original.css（唯一样式源）
│   ├── App.vue             # 顶层：氛围层（PageLoading / FeatherLayer）+ <RouterView/>
│   ├── router/index.ts     # 路由聚合（modules/user + modules/manage）
│   ├── modules/
│   │   ├── user/           # 用户端：views/（8 页）、components/（Layout/NavPlayer）
│   │   └── manage/         # 管理端：routes + ManageLayout + DashboardView（懒加载）
│   ├── shared/components/  # 全站共享：PageLoading.vue、FeatherLayer.vue
│   ├── stores/data.ts      # Pinia store（相册/视频/成长/音乐/留言 + 播放器）
│   ├── services/           # API 服务层（messageService 等，VITE_USE_MOCK 切换 mock/真实）
│   ├── mock/               # Mock 数据（VITE_USE_MOCK=true 时启用）
│   ├── utils/asset.ts      # useAssetUrl()：../assets/x → /assets/x（SPA 路径安全）
│   └── styles/original.css  # 设计系统 + 旧站样式（T13）
├── public/assets/          # 静态资源（img/css/js→已删/music/video），dev 下 /assets/* 直读
└── vite.config.ts          # 构建配置（manualChunks 分包）
```

## 开发

```bash
npm install
npm run dev        # 默认 http://localhost:5173
npm run build      # 类型检查 + 生产构建到 dist/
```

## 关键约定

1. **资源路径**：所有媒体经 `useAssetUrl('assets/...')` 解析为 `/assets/...`，**禁止**写死相对路径（`../assets`）或绝对域名。
2. **样式**：全站仅 `original.css` 一个 `:root` 变量源；新增品牌色进 `:root` token，禁止组件 scoped 写死 `#8A2BE2` 等（见 `docs/STYLE-SYSTEM.md`）。
3. **Mock / 真实接口**：`.env` 中 `VITE_USE_MOCK=true` 走 mock 数据；切真实后端改 `false`（需 `localhost:8000` 运行 api）。
4. **大体积媒体**：`music/`(58.5MB) / `video/`(412MB) 经 `.gitignore` 忽略，不入库，部署时注入。

## 文档

- `docs/tasks.md` —— 全量任务清单（T 主线 + 临时变更 C 项）
- `docs/修改日志.md` —— 版本迭代记录
- `docs/STYLE-SYSTEM.md` —— 设计系统 token 体系
