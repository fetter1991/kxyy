'use strict';

/* ===== 页面导航切换 ===== */
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const navMenu = document.getElementById('navMenu');
const navToggle = document.getElementById('navToggle');
const pageLoading = document.getElementById('pageLoading');

let isLoadingActive = false;

function showPageLoading() {
    if (isLoadingActive) return;
    isLoadingActive = true;
    pageLoading.classList.add('show');
}

function hidePageLoading() {
    pageLoading.classList.remove('show');
    isLoadingActive = false;
}

/* ===== Loading打字机效果 ===== */
function playLoadingTypewriter() {
    const cnEl = document.getElementById('loadingLineCn');
    const enEl = document.getElementById('loadingLineEn');
    if (!cnEl || !enEl) return;

    const cnText = '开心元元';
    const enText = 'KAIXINYUANYUAN';
    cnEl.innerHTML = '';
    enEl.innerHTML = '';

    let i = 0;
    // 逐字显示中文
    function typeCn() {
        if (i < cnText.length) {
            const span = document.createElement('span');
            span.className = 'loading-char';
            span.textContent = cnText[i];
            cnEl.appendChild(span);
            i++;
            setTimeout(typeCn, 280);
        } else {
            // 中文完成，添加光标后开始英文
            const cursor = document.createElement('span');
            cursor.className = 'loading-cursor';
            cnEl.appendChild(cursor);
            setTimeout(typeEn, 400);
        }
    }

    let j = 0;
    // 逐字显示英文
    function typeEn() {
        if (j < enText.length) {
            const span = document.createElement('span');
            span.className = 'loading-char';
            span.textContent = enText[j];
            enEl.appendChild(span);
            j++;
            setTimeout(typeEn, 120);
        } else {
            const cursor = document.createElement('span');
            cursor.className = 'loading-cursor';
            enEl.appendChild(cursor);
        }
    }

    // 延迟开始，等待loading动画出现
    setTimeout(typeCn, 300);
}

function switchPage(pageName) {
    // 显示loading
    showPageLoading();
    playLoadingTypewriter();

    setTimeout(() => {
        pages.forEach(p => p.classList.remove('active'));
        const target = document.getElementById('page-' + pageName);
        if (target) target.classList.add('active');
        navLinks.forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector('.nav-link[data-page="' + pageName + '"]');
        if (activeLink) activeLink.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // 切换到成长历程页时，重置时间轴导航条到最左侧（显示第一个点）
        if (pageName === 'ihan') {
            // 锁定高亮，防止重置滚动时触发scroll事件覆盖高亮
            growthHighlightLocked = true;
            growthCurrentIndex = 0;
            updateGrowthHighlight(0);

            if (growthFullscreenScroll) {
                growthFullscreenScroll.scrollTop = 0;
                setGrowthItemHeights();
            }

            // 多次尝试设置scrollLeft=0，确保布局稳定后最终值正确
            const growthNav = document.getElementById('growthTimelineNav');
            function trySetScrollLeft() {
                if (growthNav) {
                    growthNav.scrollLeft = 0;
                }
            }
            // 立即设置一次
            trySetScrollLeft();
            // 延迟再设置几次，覆盖不同布局阶段
            setTimeout(trySetScrollLeft, 50);
            setTimeout(trySetScrollLeft, 120);
            // 最后一次设置后，调用centerTimelinePoint确保z1居中显示
            setTimeout(() => {
                trySetScrollLeft();
                // 确保z1位于第3个位置（居中显示）
                centerTimelinePoint(0);
                growthHighlightLocked = false;
            }, 200);
        }

        // 隐藏loading
        hidePageLoading();
    }, 5000);
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        switchPage(page);
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
    });
});

navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navMenu.classList.toggle('open');
    navToggle.classList.toggle('active');
});

// 点击页面任意位置（非导航栏区域）时自动收回移动端导航栏
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open')) {
        if (!navbar.contains(e.target)) {
            navMenu.classList.remove('open');
            navToggle.classList.remove('active');
        }
    }
});

