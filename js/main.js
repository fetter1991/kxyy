'use strict';

/* ===== 页面导航切换 ===== */
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const navMenu = document.getElementById('navMenu');
const navToggle = document.getElementById('navToggle');

function switchPage(pageName) {
    pages.forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + pageName);
    if (target) target.classList.add('active');
    navLinks.forEach(l => l.classList.remove('active'));
    const activeLink = document.querySelector('.nav-link[data-page="' + pageName + '"]');
    if (activeLink) activeLink.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

/* ===== 音乐播放器 ===== */
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
const itemsPerPage = 5;
let currentPage = 0;

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

function renderPlaylist() {
    const totalPages = Math.ceil(musicData.length / itemsPerPage);
    if (currentPage >= totalPages) currentPage = totalPages - 1;
    const start = currentPage * itemsPerPage;
    const pageItems = musicData.slice(start, start + itemsPerPage);

    playlistEl.innerHTML = `
        <div class="playlist-title">播放列表</div>
    ` + pageItems.map((track) => {
        const globalIdx = start + pageItems.indexOf(track);
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

    // 分页控件
    if (totalPages > 1) {
        let pageHTML = '<div class="playlist-pagination">';
        pageHTML += `<button class="page-btn" id="prevPage" ${currentPage === 0 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>`;
        for (let i = 0; i < totalPages; i++) {
            pageHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i + 1}</button>`;
        }
        pageHTML += `<button class="page-btn" id="nextPage" ${currentPage >= totalPages - 1 ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button>`;
        pageHTML += '</div>';
        playlistEl.innerHTML += pageHTML;
    }

    // 绑定列表项点击
    playlistEl.querySelectorAll('.playlist-item').forEach(item => {
        item.addEventListener('click', () => {
            currentTrack = parseInt(item.dataset.index);
            loadTrack();
            playTrack();
        });
    });

    // 绑定分页按钮
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    if (prevPageBtn) prevPageBtn.addEventListener('click', () => { currentPage--; renderPlaylist(); });
    if (nextPageBtn) nextPageBtn.addEventListener('click', () => { currentPage++; renderPlaylist(); });
    playlistEl.querySelectorAll('.page-btn[data-page]').forEach(btn => {
        btn.addEventListener('click', () => {
            currentPage = parseInt(btn.dataset.page);
            renderPlaylist();
        });
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

    // 确保当前曲目所在页显示
    const trackPage = Math.floor(currentTrack / itemsPerPage);
    if (trackPage !== currentPage) {
        currentPage = trackPage;
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

/* ===== 留言板 ===== */
const messageList = document.getElementById('messageList');
const msgName = document.getElementById('msgName');
const msgContent = document.getElementById('msgContent');
const msgSubmit = document.getElementById('msgSubmit');
const COMMENT_STORAGE_KEY = 'kaixin_yuanyuan_comments';

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

function renderMessages() {
    const messages = getComments();
    messageList.innerHTML = messages.map(m => {
        const initial = m.nick.charAt(0);
        return `
        <div class="msg-card">
            <div class="msg-head">
                <div class="msg-user">
                    <div class="msg-avatar">${initial}</div>
                    <div>
                        <div class="msg-nick">${m.nick}</div>
                        <div class="msg-time">${m.time}</div>
                    </div>
                </div>
            </div>
            <div class="msg-text">${m.text}</div>
        </div>
        `;
    }).join('');
}

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
    const newComment = { nick, text, time: dateStr };
    // 追加到 comment.js 的留言数据中（通过 localStorage 持久化）
    saveComment(newComment);
    msgName.value = '';
    msgContent.value = '';
    renderMessages();
});

/* ===== 导航栏滚动效果 ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.15)';
        navbar.style.boxShadow = '0 8px 32px rgba(0,0,0,0.35)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.1)';
        navbar.style.boxShadow = '0 8px 32px rgba(0,0,0,0.25)';
    }
});

/* ===== 初始化 ===== */
renderGallery('all');
renderPlaylist();
loadTrack();
renderWorks();
renderMessages();