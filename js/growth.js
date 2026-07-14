'use strict';

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
let growthHighlightLocked = false;

// 扩展成长历程数据，增加4个新条目
const growthDataExtended = [
    // 新条目1：梦的开始
    {
        date: "2024/06/01",
        title: "梦的开始",
        shortTitle: "梦的开始",
        desc: "开心元元在社交媒体上发布了第一条短视频，以清新自然的风格和独特的穿搭品味，开启了她的自媒体之旅。",
        status: "",
        cover: galleryData[19].url,
        type: "article",
        content: {
            image: galleryData[19].url,
            caption: "梦的开始 · 初识元元",
            text: "2024年6月，开心元元在社交媒体上发布了她的第一条短视频。视频中她以清新自然的风格和独特的穿搭品味，迅速吸引了第一批粉丝的关注。从这一刻起，她踏上了属于自己的自媒体之路，用镜头记录生活，用穿搭表达态度。"
        }
    },
    // 新条目2：七擒孟获
    {
        date: "2024/08/15",
        title: "七擒孟获挑战赛",
        shortTitle: "七擒孟获",
        desc: "参与平台热门挑战赛「七擒孟获」，凭借创意十足的演绎和独特的个人风格，一举拿下挑战赛冠军。",
        status: "",
        cover: galleryData[8].url,
        type: "video",
        content: {
            image: galleryData[8].url,
            caption: "七擒孟获 · 挑战赛冠军",
            text: "2024年8月，开心元元参与了平台热门挑战赛「七擒孟获」。她以创意十足的演绎和独特的个人风格，在众多参赛者中脱颖而出，一举拿下挑战赛冠军。这次胜利不仅为她带来了大量关注，也展现了她多才多艺的一面。",
            video: {
                title: "七擒孟获挑战赛",
                videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
            }
        }
    },
    // 新条目3：周年庆
    {
        date: "2025/06/01",
        title: "自媒体一周年庆典",
        shortTitle: "周年庆",
        desc: "自媒体创作一周年，粉丝数突破50万，举办线上庆典活动回馈粉丝的厚爱与支持。",
        status: "",
        cover: galleryData[15].url,
        type: "article",
        content: {
            image: galleryData[15].url,
            caption: "周年庆 · 一周年快乐",
            text: "2025年6月，开心元元迎来了自媒体创作一周年。短短一年时间，她从一名普通女孩成长为拥有50万粉丝的时尚博主。为了回馈粉丝的厚爱与支持，她特别举办了线上庆典活动，与粉丝们一起分享这一年的成长与感动。"
        }
    },
    // 新条目4：生日
    {
        date: "2025/06/21",
        title: "元元生日特别直播",
        shortTitle: "生日",
        desc: "生日当天举办特别直播活动，与粉丝在线互动，分享生日蛋糕和一年来的心路历程。",
        status: "",
        cover: galleryData[4].url,
        type: "video",
        content: {
            image: galleryData[4].url,
            caption: "生日直播 · 温暖时刻",
            text: "2025年6月21日，开心元元在生日当天举办了特别直播活动。她与粉丝在线互动，分享生日蛋糕，畅谈一年来的心路历程。这场直播吸引了数万粉丝在线观看，大家纷纷在弹幕中送上生日祝福，场面温馨感人。",
            video: {
                title: "元元生日直播回放",
                videoUrl: "https://www.w3schools.com/html/movie.mp4"
            }
        }
    },
    // 原有条目
    {
        date: "2025/12/28",
        title: "元元大王短片《编号2002》",
        shortTitle: "编号2002",
        desc: "元宝基于元形象创作的一部AI短片，融合了科幻与情感元素，展现了元元在AI创作领域的全新探索。",
        status: "最新",
        cover: galleryData[0].url,
        type: "video",
        content: {
            image: galleryData[0].url,
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
        cover: galleryData[6].url,
        type: "article",
        content: {
            image: galleryData[6].url,
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
        cover: galleryData[9].url,
        type: "music",
        content: {
            image: galleryData[9].url,
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
        cover: galleryData[14].url,
        type: "article",
        content: {
            image: galleryData[14].url,
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
        cover: galleryData[12].url,
        type: "music",
        content: {
            image: galleryData[12].url,
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
        cover: galleryData[4].url,
        type: "image",
        content: {
            image: galleryData[4].url,
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
        cover: galleryData[7].url,
        type: "article",
        content: {
            image: galleryData[7].url,
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
        cover: galleryData[10].url,
        type: "article",
        content: {
            image: galleryData[10].url,
            caption: "汉服古风 · 仙气飘飘",
            text: "一次偶然的古风造型分享让开心元元一夜出圈。"
        }
    },
];

function setGrowthItemHeights() {
    if (!growthFullscreenScroll || !growthFullscreenList) return;
    const h = growthFullscreenScroll.clientHeight;
    if (h <= 0) return;
    growthFullscreenList.querySelectorAll('.growth-fullscreen-item').forEach(item => {
        item.style.height = h + 'px';
    });
}

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

    growthFullscreenList.innerHTML = growthDataExtended.map((item, i) => {
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
            openGrowthModal(idx);
        });
    });

    growthNavTrack.querySelectorAll('.growth-nav-point').forEach(point => {
        point.addEventListener('click', () => {
            const idx = parseInt(point.dataset.index);
            scrollToGrowthItem(idx);
        });
    });

    let growthScrollRaf = null;
    growthFullscreenScroll.addEventListener('scroll', () => {
        if (growthHighlightLocked) return;
        if (growthScrollRaf) cancelAnimationFrame(growthScrollRaf);
        growthScrollRaf = requestAnimationFrame(() => {
            const itemHeight = growthFullscreenScroll.clientHeight;
            if (itemHeight <= 0) return;
            const idx = Math.round(growthFullscreenScroll.scrollTop / itemHeight);
            const clamped = Math.max(0, Math.min(idx, growthDataExtended.length - 1));
            if (clamped !== growthCurrentIndex) {
                growthCurrentIndex = clamped;
                updateGrowthHighlight(clamped);
            }
        });
    });

    setGrowthItemHeights();
    const firstItem = growthFullscreenList.querySelector('.growth-fullscreen-item');
    if (firstItem) firstItem.classList.add('active');
}

window.addEventListener('resize', () => {
    setGrowthItemHeights();
});

function scrollToGrowthItem(idx) {
    const target = document.getElementById('growth-fs-' + idx);
    if (!target) return;

    const clickedPoint = growthNavTrack.querySelector(`.growth-nav-point[data-index="${idx}"]`);
    if (clickedPoint) {
        clickedPoint.classList.add('clicking');
        setTimeout(() => clickedPoint.classList.remove('clicking'), 600);
    }

    updateGrowthHighlight(idx);
    growthCurrentIndex = idx;

    target.scrollIntoView({ behavior: 'smooth' });
    centerTimelinePoint(idx);
}

function centerTimelinePoint(idx) {
    const navContainer = document.getElementById('growthTimelineNav');
    if (!navContainer) return;
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

function openGrowthModal(idx) {
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

    growthModalAudio = growthModalBody.querySelector('audio');
    growthModalVideo = growthModalBody.querySelector('video');
}

function closeGrowthModal() {
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
renderGrowthTimeline();