/* ===== 生日倒计时 ===== */
function updateCountdown() {
    const now = new Date();
    // 生日为6月21日（月份索引5），如果今年已过则计算明年
    const year = now.getMonth() > 5 || (now.getMonth() === 5 && now.getDate() > 21)
        ? now.getFullYear() + 1 : now.getFullYear();
    const birthday = new Date(year, 5, 21, 0, 0, 0);
    const diff = birthday - now;

    if (diff <= 0) return;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cd-days').textContent = days;
    document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
    document.getElementById('cd-secs').textContent = String(secs).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

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
    // 如果作品弹窗开着，先隐藏避免层级冲突
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
    // 如果之前是从作品弹窗打开的，恢复显示
    if (lightbox.dataset.fromWorkModal === '1') {
        lightbox.removeAttribute('data-from-work-modal');
        if (workModal) workModal.style.display = '';
    }
}

// 键盘左右切换
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('show')) return;
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    else if (e.key === 'ArrowRight') lightboxNext.click();
    else if (e.key === 'Escape') closeLightbox();
});

/* ===== 全局音乐播放器 ===== */
const playlistEl = document.getElementById('musicPlaylist');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const playerDisc = document.getElementById('playerDisc');
const playerVideo = document.getElementById('playerVideo');
const playerAudio = document.getElementById('playerAudio');
const playerVideoWrap = document.getElementById('playerVideoWrap');
const playerDiscWrap = document.querySelector('.player-disc-wrap');
const musicPlayer = document.getElementById('musicPlayer');
const playerInfo = document.querySelector('.player-info');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');

let currentTrack = 0;
let isPlaying = false;
let progressTimer = null;
let currentSec = 0;
const ITEMS_PER_PAGE = 10;
let currentPage = 0;
let renderedCount = 0; // 已渲染的条目数

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

/* ===== 滚动加载分页 ===== */
function renderPlaylist() {
    const totalItems = musicData.length;
    if (renderedCount === 0) {
        playlistEl.innerHTML = `<div class="playlist-title">播放列表</div>`;
    }

    const end = Math.min(renderedCount + ITEMS_PER_PAGE, totalItems);
    const newItems = musicData.slice(renderedCount, end);
    if (newItems.length === 0) return;

    const itemsHTML = newItems.map((track) => {
        const globalIdx = renderedCount + newItems.indexOf(track);
        const typeBadge = track.type === 'video'
            ? '<span class="pl-type-badge"><i class="fas fa-video"></i> MV</span>'
            : '<span class="pl-type-badge"><i class="fas fa-music"></i></span>';
        return `
        <div class="playlist-item ${globalIdx === currentTrack ? 'playing' : ''}" data-index="${globalIdx}">
            <span class="pl-index">${String(globalIdx + 1).padStart(2, '0')}</span>
            <div class="pl-info">
                <div class="pl-name">${track.title}${typeBadge}</div>
                <div class="pl-duration">${track.duration}</div>
            </div>
        </div>
        `;
    }).join('');

    // 移除加载提示（如果有）
    const loadingHint = playlistEl.querySelector('.playlist-loading-hint');
    if (loadingHint) loadingHint.remove();

    playlistEl.insertAdjacentHTML('beforeend', itemsHTML);
    renderedCount = end;

    // 如果还有更多，添加加载提示
    if (renderedCount < totalItems) {
        const hint = document.createElement('div');
        hint.className = 'playlist-loading-hint';
        hint.innerHTML = '<span>向下滚动加载更多...</span>';
        playlistEl.appendChild(hint);
    }

    // 绑定列表项点击
    playlistEl.querySelectorAll('.playlist-item').forEach(item => {
        item.removeEventListener('click', item._clickHandler);
        item._clickHandler = () => {
            currentTrack = parseInt(item.dataset.index);
            loadTrack();
            playTrack();
        };
        item.addEventListener('click', item._clickHandler);
    });
}

// 滚动加载监听
if (playlistEl) {
    playlistEl.addEventListener('scroll', () => {
        if (renderedCount >= musicData.length) return;
        const { scrollTop, scrollHeight, clientHeight } = playlistEl;
        if (scrollTop + clientHeight >= scrollHeight - 50) {
            renderPlaylist();
        }
    });
}

