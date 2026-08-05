'use strict';

/* ===== 成长历程全屏展示 ===== */

// 扩展成长历程数据，增加4个新条目
const growthDataExtended = [
    {
        date: "2024/06/01",
        title: "梦的开始",
        shortTitle: "梦的开始",
        desc: "开心元元在社交媒体上发布了第一条短视频，以清新自然的风格和独特的穿搭品味，开启了她的自媒体之旅。",
        status: "",
        cover: galleryImages[19],
        type: "article",
        content: {
            image: galleryImages[19],
            caption: "梦的开始 · 初识元元",
            text: "2024年6月，开心元元在社交媒体上发布了她的第一条短视频。视频中她以清新自然的风格和独特的穿搭品味，迅速吸引了第一批粉丝的关注。从这一刻起，她踏上了属于自己的自媒体之路，用镜头记录生活，用穿搭表达态度。"
        }
    },
    {
        date: "2024/08/15",
        title: "七擒孟获挑战赛",
        shortTitle: "七擒孟获",
        desc: "参与平台热门挑战赛「七擒孟获」，凭借创意十足的演绎和独特的个人风格，一举拿下挑战赛冠军。",
        status: "",
        cover: galleryImages[8],
        type: "video",
        content: {
            image: galleryImages[8],
            caption: "七擒孟获 · 挑战赛冠军",
            text: "2024年8月，开心元元参与了平台热门挑战赛「七擒孟获」。她以创意十足的演绎和独特的个人风格，在众多参赛者中脱颖而出，一举拿下挑战赛冠军。这次胜利不仅为她带来了大量关注，也展现了她多才多艺的一面。",
            video: {
                title: "七擒孟获挑战赛",
                videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
            }
        }
    },
    {
        date: "2025/06/01",
        title: "自媒体一周年庆典",
        shortTitle: "周年庆",
        desc: "自媒体创作一周年，粉丝数突破50万，举办线上庆典活动回馈粉丝的厚爱与支持。",
        status: "",
        cover: galleryImages[15],
        type: "article",
        content: {
            image: galleryImages[15],
            caption: "周年庆 · 一周年快乐",
            text: "2025年6月，开心元元迎来了自媒体创作一周年。短短一年时间，她从一名普通女孩成长为拥有50万粉丝的时尚博主。为了回馈粉丝的厚爱与支持，她特别举办了线上庆典活动，与粉丝们一起分享这一年的成长与感动。"
        }
    },
    {
        date: "2025/06/21",
        title: "元元生日特别直播",
        shortTitle: "生日",
        desc: "生日当天举办特别直播活动，与粉丝在线互动，分享生日蛋糕和一年来的心路历程。",
        status: "",
        cover: galleryImages[4],
        type: "video",
        content: {
            image: galleryImages[4],
            caption: "生日直播 · 温暖时刻",
            text: "2025年6月21日，开心元元在生日当天举办了特别直播活动。她与粉丝在线互动，分享生日蛋糕，畅谈一年来的心路历程。这场直播吸引了数万粉丝在线观看，大家纷纷在弹幕中送上生日祝福，场面温馨感人。",
            video: {
                title: "元元生日直播回放",
                videoUrl: "https://www.w3schools.com/html/movie.mp4"
            }
        }
    },
    {
        date: "2025/12/28",
        title: "元元大王短片《编号2002》",
        shortTitle: "编号2002",
        desc: "元宝基于元形象创作的一部AI短片，融合了科幻与情感元素，展现了元元在AI创作领域的全新探索。",
        status: "最新",
        cover: galleryImages[0],
        type: "video",
        content: {
            image: galleryImages[0],
            caption: "编号2002 · AI短片",
            text: "元元大王短片《编号2002》是元宝基于元形象创作的一部AI短片。影片融合了科幻与情感元素，通过AI技术呈现出独特的视觉效果，展现了元元在AI创作领域的全新探索与突破。",
            video: {
                title: "编号2002 AI短片",
                videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
            }
        }
    },
    {
        date: "2025/12/27",
        title: "宠粉赛冠军",
        shortTitle: "宠粉赛",
        desc: "恭喜元元在抖音2025年嘉年华10万龙粉赛道中获得冠军，感谢每一位粉丝的支持与陪伴！",
        status: "",
        cover: galleryImages[6],
        type: "article",
        content: {
            image: galleryImages[6],
            caption: "宠粉赛冠军 · 荣耀时刻",
            text: "恭喜元元在抖音2025年嘉年华10万龙粉赛道中获得冠军！这份荣誉属于元元，也属于每一位支持她的粉丝。"
        }
    },
    {
        date: "2025/12/26",
        title: "抖音·宠粉赛",
        shortTitle: "宠粉赛",
        desc: "抖音宠粉赛火热开启中，活动时间为2025/12/26，快来为元元打call吧！",
        status: "已结束",
        cover: galleryImages[9],
        type: "music",
        content: {
            image: galleryImages[9],
            caption: "宠粉赛 · 元元加油",
            text: "抖音宠粉赛火热开启中！活动时间为2025/12/26，粉丝们积极参与为元元打call。",
            music: {
                title: "涵光初现",
                artist: "开心元元",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                duration: "03:42"
            }
        }
    },
    {
        date: "2025/11/15",
        title: "百万粉丝达成",
        shortTitle: "百万粉丝",
        desc: "抖音粉丝突破百万大关，成为知名时尚博主，每一条更新都牵动着百万粉丝的心。",
        status: "",
        cover: galleryImages[14],
        type: "article",
        content: {
            image: galleryImages[14],
            caption: "百万粉丝 · 里程碑",
            text: "随着短视频平台的崛起，开心元元凭借高质量的穿搭视频和独特的个人魅力，抖音粉丝突破百万大关。"
        }
    },
    {
        date: "2025/09/20",
        title: "古风音乐特辑",
        shortTitle: "古风音乐",
        desc: "身着汉服弹奏传统乐器，将音乐与古风完美结合，开创属于自己的音乐风格。",
        status: "",
        cover: galleryImages[12],
        type: "music",
        content: {
            image: galleryImages[12],
            caption: "汉服少女 · 扬琴旋律",
            text: "在时尚领域站稳脚跟后，开心元元开始探索音乐的无限可能。",
            music: {
                title: "星河入梦",
                artist: "开心元元",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                duration: "03:55"
            }
        }
    },
    {
        date: "2025/06/21",
        title: "生日特别企划",
        shortTitle: "生日企划",
        desc: "元元生日当天发布特别企划，与粉丝共同庆祝这个特别的日子。",
        status: "已结束",
        cover: galleryImages[4],
        type: "image",
        content: {
            image: galleryImages[4],
            caption: "生日企划 · 温暖时刻",
            text: "在元元生日这天，团队特别策划了一场生日企划活动。"
        }
    },
    {
        date: "2025/03/08",
        title: "三里屯潮流穿搭",
        shortTitle: "潮流穿搭",
        desc: "都市街头的潮流穿搭分享，融合时尚元素与个人风格，引发穿搭热潮。",
        status: "",
        cover: galleryImages[7],
        type: "article",
        content: {
            image: galleryImages[7],
            caption: "三里屯街拍 · 都市潮流",
            text: "开心元元在三里屯的街拍穿搭引发了新一轮时尚热潮。"
        }
    },
    {
        date: "2024/12/01",
        title: "古风出圈",
        shortTitle: "古风出圈",
        desc: "凭借独特的古风造型获得大量关注，身着汉服仙气飘飘，一夜之间引爆网络。",
        status: "",
        cover: galleryImages[10],
        type: "article",
        content: {
            image: galleryImages[10],
            caption: "汉服古风 · 仙气飘飘",
            text: "一次偶然的古风造型分享让开心元元一夜出圈。"
        }
    },
];

