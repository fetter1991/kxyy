'use strict';

/* ===== 相册渲染与合集弹窗 ===== */

let _albumGalleryItems = [];
let _albumLightboxIndex = 0;

function renderAlbum() {
    const grid = document.getElementById('albumGrid');
    if (!grid) return;
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
            _openAlbumModal(idx);
        });
    });
}

function _openAlbumModal(idx) {
    const workModal = document.getElementById('workModal');
    const workModalTitle = document.getElementById('workModalTitle');
    const workModalBody = document.getElementById('workModalBody');
    if (!workModal || !workModalBody) return;

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
            _albumGalleryItems = work.images.map(im => ({ url: im.url, caption: im.caption }));
            _showAlbumLightbox(i);
        });
    });

    workModal.classList.add('show');
}

function _showAlbumLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const workModal = document.getElementById('workModal');
    if (!lightbox || !lightboxImg) return;

    _albumLightboxIndex = index;
    const item = _albumGalleryItems[index];
    lightboxImg.src = item.url;
    lightboxCaption.textContent = item.caption;
    lightboxCounter.textContent = (index + 1) + ' / ' + _albumGalleryItems.length;
    lightbox.classList.add('show');
    if (workModal && workModal.classList.contains('show')) {
        workModal.style.display = 'none';
        lightbox.dataset.fromWorkModal = '1';
    }
}

function _closeAlbumLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    lightbox.classList.remove('show');
    if (lightbox.dataset.fromWorkModal === '1') {
        lightbox.removeAttribute('data-from-work-modal');
        const workModal = document.getElementById('workModal');
        if (workModal) workModal.style.display = '';
    }
}

function initAlbum() {
    const handlers = [];

    const workModal = document.getElementById('workModal');
    const workModalClose = document.getElementById('workModalClose');
    const lightbox = document.getElementById('lightbox');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxClose = document.getElementById('lightboxClose');

    // 渲染作品
    renderAlbum();

    // 作品弹窗关闭
    if (workModalClose) {
        function onCloseClick() { workModal.classList.remove('show'); }
        workModalClose.addEventListener('click', onCloseClick);
        handlers.push([workModalClose, 'click', onCloseClick]);
    }

    // 点击弹窗背景关闭
    if (workModal) {
        function onModalClick(e) {
            if (e.target === workModal) workModal.classList.remove('show');
        }
        workModal.addEventListener('click', onModalClick);
        handlers.push([workModal, 'click', onModalClick]);
    }

    // 灯箱导航
    if (lightboxPrev) {
        function onPrev(e) {
            e.stopPropagation();
            _albumLightboxIndex = (_albumLightboxIndex - 1 + _albumGalleryItems.length) % _albumGalleryItems.length;
            _showAlbumLightbox(_albumLightboxIndex);
        }
        lightboxPrev.addEventListener('click', onPrev);
        handlers.push([lightboxPrev, 'click', onPrev]);
    }

    if (lightboxNext) {
        function onNext(e) {
            e.stopPropagation();
            _albumLightboxIndex = (_albumLightboxIndex + 1) % _albumGalleryItems.length;
            _showAlbumLightbox(_albumLightboxIndex);
        }
        lightboxNext.addEventListener('click', onNext);
        handlers.push([lightboxNext, 'click', onNext]);
    }

    if (lightboxClose) {
        function onClose() { _closeAlbumLightbox(); }
        lightboxClose.addEventListener('click', onClose);
        handlers.push([lightboxClose, 'click', onClose]);
    }

    if (lightbox) {
        function onLightboxClick(e) {
            if (e.target === lightbox) _closeAlbumLightbox();
        }
        lightbox.addEventListener('click', onLightboxClick);
        handlers.push([lightbox, 'click', onLightboxClick]);
    }

    // 键盘控制
    function onKeydown(e) {
        if (!lightbox || !lightbox.classList.contains('show')) return;
        if (e.key === 'ArrowLeft') lightboxPrev && lightboxPrev.click();
        else if (e.key === 'ArrowRight') lightboxNext && lightboxNext.click();
        else if (e.key === 'Escape') _closeAlbumLightbox();
    }
    document.addEventListener('keydown', onKeydown);
    handlers.push([document, 'keydown', onKeydown]);

    // 公共UI
    const cleanupCommon = window.initCommonUI ? window.initCommonUI() : null;

    // 注册 cleanup
    window._currentPageCleanup = function () {
        handlers.forEach(([target, event, fn]) => target.removeEventListener(event, fn));
        _closeWorksLightbox();
        if (workModal) workModal.classList.remove('show');
        if (cleanupCommon) cleanupCommon();
    };
}

// 首次直接加载时自动执行
if (document.getElementById('albumGrid')) {
    initAlbum();
}

// 暴露给 nav-switch.js 用于 AJAX 切换时的页面初始化
window.initAlbum = initAlbum;