function loadTrack() {
    const track = musicData[currentTrack];
    playerTitle.textContent = track.title;
    playerArtist.textContent = track.artist;
    totalTimeEl.textContent = track.duration;
    currentSec = 0;
    currentTimeEl.textContent = '00:00';
    progressBar.style.width = '0%';

    // 切换视频/音频显示
    if (track.type === 'video' && track.videoUrl) {
        playerDiscWrap.classList.add('hidden');
        playerVideoWrap.classList.remove('hidden');
        playerVideo.src = track.videoUrl;
        musicPlayer.classList.add('video-mode');
        // 视频模式下默认隐藏控制按钮
        playerInfo.classList.remove('visible');
        playerAudio.pause();
        playerAudio.removeAttribute('src');
    } else {
        playerDiscWrap.classList.remove('hidden');
        playerVideoWrap.classList.add('hidden');
        playerVideo.pause();
        playerVideo.removeAttribute('src');
        musicPlayer.classList.remove('video-mode');
        playerInfo.classList.remove('visible');
        if (track.audioUrl) {
            playerAudio.src = track.audioUrl;
        } else {
            playerAudio.removeAttribute('src');
        }
    }

    renderPlaylist();
}

// 点击视频区域切换控制按钮显示/隐藏
playerVideo.addEventListener('click', (e) => {
    e.stopPropagation();
    playerInfo.classList.toggle('visible');
});

// 音频播放结束自动下一曲
playerAudio.addEventListener('ended', () => {
    nextTrack();
});

function playTrack() {
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    const track = musicData[currentTrack];
    if (track.type === 'video' && track.videoUrl) {
        playerVideo.play().catch(() => {});
    } else {
        playerDisc.classList.add('spinning');
        if (track.audioUrl) {
            playerAudio.play().catch(() => {});
        }
    }
    if (progressTimer) clearInterval(progressTimer);
    progressTimer = setInterval(() => {
        currentSec++;
        if (currentSec >= track.durationSec) {
            nextTrack();
            return;
        }
        currentTimeEl.textContent = formatTime(currentSec);
        progressBar.style.width = (currentSec / track.durationSec * 100) + '%';
    }, 1000);
}

function pauseTrack() {
    isPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    const track = musicData[currentTrack];
    if (track.type === 'video' && track.videoUrl) {
        playerVideo.pause();
    } else {
        playerDisc.classList.remove('spinning');
        playerAudio.pause();
    }
    if (progressTimer) clearInterval(progressTimer);
}

function nextTrack() {
    currentTrack = (currentTrack + 1) % musicData.length;
    loadTrack();
    if (isPlaying) playTrack();
}

function prevTrack() {
    currentTrack = (currentTrack - 1 + musicData.length) % musicData.length;
    loadTrack();
    if (isPlaying) playTrack();
}

playBtn.addEventListener('click', () => {
    if (isPlaying) pauseTrack(); else playTrack();
});
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);

document.querySelector('.player-progress').addEventListener('click', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    currentSec = Math.floor(ratio * musicData[currentTrack].durationSec);
    currentTimeEl.textContent = formatTime(currentSec);
    progressBar.style.width = (ratio * 100) + '%';
});

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

    // 绑定卡片点击事件
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

    // 点击弹窗内图片用灯箱查看大图
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

/* ===== 留言册（相册翻书） ===== */
const bookPageLeft = document.getElementById('bookPageLeft');
const bookPageRight = document.getElementById('bookPageRight');
const bookFlipPage = document.getElementById('bookFlipPage');
const flipFront = document.getElementById('flipFront');
const flipBack = document.getElementById('flipBack');
const bookPrev = document.getElementById('bookPrev');
const bookNext = document.getElementById('bookNext');
const bookPageInfo = document.getElementById('bookPageInfo');
const msgName = document.getElementById('msgName');
const msgContent = document.getElementById('msgContent');
const msgSubmit = document.getElementById('msgSubmit');
const COMMENT_STORAGE_KEY = 'kaixin_yuanyuan_comments';

let bookSpread = 0;
let bookFlipping = false;

const albumPalettes = [
    ['#8A2BE2', '#b06ab3'],
    ['#e8b4d8', '#c77dff'],
    ['#5e2a8c', '#8A2BE2'],
    ['#d896d8', '#b06ab3'],
    ['#7c3aed', '#e8b4d8'],
];

