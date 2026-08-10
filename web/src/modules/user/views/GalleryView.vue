<template>
  <section class="gallery-section page-section">
    <header class="page-header">
      <h1 class="page-title">图库画廊</h1>
      <p class="page-subtitle">珍藏每一个闪耀瞬间</p>
    </header>

    <div class="library-filters">
      <button
        v-for="cat in categories"
        :key="cat.value"
        class="filter-btn"
        :class="{ active: activeCategory === cat.value }"
        @click="activeCategory = cat.value"
      >
        {{ cat.label }}
      </button>
    </div>

    <div class="library-grid collection-grid">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="collection-card"
        @click="openCollection(item)"
      >
        <div class="collection-cover">
          <img :src="resolveUrl(item.cover)" :alt="item.title" />
          <div class="collection-count">
            <i class="fa-solid fa-images"></i>
            <span>{{ item.images.length }}</span>
          </div>
        </div>
        <div class="collection-info">
          <h3 class="collection-title">{{ item.title }}</h3>
          <div class="collection-author">
            <i class="fa-solid fa-user"></i>
            <span>{{ item.author }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 合集弹窗 -->
    <teleport to="body">
      <div v-if="activeItem" class="collection-modal" @click.self="closeCollection">
        <div class="collection-modal-content">
          <div class="collection-modal-header">
            <div class="collection-modal-title">
              <span class="collection-modal-title-main">{{ activeItem.title }}</span>
              <span class="collection-modal-title-sub">— {{ activeItem.author }}</span>
            </div>
            <button class="collection-modal-close" @click="closeCollection">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="collection-modal-body">
            <div class="collection-preview">
              <img
                id="collectionPreviewImg"
                :src="resolveUrl(activeImage ? activeImage.url : activeItem.cover)"
                :alt="activeImage?.caption || activeItem.title"
                @click="openLightbox(activeIndex)"
              />
            </div>
            <div class="collection-detail">
              <div class="collection-detail-tags">
                <span class="collection-tag">{{ categoryLabel(activeItem.category) }}</span>
              </div>
              <div class="collection-thumbs">
                <div
                  v-for="(img, idx) in activeItem.images"
                  :key="idx"
                  class="collection-thumb"
                  :class="{ active: activeIndex === idx }"
                  @click="activeIndex = idx"
                >
                  <img :src="resolveUrl(img.url)" :alt="img.caption" />
                </div>
              </div>
              <p class="collection-detail-desc">{{ activeItem.desc }}</p>
              <button class="collection-download-btn" disabled>
                <i class="fa-solid fa-download"></i>
                打包下载合集 ({{ activeItem.images.length }}张)
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- 灯箱 -->
    <teleport to="body">
      <div v-if="lightboxIndex !== null" class="lightbox" @click.self="closeLightbox">
        <span class="lightbox-close" @click="closeLightbox">
          <i class="fa-solid fa-xmark"></i>
        </span>
        <img
          class="lightbox-img"
          :src="resolveUrl(activeItem!.images[lightboxIndex].url)"
          :alt="activeItem!.images[lightboxIndex].caption"
        />
        <div class="lightbox-caption">{{ activeItem!.images[lightboxIndex].caption }}</div>
        <button v-if="lightboxIndex > 0" class="lightbox-nav lightbox-prev" @click="prevImage">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <button
          v-if="lightboxIndex < (activeItem?.images.length || 0) - 1"
          class="lightbox-nav lightbox-next"
          @click="nextImage"
        >
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
import type { GalleryItem } from '@/types'

const store = useDataStore()

const categories = [
  { value: 'all', label: '全部' },
  { value: 'fashion', label: '时尚' },
  { value: 'style', label: '风格' },
  { value: 'scene', label: '场景' },
  { value: 'vibe', label: '氛围' },
]

const activeCategory = ref('all')
const items = computed(() => store.galleries)
const filteredItems = computed(() =>
  activeCategory.value === 'all'
    ? items.value
    : items.value.filter((i: GalleryItem) => i.category === activeCategory.value)
)

const activeItem = ref<GalleryItem | null>(null)
const activeIndex = ref(0)
const activeImage = computed(() => activeItem.value?.images[activeIndex.value] ?? null)

function openCollection(item: GalleryItem) {
  activeItem.value = item
  activeIndex.value = 0
}

function closeCollection() {
  activeItem.value = null
  activeIndex.value = 0
  lightboxIndex.value = null
}

function categoryLabel(value: string) {
  return categories.find((c) => c.value === value)?.label ?? value
}

const lightboxIndex = ref<number | null>(null)
function openLightbox(idx: number) {
  lightboxIndex.value = idx
}
function closeLightbox() {
  lightboxIndex.value = null
}
function prevImage() {
  if (lightboxIndex.value !== null && lightboxIndex.value > 0) lightboxIndex.value--
}
function nextImage() {
  if (
    lightboxIndex.value !== null &&
    activeItem.value &&
    lightboxIndex.value < activeItem.value.images.length - 1
  )
    lightboxIndex.value++
}
</script>
