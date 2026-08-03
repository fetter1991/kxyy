'use strict';

/* ===== 视频播放器（页面专属） ===== */
/* 适配竖屏(portrait)和横屏(landscape)视频，播放列表数据使用 videoData */

let _videoCurrentTrack = 0;
let _videoIsPlaying = false;
let _videoProgressTimer = null;
let _videoCurrentSec = 0;
const VIDEO_ITEMS_PER_PAGE = 10;
let _videoRenderedCount = 0;

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

function _renderVideoPlaylist() {
    const playlistEl = document.getElementById('videoPlaylist');
    if (!playlistEl) return;

    const totalItems = videoData.length;
    if (_videoRenderedCount === 0) {
        playlistEl.innerHTML = `<div class="playlist-title">播放列表</div>`;
    }

    const end = Math.min(_videoRenderedCount + VIDEO_ITEMS_PER_PAGE, totalItems);
    const newItems = videoData.slice(_videoRenderedCount, end);
    if (newItems.length === 0) return;

    const itemsHTML = newItems.map((track, i) => {
        const globalIdx = _videoRenderedCount + i;
        const orientIcon = track.orientation === 'portrait'
            ? '<i class="fas fa-mobile-alt"></i>'
            : '<i class="fas fa-desktop"></i>';
        const orientLabel = track.orientation === 'portrait' ? '竖屏' : '横屏';
        return `
        <div class="playlist-item ${globalIdx === _videoCurrentTrack ? 'playing' : ''}" data-index="${globalIdx}">
            <span class="pl-index">${String(globalIdx + 1).padStart(2, '0')}</span>
            <div class="pl-info">
                <div class="pl-name">${track.title}<span class="pl-type-badge">${orientIcon} ${orientLabel}</span></div>
                <div class="pl-duration">${track.duration}</div>
            </div>
        </div>
        `;
    }).join('');

    const loadingHint = playlistEl.querySelector('.playlist-loading-hint');
    if (loadingHint) loadingHint.remove();

    playlistEl.insertAdjacentHTML('beforeend', itemsHTML);
    _videoRenderedCount = end;

    if (_videoRenderedCount < totalItems) {
        const hint = document.createElement('div');
        hint.className = 'playlist-loading-hint';
        hint.innerHTML = '<span>向下滚动加载更多...</span>';
        playlistEl.appendChild(hint);
    }

    playlistEl.querySelectorAll('.playlist-item').forEach(item => {
        item.removeEventListener('click', item._clickHandler);
        item._clickHandler = () => {
            _videoCurrentTrack = parseInt(item.dataset.index);
            _loadVideoTrack();
            _playVideoTrack();
        };
        item.addEventListener('click', item._clickHandler);
    });
}

function _loadVideoTrack() {
    const playerTitle = document.getElementById('playerTitle');
    const playerArtist = document.getElementById('playerArtist');
    const playerVideo = document.getElementById('playerVideo');
    const totalTimeEl = document.getElementById('totalTime');
    const currentTimeEl = document.getElementById('currentTime');
    const progressBar = document.getElementById('progressBar');
    const videoWrap = document.getElementById('playerVideoWrap');
    const videoContainer = document.getElementById('videoContainer');

    if (!playerTitle) return;
    const track = videoData[_videoCurrentTrack];
    playerTitle.textContent = track.title;
    playerArtist.textContent = track.artist;
    totalTimeEl.textContent = track.duration;
    _videoCurrentSec = 0;
    currentTimeEl.textContent = '00:00';
    progressBar.style.width = '0%';

    // 根据视频方向设置容器模式
    if (videoContainer) {
        videoContainer.classList.remove('orientation-portrait', 'orientation-landscape');
        videoContainer.classList.add(track.orientation === 'portrait' ? 'orientation-portrait' : 'orientation-landscape');
    }

    if (playerVideo) {
        playerVideo.muted = false;
        playerVideo.volume = 1;
        playerVideo.src = track.videoUrl;
        playerVideo.poster = track.cover || '';
        playerVideo.load();
    }

    _renderVideoPlaylist();
}

