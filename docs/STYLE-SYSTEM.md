# 设计系统（STYLE-SYSTEM）

> 对应 tasks.md **T13 · 样式系统抽象**。状态：✅ 基础 token 体系已就位（2026-08-10 收敛 `style.css` 冲突后），文档化完成。

## 1. 样式架构

| 层 | 文件 | 职责 | 引入方式 |
|----|------|------|----------|
| **设计 token + 旧站还原样式** | `web/src/styles/original.css` | 旧站 91KB 完整样式 + `:root` 设计变量，**全站唯一样式源** | `main.ts` 全局 `import` |
| （已删除）脚手架样式 | `web/src/style.css` | ~~Vite 默认样式，含冲突 `:root`~~ | 2026-08-10 移除（与 original.css 抢变量，造成浅/深主题变量打架） |

**关键约束**：全站**只保留 `original.css` 一个 `:root` 变量源**。任何组件 scoped 样式需取色一律引用 `--primary/--accent/--text` 等 token，**禁止新增独立 `:root` 或硬编码品牌色**。

## 2. 设计 Token（`original.css` `:root`）

### 2.1 色彩（深色主题基底）
```css
--primary:       #8A2BE2;   /* 主紫 — 按钮渐变/边框/hover 主色 */
--primary-light: #b06ab3;   /* 主紫浅 — 渐变终点 */
--primary-dark:  #5e2a8c;   /* 主紫深 — 阴影/按压态 */
--accent:        #e8b4d8;   /* 强调粉 — 标题渐变/图标/close hover */
--dark:          #1a1228;   /* 最深背景 */
--dark-soft:     #241935;   /* 次级背景（面板） */
--text:          #f0eaf5;   /* 主文字（浅色） */
--text-muted:    #a99cc0;   /* 次级文字（标签/说明） */
--card-bg:       rgba(255,255,255,0.06);   /* 卡片底（透明叠层） */
--card-border:   rgba(255,255,255,0.12);   /* 卡片描边 */
```

### 2.2 度量 / 形状
```css
--nav-h:  64px;    /* 导航栏高度（Layout 布局锚点） */
--radius: 16px;    /* 通用圆角 */
```

### 2.3 派生用法约定（非 token，约定俗成）
- 主渐变统一：`linear-gradient(135deg, var(--primary), var(--primary-light))`
- 标题渐变：`linear-gradient(135deg, #fff 30%, var(--accent))`（hero 用）
- 主色半透明阴影：`rgba(138, 43, 226, 0.4)`（= `--primary` @ 40%，散落于 hover 阴影，后续可抽 `--primary-shadow`）

## 3. 字体
- 全局：`'Noto Sans SC', sans-serif`（body 设定）
- 装饰标题：`'Playfair Display', serif`（英文花体，hero/social 数字）
- 等宽：仅 `code` 用 `ui-monospace, Consolas`

## 4. 组件类命名约定
旧站类名保留（保还原），新组件遵循 BEM-ish：
- 区块：`.page-*`（page-hero / page-title / page-subtitle）
- 卡片：`.collection-card` / `.social-card` / `.info-item`
- 弹窗：`.collection-modal` / `.lightbox` / `.work-modal-*`
- 播放器：`.nav-playlist-*` / `.play-btn` / `.progress-bar`

## 5. 响应式断点
| 断点 | 行为 |
|------|------|
| `max-width: 1024px` | 根字号 16px；h1 56→36px；h2 20px |
| `max-width: 768px` | 单列布局（各 view 内 `@media` 控制） |
| `max-width: 480px` | 紧凑间距 |

## 6. 滚动条（见 C09）
全站 `::-webkit-scrollbar` 通配符兜底（6px 宽、半透明白滑块），例外容器（`.growth-fullscreen-scroll` 等）后置 `!important` 隐藏。**新增可滚动容器无需登记**，自动命中通配规则。

## 7. 暗色 / 亮色
当前 `original.css` 为**固定深色主题**（无 `@media (prefers-color-scheme: dark)` 分支）。`style.css` 曾含 light/dark 双套变量但已删除（与旧站深色基底冲突）。**若未来需亮色模式**：在 `original.css` `:root` 下加 `@media (prefers-color-scheme: light)` 重定义上述 token，业务样式无需改（均已变量化）。

## 8. 已知技术债
1. **散落半透明主色**：`rgba(138,43,226,0.4)` 等出现约 10+ 处，建议抽 `--primary-shadow` token（低优先级，纯重构）。
2. **`linear-gradient` 未抽 token**：渐变表达式是"值"非"变量"，CSS 变量不支持嵌套计算渐变，暂保持字面量。
3. **无组件级 CSS 变量作用域**：所有 token 在 `:root` 全局，无按区块覆写需求，暂不引入 scoped token。

---
*维护说明：新增品牌色必须进 `:root` 并同步本文件 §2；禁止在组件 scoped 块写死 `#8A2BE2` 等。*
