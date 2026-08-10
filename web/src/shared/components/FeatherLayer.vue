<script setup lang="ts">
/**
 * C04 · 羽毛飘动氛围层（组件化自 assets/js/feathers.js）
 *
 * 与旧实现的差异说明：
 * 1. 旧站手工 createElement/appendChild 管理 DOM；这里由 v-for 渲染，
 *    动画帧内仅改 style.transform / opacity（与旧站一致，不触发重排）。
 *    粒子对象持有 el 引用，避免每帧走 Vue 响应式（≈11 个粒子 × 60fps 的
 *    响应式更新会造成不必要的 patch 开销）。
 * 2. 旧站 detectBasePath() 靠 location.pathname 判断 '/pages/'；SPA 下该判断
 *    失效，改用 useAssetUrl() 统一解析（原则 2 / T04 约定）。
 * 3. 新增 prefers-reduced-motion 降级：用户开启"减少动态效果"时不渲染本层。
 * 4. onBeforeUnmount 统一 cancelAnimationFrame + clearTimeout + 移除 resize
 *    监听，杜绝路由切换后的残留实例（原则 10 P1）。
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useAssetUrl } from '@/utils/asset'

const FEATHER_SRCS: string[] = [
  'assets/img/global/feather0.png',
  'assets/img/global/feather1.png',
  'assets/img/global/feather2.png',
  'assets/img/global/feather3.png',
].map((p) => useAssetUrl(p))

const MAX_FEATHERS = 11 // 旧站 adjustCount 上限 6+4
const INIT_COUNT = 3 // 旧站 init() 初始 3 片

// 降级：尊重系统"减少动态效果"偏好
const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const enabled = ref(!reducedMotion)

// 渲染槽位：固定 MAX_FEATHERS 个 <img>，通过 active 控制是否参与动画，
// 避免频繁增删 DOM 节点。
interface Slot {
  key: number
  src: string
}
const slots = ref<Slot[]>(
  Array.from({ length: MAX_FEATHERS }, (_, i) => ({ key: i, src: FEATHER_SRCS[0] })),
)
const imgRefs = ref<(HTMLImageElement | null)[]>([])

class Feather {
  el: HTMLImageElement
  size = 0
  x = 0
  y = 0
  vx = 0
  vy = 0
  rotation = 0
  rotationSpeed = 0
  swayAmp = 0
  swayFreq = 0
  swayPhase = 0
  time = 0
  baseOpacity = 0
  opacityAmp = 0
  opacityFreq = 0
  fadeIn = 0

  constructor(el: HTMLImageElement, initial: boolean) {
    this.el = el
    this.reset(initial)
  }

  reset(initial: boolean) {
    const size = 30 + Math.random() * 35 // 30~65px
    this.size = size
    this.el.style.width = `${size}px`
    this.el.style.height = 'auto'

    this.x = Math.random() * (canvasW - size) + size * 0.5
    this.y = initial ? Math.random() * (canvasH - size) + size * 0.5 : Math.random() * canvasH

    const angle = Math.random() * Math.PI * 2
    const speed = 0.15 + Math.random() * 0.35
    this.vx = Math.cos(angle) * speed
    this.vy = Math.sin(angle) * speed

    this.rotation = Math.random() * 360
    this.rotationSpeed = (Math.random() - 0.5) * 0.4

    this.swayAmp = 0.3 + Math.random() * 0.6
    this.swayFreq = 0.005 + Math.random() * 0.01
    this.swayPhase = Math.random() * Math.PI * 2
    this.time = Math.random() * 1000

    this.baseOpacity = 0.35 + Math.random() * 0.35
    this.opacityAmp = 0.1 + Math.random() * 0.15
    this.opacityFreq = 0.003 + Math.random() * 0.005

    this.fadeIn = initial ? 1 : 0
    this.el.style.transition = ''
  }

  update() {
    this.time++

    const swayX = Math.sin(this.time * this.swayFreq + this.swayPhase) * this.swayAmp
    const swayY = Math.cos(this.time * this.swayFreq * 0.7 + this.swayPhase) * this.swayAmp * 0.5

    this.x += this.vx + swayX
    this.y += this.vy + swayY
    this.rotation += this.rotationSpeed

    const half = this.size * 0.5
    if (this.x < half) {
      this.x = half
      this.vx = Math.abs(this.vx) * 0.8
    }
    if (this.x > canvasW - half) {
      this.x = canvasW - half
      this.vx = -Math.abs(this.vx) * 0.8
    }
    if (this.y < half) {
      this.y = half
      this.vy = Math.abs(this.vy) * 0.8
    }
    if (this.y > canvasH - half) {
      this.y = canvasH - half
      this.vy = -Math.abs(this.vy) * 0.8
    }

    // 偶尔微调方向，模拟风的变化
    if (Math.random() < 0.002) {
      const angle = Math.random() * Math.PI * 2
      const speed = 0.15 + Math.random() * 0.35
      this.vx = Math.cos(angle) * speed
      this.vy = Math.sin(angle) * speed
    }

    if (this.fadeIn < 1) this.fadeIn = Math.min(1, this.fadeIn + 0.01)

    const opacity =
      (this.baseOpacity + Math.sin(this.time * this.opacityFreq) * this.opacityAmp) * this.fadeIn

    this.el.style.transform = `translate(${this.x - half}px, ${this.y - half}px) rotate(${this.rotation}deg)`
    this.el.style.opacity = opacity.toFixed(3)
  }
}

let canvasW = typeof window !== 'undefined' ? window.innerWidth : 0
let canvasH = typeof window !== 'undefined' ? window.innerHeight : 0
let animId: number | null = null
let countTimer: number | null = null
let feathers: Feather[] = []
let liveCount = 0 // 当前参与动画的槽位数

function randomSrc() {
  return FEATHER_SRCS[Math.floor(Math.random() * FEATHER_SRCS.length)]
}

function activate(index: number, initial: boolean) {
  const el = imgRefs.value[index]
  if (!el) return
  slots.value[index].src = randomSrc()
  el.style.display = ''
  feathers[index] = new Feather(el, initial)
}

function deactivate(index: number) {
  const el = imgRefs.value[index]
  if (!el) return
  // 旧站 fadeOutRemove：1.5s 淡出后移除；这里淡出后隐藏槽位以便复用
  el.style.transition = 'opacity 1.5s ease'
  el.style.opacity = '0'
  delete feathers[index]
  window.setTimeout(() => {
    if (el.style.opacity === '0') el.style.display = 'none'
  }, 1600)
}

// 动态调整数量：6~11 片（旧站 adjustCount）
function adjustCount() {
  const target = 6 + Math.floor(Math.random() * 5)
  while (liveCount < target && liveCount < MAX_FEATHERS) {
    activate(liveCount, false)
    liveCount++
  }
  while (liveCount > target) {
    liveCount--
    deactivate(liveCount)
  }
}

function animate() {
  for (let i = 0; i < liveCount; i++) feathers[i]?.update()
  animId = requestAnimationFrame(animate)
}

function onResize() {
  canvasW = window.innerWidth
  canvasH = window.innerHeight
}

function scheduleAdjust() {
  const delay = 8000 + Math.random() * 7000 // 旧站 8~15s
  countTimer = window.setTimeout(() => {
    adjustCount()
    scheduleAdjust()
  }, delay)
}

onMounted(() => {
  if (!enabled.value) return
  // 先隐藏全部槽位，再按初始数量激活
  imgRefs.value.forEach((el) => {
    if (el) el.style.display = 'none'
  })
  for (let i = 0; i < INIT_COUNT; i++) {
    activate(i, true)
    liveCount++
  }
  animate()
  scheduleAdjust()
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  if (animId !== null) cancelAnimationFrame(animId)
  if (countTimer !== null) window.clearTimeout(countTimer)
  animId = null
  countTimer = null
  feathers = []
  liveCount = 0
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <div v-if="enabled" id="featherLayer">
    <img
      v-for="(slot, i) in slots"
      :key="slot.key"
      :ref="(el) => (imgRefs[i] = el as HTMLImageElement | null)"
      :src="slot.src"
      class="feather-particle"
      alt=""
      draggable="false"
    />
  </div>
</template>