function _playVideoTrack() {
    const playBtn = document.getElementById('playBtn');
    const playerVideo = document.getElementById('playerVideo');

    // 如果导航栏音乐播放器正在播放，暂停它
    if (window.navPlayer && typeof window.navPlayer.isPlaying === 'function' && window.navPlayer.isPlaying()) {
        window.navPlayer.pause();
    }

    _videoIsPlaying = true;
    if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    const track = videoData[_videoCurrentTrack];
    if (track.videoUrl && playerVideo) {
        // 确保静音属性被移除
        playerVideo.muted = false;
        // 等待 canplay 事件后再播放，避免视频未就绪时调用 play() 失败
        if (playerVideo.readyState >= 3) {
            // HAVE_FUTURE_DATA 或更高，可以直接播放
            playerVideo.play().catch(() => {
                // 播放失败时标记为暂停状态
                _videoIsPlaying = false;
                if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i>';
            });
        } else {
            // 等待视频可以播放
            function onCanPlay() {
                playerVideo.removeEventListener('canplay', onCanPlay);
                playerVideo.removeEventListener('error', onPlayError);
                playerVideo.play().catch(() => {
                    _videoIsPlaying = false;
                    if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i>';
                });
            }
            function onPlayError() {
                playerVideo.removeEventListener('canplay', onCanPlay);
                playerVideo.removeEventListener('error', onPlayError);
                _videoIsPlaying = false;
                if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
            playerVideo.addEventListener('canplay', onCanPlay);
            playerVideo.addEventListener('error', onPlayError);
            // 设置超时兜底：5秒后如果仍未播放，尝试强制播放
            setTimeout(() => {
                if (_videoIsPlaying && playerVideo.paused) {
                    playerVideo.play().catch(() => {});
                }
            }, 5000);
        }
    }

    if (_videoProgressTimer) clearInterval(_videoProgressTimer);
    _videoProgressTimer = setInterval(() => {
        // 优先使用 video.currentTime 获取真实进度
        if (playerVideo && playerVideo.duration && !isNaN(playerVideo.duration)) {
            _videoCurrentSec = Math.floor(playerVideo.currentTime);
            const ratio = playerVideo.currentTime / playerVideo.duration;
            const currentTimeEl = document.getElementById('currentTime');
            const progressBar = document.getElementById('progressBar');
            if (currentTimeEl) currentTimeEl.textContent = formatTime(_videoCurrentSec);
            if (progressBar) progressBar.style.width = (ratio * 100) + '%';
        } else {
            // 降级：使用模拟计时
            _videoCurrentSec++;
            const currentTimeEl = document.getElementById('currentTime');
            const progressBar = document.getElementById('progressBar');
            if (currentTimeEl) currentTimeEl.textContent = formatTime(_videoCurrentSec);
            if (progressBar) progressBar.style.width = (_videoCurrentSec / track.durationSec * 100) + '%';
            if (_videoCurrentSec >= track.durationSec) {
                _nextVideoTrack();
            }
        }
    }, 500);
}

function _pauseVideoTrack() {
    const playBtn = document.getElementById('playBtn');
    const playerVideo = document.getElementById('playerVideo');

    _videoIsPlaying = false;
    if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i>';
    if (playerVideo) playerVideo.pause();
    if (_videoProgressTimer) clearInterval(_videoProgressTimer);
}

function _nextVideoTrack() {
    _videoCurrentTrack = (_videoCurrentTrack + 1) % videoData.length;
    _loadVideoTrack();
    if (_videoIsPlaying) _playVideoTrack();
}

function _prevVideoTrack() {
    _videoCurrentTrack = (_videoCurrentTrack - 1 + videoData.length) % videoData.length;
    _loadVideoTrack();
    if (_videoIsPlaying) _playVideoTrack();
}

function initMusic() {
    const handlers = [];
    _videoRenderedCount = 0;
    _videoCurrentTrack = 0;
    _videoIsPlaying = false;

    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const playlistEl = document.getElementById('videoPlaylist');
    const playerVideo = document.getElementById('playerVideo');
    const playerProgress = document.querySelector('.player-progress');
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    // 滚动加载分页
    if (playlistEl) {
        function onPlaylistScroll() {
            if (_videoRenderedCount >= videoData.length) return;
            const { scrollTop, scrollHeight, clientHeight } = playlistEl;
            if (scrollTop + clientHeight >= scrollHeight - 50) {
                _renderVideoPlaylist();
            }
        }
        playlistEl.addEventListener('scroll', onPlaylistScroll);
        handlers.push([playlistEl, 'scroll', onPlaylistScroll]);
    }

    // 视频点击切换控制栏显示/隐藏
    if (playerVideo) {
        function onVideoClick(e) {
            e.stopPropagation();
            const playerInfo = document.querySelector('.player-info');
            if (playerInfo) playerInfo.classList.toggle('visible');
        }
        playerVideo.addEventListener('click', onVideoClick);
        handlers.push([playerVideo, 'click', onVideoClick]);

        // 视频播放结束自动下一首
        function onVideoEnded() { _nextVideoTrack(); }
        playerVideo.addEventListener('ended', onVideoEnded);
        handlers.push([playerVideo, 'ended', onVideoEnded]);

        // 视频加载元数据后，根据真实宽高比校正方向
        function onLoadedMetadata() {
            if (playerVideo.videoWidth > 0 && playerVideo.videoHeight > 0) {
                const track = videoData[_videoCurrentTrack];
                const realPortrait = playerVideo.videoHeight > playerVideo.videoWidth;
                const videoContainer = document.getElementById('videoContainer');
                if (videoContainer) {
                    videoContainer.classList.remove('orientation-portrait', 'orientation-landscape');
                    videoContainer.classList.add(realPortrait ? 'orientation-portrait' : 'orientation-landscape');
                }
            }
        }
        playerVideo.addEventListener('loadedmetadata', onLoadedMetadata);
        handlers.push([playerVideo, 'loadedmetadata', onLoadedMetadata]);
    }

    // 播放控制按钮
    if (playBtn) {
        function onPlayClick() {
            if (_videoIsPlaying) _pauseVideoTrack(); else _playVideoTrack();
        }
        playBtn.addEventListener('click', onPlayClick);
        handlers.push([playBtn, 'click', onPlayClick]);
    }
    if (nextBtn) {
        function onNextClick() { _nextVideoTrack(); }
        nextBtn.addEventListener('click', onNextClick);
        handlers.push([nextBtn, 'click', onNextClick]);
    }
    if (prevBtn) {
        function onPrevClick() { _prevVideoTrack(); }
        prevBtn.addEventListener('click', onPrevClick);
        handlers.push([prevBtn, 'click', onPrevClick]);
    }

    // 进度条点击跳转
    if (playerProgress) {
        function onProgressClick(e) {
            const track = videoData[_videoCurrentTrack];
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            if (playerVideo && playerVideo.duration && !isNaN(playerVideo.duration)) {
                playerVideo.currentTime = ratio * playerVideo.duration;
                _videoCurrentSec = Math.floor(playerVideo.currentTime);
            } else {
                _videoCurrentSec = Math.floor(ratio * track.durationSec);
            }
            const currentTimeEl = document.getElementById('currentTime');
            const progressBar = document.getElementById('progressBar');
            if (currentTimeEl) currentTimeEl.textContent = formatTime(_videoCurrentSec);
            if (progressBar) progressBar.style.width = (ratio * 100) + '%';
        }
        playerProgress.addEventListener('click', onProgressClick);
        handlers.push([playerProgress, 'click', onProgressClick]);
    }

    // 全屏按钮
    if (fullscreenBtn) {
        function onFullscreenClick() {
            const videoContainer = document.getElementById('videoContainer');
            const target = videoContainer || playerVideo;
            if (!target) return;
            if (!document.fullscreenElement) {
                if (target.requestFullscreen) target.requestFullscreen();
                else if (target.webkitRequestFullscreen) target.webkitRequestFullscreen();
            } else {
                if (document.exitFullscreen) document.exitFullscreen();
                else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
            }
        }
        fullscreenBtn.addEventListener('click', onFullscreenClick);
        handlers.push([fullscreenBtn, 'click', onFullscreenClick]);
    }

    // 初始化渲染
    _renderVideoPlaylist();
    _loadVideoTrack();

    // 公共UI
    const cleanupCommon = window.initCommonUI ? window.initCommonUI() : null;

    // 注册 cleanup
    window._currentPageCleanup = function () {
        handlers.forEach(([target, event, fn]) => target.removeEventListener(event, fn));
        if (_videoProgressTimer) clearInterval(_videoProgressTimer);
        const playerVideo = document.getElementById('playerVideo');
        if (playerVideo) {
            playerVideo.pause();
            playerVideo.removeAttribute('src');
            playerVideo.load();
        }
        if (cleanupCommon) cleanupCommon();
    };

    // 暴露API供导航栏播放器互斥调用
    window.musicPlayerAPI = {
        isPlaying: () => _videoIsPlaying,
        pause: _pauseVideoTrack,
        play: _playVideoTrack,
        next: _nextVideoTrack,
        prev: _prevVideoTrack,
        load: _loadVideoTrack,
        currentTrack: () => _videoCurrentTrack
    };
}

// 首次直接加载时自动执行
if (document.getElementById('videoContainer')) {
    initMusic();
}
