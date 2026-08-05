// ===== 素材库：素材合集卡片 + 标签筛选 + 合集弹窗（含打包下载）=====
// 19.2：素材页保留标签，16:9 每张合集卡片，每行 4 张（响应式 4/2/1）
// 19.3：点击合集卡片弹窗，左侧大图预览，右侧标题/作者/缩略图列表/说明/下载按钮
/* global JSZip */

function initGallery() {
    const grid = document.getElementById('galleryGrid');
    const filters = document.getElementById('galleryFilters');
    if (!grid) return;

    // 原始数据顺序即展示顺序，标签筛选维度按合集 filter
    const collections = (typeof galleryData !== 'undefined' ? galleryData : []) || [];

    // 构建标签（全部 + 各分类），保留原 active 配置
    let activeFilter = 'all';
    if (filters) {
        const filterConfig = [
            { key: 'all', label: '全部' },
            { key: 'fashion', label: '时尚' },
            { key: 'style', label: '风格' },
            { key: 'scene', label: '场景' },
            { key: 'vibe', label: '氛围' }
        ];
        // 仅保留实际存在的分类
        const existFilters = new Set(collections.map(c => c.filter));
        const shown = filterConfig.filter(f => f.key === 'all' || existFilters.has(f.key));
        filters.innerHTML = shown.map(f =>
            `<button class="filter-btn${f.key === activeFilter ? ' active' : ''}" data-filter="${f.key}">${f.label}</button>`
        ).join('');

        filters.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;
            activeFilter = btn.dataset.filter;
            filters.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
            render();
        });
    }

    function render() {
        const list = collections.filter(c => activeFilter === 'all' || c.filter === activeFilter);
        grid.innerHTML = list.map(c => `
            <div class="collection-card" data-index="${collections.indexOf(c)}">
                <div class="collection-cover">
                    <img src="${c.cover}" alt="${c.title}" loading="lazy">
                    <div class="collection-count"><i class="fas fa-images"></i> ${c.images.length}</div>
                </div>
                <div class="collection-info">
                    <div class="collection-title">${c.title}</div>
                    <div class="collection-author"><i class="fas fa-user"></i> ${c.author}</div>
                </div>
            </div>
        `).join('');
    }

    // 点击合集卡片打开弹窗
    grid.addEventListener('click', (e) => {
        const card = e.target.closest('.collection-card');
        if (!card) return;
        const idx = parseInt(card.dataset.index, 10);
        openCollectionModal(collections[idx]);
    });

    render();
}

// ===== 素材库内轻量灯箱（供合集大图点击放大，复用 #lightbox）=====
let galleryLightboxItems = [];
let galleryLightboxIndex = 0;

function openLightbox(images, index) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    if (!lightbox || !img) return;
    galleryLightboxItems = images;
    galleryLightboxIndex = index;
    img.src = images[index];
    lightbox.classList.add('show');
    bindGalleryLightbox(); // 每次打开时按需绑定（nav-switch 会在切换页时替换 #lightbox）
}

// 幂等绑定：nav-switch 切换页面会移除并重建 #lightbox，故每次打开时重绑
function bindGalleryLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || lightbox.dataset.bound === '1') return;
    lightbox.dataset.bound = '1';
    const prev = document.getElementById('lightboxPrev');
    const next = document.getElementById('lightboxNext');
    const close = document.getElementById('lightboxClose');
    const show = (i) => {
        galleryLightboxIndex = (i + galleryLightboxItems.length) % galleryLightboxItems.length;
        document.getElementById('lightboxImg').src = galleryLightboxItems[galleryLightboxIndex];
    };
    if (prev) prev.addEventListener('click', (e) => { e.stopPropagation(); show(galleryLightboxIndex - 1); });
    if (next) next.addEventListener('click', (e) => { e.stopPropagation(); show(galleryLightboxIndex + 1); });
    if (close) close.addEventListener('click', () => lightbox.classList.remove('show'));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('show'); });
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('show')) return;
        if (e.key === 'ArrowLeft') show(galleryLightboxIndex - 1);
        else if (e.key === 'ArrowRight') show(galleryLightboxIndex + 1);
        else if (e.key === 'Escape') lightbox.classList.remove('show');
    });
}

