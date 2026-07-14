'use strict';

/* ===== 作品渲染 ===== */
function renderWorks() {
    const grid = document.getElementById('worksGrid');
    grid.innerHTML = worksData.map((w, i) => `
        <div class="work-card" data-index="${i}">
            <div class="work-cover"><img src="${w.cover}" alt="${w.title}" loading="lazy"></div>
            <div class="work-body">
                <div class="work-title">${w.title}</div>
                <div class="work-desc">${w.desc}</div>
                <div class="work-meta">
                    <span><i class="fas fa-heart"></i>${w.likes}</span>
                    <span><i class="fas fa-eye"></i>${w.views}</span>
                </div>
            </div>
        </div>
    `).join('');

    grid.querySelectorAll('.work-card').forEach(card => {
        card.addEventListener('click', () => {
            const idx = parseInt(card.dataset.index);
            openWorkModal(idx);
        });
    });
}

/* ===== 作品合集弹窗 ===== */
const workModal = document.getElementById('workModal');
const workModalTitle = document.getElementById('workModalTitle');
const workModalBody = document.getElementById('workModalBody');
const workModalClose = document.getElementById('workModalClose');

function openWorkModal(idx) {
    const work = worksData[idx];
    workModalTitle.textContent = work.title;
    workModalBody.innerHTML = work.images.map(img => `
        <div class="work-modal-item" data-src="${img.url}" data-caption="${img.caption}">
            <img src="${img.url}" alt="${img.caption}" loading="lazy">
            <div class="item-overlay">${img.caption}</div>
        </div>
    `).join('');

    workModalBody.querySelectorAll('.work-modal-item').forEach((item, i) => {
        item.addEventListener('click', () => {
            currentGalleryItems = work.images.map(im => ({ url: im.url, caption: im.caption }));
            showLightbox(i);
        });
    });

    workModal.classList.add('show');
}

workModalClose.addEventListener('click', () => workModal.classList.remove('show'));
workModal.addEventListener('click', (e) => {
    if (e.target === workModal) workModal.classList.remove('show');
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

/* ===== 初始化 ===== */
renderWorks();