// 模块级状态变量
let _growthCurrentIndex = 0;
let _growthHighlightLocked = false;
let _growthModalAudio = null;
let _growthModalVideo = null;

function _setGrowthItemHeights() {
    const growthFullscreenScroll = document.getElementById('growthFullscreenScroll');
    const growthFullscreenList = document.getElementById('growthFullscreenList');
    if (!growthFullscreenScroll || !growthFullscreenList) return;
    const h = growthFullscreenScroll.clientHeight;
    if (h <= 0) return;
    growthFullscreenList.querySelectorAll('.growth-fullscreen-item').forEach(item => {
        item.style.height = h + 'px';
    });
}

function _updateGrowthHighlight(idx) {
    const growthFullscreenList = document.getElementById('growthFullscreenList');
    const growthNavTrack = document.getElementById('growthNavTrack');
    if (!growthFullscreenList || !growthNavTrack) return;
    growthFullscreenList.querySelectorAll('.growth-fullscreen-item').forEach((item, i) => {
        item.classList.toggle('active', i === idx);
    });
    growthNavTrack.querySelectorAll('.growth-nav-point').forEach((p, i) => {
        p.classList.toggle('active', i === idx);
    });
}

function _renderGrowthTimeline() {
    const growthFullscreenList = document.getElementById('growthFullscreenList');
    const growthNavTrack = document.getElementById('growthNavTrack');
    if (!growthFullscreenList) return;

    growthFullscreenList.innerHTML = growthDataExtended.map((item, i) => {
        return `
        <div class="growth-fullscreen-item" data-index="${i}" id="growth-fs-${i}">
            <div class="growth-fullscreen-bg">
                <img src="${item.cover}" alt="${item.title}" loading="lazy">
            </div>
            <div class="growth-fullscreen-content">
                <div class="growth-fs-date">${item.date}</div>
                <div class="growth-fs-title-row">
                    <img src="../assets/img/global/pattern.svg" class="growth-fs-deco growth-fs-deco-left" alt="装饰">
                    <h2 class="growth-fs-title">${item.shortTitle || item.title}</h2>
                    <img src="../assets/img/global/pattern.svg" class="growth-fs-deco growth-fs-deco-right" alt="装饰">
                </div>
                <p class="growth-fs-desc">${item.desc}</p>
                <button class="growth-fs-btn" data-index="${i}">查看详情 <i class="fas fa-arrow-right"></i></button>
            </div>
        </div>
        `;
    }).join('');

    growthNavTrack.innerHTML = growthDataExtended.map((item, i) => `
        <button class="growth-nav-point ${i === 0 ? 'active' : ''}" data-index="${i}">
            <span class="growth-nav-diamond"></span>
            <span class="growth-nav-label">${item.shortTitle || item.title}</span>
        </button>
    `).join('');

    growthFullscreenList.querySelectorAll('.growth-fs-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.dataset.index);
            _openGrowthModal(idx);
        });
    });

    growthNavTrack.querySelectorAll('.growth-nav-point').forEach(point => {
        point.addEventListener('click', () => {
            const idx = parseInt(point.dataset.index);
            _scrollToGrowthItem(idx);
        });
    });

    const growthFullscreenScroll = document.getElementById('growthFullscreenScroll');
    let growthScrollRaf = null;
    growthFullscreenScroll.addEventListener('scroll', () => {
        if (_growthHighlightLocked) return;
        if (growthScrollRaf) cancelAnimationFrame(growthScrollRaf);
        growthScrollRaf = requestAnimationFrame(() => {
            const itemHeight = growthFullscreenScroll.clientHeight;
            if (itemHeight <= 0) return;
            const idx = Math.round(growthFullscreenScroll.scrollTop / itemHeight);
            const clamped = Math.max(0, Math.min(idx, growthDataExtended.length - 1));
            if (clamped !== _growthCurrentIndex) {
                _growthCurrentIndex = clamped;
                _updateGrowthHighlight(clamped);
            }
        });
    });

    _setGrowthItemHeights();
    const firstItem = growthFullscreenList.querySelector('.growth-fullscreen-item');
    if (firstItem) firstItem.classList.add('active');
}