// 获取留言列表：合并 localStorage 新留言与 comment.js 初始数据
function getComments() {
    let saved = [];
    try {
        saved = JSON.parse(localStorage.getItem(COMMENT_STORAGE_KEY) || '[]');
    } catch (e) {
        saved = [];
    }
    return [...saved, ...commentData];
}

// 追加新留言到 localStorage 持久化存储
function saveComment(comment) {
    let saved = [];
    try {
        saved = JSON.parse(localStorage.getItem(COMMENT_STORAGE_KEY) || '[]');
    } catch (e) {
        saved = [];
    }
    saved.unshift(comment);
    localStorage.setItem(COMMENT_STORAGE_KEY, JSON.stringify(saved));
}

// 构建书页：第0页为封面，之后每页放两条留言
function buildSpreads() {
    const msgs = getComments();
    const spreads = [];
    spreads.push({ left: { kind: 'cover' }, right: { kind: 'welcome', count: msgs.length } });
    for (let i = 0; i < msgs.length; i += 2) {
        spreads.push({
            left: { kind: 'message', msg: msgs[i] },
            right: msgs[i + 1] ? { kind: 'message', msg: msgs[i + 1] } : { kind: 'empty' }
        });
    }
    if (spreads.length === 1) {
        spreads.push({ left: { kind: 'empty' }, right: { kind: 'empty' } });
    }
    return spreads;
}

