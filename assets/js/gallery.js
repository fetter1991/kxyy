'use strict';

/* ===== 图库渲染与筛选 ===== */

let currentGalleryItems = [];
let currentLightboxIndex = 0;

function renderGallery(filter) {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
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

function showLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCounter = document.getElementById('lightboxCounter');
    if (!lightbox || !lightboxImg) return;

    currentLightboxIndex = index;
    const item = currentGalleryItems[index];
    lightboxImg.src = item.url;
    lightboxCaption.textContent = item.caption;
    lightboxCounter.textContent = (index + 1) + ' / ' + currentGalleryItems.length;
    lightbox.classList.add('show');
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    lightbox.classList.remove('show');
    if (lightbox.dataset.fromWorkModal === '1') {
        lightbox.removeAttribute('data-from-work-modal');
        const workModal = document.getElementById('workModal');
        if (workModal) workModal.style.display = '';
    }
}

// 初始化函数（由 nav-switch 调用）
function initGallery() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const handlers = [];

    // 筛选按钮
    filterBtns.forEach(btn => {
        function onFilterClick() {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderGallery(btn.dataset.filter);
        }
        btn.addEventListener('click', onFilterClick);
        handlers.push([btn, 'click', onFilterClick]);
    });

    // 灯箱导航
    const lightbox = document.getElementById('lightbox');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxClose = document.getElementById('lightboxClose');

    if (lightboxPrev) {
        function onPrev(e) {
            e.stopPropagation();
            currentLightboxIndex = (currentLightboxIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length;
            showLightbox(currentLightboxIndex);
        }
        lightboxPrev.addEventListener('click', onPrev);
        handlers.push([lightboxPrev, 'click', onPrev]);
    }

    if (lightboxNext) {
        function onNext(e) {
            e.stopPropagation();
            currentLightboxIndex = (currentLightboxIndex + 1) % currentGalleryItems.length;
            showLightbox(currentLightboxIndex);
        }
        lightboxNext.addEventListener('click', onNext);
        handlers.push([lightboxNext, 'click', onNext]);
    }

    if (lightboxClose) {
        function onClose() { closeLightbox(); }
        lightboxClose.addEventListener('click', onClose);
        handlers.push([lightboxClose, 'click', onClose]);
    }

    if (lightbox) {
        function onLightboxClick(e) {
            if (e.target === lightbox) closeLightbox();
        }
        lightbox.addEventListener('click', onLightboxClick);
        handlers.push([lightbox, 'click', onLightboxClick]);
    }

    function onKeydown(e) {
        if (!lightbox || !lightbox.classList.contains('show')) return;
        if (e.key === 'ArrowLeft') lightboxPrev && lightboxPrev.click();
        else if (e.key === 'ArrowRight') lightboxNext && lightboxNext.click();
        else if (e.key === 'Escape') closeLightbox();
    }
    document.addEventListener('keydown', onKeydown);
    handlers.push([document, 'keydown', onKeydown]);

    // 渲染图库
    renderGallery('all');

    // 公共UI
    const cleanupCommon = window.initCommonUI ? window.initCommonUI() : null;

    // 注册 cleanup
    window._currentPageCleanup = function () {
        handlers.forEach(([target, event, fn]) => {
            target.removeEventListener(event, fn);
        });
        if (cleanupCommon) cleanupCommon();
        closeLightbox();
    };
}

// 首次直接加载时自动执行
if (document.getElementById('galleryGrid')) {
    initGallery();
}
