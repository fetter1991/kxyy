'use strict';

/* ===== 全局导航栏双向展开播放器 ===== */
(function() {
    if (window._navPlayerInitialized) return;
    window._navPlayerInitialized = true;

    const navMusicBtn = document.getElementById('navMusicBtn');
    if (!navMusicBtn) return;

    // ===== 状态 =====
    let currentTrack = 0;
    let isPlaying = false;
    let progressTimer = null;
    let currentSec = 0;
    let isExpanded = false;
    let isPlaylistOpen = false;
    let isAnimating = false;
    let isClickKept = false;

    // ===== 创建DOM结构 =====
    // 结构：nav-player-zone (锚点容器，position:relative)
    //   ├── nav-player-left-section  (absolute, right:100%, 向左展开)
    //   ├── navMusicBtn              (中心锚点：旋转→变身头像)
    //   ├── nav-player-right-section (absolute, left:100%, 向右展开)
    //   └── nav-player-playlist      (absolute, top:100%, 下拉播放列表)

    const leftSectionHTML = `
    <div class="nav-player-left-section" id="navPlayerLeft">
        <div class="nav-player-card-left">
            <button class="nav-ctrl-btn" id="navPrevBtn" title="上一首"><i class="fas fa-step-backward"></i></button>
            <button class="nav-ctrl-btn nav-play-btn" id="navPlayBtn" title="播放/暂停"><i class="fas fa-play"></i></button>
            <button class="nav-ctrl-btn" id="navNextBtn" title="下一首"><i class="fas fa-step-forward"></i></button>
        </div>
    </div>`;

    const rightSectionHTML = `
    <div class="nav-player-right-section" id="navPlayerRight">
        <div class="nav-player-card-right">
            <div class="nav-player-info" id="navPlayerInfo">
                <span class="nav-player-track-text" id="navPlayerTrackText">未在播放 - 开心元元</span>
            </div>
        </div>
    </div>`;

    const playlistHTML = `
    <div class="nav-player-playlist" id="navPlayerPlaylist">
        <div class="nav-playlist-body" id="navPlaylistBody"></div>
    </div>`;

    // 在 navMusicBtn 内部添加头像图层
    const avatarImg = document.createElement('img');
    avatarImg.className = 'music-btn-avatar';
    avatarImg.id = 'navMusicBtnAvatar';
    avatarImg.alt = '歌手头像';
    navMusicBtn.appendChild(avatarImg);

    // 创建 nav-player-zone 容器，包裹按钮和面板
    const navPlayerZone = document.createElement('div');
    navPlayerZone.className = 'nav-player-zone';
    navPlayerZone.id = 'navPlayerZone';

    // 将 navMusicBtn 移入 zone
    const navControls = document.querySelector('.nav-controls');
    if (navControls) {
        navControls.insertBefore(navPlayerZone, navMusicBtn);
        navPlayerZone.appendChild(navMusicBtn);

        // 插入左右面板和播放列表
        const tmpLeft = document.createElement('div');
        tmpLeft.innerHTML = leftSectionHTML;
        navPlayerZone.appendChild(tmpLeft.firstElementChild);

        const tmpRight = document.createElement('div');
        tmpRight.innerHTML = rightSectionHTML;
        navPlayerZone.appendChild(tmpRight.firstElementChild);

        const tmpPlaylist = document.createElement('div');
        tmpPlaylist.innerHTML = playlistHTML;
        navPlayerZone.appendChild(tmpPlaylist.firstElementChild);
    }

    // 创建后台音频
    const audioEl = document.createElement('audio');
    audioEl.id = 'navPlayerAudio';
    audioEl.preload = 'metadata';
    document.body.appendChild(audioEl);

    // ===== DOM引用 =====
    const leftSection = document.getElementById('navPlayerLeft');
    const rightSection = document.getElementById('navPlayerRight');
    const playlistEl = document.getElementById('navPlayerPlaylist');
    const playlistBody = document.getElementById('navPlaylistBody');
    const playerInfo = document.getElementById('navPlayerInfo');
    const playerTrackText = document.getElementById('navPlayerTrackText');
    const playBtn = document.getElementById('navPlayBtn');
    const prevBtn = document.getElementById('navPrevBtn');
    const nextBtn = document.getElementById('navNextBtn');
    const playerAudio = document.getElementById('navPlayerAudio');

    // ===== 工具函数 =====
    function formatTime(sec) {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    }

    // ===== 播放器功能 =====
    function loadTrack(index) {
        const track = musicData[index];
        if (!track) return;
        currentTrack = index;
        // 更新锚点头像
        avatarImg.src = track.avatar || '';
        // 更新右侧文字：歌名 - 歌手
        const songName = track.title || '未在播放';
        const artistName = track.artist || '开心元元';
        playerTrackText.textContent = songName + ' - ' + artistName;
        currentSec = 0;

        playerAudio.src = track.audioUrl || '';
        playerAudio.load();

        renderPlaylist();
    }

    function playTrack() {
        if (!musicData[currentTrack]) return;
        isPlaying = true;
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';

        const track = musicData[currentTrack];
        if (track.audioUrl) {
            playerAudio.play().catch(() => {});
        }

        if (progressTimer) clearInterval(progressTimer);
        progressTimer = setInterval(() => {
            currentSec++;
            if (currentSec >= track.durationSec) {
                nextTrack();
                return;
            }
        }, 1000);

        renderPlaylist();
        updateNavBtnState();
    }

    function pauseTrack() {
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        playerAudio.pause();
        if (progressTimer) clearInterval(progressTimer);
        updateNavBtnState();
    }

    function nextTrack() {
        currentTrack = (currentTrack + 1) % musicData.length;
        loadTrack(currentTrack);
        if (isPlaying) playTrack();
        updateNavBtnState();
    }

    function prevTrack() {
        currentTrack = (currentTrack - 1 + musicData.length) % musicData.length;
        loadTrack(currentTrack);
        if (isPlaying) playTrack();
        updateNavBtnState();
    }

    function updateNavBtnState() {
        const iconEl = navMusicBtn.querySelector('i');
        if (isPlaying) {
            if (iconEl) {
                iconEl.className = 'fas fa-pause';
            }
            navMusicBtn.classList.add('playing');
        } else {
            if (iconEl) {
                iconEl.className = 'fas fa-music';
            }
            navMusicBtn.classList.remove('playing');
        }
    }

    // ===== 渲染播放列表 =====
    function renderPlaylist() {
        playlistBody.innerHTML = musicData.map((track, i) => {
            const isActive = i === currentTrack;
            return `
            <div class="nav-playlist-item ${isActive ? 'playing' : ''}" data-index="${i}">
                <span class="nav-pl-index">${String(i + 1).padStart(2, '0')}</span>
                <div class="nav-pl-info">
                    <div class="nav-pl-name">${track.title}</div>
                    <div class="nav-pl-duration">${track.duration}</div>
                </div>
                ${isActive && isPlaying ? '<span class="nav-pl-indicator"><i class="fas fa-volume-up"></i></span>' : ''}
            </div>
            `;
        }).join('');

        playlistBody.querySelectorAll('.nav-playlist-item').forEach(item => {
            item.addEventListener('click', () => {
                const idx = parseInt(item.dataset.index);
                if (idx === currentTrack && isPlaying) {
                    pauseTrack();
                } else {
                    loadTrack(idx);
                    playTrack();
                }
            });
        });
    }

    // ===== 互斥逻辑：暂停音乐页面播放器 =====
    function pauseOtherPlayer() {
        if (window.musicPlayerAPI && typeof window.musicPlayerAPI.isPlaying === 'function' && window.musicPlayerAPI.isPlaying()) {
            window.musicPlayerAPI.pause();
        }
    }

    // ===== 双向展开动画 =====
    function expandPlayer(fromHover) {
        if (isExpanded || isAnimating) return;
        isAnimating = true;

        // 加载默认曲目
        if (!playerAudio.src || playerAudio.src === '') {
            loadTrack(0);
        }
        renderPlaylist();

        // 阶段1：图标向左旋转360°（0~0.3s）
        navMusicBtn.classList.add('rotating');

        // 阶段2：旋转结束后，cross-fade变身头像 + 左右面板展开（0.3~0.6s）
        setTimeout(() => {
            navMusicBtn.classList.remove('rotating');
            navMusicBtn.classList.add('expanded');

            // zone容器整体背景
            navPlayerZone.classList.add('expanded');

            // 左右面板同步展开
            leftSection.classList.add('expanded');
            rightSection.classList.add('expanded');
        }, 300);

        isExpanded = true;
        // 等待CSS过渡完成
        setTimeout(() => {
            isAnimating = false;
        }, 650);
    }

    // ===== 收起动画 =====
    function collapsePlayer() {
        if (!isExpanded || isAnimating) return;
        isAnimating = true;
        isPlaylistOpen = false;
        playlistEl.classList.remove('open');

        // 面板收回
        leftSection.classList.remove('expanded');
        rightSection.classList.remove('expanded');

        // 锚点：头像淡出→图标淡入
        navMusicBtn.classList.remove('expanded');

        // zone统一背景同步移除
        navPlayerZone.classList.remove('expanded');

        isExpanded = false;
        isClickKept = false;
        setTimeout(() => {
            isAnimating = false;
        }, 350);
    }

    // ===== 切换播放列表 =====
    function togglePlaylist() {
        isPlaylistOpen = !isPlaylistOpen;
        playlistEl.classList.toggle('open', isPlaylistOpen);
    }

    // ===== 事件绑定 - 导航栏按钮（锚点） =====
    navMusicBtn.addEventListener('click', function(e) {
        e.stopPropagation();

        if (isAnimating) return;

        if (isExpanded) {
            collapsePlayer();
        } else {
            // 点击展开时，暂停音乐页面播放器
            pauseOtherPlayer();
            isClickKept = true;
            expandPlayer(false);
        }
    });

    // ===== 主播放器控制 =====
    playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isPlaying) pauseTrack();
        else {
            pauseOtherPlayer();
            playTrack();
        }
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevTrack();
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextTrack();
    });

    // 播放结束自动下一曲
    playerAudio.addEventListener('ended', () => {
        nextTrack();
    });

    // ===== 点击完整播放器主区域切换播放列表 =====
    leftSection.addEventListener('click', (e) => {
        if (e.target.closest('.nav-ctrl-btn')) return;
        togglePlaylist();
    });

    // ===== 点击外部收起 =====
    document.addEventListener('click', (e) => {
        if (!isExpanded) return;
        const isClickInside = leftSection.contains(e.target) 
            || rightSection.contains(e.target) 
            || navMusicBtn.contains(e.target)
            || playlistEl.contains(e.target);
        if (!isClickInside) {
            collapsePlayer();
        }
    });

    // ===== 大屏 hover 逻辑 =====
    let isHovering = false;

    // hover整个zone区域（按钮+面板）保持展开
    navPlayerZone.addEventListener('mouseenter', () => {
        isHovering = true;
    });

    navPlayerZone.addEventListener('mouseleave', () => {
        isHovering = false;
        // 大屏且非点击保持时，延迟收起
        if (window.innerWidth > 768 && !isClickKept && !isAnimating) {
            setTimeout(() => {
                if (!isHovering && !isAnimating && !isClickKept && isExpanded) {
                    collapsePlayer();
                }
            }, 300);
        }
    });

    // 大屏hover圆形按钮展开
    navMusicBtn.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768 && !isClickKept && !isAnimating && !isExpanded) {
            expandPlayer(true);
        }
    });

    // ===== 初始化 =====
    loadTrack(0);
    updateNavBtnState();

    window.navPlayer = {
        play: playTrack,
        pause: pauseTrack,
        next: nextTrack,
        prev: prevTrack,
        load: loadTrack,
        isPlaying: () => isPlaying,
        currentTrack: () => currentTrack,
        expand: expandPlayer,
        collapse: collapsePlayer
    };
})();