function _scrollToGrowthItem(idx) {
    const target = document.getElementById('growth-fs-' + idx);
    const growthNavTrack = document.getElementById('growthNavTrack');
    if (!target || !growthNavTrack) return;

    const clickedPoint = growthNavTrack.querySelector(`.growth-nav-point[data-index="${idx}"]`);
    if (clickedPoint) {
        clickedPoint.classList.add('clicking');
        setTimeout(() => clickedPoint.classList.remove('clicking'), 600);
    }

    _updateGrowthHighlight(idx);
    _growthCurrentIndex = idx;

    target.scrollIntoView({ behavior: 'smooth' });
    _centerTimelinePoint(idx);
}

function _centerTimelinePoint(idx) {
    const navContainer = document.getElementById('growthTimelineNav');
    const growthNavTrack = document.getElementById('growthNavTrack');
    if (!navContainer || !growthNavTrack) return;

    const points = growthNavTrack.querySelectorAll('.growth-nav-point');
    if (!points[idx]) return;

    const containerWidth = navContainer.offsetWidth;
    if (containerWidth <= 0) return;
    if (navContainer.scrollWidth <= containerWidth) return;

    const pointWidth = 100;
    const containerPadding = 24;
    const pointOffsetLeft = points[idx].offsetLeft;
    let targetScrollLeft = pointOffsetLeft - (2 * pointWidth - containerPadding);
    const maxScrollLeft = navContainer.scrollWidth - containerWidth;
    targetScrollLeft = Math.max(0, Math.min(targetScrollLeft, maxScrollLeft));

    navContainer.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
    });
}