function paletteFor(nick) {
    let h = 0;
    for (let i = 0; i < nick.length; i++) h = (h * 31 + nick.charCodeAt(i)) % albumPalettes.length;
    return albumPalettes[h];
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

// 渲染单页内容
function pageHTML(desc) {
    if (desc.kind === 'cover') {
        return `
        <div class="album-cover">
            <div class="album-cover-frame">
                <div class="album-cover-icon"><i class="fas fa-heart"></i></div>
                <div class="album-cover-title">粉丝留言册</div>
                <div class="album-cover-en">KAI XIN YUAN YUAN</div>
                <div class="album-cover-deco">✦ ✦ ✦</div>
                <div class="album-cover-foot">致 · 开心元元</div>
            </div>
        </div>`;
    }
    if (desc.kind === 'welcome') {
        return `
        <div class="album-welcome">
            <div class="album-welcome-icon"><i class="fas fa-feather-alt"></i></div>
            <h3>欢迎翻开留言册</h3>
            <p>这里珍藏着每一位粉丝<br>写给元元的温暖话语</p>
            <div class="album-welcome-count">共 <strong>${desc.count}</strong> 条留言</div>
            <p class="album-welcome-tip">点击右侧按钮翻页<br>阅读每一份心意 ✨</p>
        </div>`;
    }
    if (desc.kind === 'empty') {
        return `
        <div class="album-empty">
            <i class="fas fa-feather-alt"></i>
            <p>这一页还空着<br>期待你的留言填满它</p>
        </div>`;
    }
    const m = desc.msg;
    const [c1, c2] = paletteFor(m.nick);
    const initial = m.nick.charAt(0);
    return `
    <div class="album-card">
        <div class="album-tape"></div>
        <div class="album-card-photo">
            <div class="album-avatar" style="background:linear-gradient(135deg, ${c1}, ${c2})">${escapeHtml(initial)}</div>
        </div>
        <div class="album-card-body">
            <div class="album-card-nick">${escapeHtml(m.nick)}</div>
            <div class="album-card-date">${escapeHtml(m.time)}</div>
            <div class="album-card-text">${escapeHtml(m.text)}</div>
        </div>
    </div>`;
}

function updateBookInfo() {
    const spreads = buildSpreads();
    if (bookSpread === 0) {
        bookPageInfo.textContent = '封面';
    } else {
        bookPageInfo.textContent = '第 ' + bookSpread + ' / ' + (spreads.length - 1) + ' 页';
    }
    bookPrev.disabled = bookSpread === 0;
    bookNext.disabled = bookSpread >= spreads.length - 1;
}

function renderBook() {
    const spreads = buildSpreads();
    if (bookSpread > spreads.length - 1) bookSpread = spreads.length - 1;
    const sp = spreads[bookSpread];
    bookPageLeft.innerHTML = pageHTML(sp.left);
    bookPageRight.innerHTML = pageHTML(sp.right);
    bookFlipPage.style.transition = 'none';
    bookFlipPage.className = 'book-flip-page';
    bookFlipPage.style.display = 'none';
    void bookFlipPage.offsetWidth;
    bookFlipPage.style.transition = '';
    updateBookInfo();
}

// 执行一次翻页动画
function startFlip(side, frontDesc, backDesc, underLeftDesc, underRightDesc, onDone) {
    bookFlipPage.style.transition = 'none';
    bookFlipPage.className = 'book-flip-page flip-on-' + side;
    bookFlipPage.style.display = '';
    flipFront.innerHTML = pageHTML(frontDesc);
    flipBack.innerHTML = pageHTML(backDesc);
    bookPageLeft.innerHTML = pageHTML(underLeftDesc);
    bookPageRight.innerHTML = pageHTML(underRightDesc);
    void bookFlipPage.offsetWidth; // 提交无动画的初始状态
    bookFlipPage.style.transition = '';
    void bookFlipPage.offsetWidth;
    bookFlipPage.classList.add('flipping');
    bookFlipPage.addEventListener('transitionend', function done(e) {
        if (e.propertyName !== 'transform') return;
        bookFlipPage.removeEventListener('transitionend', done);
        onDone();
    });
}

function flipNext() {
    if (bookFlipping) return;
    const spreads = buildSpreads();
    if (bookSpread >= spreads.length - 1) return;
    bookFlipping = true;
    const cur = spreads[bookSpread];
    const next = spreads[bookSpread + 1];
    // 翻右侧页：正面=当前右页，背面=下一页左页
    startFlip('right', cur.right, next.left, cur.left, next.right, () => {
        bookSpread++;
        bookFlipPage.style.transition = 'none';
        bookFlipPage.classList.remove('flipping');
        bookFlipPage.className = 'book-flip-page';
        bookFlipPage.style.display = 'none';
        void bookFlipPage.offsetWidth;
        bookFlipPage.style.transition = '';
        renderBook();
        bookFlipping = false;
    });
}

function flipPrev() {
    if (bookFlipping) return;
    if (bookSpread <= 0) return;
    bookFlipping = true;
    const spreads = buildSpreads();
    const cur = spreads[bookSpread];
    const prev = spreads[bookSpread - 1];
    // 翻左侧页：正面=当前左页，背面=上一页右页
    startFlip('left', cur.left, prev.right, prev.left, cur.right, () => {
        bookSpread--;
        bookFlipPage.style.transition = 'none';
        bookFlipPage.classList.remove('flipping');
        bookFlipPage.className = 'book-flip-page';
        bookFlipPage.style.display = 'none';
        void bookFlipPage.offsetWidth;
        bookFlipPage.style.transition = '';
        renderBook();
        bookFlipping = false;
    });
}

bookNext.addEventListener('click', flipNext);
bookPrev.addEventListener('click', flipPrev);

msgSubmit.addEventListener('click', () => {
    const nick = msgName.value.trim();
    const text = msgContent.value.trim();
    if (!nick || !text) {
        alert('请填写昵称和留言内容');
        return;
    }
    const today = new Date();
    const dateStr = today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0');
    saveComment({ nick, text, time: dateStr });
    msgName.value = '';
    msgContent.value = '';
    // 新留言位于第1页（首条留言页），跳转展示
    bookSpread = 1;
    renderBook();
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

/* ===== 成长历程全屏展示 ===== */
const growthFullscreenList = document.getElementById('growthFullscreenList');
const growthFullscreenScroll = document.getElementById('growthFullscreenScroll');
const growthNavTrack = document.getElementById('growthNavTrack');
const growthModal = document.getElementById('growthModal');
const growthModalTitle = document.getElementById('growthModalTitle');
const growthModalBody = document.getElementById('growthModalBody');
const growthModalClose = document.getElementById('growthModalClose');
let growthModalAudio = null;
let growthModalVideo = null;
let growthCurrentIndex = 0;
let growthHighlightLocked = false; // 页面切换时锁定，防止scroll事件干扰高亮

// 动态设置每个item的高度等于滚动容器的实际可见高度
function setGrowthItemHeights() {
    if (!growthFullscreenScroll || !growthFullscreenList) return;
    const h = growthFullscreenScroll.clientHeight;
    if (h <= 0) return;
    growthFullscreenList.querySelectorAll('.growth-fullscreen-item').forEach(item => {
        item.style.height = h + 'px';
    });
}

// 更新成长历程高亮状态（内容项 + 导航点）
function updateGrowthHighlight(idx) {
    if (!growthFullscreenList || !growthNavTrack) return;
    growthFullscreenList.querySelectorAll('.growth-fullscreen-item').forEach((item, i) => {
        item.classList.toggle('active', i === idx);
    });
    growthNavTrack.querySelectorAll('.growth-nav-point').forEach((p, i) => {
        p.classList.toggle('active', i === idx);
    });
}

function renderGrowthTimeline() {
    if (!growthFullscreenList) return;

    // 渲染全屏内容
    growthFullscreenList.innerHTML = growthData.map((item, i) => {
        return `
        <div class="growth-fullscreen-item" data-index="${i}" id="growth-fs-${i}">
            <div class="growth-fullscreen-bg">
                <img src="${item.cover}" alt="${item.title}" loading="lazy">
            </div>
            <div class="growth-fullscreen-content">
                <div class="growth-fs-date">${item.date}</div>
                <div class="growth-fs-title-row">
                    <img src="../img/pattern.svg" class="growth-fs-deco growth-fs-deco-left" alt="装饰">
                    <h2 class="growth-fs-title">${item.shortTitle || item.title}</h2>
                    <img src="../img/pattern.svg" class="growth-fs-deco growth-fs-deco-right" alt="装饰">
                </div>
                <p class="growth-fs-desc">${item.desc}</p>
                <button class="growth-fs-btn" data-index="${i}">查看详情 <i class="fas fa-arrow-right"></i></button>
            </div>
        </div>
        `;
    }).join('');

    // 渲染底部导航点（菱形样式）
    growthNavTrack.innerHTML = growthData.map((item, i) => `
        <button class="growth-nav-point ${i === 0 ? 'active' : ''}" data-index="${i}">
            <span class="growth-nav-diamond"></span>
            <span class="growth-nav-label">${item.shortTitle || item.title}</span>
        </button>
    `).join('');

    // 绑定查看详情按钮
    growthFullscreenList.querySelectorAll('.growth-fs-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.dataset.index);
            openGrowthModal(idx);
        });
    });

    // 绑定导航点点击
    growthNavTrack.querySelectorAll('.growth-nav-point').forEach(point => {
        point.addEventListener('click', () => {
            const idx = parseInt(point.dataset.index);
            scrollToGrowthItem(idx);
        });
    });

    // 使用 scroll 事件 + requestAnimationFrame 精确检测当前可视项
    let growthScrollRaf = null;
    growthFullscreenScroll.addEventListener('scroll', () => {
        if (growthHighlightLocked) return; // 页面切换锁定期间忽略
        if (growthScrollRaf) cancelAnimationFrame(growthScrollRaf);
        growthScrollRaf = requestAnimationFrame(() => {
            const itemHeight = growthFullscreenScroll.clientHeight;
            if (itemHeight <= 0) return;
            const idx = Math.round(growthFullscreenScroll.scrollTop / itemHeight);
            const clamped = Math.max(0, Math.min(idx, growthData.length - 1));
            if (clamped !== growthCurrentIndex) {
                growthCurrentIndex = clamped;
                updateGrowthHighlight(clamped);
            }
        });
    });

    // 设置item高度并首项激活
    setGrowthItemHeights();
    const firstItem = growthFullscreenList.querySelector('.growth-fullscreen-item');
    if (firstItem) firstItem.classList.add('active');
}

