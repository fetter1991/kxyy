'use strict';

/* ===== 页面Loading遮罩控制 ===== */
(function() {
    const pageLoading = document.getElementById('pageLoading');
    if (!pageLoading) return;

    // 如果HTML中已经有show类（避免白色闪烁），标记为已激活
    let isLoadingActive = pageLoading.classList.contains('show');

    window.showPageLoading = function() {
        if (isLoadingActive) return;
        isLoadingActive = true;
        pageLoading.classList.add('show');
    };

    window.hidePageLoading = function() {
        pageLoading.classList.remove('show');
        isLoadingActive = false;
    };

    /* ===== Loading打字机效果 ===== */
    window.playLoadingTypewriter = function() {
        const cnEl = document.getElementById('loadingLineCn');
        const enEl = document.getElementById('loadingLineEn');
        if (!cnEl || !enEl) return;

        const cnText = '开心元元';
        const enText = 'KAIXINYUANYUAN';
        cnEl.innerHTML = '';
        enEl.innerHTML = '';

        let i = 0;
        function typeCn() {
            if (i < cnText.length) {
                const span = document.createElement('span');
                span.className = 'loading-char';
                span.textContent = cnText[i];
                cnEl.appendChild(span);
                i++;
                setTimeout(typeCn, 280);
            } else {
                const cursor = document.createElement('span');
                cursor.className = 'loading-cursor';
                cnEl.appendChild(cursor);
                setTimeout(typeEn, 400);
            }
        }

        let j = 0;
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

        setTimeout(typeCn, 300);
    };

    /* ===== 首页初始加载Loading ===== */
    window.showPageLoading();
    window.playLoadingTypewriter();
    setTimeout(function() {
        window.hidePageLoading();
    }, 5000);
})();