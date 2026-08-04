'use strict';

/* ===== 公共UI模块：导航栏滚动、回到顶部、汉堡菜单 ===== */
/* 所有页面共用，支持反复绑定与清理 */

(function () {

    function initCommonUI() {
        const navbar = document.getElementById('navbar');
        const backToTopBtn = document.getElementById('backToTop');
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');

        // 收集所有注册的事件处理器，便于 cleanup 时移除
        const handlers = [];

        // 导航栏滚动效果
        function onScrollNavbar() {
            if (!navbar) return;
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.25)';
                navbar.style.boxShadow = '0 4px 32px rgba(0,0,0,0.15)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.15)';
                navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.1)';
            }
        }

        // 回到顶部按钮显隐
        function onScrollBackToTop() {
            if (!backToTopBtn) return;
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }

        // 合并的 scroll 监听
        function onScroll() {
            onScrollNavbar();
            onScrollBackToTop();
        }

        window.addEventListener('scroll', onScroll);
        handlers.push(['window', 'scroll', onScroll]);

        // 回到顶部点击
        if (backToTopBtn) {
            function onBackToTopClick() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            backToTopBtn.addEventListener('click', onBackToTopClick);
            handlers.push([backToTopBtn, 'click', onBackToTopClick]);
        }

        // 汉堡菜单
        if (navToggle && navMenu) {
            function onNavToggleClick(e) {
                e.stopPropagation();
                navMenu.classList.toggle('open');
                navToggle.classList.toggle('active');
            }
            navToggle.addEventListener('click', onNavToggleClick);
            handlers.push([navToggle, 'click', onNavToggleClick]);

            function onDocClick(e) {
                if (navMenu.classList.contains('open')) {
                    if (!navbar.contains(e.target)) {
                        navMenu.classList.remove('open');
                        navToggle.classList.remove('active');
                    }
                }
            }
            document.addEventListener('click', onDocClick);
            handlers.push([document, 'click', onDocClick]);
        }

        // 返回 cleanup 函数
        return function cleanup() {
            handlers.forEach(([target, event, fn]) => {
                if (target === 'window') {
                    window.removeEventListener(event, fn);
                } else if (target.addEventListener) {
                    target.removeEventListener(event, fn);
                }
            });
        };
    }

    // 暴露到全局
    window.initCommonUI = initCommonUI;
})();