// 窗口尺寸变化时重新设置item高度
window.addEventListener('resize', () => {
    setGrowthItemHeights();
});

function scrollToGrowthItem(idx) {
    const target = document.getElementById('growth-fs-' + idx);
    if (!target) return;

    // 点击的菱形动画效果
    const clickedPoint = growthNavTrack.querySelector(`.growth-nav-point[data-index="${idx}"]`);
    if (clickedPoint) {
        clickedPoint.classList.add('clicking');
        setTimeout(() => clickedPoint.classList.remove('clicking'), 600);
    }

    // 提前更新高亮避免闪动
    updateGrowthHighlight(idx);
    growthCurrentIndex = idx;

    // 平滑滚动内容到目标项
    target.scrollIntoView({ behavior: 'smooth' });

    // 将点击的时间轴节点滚动到导航条可视范围内（居中）
    centerTimelinePoint(idx);
}

// 将指定索引的时间轴节点在导航条中定位到第3个位置（居中），每次只显示5个节点
function centerTimelinePoint(idx) {
    const navContainer = document.getElementById('growthTimelineNav');
    if (!navContainer) return;

    const points = growthNavTrack.querySelectorAll('.growth-nav-point');
    if (!points[idx]) return;

    const containerWidth = navContainer.offsetWidth;
    if (containerWidth <= 0) return;

    // 如果所有节点都能完整显示，无需滚动
    if (navContainer.scrollWidth <= containerWidth) return;

    // 目标：点击的节点位于第3个位置（居中），前后各2个节点，共显示5个
    // 计算节点的偏移：每个节点100px宽，第3个节点左侧偏移 = 2 * 100 = 200px
    // 但考虑到容器有 padding: 0 24px，左侧有24px padding
    // 所以 scrollLeft = pointOffsetLeft - (2 * 100 - 24)
    const pointWidth = 100; // 每个节点固定100px
    const containerPadding = 24; // 左侧padding

    const pointOffsetLeft = points[idx].offsetLeft;
    // 让当前节点位于第3个位置：左侧应有2个节点的空间
    let targetScrollLeft = pointOffsetLeft - (2 * pointWidth - containerPadding);

    // 边界限制：不能小于0，不能大于最大滚动范围
    const maxScrollLeft = navContainer.scrollWidth - containerWidth;
    targetScrollLeft = Math.max(0, Math.min(targetScrollLeft, maxScrollLeft));

    navContainer.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
    });
}

