'use strict';

/* ===== 留言册（相册翻书） ===== */

const COMMENT_STORAGE_KEY = 'kaixin_yuanyuan_comments';

const albumPalettes = [
    ['#8A2BE2', '#b06ab3'],
    ['#e8b4d8', '#c77dff'],
    ['#5e2a8c', '#8A2BE2'],
    ['#d896d8', '#b06ab3'],
    ['#7c3aed', '#e8b4d8'],
];

let _msgBookSpread = 0;
let _msgBookFlipping = false;

function _getComments() {
    let saved = [];
    try {
        saved = JSON.parse(localStorage.getItem(COMMENT_STORAGE_KEY) || '[]');
    } catch (e) {
        saved = [];
    }
    return [...saved, ...commentData];
}

function _saveComment(comment) {
    let saved = [];
    try {
        saved = JSON.parse(localStorage.getItem(COMMENT_STORAGE_KEY) || '[]');
    } catch (e) {
        saved = [];
    }
    saved.unshift(comment);
    localStorage.setItem(COMMENT_STORAGE_KEY, JSON.stringify(saved));
}

function _buildSpreads() {
    const msgs = _getComments();
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

function _paletteFor(nick) {
    let h = 0;
    for (let i = 0; i < nick.length; i++) h = (h * 31 + nick.charCodeAt(i)) % albumPalettes.length;
    return albumPalettes[h];
}

function _escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function _pageHTML(desc) {
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
    const [c1, c2] = _paletteFor(m.nick);
    const initial = m.nick.charAt(0);
    return `
    <div class="album-card">
        <div class="album-tape"></div>
        <div class="album-card-photo">
            <div class="album-avatar" style="background:linear-gradient(135deg, ${c1}, ${c2})">${_escapeHtml(initial)}</div>
        </div>
        <div class="album-card-body">
            <div class="album-card-nick">${_escapeHtml(m.nick)}</div>
            <div class="album-card-date">${_escapeHtml(m.time)}</div>
            <div class="album-card-text">${_escapeHtml(m.text)}</div>
        </div>
    </div>`;
}

function _updateBookInfo() {
    const bookPageInfo = document.getElementById('bookPageInfo');
    const bookPrev = document.getElementById('bookPrev');
    const bookNext = document.getElementById('bookNext');
    if (!bookPageInfo) return;

    const spreads = _buildSpreads();
    if (_msgBookSpread === 0) {
        bookPageInfo.textContent = '封面';
    } else {
        bookPageInfo.textContent = '第 ' + _msgBookSpread + ' / ' + (spreads.length - 1) + ' 页';
    }
    if (bookPrev) bookPrev.disabled = _msgBookSpread === 0;
    if (bookNext) bookNext.disabled = _msgBookSpread >= spreads.length - 1;
}

function _renderBook() {
    const bookPageLeft = document.getElementById('bookPageLeft');
    const bookPageRight = document.getElementById('bookPageRight');
    const bookFlipPage = document.getElementById('bookFlipPage');
    if (!bookPageLeft || !bookPageRight) return;

    const spreads = _buildSpreads();
    if (_msgBookSpread > spreads.length - 1) _msgBookSpread = spreads.length - 1;
    const sp = spreads[_msgBookSpread];
    bookPageLeft.innerHTML = _pageHTML(sp.left);
    bookPageRight.innerHTML = _pageHTML(sp.right);
    if (bookFlipPage) {
        bookFlipPage.style.transition = 'none';
        bookFlipPage.className = 'book-flip-page';
        bookFlipPage.style.display = 'none';
        void bookFlipPage.offsetWidth;
        bookFlipPage.style.transition = '';
    }
    _updateBookInfo();
}

function _startFlip(side, frontDesc, backDesc, underLeftDesc, underRightDesc, onDone) {
    const bookFlipPage = document.getElementById('bookFlipPage');
    const flipFront = document.getElementById('flipFront');
    const flipBack = document.getElementById('flipBack');
    const bookPageLeft = document.getElementById('bookPageLeft');
    const bookPageRight = document.getElementById('bookPageRight');
    if (!bookFlipPage) return;

    bookFlipPage.style.transition = 'none';
    bookFlipPage.className = 'book-flip-page flip-on-' + side;
    bookFlipPage.style.display = '';
    flipFront.innerHTML = _pageHTML(frontDesc);
    flipBack.innerHTML = _pageHTML(backDesc);
    bookPageLeft.innerHTML = _pageHTML(underLeftDesc);
    bookPageRight.innerHTML = _pageHTML(underRightDesc);
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

function _flipNext() {
    if (_msgBookFlipping) return;
    const spreads = _buildSpreads();
    if (_msgBookSpread >= spreads.length - 1) return;
    _msgBookFlipping = true;
    const cur = spreads[_msgBookSpread];
    const next = spreads[_msgBookSpread + 1];
    _startFlip('right', cur.right, next.left, cur.left, next.right, () => {
        _msgBookSpread++;
        const bookFlipPage = document.getElementById('bookFlipPage');
        if (bookFlipPage) {
            bookFlipPage.style.transition = 'none';
            bookFlipPage.classList.remove('flipping');
            bookFlipPage.className = 'book-flip-page';
            bookFlipPage.style.display = 'none';
            void bookFlipPage.offsetWidth;
            bookFlipPage.style.transition = '';
        }
        _renderBook();
        _msgBookFlipping = false;
    });
}

function _flipPrev() {
    if (_msgBookFlipping) return;
    if (_msgBookSpread <= 0) return;
    _msgBookFlipping = true;
    const spreads = _buildSpreads();
    const cur = spreads[_msgBookSpread];
    const prev = spreads[_msgBookSpread - 1];
    _startFlip('left', cur.left, prev.right, prev.left, cur.right, () => {
        _msgBookSpread--;
        const bookFlipPage = document.getElementById('bookFlipPage');
        if (bookFlipPage) {
            bookFlipPage.style.transition = 'none';
            bookFlipPage.classList.remove('flipping');
            bookFlipPage.className = 'book-flip-page';
            bookFlipPage.style.display = 'none';
            void bookFlipPage.offsetWidth;
            bookFlipPage.style.transition = '';
        }
        _renderBook();
        _msgBookFlipping = false;
    });
}

function initMessage() {
    const handlers = [];
    _msgBookSpread = 0;
    _msgBookFlipping = false;

    const bookNext = document.getElementById('bookNext');
    const bookPrev = document.getElementById('bookPrev');
    const msgSubmit = document.getElementById('msgSubmit');
    const msgName = document.getElementById('msgName');
    const msgContent = document.getElementById('msgContent');

    // 翻页按钮
    if (bookNext) {
        function onNext() { _flipNext(); }
        bookNext.addEventListener('click', onNext);
        handlers.push([bookNext, 'click', onNext]);
    }
    if (bookPrev) {
        function onPrev() { _flipPrev(); }
        bookPrev.addEventListener('click', onPrev);
        handlers.push([bookPrev, 'click', onPrev]);
    }

    // 提交留言
    if (msgSubmit) {
        function onSubmit() {
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
            _saveComment({ nick, text, time: dateStr });
            msgName.value = '';
            msgContent.value = '';
            _msgBookSpread = 1;
            _renderBook();
        }
        msgSubmit.addEventListener('click', onSubmit);
        handlers.push([msgSubmit, 'click', onSubmit]);
    }

    // 渲染留言册
    _renderBook();

    // 公共UI
    const cleanupCommon = window.initCommonUI ? window.initCommonUI() : null;

    // 注册 cleanup
    window._currentPageCleanup = function () {
        handlers.forEach(([target, event, fn]) => target.removeEventListener(event, fn));
        if (cleanupCommon) cleanupCommon();
    };
}

// 首次直接加载时自动执行
if (document.getElementById('messageBook')) {
    initMessage();
}
