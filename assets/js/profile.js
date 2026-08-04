'use strict';

/* ===== 个人资料页：生日倒计时 ===== */

function updateCountdown() {
    const cdDays = document.getElementById('cd-days');
    const cdHours = document.getElementById('cd-hours');
    const cdMins = document.getElementById('cd-mins');
    const cdSecs = document.getElementById('cd-secs');
    if (!cdDays) return;

    const now = new Date();
    const year = now.getMonth() > 5 || (now.getMonth() === 5 && now.getDate() > 21)
        ? now.getFullYear() + 1 : now.getFullYear();
    const birthday = new Date(year, 5, 21, 0, 0, 0);
    const diff = birthday - now;
    if (diff <= 0) return;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    cdDays.textContent = days;
    cdHours.textContent = String(hours).padStart(2, '0');
    cdMins.textContent = String(mins).padStart(2, '0');
    cdSecs.textContent = String(secs).padStart(2, '0');
}

function initProfile() {
    let countdownTimer = null;
    const handlers = [];

    // 生日倒计时
    updateCountdown();
    countdownTimer = setInterval(updateCountdown, 1000);

    // 公共UI
    const cleanupCommon = window.initCommonUI ? window.initCommonUI() : null;

    // 注册 cleanup
    window._currentPageCleanup = function () {
        if (countdownTimer) clearInterval(countdownTimer);
        if (cleanupCommon) cleanupCommon();
    };
}

// 首次直接加载时自动执行
if (document.getElementById('countdown')) {
    initProfile();
}
