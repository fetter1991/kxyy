'use strict';

/* ===== 留言册（相册翻书） ===== */
const bookPageLeft = document.getElementById('bookPageLeft');
const bookPageRight = document.getElementById('bookPageRight');
const bookFlipPage = document.getElementById('bookFlipPage');
const flipFront = document.getElementById('flipFront');
const flipBack = document.getElementById('flipBack');
const bookPrev = document.getElementById('bookPrev');
const bookNext = document.getElementById('bookNext');
const bookPageInfo = document.getElementById('bookPageInfo');
const msgName = document.getElementById('msgName');
const msgContent = document.getElementById('msgContent');
const msgSubmit = document.getElementById('msgSubmit');
const COMMENT_STORAGE_KEY = 'kaixin_yuanyuan_comments';

let bookSpread = 0;
let bookFlipping = false;

const albumPalettes = [
    ['#8A2BE2', '#b06ab3'],
    ['#e8b4d8', '#c77dff'],
    ['#5e2a8c', '#8A2BE2'],
    ['#d896d8', '#b06ab3'],
    ['#7c3aed', '#e8b4d8'],
];

function getComments() {
    let saved = [];
    try {
        saved = JSON.parse(localStorage.getItem(COMMENT_STORAGE_KEY) || '[]');
    } catch (e) {
        saved = [];
    }
    return [...saved, ...commentData];
}

function saveComment(comment) {
    let saved = [];
    try {
        saved = JSON.parse(localStorage.getItem(COMMENT_STORAGE_KEY) || '[]');
    } catch (e) {
        saved = [];
    }
    saved.unshift(comment);
    localStorage.setItem(COMMENT_STORAGE_KEY, JSON.stringify(saved));
}

function buildSpreads() {
    const msgs = getComments();
    const spreads = [];
    spreads.push({ left: { kind: 'cover' }, right: { kind: 'welcome', count: msgs.length } });
    for (let i = 0; i < msgs.length; i += 2) {
        spreads.push({
            left: { kind: 'message', msg: msgs[i] },
            right: msgs[i + 1] ? { kind: 'message', msg: msgs[i + 1] } : { kind: 'empty' }
        });
    }
    if (spreads.length === 1) {
        spreads.push({ left: { kind: 'empty' }, right: { kind: 'empty' } });
    }
    return spreads;
}

