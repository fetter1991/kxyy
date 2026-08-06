// 音乐/视频页面交互
// PC（≥1024px）：专辑 Tab + 每页 8 条分页（数字胶囊）
// 小屏（<1024px）：专辑 Tab + 按专辑滚动加载（分页关闭）
(function () {
    'use strict';

    const isPC = () => window.innerWidth >= 1024;
    const PAGE_SIZE = 8;

    const state = {
        albums: videoAlbums || [],
        currentAlbum: 0,   // 当前选中专辑索引
        page: 1,           // 当前页码（仅 PC 分页使用）
        loaded: 0,         // 小屏已加载条数
        playingIndex: -1,  // 当前播放视频在所属专辑 videos 中的索引（-1 表示无）
    };

    const elements = {};

    function cacheElements() {
        elements.tabScroll = document.getElementById('albumTabScroll');
        elements.tabPrev = document.getElementById('albumTabPrev');
        elements.tabNext = document.getElementById('albumTabNext');
        elements.playlist = document.getElementById('videoPlaylist');
        elements.panel = document.querySelector('.video-panel');
        elements.video = document.getElementById('playerVideo');
        elements.stage = document.getElementById('videoContainer');
        elements.title = document.getElementById('playerTitle');
        elements.desc = document.getElementById('playerArtist');
        elements.playPause = document.getElementById('playBtn');
        elements.progress = document.getElementById('progressBar');
        elements.progressBar = document.getElementById('progressBar');
        elements.progressCurrent = document.getElementById('progressCurrent');
        elements.timeCurrent = document.getElementById('currentTime');
        elements.timeTotal = document.getElementById('totalTime');
        elements.prev = document.getElementById('prevBtn');
        elements.next = document.getElementById('nextBtn');
        elements.fullscreen = document.getElementById('fullscreenBtn');
    }

    // ---------- 专辑 Tab ----------
    function renderTabs() {
        if (!elements.tabScroll) return;
        elements.tabScroll.innerHTML = '';
        state.albums.forEach((album, i) => {
            const tab = document.createElement('button');
            tab.type = 'button';
            tab.className = 'album-tab' + (i === state.currentAlbum ? ' active' : '');
            tab.textContent = album.name;
            tab.dataset.index = i;
            tab.addEventListener('click', () => switchAlbum(i));
            elements.tabScroll.appendChild(tab);
        });
        updateTabArrows();
    }

    function updateTabArrows() {
        if (!elements.tabScroll || !elements.tabPrev || !elements.tabNext) return;
        const overflow = elements.tabScroll.scrollWidth > elements.tabScroll.clientWidth + 1;
        elements.tabPrev.style.display = overflow ? '' : 'none';
        elements.tabNext.style.display = overflow ? '' : 'none';
        if (!overflow) {
            elements.tabPrev.disabled = true;
            elements.tabNext.disabled = true;
            return;
        }
        elements.tabPrev.disabled = elements.tabScroll.scrollLeft <= 0;
        elements.tabNext.disabled =
            elements.tabScroll.scrollLeft + elements.tabScroll.clientWidth >= elements.tabScroll.scrollWidth - 1;
    }

    // ---------- 播放列表渲染 ----------
    function getVisibleVideos() {
        const album = state.albums[state.currentAlbum];
        if (!album) return [];
        const videos = album.videos || [];
        if (isPC()) {
            const start = (state.page - 1) * PAGE_SIZE;
            return videos.slice(start, start + PAGE_SIZE);
        }
        // 小屏：滚动加载
        return videos.slice(0, state.loaded);
    }

    function renderPlaylist() {
        if (!elements.playlist) return;
        elements.playlist.innerHTML = '';
        const album = state.albums[state.currentAlbum];
        const videos = getVisibleVideos();
        videos.forEach((item, localIdx) => {
            const globalIndex = isPC()
                ? (state.page - 1) * PAGE_SIZE + localIdx
                : localIdx;
            const isPlaying = globalIndex === state.playingIndex;
            const el = document.createElement('div');
            el.className = 'playlist-item' + (isPlaying ? ' playing' : '');
            el.dataset.index = globalIndex;
            const indexOrIcon = isPlaying
                ? '<span class="pl-play-icon"><i class="fas fa-play"></i></span>'
                : '<span class="pl-index">' + (globalIndex + 1) + '</span>';
            el.innerHTML =
                indexOrIcon +
                '<div class="pl-thumb">' +
                    '<img src="' + (item.cover || '') + '" alt="' + (item.title || '') + '">' +
                '</div>' +
                '<div class="pl-info">' +
                    '<div class="pl-name">' + (item.title || '') + '</div>' +
                '</div>';
            // 复用 hover/playing 时的播放小按钮提示
            if (!isPlaying) {
                el.innerHTML += '<span class="pl-hover-play"><i class="fas fa-play"></i></span>';
            }
            el.addEventListener('click', () => {
                // 小屏滚动加载模式下，点击已加载但未进入 loaded 的条目也允许播放
                state.playingIndex = globalIndex;
                playVideo(globalIndex);
                renderPlaylist();
            });
            elements.playlist.appendChild(el);
        });

        // 小屏加载更多按钮
        if (!isPC() && album) {
            const total = album.videos.length;
            if (state.loaded < total) {
                const more = document.createElement('button');
                more.type = 'button';
                more.className = 'playlist-load-more';
                more.textContent = '加载更多';
                more.addEventListener('click', () => {
                    state.loaded = Math.min(state.loaded + PAGE_SIZE, total);
                    renderPlaylist();
                    scrollToPlaylistBottom();
                });
                elements.playlist.appendChild(more);
            }
        }

        // PC 分页
        if (isPC() && album) {
            const totalPages = Math.max(1, Math.ceil(album.videos.length / PAGE_SIZE));
            renderPagination(totalPages);
        } else {
            removePagination();
        }
    }

    function scrollToPlaylistBottom() {
        if (elements.playlist) {
            elements.playlist.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }

    // ---------- 分页（PC） ----------
    function removePagination() {
        const existing = document.getElementById('videoPagination');
        if (existing) existing.remove();
    }

    function renderPagination(totalPages) {
        removePagination();
        if (totalPages <= 1) return;
        const pag = document.createElement('div');
        pag.className = 'video-pagination';
        pag.id = 'videoPagination';

        const mkBtn = (label, page, opts) => {
            opts = opts || {};
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'page-btn' + (opts.active ? ' active' : '') + (opts.disabled ? ' disabled' : '');
            b.textContent = label;
            if (!opts.disabled && !opts.active) {
                b.addEventListener('click', () => {
                    state.page = page;
                    renderPlaylist();
                });
            }
            return b;
        };

        // 上一页
        pag.appendChild(mkBtn('‹', state.page - 1, { disabled: state.page <= 1 }));

        // 页码
        for (let p = 1; p <= totalPages; p++) {
            if (totalPages > 7 && p > 2 && p < totalPages - 1 && Math.abs(p - state.page) > 1) {
                if (p === 3 || p === totalPages - 2) {
                    const dot = document.createElement('span');
                    dot.className = 'page-ellipsis';
                    dot.textContent = '…';
                    pag.appendChild(dot);
                }
                continue;
            }
            pag.appendChild(mkBtn(String(p), p, { active: p === state.page }));
        }

        // 下一页
        pag.appendChild(mkBtn('›', state.page + 1, { disabled: state.page >= totalPages }));

        if (elements.playlist && elements.playlist.parentNode) {
            elements.playlist.parentNode.insertBefore(pag, elements.playlist.nextSibling);
        }
    }

    // ---------- 专辑切换 ----------
    function switchAlbum(index) {
        if (index < 0 || index >= state.albums.length) return;
        state.currentAlbum = index;
        state.page = 1;
        state.loaded = Math.min(PAGE_SIZE, (state.albums[index].videos || []).length);
        // 切换专辑：继续播放，若当前播放视频不在新专辑列表中则高亮消失
        const album = state.albums[index];
        const stillInList = state.playingIndex >= 0 &&
            album.videos[state.playingIndex] !== undefined;
        if (!stillInList) state.playingIndex = -1;
        renderTabs();
        renderPlaylist();
    }

    // ---------- 视频播放 ----------
    function playVideo(index) {
        const album = state.albums[state.currentAlbum];
        if (!album || !album.videos[index]) return;
        const item = album.videos[index];
        state.playingIndex = index;
        if (elements.video) {
            elements.video.src = item.videoUrl;
            elements.video.load();
            const pr = elements.video.play();
            if (pr && pr.catch) pr.catch(() => {});
        }
        if (elements.title) elements.title.textContent = item.title || '未知视频';
        if (elements.desc) elements.desc.textContent = item.desc || '';
        if (elements.stage) elements.stage.classList.add('is-playing');
        updatePlayPauseIcon(true);
    }

    function updatePlayPauseIcon(playing) {
        if (!elements.playPause) return;
        const icon = elements.playPause.querySelector('i');
        if (icon) icon.className = playing ? 'fas fa-pause' : 'fas fa-play';
    }

    // ---------- 控制条 ----------
    function bindControls() {
        if (elements.playPause) {
            elements.playPause.addEventListener('click', () => {
                if (!elements.video) return;
                if (elements.video.paused) {
                    const pr = elements.video.play();
                    if (pr && pr.catch) pr.catch(() => {});
                    updatePlayPauseIcon(true);
                    if (elements.stage) elements.stage.classList.add('is-playing');
                } else {
                    elements.video.pause();
                    updatePlayPauseIcon(false);
                    if (elements.stage) elements.stage.classList.remove('is-playing');
                }
            });
        }

        if (elements.prev) {
            elements.prev.addEventListener('click', () => {
                const album = state.albums[state.currentAlbum];
                if (!album) return;
                const prevIdx = (state.playingIndex <= 0 ? album.videos.length - 1 : state.playingIndex - 1);
                state.playingIndex = prevIdx;
                playVideo(prevIdx);
                renderPlaylist();
            });
        }
        if (elements.next) {
            elements.next.addEventListener('click', () => {
                const album = state.albums[state.currentAlbum];
                if (!album) return;
                const nextIdx = (state.playingIndex < 0 ? 0 : (state.playingIndex + 1) % album.videos.length);
                state.playingIndex = nextIdx;
                playVideo(nextIdx);
                renderPlaylist();
            });
        }

        if (elements.fullscreen) {
            elements.fullscreen.addEventListener('click', () => {
                if (!elements.stage) return;
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else if (elements.stage.requestFullscreen) {
                    elements.stage.requestFullscreen();
                }
            });
        }

        if (elements.video) {
            elements.video.addEventListener('timeupdate', () => {
                if (!elements.video.duration) return;
                const pct = (elements.video.currentTime / elements.video.duration) * 100;
                if (elements.progressCurrent) {
                    elements.progressCurrent.style.width = pct + '%';
                }
                if (elements.timeCurrent) {
                    elements.timeCurrent.textContent = formatTime(elements.video.currentTime);
                }
                if (elements.timeTotal) {
                    elements.timeTotal.textContent = formatTime(elements.video.duration);
                }
            });
            elements.video.addEventListener('ended', () => {
                if (elements.stage) elements.stage.classList.remove('is-playing');
                updatePlayPauseIcon(false);
            });
        }

        if (elements.progress) {
            elements.progress.addEventListener('click', (e) => {
                if (!elements.video || !elements.video.duration) return;
                const rect = elements.progress.getBoundingClientRect();
                const ratio = (e.clientX - rect.left) / rect.width;
                elements.video.currentTime = ratio * elements.video.duration;
            });
        }

        // Tab 箭头
        if (elements.tabPrev) {
            elements.tabPrev.addEventListener('click', () => {
                if (elements.tabScroll) elements.tabScroll.scrollBy({ left: -120, behavior: 'smooth' });
            });
        }
        if (elements.tabNext) {
            elements.tabNext.addEventListener('click', () => {
                if (elements.tabScroll) elements.tabScroll.scrollBy({ left: 120, behavior: 'smooth' });
            });
        }
        if (elements.tabScroll) {
            elements.tabScroll.addEventListener('scroll', updateTabArrows);
        }
    }

    function formatTime(sec) {
        sec = Math.max(0, Math.floor(sec || 0));
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
    }

    // ---------- 初始化 ----------
    function init() {
        cacheElements();
        if (state.albums.length === 0) return;
        state.loaded = Math.min(PAGE_SIZE, state.albums[0].videos.length);
        renderTabs();
        renderPlaylist();
        bindControls();

        let resizeTimer = null;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // 响应式：切换 PC/小屏时重置分页与加载状态后重渲染
                const album = state.albums[state.currentAlbum];
                state.loaded = Math.min(PAGE_SIZE, album.videos.length);
                state.page = 1;
                renderPlaylist();
                updateTabArrows();
            }, 200);
        });
    }

    // 暴露给 nav-switch.js 用于 AJAX 切换时的页面初始化
    window.initVideo = init;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