function _openGrowthModal(idx) {
    const growthModal = document.getElementById('growthModal');
    const growthModalTitle = document.getElementById('growthModalTitle');
    const growthModalBody = document.getElementById('growthModalBody');
    if (!growthModal || !growthModalBody) return;

    const item = growthDataExtended[idx];
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

    _growthModalAudio = growthModalBody.querySelector('audio');
    _growthModalVideo = growthModalBody.querySelector('video');
}

function _closeGrowthModal() {
    const growthModal = document.getElementById('growthModal');
    const growthModalBody = document.getElementById('growthModalBody');
    if (!growthModal) return;

    if (_growthModalAudio) {
        _growthModalAudio.pause();
        _growthModalAudio.currentTime = 0;
        _growthModalAudio = null;
    }
    if (_growthModalVideo) {
        _growthModalVideo.pause();
        _growthModalVideo.currentTime = 0;
        _growthModalVideo = null;
    }
    growthModal.classList.remove('show');
    growthModalBody.innerHTML = '';
}

function initGrowth() {
    const handlers = [];
    _growthCurrentIndex = 0;
    _growthHighlightLocked = false;

    const growthModal = document.getElementById('growthModal');
    const growthModalClose = document.getElementById('growthModalClose');
    const growthFullscreenScroll = document.getElementById('growthFullscreenScroll');

    // 渲染时间轴
    _renderGrowthTimeline();

    // 弹窗关闭按钮
    if (growthModalClose) {
        function onCloseClick() { _closeGrowthModal(); }
        growthModalClose.addEventListener('click', onCloseClick);
        handlers.push([growthModalClose, 'click', onCloseClick]);
    }

    // 点击弹窗背景关闭
    if (growthModal) {
        function onModalClick(e) {
            if (e.target === growthModal) _closeGrowthModal();
        }
        growthModal.addEventListener('click', onModalClick);
        handlers.push([growthModal, 'click', onModalClick]);
    }

    // ESC 关闭弹窗 + 上下方向键切换模块
    function onKeydown(e) {
        if (e.key === 'Escape' && growthModal && growthModal.classList.contains('show')) {
            _closeGrowthModal();
            return;
        }
        // 弹窗打开时不处理方向键
        if (growthModal && growthModal.classList.contains('show')) return;
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const dir = e.key === 'ArrowDown' ? 1 : -1;
            const nextIdx = _growthCurrentIndex + dir;
            const clamped = Math.max(0, Math.min(nextIdx, growthDataExtended.length - 1));
            if (clamped !== _growthCurrentIndex) {
                _scrollToGrowthItem(clamped);
            }
        }
    }
    document.addEventListener('keydown', onKeydown);
    handlers.push([document, 'keydown', onKeydown]);

    // 滚轮事件：每次滚动直接切换到下一/上一模块（一次一格）
    if (growthFullscreenScroll) {
        let _wheelLocking = false;
        function onWheel(e) {
            e.preventDefault();
            if (_wheelLocking) return;
            const delta = e.deltaY || 0;
            if (Math.abs(delta) < 5) return;
            _wheelLocking = true;
            const dir = delta > 0 ? 1 : -1;
            const nextIdx = _growthCurrentIndex + dir;
            const clamped = Math.max(0, Math.min(nextIdx, growthDataExtended.length - 1));
            if (clamped !== _growthCurrentIndex) {
                _scrollToGrowthItem(clamped);
            }
            setTimeout(() => { _wheelLocking = false; }, 800);
        }
        growthFullscreenScroll.addEventListener('wheel', onWheel, { passive: false });
        handlers.push([growthFullscreenScroll, 'wheel', onWheel]);

        // 触摸滑动支持（移动端一次一格切换）
        let _touchStartY = 0;
        let _touchLocking = false;
        function onTouchStart(e) {
            _touchStartY = e.touches[0].clientY;
        }
        function onTouchEnd(e) {
            if (_touchLocking) return;
            const endY = e.changedTouches[0].clientY;
            const diff = _touchStartY - endY;
            if (Math.abs(diff) < 40) return;
            _touchLocking = true;
            const dir = diff > 0 ? 1 : -1;
            const nextIdx = _growthCurrentIndex + dir;
            const clamped = Math.max(0, Math.min(nextIdx, growthDataExtended.length - 1));
            if (clamped !== _growthCurrentIndex) {
                _scrollToGrowthItem(clamped);
            }
            setTimeout(() => { _touchLocking = false; }, 800);
        }
        growthFullscreenScroll.addEventListener('touchstart', onTouchStart, { passive: true });
        growthFullscreenScroll.addEventListener('touchend', onTouchEnd, { passive: true });
        handlers.push([growthFullscreenScroll, 'touchstart', onTouchStart]);
        handlers.push([growthFullscreenScroll, 'touchend', onTouchEnd]);
    }

    // 窗口 resize 重新设置高度
    function onResize() { _setGrowthItemHeights(); }
    window.addEventListener('resize', onResize);
    handlers.push([window, 'resize', onResize]);

    // 重置滚动位置到顶部
    if (growthFullscreenScroll) {
        growthFullscreenScroll.scrollTop = 0;
    }

    // 重置时间轴导航到最左侧
    const growthNav = document.getElementById('growthTimelineNav');
    _growthHighlightLocked = true;
    _growthCurrentIndex = 0;
    _updateGrowthHighlight(0);
    if (growthNav) growthNav.scrollLeft = 0;

    setTimeout(() => {
        if (growthNav) growthNav.scrollLeft = 0;
        _centerTimelinePoint(0);
        _growthHighlightLocked = false;
    }, 100);

    // 公共UI
    const cleanupCommon = window.initCommonUI ? window.initCommonUI() : null;

    // 注册 cleanup
    window._currentPageCleanup = function () {
        handlers.forEach(([target, event, fn]) => {
            if (target === window) {
                window.removeEventListener(event, fn);
            } else {
                target.removeEventListener(event, fn);
            }
        });
        _closeGrowthModal();
        if (cleanupCommon) cleanupCommon();
    };
}

// 首次直接加载时自动执行
if (document.getElementById('growthFullscreenList')) {
    initGrowth();
}