function paletteFor(nick) {
    let h = 0;
    for (let i = 0; i < nick.length; i++) h = (h * 31 + nick.charCodeAt(i)) % albumPalettes.length;
    return albumPalettes[h];
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function pageHTML(desc) {
    if (desc.kind === 'cover') {
        return `
        <div class="album-cover">
            <div class="album-cover-frame">
                <div class="album-cover-icon"><i class="fas fa-heart"></i></div>
                <div class="album-cover-title">粉丝留言册</div>
                <div class="album-cover-en">KAI XIN YUAN YUAN</div>
                <div class="album-cover-deco">✦ ✦ ✦</div>
                <div class="album-cover-foot">致 · 开心元元</div>
            </div>
        </div>`;
    }
    if (desc.kind === 'welcome') {
        return `
        <div class="album-welcome">
            <div class="album-welcome-icon"><i class="fas fa-feather-alt"></i></div>
            <h3>欢迎翻开留言册</h3>
            <p>这里珍藏着每一位粉丝<br>写给元元的温暖话语</p>
            <div class="album-welcome-count">共 <strong>${desc.count}</strong> 条留言</div>
            <p class="album-welcome-tip">点击右侧按钮翻页<br>阅读每一份心意 ✨</p>
        </div>`;
    }
    if (desc.kind === 'empty') {
        return `
        <div class="album-empty">
            <i class="fas fa-feather-alt"></i>
            <p>这一页还空着<br>期待你的留言填满它</p>
        </div>`;
    }
    const m = desc.msg;
    const [c1, c2] = paletteFor(m.nick);
    const initial = m.nick.charAt(0);
    return `
    <div class="album-card">
        <div class="album-tape"></div>
        <div class="album-card-photo">
            <div class="album-avatar" style="background:linear-gradient(135deg, ${c1}, ${c2})">${escapeHtml(initial)}</div>
        </div>
        <div class="album-card-body">
            <div class="album-card-nick">${escapeHtml(m.nick)}</div>
            <div class="album-card-date">${escapeHtml(m.time)}</div>
            <div class="album-card-text">${escapeHtml(m.text)}</div>
        </div>
    </div>`;
}

function updateBookInfo() {
    const spreads = buildSpreads();
    if (bookSpread === 0) {
        bookPageInfo.textContent = '封面';
    } else {
        bookPageInfo.textContent = '第 ' + bookSpread + ' / ' + (spreads.length - 1) + ' 页';
    }
    bookPrev.disabled = bookSpread === 0;
    bookNext.disabled = bookSpread >= spreads.length - 1;
}

function renderBook() {
    const spreads = buildSpreads();
    if (bookSpread > spreads.length - 1) bookSpread = spreads.length - 1;
    const sp = spreads[bookSpread];
    bookPageLeft.innerHTML = pageHTML(sp.left);
    bookPageRight.innerHTML = pageHTML(sp.right);
    bookFlipPage.style.transition = 'none';
    bookFlipPage.className = 'book-flip-page';
    bookFlipPage.style.display = 'none';
    void bookFlipPage.offsetWidth;
    bookFlipPage.style.transition = '';
    updateBookInfo();
}

function startFlip(side, frontDesc, backDesc, underLeftDesc, underRightDesc, onDone) {
    bookFlipPage.style.transition = 'none';
    bookFlipPage.className = 'book-flip-page flip-on-' + side;
    bookFlipPage.style.display = '';
    flipFront.innerHTML = pageHTML(frontDesc);
    flipBack.innerHTML = pageHTML(backDesc);
    bookPageLeft.innerHTML = pageHTML(underLeftDesc);
    bookPageRight.innerHTML = pageHTML(underRightDesc);
    void bookFlipPage.offsetWidth;
    bookFlipPage.style.transition = '';
    void bookFlipPage.offsetWidth;
    bookFlipPage.classList.add('flipping');
    bookFlipPage.addEventListener('transitionend', function done(e) {
        if (e.propertyName !== 'transform') return;
        bookFlipPage.removeEventListener('transitionend', done);
        onDone();
    });
}

function flipNext() {
    if (bookFlipping) return;
    const spreads = buildSpreads();
    if (bookSpread >= spreads.length - 1) return;
    bookFlipping = true;
    const cur = spreads[bookSpread];
    const next = spreads[bookSpread + 1];
    startFlip('right', cur.right, next.left, cur.left, next.right, () => {
        bookSpread++;
        bookFlipPage.style.transition = 'none';
        bookFlipPage.classList.remove('flipping');
        bookFlipPage.className = 'book-flip-page';
        bookFlipPage.style.display = 'none';
        void bookFlipPage.offsetWidth;
        bookFlipPage.style.transition = '';
        renderBook();
        bookFlipping = false;
    });
}

function flipPrev() {
    if (bookFlipping) return;
    if (bookSpread <= 0) return;
    bookFlipping = true;
    const spreads = buildSpreads();
    const cur = spreads[bookSpread];
    const prev = spreads[bookSpread - 1];
    startFlip('left', cur.left, prev.right, prev.left, cur.right, () => {
        bookSpread--;
        bookFlipPage.style.transition = 'none';
        bookFlipPage.classList.remove('flipping');
        bookFlipPage.className = 'book-flip-page';
        bookFlipPage.style.display = 'none';
        void bookFlipPage.offsetWidth;
        bookFlipPage.style.transition = '';
        renderBook();
        bookFlipping = false;
    });
}

bookNext.addEventListener('click', flipNext);
bookPrev.addEventListener('click', flipPrev);

msgSubmit.addEventListener('click', () => {
    const nick = msgName.value.trim();
    const text = msgContent.value.trim();
    if (!nick || !text) {
        alert('请填写昵称和留言内容');
        return;
    }
    const today = new Date();
    const dateStr = today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0');
    saveComment({ nick, text, time: dateStr });
    msgName.value = '';
    msgContent.value = '';
    bookSpread = 1;
    renderBook();
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
renderBook();
