<template>
  <section class="profile-section page-section">
    <div class="profile-hero">
      <div class="profile-hero-bg"></div>
      <div class="profile-hero-content">
        <!-- 左侧 -->
        <div class="profile-left">
          <div class="profile-avatar-wrap">
            <div class="profile-avatar-ring">
              <img class="profile-avatar-img" :src="resolveUrl(profile.avatar)" :alt="profile.name" />
            </div>
          </div>
          <div class="profile-actions">
            <a :href="profile.links.douyin" target="_blank" class="profile-btn profile-btn-primary">
              <i class="fa-brands fa-tiktok"></i> 访问主页
            </a>
            <a :href="profile.links.live" target="_blank" class="profile-btn profile-btn-secondary">
              <i class="fa-solid fa-sign-in-alt"></i> 进入直播间
            </a>
          </div>
          <div class="profile-avatar-title-section">
            <div class="profile-title-en">{{ profile.englishName }}</div>
            <h2 class="profile-title-cn">{{ profile.name }}</h2>
            <p class="profile-title-tagline">{{ profile.tagline }}</p>
          </div>
        </div>

        <!-- 右侧 -->
        <div class="profile-right">
          <div class="profile-info-panel">
            <div class="panel-header"><i class="fa-solid fa-id-card"></i> 个人档案</div>
            <div class="profile-info-grid">
              <div class="info-item"><i class="fa-solid fa-ruler-vertical"></i><span class="info-label">身高</span><span class="info-value">{{ profile.info.height }}</span></div>
              <div class="info-item"><i class="fa-solid fa-weight-hanging"></i><span class="info-label">体重</span><span class="info-value">{{ profile.info.weight }}</span></div>
              <div class="info-item"><i class="fa-solid fa-birthday-cake"></i><span class="info-label">生日</span><span class="info-value">{{ profile.info.birthday }}</span></div>
              <div class="info-item"><i class="fa-solid fa-map-marker-alt"></i><span class="info-label">籍贯</span><span class="info-value">{{ profile.info.hometown }}</span></div>
              <div class="info-item"><i class="fa-solid fa-star"></i><span class="info-label">星座</span><span class="info-value">{{ profile.info.zodiac }}</span></div>
              <div class="info-item"><i class="fa-solid fa-calendar-day"></i><span class="info-label">出生年份</span><span class="info-value">{{ profile.info.birthYear }}</span></div>
            </div>
          </div>

          <div class="profile-bio-card">
            <h3><i class="fa-solid fa-heart"></i> 个人简介</h3>
            <p>{{ profile.bio }}</p>
          </div>

          <div class="profile-birthday-section">
            <div class="section-title-center">
              <h2>距元元生日还有</h2>
              <div class="title-line"></div>
            </div>
            <div class="countdown">
              <div class="count-box"><span class="count-num">{{ cd.days }}</span><span class="count-label">天</span></div>
              <div class="count-sep">:</div>
              <div class="count-box"><span class="count-num">{{ cd.hours }}</span><span class="count-label">时</span></div>
              <div class="count-sep">:</div>
              <div class="count-box"><span class="count-num">{{ cd.minutes }}</span><span class="count-label">分</span></div>
              <div class="count-sep">:</div>
              <div class="count-box"><span class="count-num">{{ cd.seconds }}</span><span class="count-label">秒</span></div>
            </div>
            <p class="birthday-date">🎂 2002年6月21日 · 巨蟹座</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onUnmounted } from 'vue'
import { useDataStore } from '@/stores/data'
import { useAssetUrl as resolveUrl } from '@/utils/asset'

const store = useDataStore()
const profile = computed(() => store.profile!)

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

function getNextBirthday() {
  const now = new Date()
  const year = now.getFullYear()
  let bd = new Date(year, 5, 21, 0, 0, 0)
  if (bd.getTime() <= now.getTime()) {
    bd = new Date(year + 1, 5, 21, 0, 0, 0)
  }
  return bd
}

function calcDiff() {
  const diff = getNextBirthday().getTime() - Date.now()
  const seconds = Math.floor((diff / 1000) % 60)
  const minutes = Math.floor((diff / 1000 / 60) % 60)
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  return { days: days.toString(), hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds) }
}

const cd = ref(calcDiff())
const timer = setInterval(() => {
  cd.value = calcDiff()
}, 1000)
onUnmounted(() => clearInterval(timer))
</script>