window.openLightbox = openLightbox; // 供合集大图点击放大复用

// ===== 素材合集弹窗 =====
function openCollectionModal(collection) {
    const modal = document.getElementById('collectionModal');
    if (!modal || !collection) return;

    const titleEl = document.getElementById('collectionModalTitle');
    const bodyEl = document.getElementById('collectionModalBody');

    // 弹窗标题栏：大字体标题 -- 小字体作者
    const filterLabelMap = { fashion: '时尚', style: '风格', scene: '场景', vibe: '氛围' };
    const filterLabel = filterLabelMap[collection.filter] || collection.filter || '';
    titleEl.innerHTML = `
        <span class="collection-modal-title-main">${collection.title}</span>
        <span class="collection-modal-title-sub">-- ${collection.author}</span>
    `;

    // 左侧大图预览 + 右侧信息（标签/缩略图列表/说明/下载）
    const images = collection.images || [];
    bodyEl.innerHTML = `
        <div class="collection-preview">
            <img src="${images[0]?.url || ''}" alt="${collection.title}" id="collectionPreviewImg">
        </div>
        <div class="collection-detail">
            <div class="collection-detail-tags">
                <span class="collection-tag">${filterLabel}</span>
            </div>
            <div class="collection-thumbs" id="collectionThumbs">
                ${images.map((img, i) => `
                    <div class="collection-thumb${i === 0 ? ' active' : ''}" data-url="${img.url}">
                        <img src="${img.url}" alt="${img.caption || ''}" loading="lazy">
                    </div>
                `).join('')}
            </div>
            <p class="collection-detail-desc">${collection.desc || ''}</p>
            <button class="collection-download-btn" id="collectionDownloadBtn">
                <i class="fas fa-download"></i> 打包下载合集（${images.length} 张）
            </button>
        </div>
    `;

    // 缩略图切换左侧大图
    const previewImg = document.getElementById('collectionPreviewImg');
    bodyEl.querySelectorAll('.collection-thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
            bodyEl.querySelectorAll('.collection-thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            previewImg.src = thumb.dataset.url;
        });
    });

    // 点击大图用灯箱查看（复用全局灯箱）
    previewImg.style.cursor = 'zoom-in';
    previewImg.addEventListener('click', () => {
        if (window.openLightbox) {
            window.openLightbox(images.map(im => im.url), Array.prototype.indexOf.call(
                bodyEl.querySelectorAll('.collection-thumb'),
                bodyEl.querySelector('.collection-thumb.active')
            ));
        }
    });

    // 打包下载（JSZip）
    const dlBtn = document.getElementById('collectionDownloadBtn');
    dlBtn.addEventListener('click', () => downloadCollection(collection));

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeCollectionModal() {
    const modal = document.getElementById('collectionModal');
    if (!modal) return;
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// 打包下载合集全部图片
async function downloadCollection(collection) {
    const images = collection.images || [];
    if (!images.length) return;
    const btn = document.getElementById('collectionDownloadBtn');
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 打包中…';

    try {
        const zip = new JSZip();
        const folder = zip.folder(collection.title || 'collection');
        const extOf = (url) => (url.split('?')[0].split('.').pop() || 'jpg').split('/').pop();
        await Promise.all(images.map(async (img, i) => {
            const res = await fetch(img.url);
            const blob = await res.blob();
            const name = `${String(i + 1).padStart(2, '0')}_${extOf(img.url)}`;
            folder.file(name, blob);
        }));
        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(collection.title || 'collection').replace(/[\\/:*?"<>|]/g, '_')}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    } catch (err) {
        console.error('打包下载失败：', err);
        alert('打包下载失败，请稍后重试。');
    } finally {
        btn.disabled = false;
        btn.innerHTML = original;
    }
}

// 绑定弹窗关闭 + 灯箱
document.addEventListener('DOMContentLoaded', () => {
    bindGalleryLightbox();
    const modal = document.getElementById('collectionModal');
    if (!modal) return;
    const closeBtn = document.getElementById('collectionModalClose');
    if (closeBtn) closeBtn.addEventListener('click', closeCollectionModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeCollectionModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) closeCollectionModal();
    });
});
