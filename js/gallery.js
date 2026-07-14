'use strict';

/* ===== 图库渲染与筛选 ===== */
const galleryGrid = document.getElementById('galleryGrid');
const filterBtns = document.querySelectorAll('.filter-btn');

function renderGallery(filter) {
    const items = filter === 'all' ? galleryData : galleryData.filter(item => item.filter === filter);
    galleryGrid.innerHTML = items.map(item => `
        <div class="gallery-item" data-src="${item.url}" data-caption="${item.caption}">
            <img src="${item.url}" alt="${item.caption}" loading="lazy">
            <div class="gallery-overlay">
                <span class="gallery-tag">${item.tag}</span>
            </div>
        </div>
    `).join('');
    bindLightbox();
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderGallery(btn.dataset.filter);
    });
});

/* ===== 灯箱 ===== */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxCounter = document.getElementById('lightboxCounter');

let currentGalleryItems = [];
let currentLightboxIndex = 0;

function showLightbox(index) {
    currentLightboxIndex = index;
    const item = currentGalleryItems[index];
    lightboxImg.src = item.url;
    lightboxCaption.textContent = item.caption;
    lightboxCounter.textContent = (index + 1) + ' / ' + currentGalleryItems.length;
    lightbox.classList.add('show');
    if (workModal && workModal.classList.contains('show')) {
        workModal.style.display = 'none';
        lightbox.dataset.fromWorkModal = '1';
    }
}

function bindLightbox() {
    document.querySelectorAll('.gallery-item').forEach((item, i) => {
        item.addEventListener('click', () => {
            currentGalleryItems = Array.from(document.querySelectorAll('.gallery-item')).map(el => ({
                url: el.dataset.src,
                caption: el.dataset.caption
            }));
            showLightbox(i);
        });
    });
}

lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    currentLightboxIndex = (currentLightboxIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length;
    showLightbox(currentLightboxIndex);
});

lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    currentLightboxIndex = (currentLightboxIndex + 1) % currentGalleryItems.length;
    showLightbox(currentLightboxIndex);
});

lightboxClose.addEventListener('click', () => closeLightbox());
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

function closeLightbox() {
    lightbox.classList.remove('show');
    if (lightbox.dataset.fromWorkModal === '1') {
        lightbox.removeAttribute('data-from-work-modal');
        if (workModal) workModal.style.display = '';
    }
}

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('show')) return;
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    else if (e.key === 'ArrowRight') lightboxNext.click();
    else if (e.key === 'Escape') closeLightbox();
});

/* ===== 导航栏滚动效果 ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.25)';
        navbar.style.boxShadow = '0 4px 32px rgba(0,0,0,0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.15)';
        navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.1)';
    }
});

/* ===== 回到顶部按钮 ===== */
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== 导航栏汉堡菜单 ===== */
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navMenu.classList.toggle('open');
    navToggle.classList.toggle('active');
});
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open')) {
        if (!navbar.contains(e.target)) {
            navMenu.classList.remove('open');
            navToggle.classList.remove('active');
        }
    }
});

/* ===== 导航栏播放器按钮 - 跳转到音乐页面 ===== */
const navMusicBtn = document.getElementById('navMusicBtn');
if (navMusicBtn) {
    navMusicBtn.addEventListener('click', () => {
        window.location.href = 'pages/music.html';
    });
}

/* ===== 初始化 ===== */
renderGallery('all');