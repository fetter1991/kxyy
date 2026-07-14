'use strict';

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
const ITEMS_PER_PAGE = 10;
let renderedCount = 0;

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

/* ===== 导航栏播放器按钮 ===== */
const navMusicBtn = document.getElementById('navMusicBtn');

function updateNavMusicBtn() {
    if (isPlaying) {
        navMusicBtn.innerHTML = '<i class="fas fa-pause"></i>';
        navMusicBtn.classList.add('playing');
    } else {
        navMusicBtn.innerHTML = '<i class="fas fa-music"></i>';
        navMusicBtn.classList.remove('playing');
    }
}

navMusicBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
    updateNavMusicBtn();
});

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

    const loadingHint = playlistEl.querySelector('.playlist-loading-hint');
    if (loadingHint) loadingHint.remove();

    playlistEl.insertAdjacentHTML('beforeend', itemsHTML);
    renderedCount = end;

    if (renderedCount < totalItems) {
        const hint = document.createElement('div');
        hint.className = 'playlist-loading-hint';
        hint.innerHTML = '<span>向下滚动加载更多...</span>';
        playlistEl.appendChild(hint);
    }

    playlistEl.querySelectorAll('.playlist-item').forEach(item => {
        item.removeEventListener('click', item._clickHandler);
        item._clickHandler = () => {
            currentTrack = parseInt(item.dataset.index);
            loadTrack();
            playTrack();
            updateNavMusicBtn();
        };
        item.addEventListener('click', item._clickHandler);
    });
}

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

    if (track.type === 'video' && track.videoUrl) {
        playerDiscWrap.classList.add('hidden');
        playerVideoWrap.classList.remove('hidden');
        playerVideo.src = track.videoUrl;
        musicPlayer.classList.add('video-mode');
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

playerVideo.addEventListener('click', (e) => {
    e.stopPropagation();
    playerInfo.classList.toggle('visible');
});

playerAudio.addEventListener('ended', () => {
    nextTrack();
});

function playTrack() {
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    updateNavMusicBtn();
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
    updateNavMusicBtn();
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
    updateNavMusicBtn();
}

function prevTrack() {
    currentTrack = (currentTrack - 1 + musicData.length) % musicData.length;
    loadTrack();
    if (isPlaying) playTrack();
    updateNavMusicBtn();
}

playBtn.addEventListener('click', () => {
    if (isPlaying) pauseTrack(); else playTrack();
    updateNavMusicBtn();
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
renderPlaylist();
loadTrack();