function openGrowthModal(idx) {
    const item = growthData[idx];
    growthModalTitle.textContent = item.title + ' · ' + item.date;
    const c = item.content;
    let bodyHTML = '';

    bodyHTML += `<div class="growth-detail-image"><img src="${c.image}" alt="${c.caption}"><p class="growth-detail-caption">${c.caption}</p></div>`;
    bodyHTML += `<div class="growth-detail-text">${c.text}</div>`;

    if (item.type === 'music' && c.music) {
        bodyHTML += `
            <div class="growth-detail-media">
                <div class="growth-media-title"><i class="fas fa-music"></i> ${c.music.title} - ${c.music.artist}</div>
                <div class="growth-audio-player">
                    <audio controls src="${c.music.audioUrl}"></audio>
                </div>
            </div>
        `;
    }

    if (item.type === 'video' && c.video) {
        bodyHTML += `
            <div class="growth-detail-media">
                <div class="growth-media-title"><i class="fas fa-video"></i> ${c.video.title}</div>
                <div class="growth-video-player">
                    <video controls src="${c.video.videoUrl}"></video>
                </div>
            </div>
        `;
    }

    growthModalBody.innerHTML = bodyHTML;
    growthModal.classList.add('show');

    // 保存当前媒体引用
    growthModalAudio = growthModalBody.querySelector('audio');
    growthModalVideo = growthModalBody.querySelector('video');
}

function closeGrowthModal() {
    // 停止所有媒体播放
    if (growthModalAudio) {
        growthModalAudio.pause();
        growthModalAudio.currentTime = 0;
        growthModalAudio = null;
    }
    if (growthModalVideo) {
        growthModalVideo.pause();
        growthModalVideo.currentTime = 0;
        growthModalVideo = null;
    }
    growthModal.classList.remove('show');
    growthModalBody.innerHTML = '';
}

growthModalClose.addEventListener('click', closeGrowthModal);
growthModal.addEventListener('click', (e) => {
    if (e.target === growthModal) closeGrowthModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && growthModal.classList.contains('show')) closeGrowthModal();
});

/* ===== 首页初始加载Loading ===== */
showPageLoading();
playLoadingTypewriter();
setTimeout(() => {
    hidePageLoading();
}, 5000);

/* ===== 初始化 ===== */
renderGallery('all');
renderPlaylist();
loadTrack();
renderWorks();
renderBook();
renderGrowthTimeline();

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