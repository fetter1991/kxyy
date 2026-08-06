// 媒体 URL 解析（T04 补全）：SPA 路径安全
// 原站 data.js 用 '../assets/...'（子页面相对），SPA base 为 '/' 下会错位。
// 统一转换为 `${BASE_URL}assets/...`，BASE_URL 默认 '/'（dev）/ 部署子路径可配。
const BASE = import.meta.env.BASE_URL || '/'

export function useAssetUrl(raw: string | undefined | null): string {
  if (!raw) return ''
  let p = raw.trim()
  // 去掉 '../' 或 './' 前缀
  p = p.replace(/^(\.\.\/|\.\/)+/, '')
  // 已经是以 assets/ 或 /assets/ 开头 → 补全 base
  if (p.startsWith('assets/')) return BASE + p
  if (p.startsWith('/assets/')) return BASE + p.slice(1)
  // 其它绝对/相对 → 直接拼 base
  return BASE + p.replace(/^\//, '')
}
