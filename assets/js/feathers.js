'use strict';

/* ===== 全屏羽毛自由漂浮背景效果 ===== */
/* 轻柔、浪漫、唯美风格 | 内容之下 | 2~6片动态调整 */
(function () {
    // 检测是否已存在容器，避免重复初始化
    if (document.getElementById('featherLayer')) return;

    const FEATHER_IMAGES = [
        'assets/img/global/feather0.png',
        'assets/img/global/feather1.png',
        'assets/img/global/feather2.png',
        'assets/img/global/feather3.png'
    ];

    // 自动检测相对路径（首页 vs 子页面）：仅返回页面层相对前缀
    function detectBasePath() {
        return window.location.pathname.indexOf('/pages/') !== -1 ? '../' : '';
    }

    const basePath = detectBasePath();
    const featherSrcs = FEATHER_IMAGES.map(src => basePath + src);

    // 创建容器
    const layer = document.createElement('div');
    layer.id = 'featherLayer';
    document.body.insertBefore(layer, document.body.firstChild);

    let feathers = [];
    let canvasW = window.innerWidth;
    let canvasH = window.innerHeight;
    let animId = null;
    let countTimer = null;

    // 羽毛类
    class Feather {
        constructor(src) {
            this.el = document.createElement('img');
            this.el.src = src;
            this.el.className = 'feather-particle';
            this.el.draggable = false;
            layer.appendChild(this.el);
            this.reset(true);
        }

        reset(initial) {
            const size = 30 + Math.random() * 35; // 30~65px
            this.size = size;
            this.el.style.width = size + 'px';
            this.el.style.height = 'auto';

            // 初始位置：随机散布全屏
            this.x = Math.random() * (canvasW - size) + size * 0.5;
            this.y = initial
                ? Math.random() * (canvasH - size) + size * 0.5
                : Math.random() * canvasH;

            // 速度：极缓慢，方向随机
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.15 + Math.random() * 0.35; // 0.15~0.5 px/frame
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;

            // 旋转
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 0.4; // -0.2~0.2 deg/frame

            // 摇摆参数（模拟羽毛随风飘荡的正弦摆动）
            this.swayAmp = 0.3 + Math.random() * 0.6;
            this.swayFreq = 0.005 + Math.random() * 0.01;
            this.swayPhase = Math.random() * Math.PI * 2;
            this.time = Math.random() * 1000;

            // 透明度呼吸
            this.baseOpacity = 0.35 + Math.random() * 0.35; // 0.35~0.7
            this.opacityAmp = 0.1 + Math.random() * 0.15;
            this.opacityFreq = 0.003 + Math.random() * 0.005;

            // 淡入
            this.fadeIn = initial ? 1 : 0;
        }

        update() {
            this.time++;

            // 位置更新 + 摇摆
            const swayX = Math.sin(this.time * this.swayFreq + this.swayPhase) * this.swayAmp;
            const swayY = Math.cos(this.time * this.swayFreq * 0.7 + this.swayPhase) * this.swayAmp * 0.5;

            this.x += this.vx + swayX;
            this.y += this.vy + swayY;

            // 旋转
            this.rotation += this.rotationSpeed;

            // 边界折返（柔和反弹，降低速度）
            const half = this.size * 0.5;
            if (this.x < half) { this.x = half; this.vx = Math.abs(this.vx) * 0.8; }
            if (this.x > canvasW - half) { this.x = canvasW - half; this.vx = -Math.abs(this.vx) * 0.8; }
            if (this.y < half) { this.y = half; this.vy = Math.abs(this.vy) * 0.8; }
            if (this.y > canvasH - half) { this.y = canvasH - half; this.vy = -Math.abs(this.vy) * 0.8; }

            // 偶尔微调方向，模拟风的变化
            if (Math.random() < 0.002) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 0.15 + Math.random() * 0.35;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
            }

            // 淡入
            if (this.fadeIn < 1) this.fadeIn = Math.min(1, this.fadeIn + 0.01);

            // 透明度呼吸
            const opacity = (this.baseOpacity + Math.sin(this.time * this.opacityFreq) * this.opacityAmp) * this.fadeIn;

            // 应用变换
            this.el.style.transform = `translate(${this.x - half}px, ${this.y - half}px) rotate(${this.rotation}deg)`;
            this.el.style.opacity = opacity.toFixed(3);
        }

        fadeOutRemove() {
            this.el.style.transition = 'opacity 1.5s ease';
            this.el.style.opacity = '0';
            setTimeout(() => {
                if (this.el.parentNode) this.el.parentNode.removeChild(this.el);
            }, 1600);
        }
    }

    function spawnFeather() {
        const src = featherSrcs[Math.floor(Math.random() * featherSrcs.length)];
        return new Feather(src);
    }

    // 动态调整数量：2~6片
    function adjustCount() {
        const target = 2 + Math.floor(Math.random() * 5); // 2~6
        while (feathers.length < target) {
            feathers.push(spawnFeather());
        }
        while (feathers.length > target) {
            const f = feathers.pop();
            f.fadeOutRemove();
        }
    }

    function animate() {
        feathers.forEach(f => f.update());
        animId = requestAnimationFrame(animate);
    }

    function onResize() {
        canvasW = window.innerWidth;
        canvasH = window.innerHeight;
    }

    function init() {
        // 初始创建3片
        for (let i = 0; i < 3; i++) {
            feathers.push(spawnFeather());
        }
        animate();

        // 每8~15秒动态调整数量
        function scheduleAdjust() {
            const delay = 8000 + Math.random() * 7000;
            countTimer = setTimeout(() => {
                adjustCount();
                scheduleAdjust();
            }, delay);
        }
        scheduleAdjust();

        window.addEventListener('resize', onResize);
    }

    // 等待DOM就绪
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
