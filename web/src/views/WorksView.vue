<template>
  <section class="album-section page-section">
    <header class="page-header">
      <h1 class="page-title">精选作品</h1>
      <p class="page-subtitle">每一个画面都是用心之作</p>
    </header>

    <!-- 作品封面列表（.album-grid） -->
    <div v-if="!openedWork" class="album-grid">
      <div
        v-for="work in albums"
        :key="work.id"
        class="work-card"
        @click="openAlbum(work)"
      >
        <div class="work-cover">
          <img :src="resolveUrl(work.cover)" :alt="work.title" />
        </div>
        <div class="work-body">
          <h3 class="work-title">{{ work.title }}</h3>
          <p class="work-desc">{{ work.desc }}</p>
          <div class="work-meta">
            <span><i class="fa-solid fa-folder"></i> {{ work.category }}</span>
            <span><i class="fa-regular fa-heart"></i> {{ work.likes }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 展开的相册瀑布流 -->
    <div v-else class="album-waterfall-wrapper">
      <div class="album-back-bar">
        <button class="album-back-btn" @click="openedWork = null">
          <i class="fa-solid fa-arrow-left"></i> 返回作品集
        </button>
        <h3 class="album-back-title">{{ openedWork.title }}</h3>
      </div>
      <div class="album-waterfall">
        <div
          v-for="(img, idx) in openedWork.images"
          :key="idx"
          class="album-waterfall-item"
          @click="openLightbox(idx)"
        >
          <img :src="resolveUrl(img.url)" :alt="img.caption" />
        </div>
      </div>
    </div>

    <!-- 灯箱 -->
    <teleport to="body">
      <div v-if="lightboxIndex !== null && openedWork" class="lightbox" @click.self="closeLightbox">
        <span class="lightbox-close" @click="closeLightbox">
          <i class="fa-solid fa-xmark"></i>
        </span>
        <img
          class="lightbox-img"
          :src="resolveUrl(openedWork.images[lightboxIndex].url)"
          :alt="openedWork.images[lightboxIndex].caption"
        />
        <div class="lightbox-caption">{{ openedWork.images[lightboxIndex].caption }}</div>
        <button v-if="lightboxIndex > 0" class="lightbox-nav lightbox-prev" @click="prevImage">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <button v-if="lightboxIndex < openedWork.images.length - 1" class="lightbox-nav lightbox-next" @click="nextImage">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDataStore } from '@/stores/data'
import { useAssetUrl as resolveUrl } from '@/utils/asset'
import type { AlbumItem } from '@/types'

const store = useDataStore()
const albums = computed(() => store.albums)

const openedWork = ref<AlbumItem | null>(null)
function openAlbum(work: AlbumItem) {
  openedWork.value = work
}

const lightboxIndex = ref<number | null>(null)
function openLightbox(idx: number) {
  lightboxIndex.value = idx
}
function closeLightbox() {
  lightboxIndex.value = null
}
function prevImage() {
  if (openedWork.value && lightboxIndex.value !== null && lightboxIndex.value > 0) lightboxIndex.value--
}
function nextImage() {
  if (
    openedWork.value &&
    lightboxIndex.value !== null &&
    lightboxIndex.value < openedWork.value.images.length - 1
  )
    lightboxIndex.value++
}
</script>
