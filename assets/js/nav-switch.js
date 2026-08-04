'use strict';

/* ===== AJAX 无刷新页面切换 ===== */
/* 拦截导航链接点击，fetch 目标页面 HTML，替换 #pageContainer 内容 */
/* 音频元素始终存活，音乐无缝继续播放 */

(function () {
    if (window._navSwitchInitialized) return;
    window._navSwitchInitialized = true;

    // 页面名称 -> URL 映射
    const PAGE_MAP = {
        'gallery': 'index.html',           // 首页 = 素材库
        'profile': 'pages/profile.html',
        'video': 'pages/video.html',
        'growth': 'pages/growth.html',
        'album': 'pages/album.html',
        'message': 'pages/message.html',
    };

    // 页面名称 -> 专属初始化函数名
    const INIT_MAP = {
        'gallery': 'initGallery',
        'profile': 'initProfile',
        'video': 'initVideo',
        'growth': 'initGrowth',
        'album': 'initAlbum',
        'message': 'initMessage',
    };

    let currentPage = null;
    let isSwitching = false;

    // 根据当前路径推断页面名称
    function detectPageName(url) {
        const path = url || window.location.pathname;
        if (path.indexOf('profile') !== -1) return 'profile';
        if (path.indexOf('video') !== -1) return 'video';
        if (path.indexOf('growth') !== -1) return 'growth';
        if (path.indexOf('album') !== -1) return 'album';
        if (path.indexOf('message') !== -1) return 'message';
        return 'gallery'; // index.html 或根路径（素材库）
    }

    // 根据页面名称获取对应 HTML 文件路径
    function getPageUrl(pageName) {
        // 根据当前所在目录推断路径前缀
        const isInPages = window.location.pathname.indexOf('/pages/') !== -1;
        const prefix = isInPages ? '../' : '';
        if (pageName === 'gallery') return prefix + 'index.html';
        return prefix + 'pages/' + pageName + '.html';
    }

    // 显示 loading 动画
    function showLoading() {
        if (window.showPageLoading) {
            window.showPageLoading();
        } else {
            const loading = document.getElementById('pageLoading');
            if (loading) loading.classList.add('show');
        }
        // 运行打字机效果
        if (window.playLoadingTypewriter) window.playLoadingTypewriter();
    }

    // 隐藏 loading 动画
    function hideLoading() {
        if (window.hidePageLoading) {
            window.hidePageLoading();
        } else {
            const loading = document.getElementById('pageLoading');
            if (loading) loading.classList.remove('show');
        }
    }

    // 清理上一页的资源（定时器、监听器等）
    function cleanupPage() {
        // 调用页面专属 cleanup（如果存在）
        if (window._currentPageCleanup && typeof window._currentPageCleanup === 'function') {
            try {
                window._currentPageCleanup();
            } catch (e) {
                console.warn('[nav-switch] cleanup error:', e);
            }
            window._currentPageCleanup = null;
        }

        // 清理可能残留的全局事件（在非页面的 body 级元素上的监听）
        // 移除可能存在的旧弹窗 DOM（workModal, growthModal, lightbox 等不在 pageContainer 内的元素）
        const modalsToClose = ['#workModal', '#growthModal', '#lightbox'];
        modalsToClose.forEach(sel => {
            const el = document.querySelector(sel);
            if (el) {
                el.classList.remove('show');
                el.style.display = '';
                // 停止弹窗内的视频/音频
                el.querySelectorAll('video, audio').forEach(media => {
                    media.pause();
                    media.currentTime = 0;
                });
            }
        });

        // 清理 music 页面专属播放器（如果切走音乐页）
        if (window.musicPlayerAPI && typeof window.musicPlayerAPI.pause === 'function') {
            // 不暂停导航栏播放器，只暂停页面播放器
        }

        // 移除 body 上残留的页面专属弹窗（workModal / growthModal）
        // 这些元素不在 #pageContainer 内，需要单独移除
        ['workModal', 'growthModal'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.classList.remove('show');
                el.querySelectorAll('video, audio').forEach(m => { m.pause(); });
            }
        });
    }

    // 从完整 HTML 字符串中提取指定区域
    function extractContent(fullHTML, selector) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(fullHTML, 'text/html');
        const element = doc.querySelector(selector);
        return element ? element.innerHTML : '';
    }

    // 从完整 HTML 中提取页面专属弹窗等非 pageContainer 元素
    function extractOverlayElements(fullHTML) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(fullHTML, 'text/html');
        const overlays = {};
        // 提取 lightbox, workModal, growthModal
        ['lightbox', 'workModal', 'growthModal'].forEach(id => {
            const el = doc.getElementById(id);
            if (el) overlays[id] = el.outerHTML;
        });
        return overlays;
    }

    // 更新导航栏 active 状态
    function updateNavActive(pageName) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            // 根据href推断对应页面
            let linkPage = 'gallery';
            if (href && href.indexOf('profile') !== -1) linkPage = 'profile';
            else if (href && href.indexOf('video') !== -1) linkPage = 'video';
            else if (href && href.indexOf('growth') !== -1) linkPage = 'growth';
            else if (href && href.indexOf('album') !== -1) linkPage = 'album';
            else if (href && href.indexOf('message') !== -1) linkPage = 'message';
            else if (href && (href.indexOf('index') !== -1 || href.indexOf('gallery') !== -1)) linkPage = 'gallery';

            link.classList.toggle('active', linkPage === pageName);
        });
    }

    // 更新文档标题
    function updateTitle(title) {
        if (title) document.title = title;
    }

    // 执行页面切换
    async function switchToPage(pageName, pushState) {
        if (isSwitching) return;
        if (currentPage === pageName) return;
        isSwitching = true;

        showLoading();

        const pageUrl = getPageUrl(pageName);

        try {
            const response = await fetch(pageUrl, { cache: 'no-cache' });
            if (!response.ok) throw new Error('HTTP ' + response.status);
            const fullHTML = await response.text();

            // 短暂展示 loading 动画（约 1.5s），保证动画效果完整
            await new Promise(resolve => setTimeout(resolve, 800));

            // 1. 清理上一页
            cleanupPage();

            // 2. 替换 pageContainer 内容
            const pageContent = extractContent(fullHTML, '#pageContainer');
            const pageContainer = document.getElementById('pageContainer');
            if (pageContainer && pageContent) {
                pageContainer.innerHTML = pageContent;
            }

            // 3. 替换页面专属弹窗（lightbox/workModal/growthModal 等非 pageContainer 内的元素）
            const overlays = extractOverlayElements(fullHTML);
            Object.keys(overlays).forEach(id => {
                // 移除旧的弹窗元素
                const oldEl = document.getElementById(id);
                if (oldEl) oldEl.remove();
                // 创建新元素并插入到 body
                const tmp = document.createElement('div');
                tmp.innerHTML = overlays[id];
                const newEl = tmp.firstElementChild;
                if (newEl) {
                    // 插入到 pageContainer 之后、backToTop 之前
                    const backToTop = document.getElementById('backToTop');
                    if (backToTop) {
                        document.body.insertBefore(newEl, backToTop);
                    } else {
                        document.body.appendChild(newEl);
                    }
                }
            });

            // 4. 更新标题
            const parser = new DOMParser();
            const doc = parser.parseFromString(fullHTML, 'text/html');
            updateTitle(doc.title);

            // 5. 更新导航栏 active
            updateNavActive(pageName);

            // 6. 滚动到顶部
            window.scrollTo({ top: 0, behavior: 'instant' });

            // 7. 更新浏览器历史
            if (pushState) {
                const stateUrl = getPageUrl(pageName);
                history.pushState({ page: pageName }, '', stateUrl);
            }

            currentPage = pageName;

            // 8. 执行目标页面的初始化函数
            const initFnName = INIT_MAP[pageName];
            if (initFnName && typeof window[initFnName] === 'function') {
                // 使用 requestAnimationFrame 确保DOM已渲染
                requestAnimationFrame(() => {
                    try {
                        window[initFnName]();
                    } catch (e) {
                        console.error('[nav-switch] init error for ' + pageName + ':', e);
                    }
                    hideLoading();
                    isSwitching = false;
                });
            } else {
                hideLoading();
                isSwitching = false;
            }

        } catch (err) {
            console.error('[nav-switch] Failed to load page:', err);
            // 失败时降级为传统跳转
            window.location.href = pageUrl;
        }
    }

    // 绑定导航链接点击事件
    function bindNavLinks() {
        document.addEventListener('click', function (e) {
            const link = e.target.closest('.nav-link');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href || href === '#') return;

            // 推断页面名称
            let pageName = 'gallery';
            if (href.indexOf('profile') !== -1) pageName = 'profile';
            else if (href.indexOf('video') !== -1) pageName = 'video';
            else if (href.indexOf('growth') !== -1) pageName = 'growth';
            else if (href.indexOf('album') !== -1) pageName = 'album';
            else if (href.indexOf('message') !== -1) pageName = 'message';
            else if (href.indexOf('index') !== -1 || href.indexOf('gallery') !== -1) pageName = 'gallery';

            // 拦截默认跳转
            e.preventDefault();

            // 关闭移动端菜单
            const navMenu = document.getElementById('navMenu');
            const navToggle = document.getElementById('navToggle');
            if (navMenu) navMenu.classList.remove('open');
            if (navToggle) navToggle.classList.remove('active');

            switchToPage(pageName, true);
        });

        // logo 点击回到首页
        document.addEventListener('click', function (e) {
            const logoLink = e.target.closest('.nav-logo a');
            if (!logoLink) return;
            e.preventDefault();
            const navMenu = document.getElementById('navMenu');
            const navToggle = document.getElementById('navToggle');
            if (navMenu) navMenu.classList.remove('open');
            if (navToggle) navToggle.classList.remove('active');
            switchToPage('gallery', true);
        });
    }

    // 绑定浏览器前进/后退
    window.addEventListener('popstate', function (e) {
        const pageName = (e.state && e.state.page) || detectPageName();
        switchToPage(pageName, false);
    });

    // 初始化
    function init() {
        currentPage = detectPageName();
        bindNavLinks();

        // 确保 loading 的打字机效果在首次加载后不会重复显示
        // loading.js 已经处理了首次加载的 loading
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();