// ===== 相册页：封面点击当前页展开瀑布流（19.4：平铺瀑布流 + 返回不刷新 + 保留灯箱）=====
// 点击封面：当前页内展开瀑布流（CSS columns 容器定宽），支持返回列表不刷新页面；点击图片打开灯箱

let albumReturnState = null; // 记录返回时的滚动位置

function initAlbum() {
    const grid = document.getElementById('albumGrid');
    if (!grid) return;

    const works = (typeof worksData !== 'undefined' ? worksData : []) || [];

    // 渲染封面列表
    function renderCovers() {
        grid.className = 'album-grid';
        grid.innerHTML = works.map((w, i) => `
            <div class="work-card" data-index="${i}">
                <div class="work-cover">
                    <img src="${w.cover}" alt="${w.title}" loading="lazy">
                </div>
                <div class="work-body">
                    <div class="work-title">${w.title}</div>
                    <div class="work-desc">${w.desc || ''}</div>
                    <div class="work-meta">
                        <span><i class="far fa-image"></i> ${(w.images || []).length} 张</span>
                        <span><i class="far fa-heart"></i> ${w.likes || ''}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 渲染某合集的瀑布流（当前页展开，不跳页）
    function renderWaterfall(index) {
        const work = works[index];
        if (!work) return;
        albumReturnState = window.scrollY || document.documentElement.scrollTop || 0;
        grid.className = 'album-waterfall';
        grid.innerHTML = (work.images || []).map(img => `
            <div class="album-waterfall-item" data-src="${img.url}">
                <img src="${img.url}" alt="${img.caption || work.title}" loading="lazy">
            </div>
        `).join('');

        // 顶部返回栏（不重复创建）
        let bar = document.getElementById('albumBackBar');
        if (!bar) {
            bar = document.createElement('div');
            bar.className = 'album-back-bar';
            bar.id = 'albumBackBar';
            bar.innerHTML = `<button class="album-back-btn"><i class="fas fa-arrow-left"></i> 返回作品列表</button><span class="album-back-title"></span>`;
            bar.querySelector('.album-back-btn').addEventListener('click', () => {
                bar.remove();
                renderCovers();
                window.scrollTo({ top: albumReturnState || 0, behavior: 'auto' });
            });
        }
        bar.querySelector('.album-back-title').textContent = work.title;
        grid.parentNode.insertBefore(bar, grid);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 事件委托：封面 -> 展开；瀑布流图片 -> 灯箱
    grid.addEventListener('click', (e) => {
        const card = e.target.closest('.work-card');
        if (card) {
            renderWaterfall(parseInt(card.dataset.index, 10));
            return;
        }
        const item = e.target.closest('.album-waterfall-item');
        if (item) {
            const imgs = Array.from(grid.querySelectorAll('.album-waterfall-item')).map(el => el.dataset.src);
            const idx = imgs.indexOf(item.dataset.src);
            if (window.openLightbox) window.openLightbox(imgs, idx);
        }
    });

    renderCovers();
}

// ===== 相册页灯箱（album.html 不加载 main.js，故在此绑定，兼容 workModal 与瀑布流）=====
let albumLightboxItems = [];
let albumLightboxIndex = 0;

function openAlbumLightbox(images, index) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    const counter = document.getElementById('lightboxCounter');
    if (!lightbox || !img) return;
    albumLightboxItems = images;
    albumLightboxIndex = index;
    img.src = images[index];
    if (caption) caption.textContent = '';
    if (counter) counter.textContent = (index + 1) + ' / ' + images.length;
    lightbox.classList.add('show');
    bindAlbumLightbox(); // 每次打开时按需绑定（nav-switch 会在切换页时替换 #lightbox）
}

// 幂等绑定：nav-switch 切换页面会移除并重建 #lightbox，故每次打开时重绑
function bindAlbumLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || lightbox.dataset.bound === '1') return;
    lightbox.dataset.bound = '1';
    const prev = document.getElementById('lightboxPrev');
    const next = document.getElementById('lightboxNext');
    const close = document.getElementById('lightboxClose');
    const show = (i) => {
        albumLightboxIndex = (i + albumLightboxItems.length) % albumLightboxItems.length;
        const img = document.getElementById('lightboxImg');
        img.src = albumLightboxItems[albumLightboxIndex];
        const counter = document.getElementById('lightboxCounter');
        if (counter) counter.textContent = (albumLightboxIndex + 1) + ' / ' + albumLightboxItems.length;
    };
    if (prev) prev.addEventListener('click', (e) => { e.stopPropagation(); show(albumLightboxIndex - 1); });
    if (next) next.addEventListener('click', (e) => { e.stopPropagation(); show(albumLightboxIndex + 1); });
    if (close) close.addEventListener('click', () => lightbox.classList.remove('show'));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('show'); });
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('show')) return;
        if (e.key === 'ArrowLeft') show(albumLightboxIndex - 1);
        else if (e.key === 'ArrowRight') show(albumLightboxIndex + 1);
        else if (e.key === 'Escape') lightbox.classList.remove('show');
    });
}

window.initAlbum = initAlbum;
window.openAlbumLightbox = openAlbumLightbox;
window.openLightbox = openAlbumLightbox; // 供瀑布流图片点击复用
