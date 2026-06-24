// ===== 图库数据 =====
const galleryData = [
    { url: "img/19.jpg", tag: "特征", filter: "fashion", caption: "绿色外套造型 · 时尚大片" },
    { url: "img/1.jpg", tag: "风格", filter: "style", caption: "白色裤子街拍 · 简约风格" },
    { url: "img/2.jpg", tag: "场景", filter: "scene", caption: "牛仔裤穿搭 · 休闲日常" },
    { url: "img/3.jpg", tag: "风格", filter: "style", caption: "旗袍上衣 · 东方韵味" },
    { url: "img/4.jpg", tag: "氛围", filter: "vibe", caption: "草原旅拍 · 自然清新" },
    { url: "img/5.jpg", tag: "风格", filter: "style", caption: "多风格搭配 · 时尚穿搭" },
    { url: "img/6.jpg", tag: "场景", filter: "scene", caption: "三里屯街拍 · 都市潮流" },
    { url: "img/7.jpg", tag: "氛围", filter: "vibe", caption: "张园写真 · 文艺气息" },
    { url: "img/8.jpg", tag: "特征", filter: "fashion", caption: "精致造型 · 时尚大片" },
    { url: "img/9.jpg", tag: "风格", filter: "style", caption: "汉服古风 · 仙气飘飘" },
    { url: "img/10.jpg", tag: "风格", filter: "style", caption: "唐装襦裙 · 国风之美" },
    { url: "img/11.jpg", tag: "氛围", filter: "vibe", caption: "传统汉服 · 清新氛围" },
    { url: "img/12.jpg", tag: "场景", filter: "scene", caption: "汉服少女 · 扬琴旋律" },
    { url: "img/13.jpg", tag: "氛围", filter: "vibe", caption: "古风意境 · 花开时节" },
    { url: "img/14.jpg", tag: "特征", filter: "fashion", caption: "琵琶造型 · 古韵风华" },
    { url: "img/15.jpg", tag: "场景", filter: "scene", caption: "美食摄影 · 生活记录" },
    { url: "img/16.jpg", tag: "场景", filter: "scene", caption: "咖啡时光 · 惬意午后" },
    { url: "img/17.jpg", tag: "氛围", filter: "vibe", caption: "餐厅打卡 · 美味时刻" },
    { url: "img/18.jpg", tag: "氛围", filter: "vibe", caption: "周末聚餐 · 温暖日常" },
    { url: "img/19.jpg", tag: "特征", filter: "fashion", caption: "生活日常 · 可爱瞬间" },
];

// ===== 音乐数据 =====
const musicData = [
    { title: "涵光初现", artist: "开心元元", duration: "03:42", durationSec: 222, type: "audio", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "双鱼座的梦", artist: "开心元元", duration: "04:15", durationSec: 255, type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { title: "春风十里不如你", artist: "开心元元", duration: "03:28", durationSec: 208, type: "audio", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { title: "蜀地花开", artist: "开心元元", duration: "04:01", durationSec: 241, type: "video", videoUrl: "https://www.w3schools.com/html/movie.mp4" },
    { title: "星河入梦", artist: "开心元元", duration: "03:55", durationSec: 235, type: "audio", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    { title: "霓裳羽衣", artist: "开心元元", duration: "04:30", durationSec: 270, type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { title: "二月的诗", artist: "开心元元", duration: "03:18", durationSec: 198, type: "audio", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { title: "与涵同行", artist: "开心元元", duration: "04:08", durationSec: 248, type: "audio", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
    { title: "涵光初现 (Remix)", artist: "开心元元", duration: "03:50", durationSec: 230, type: "audio", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
    { title: "星空下的约定", artist: "开心元元", duration: "04:22", durationSec: 262, type: "video", videoUrl: "https://www.w3schools.com/html/movie.mp4" },
    { title: "茉莉花开", artist: "开心元元", duration: "03:35", durationSec: 215, type: "audio", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
    { title: "月光谣", artist: "开心元元", duration: "04:10", durationSec: 250, type: "audio", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
];

// ===== 作品数据 =====
const worksData = [
    {
        cover: galleryData[1].url, title: "春日街拍特辑", desc: "以白色系为主的春日穿搭街拍，展现清新简约的时尚态度。", likes: "12.3万", views: "89.5万",
        images: [
            { url: galleryData[1].url, caption: "白色裤子街拍 · 简约风格" },
            { url: galleryData[2].url, caption: "牛仔裤穿搭 · 休闲日常" },
            { url: galleryData[5].url, caption: "多风格搭配 · 时尚穿搭" },
            { url: galleryData[6].url, caption: "三里屯街拍 · 都市潮流" },
            { url: galleryData[8].url, caption: "精致造型 · 时尚大片" },
            { url: galleryData[0].url, caption: "绿色外套造型 · 时尚大片" },
        ]
    },
    {
        cover: galleryData[9].url, title: "汉服古风写真", desc: "身着传统汉服，在古典场景中演绎东方之美，仙气十足。", likes: "25.6万", views: "156.8万",
        images: [
            { url: galleryData[9].url, caption: "汉服古风 · 仙气飘飘" },
            { url: galleryData[10].url, caption: "唐装襦裙 · 国风之美" },
            { url: galleryData[11].url, caption: "传统汉服 · 清新氛围" },
            { url: galleryData[12].url, caption: "汉服少女 · 扬琴旋律" },
            { url: galleryData[13].url, caption: "古风意境 · 花开时节" },
            { url: galleryData[14].url, caption: "琵琶造型 · 古韵风华" },
        ]
    },
    {
        cover: galleryData[6].url, title: "三里屯潮流穿搭", desc: "都市街头的潮流穿搭分享，融合时尚元素与个人风格。", likes: "8.9万", views: "67.2万",
        images: [
            { url: galleryData[6].url, caption: "三里屯街拍 · 都市潮流" },
            { url: galleryData[1].url, caption: "白色裤子街拍 · 简约风格" },
            { url: galleryData[5].url, caption: "多风格搭配 · 时尚穿搭" },
            { url: galleryData[2].url, caption: "牛仔裤穿搭 · 休闲日常" },
            { url: galleryData[8].url, caption: "精致造型 · 时尚大片" },
            { url: galleryData[0].url, caption: "绿色外套造型 · 时尚大片" },
        ]
    },
    {
        cover: galleryData[3].url, title: "旗袍韵味系列", desc: "改良旗袍上衣搭配，展现传统与现代的完美融合。", likes: "18.7万", views: "112.4万",
        images: [
            { url: galleryData[3].url, caption: "旗袍上衣 · 东方韵味" },
            { url: galleryData[9].url, caption: "汉服古风 · 仙气飘飘" },
            { url: galleryData[10].url, caption: "唐装襦裙 · 国风之美" },
            { url: galleryData[14].url, caption: "琵琶造型 · 古韵风华" },
            { url: galleryData[11].url, caption: "传统汉服 · 清新氛围" },
            { url: galleryData[13].url, caption: "古风意境 · 花开时节" },
        ]
    },
    {
        cover: galleryData[7].url, title: "张园文艺写真", desc: "在充满历史感的张园取景，记录文艺气息的午后时光。", likes: "9.2万", views: "54.3万",
        images: [
            { url: galleryData[7].url, caption: "张园写真 · 文艺气息" },
            { url: galleryData[15].url, caption: "美食摄影 · 生活记录" },
            { url: galleryData[16].url, caption: "咖啡时光 · 惬意午后" },
            { url: galleryData[17].url, caption: "餐厅打卡 · 美味时刻" },
            { url: galleryData[18].url, caption: "周末聚餐 · 温暖日常" },
            { url: galleryData[19].url, caption: "生活日常 · 可爱瞬间" },
        ]
    },
    {
        cover: galleryData[14].url, title: "古风音乐特辑", desc: "身着汉服弹奏传统乐器，将音乐与古风完美结合。", likes: "22.1万", views: "134.6万",
        images: [
            { url: galleryData[14].url, caption: "琵琶造型 · 古韵风华" },
            { url: galleryData[12].url, caption: "汉服少女 · 扬琴旋律" },
            { url: galleryData[9].url, caption: "汉服古风 · 仙气飘飘" },
            { url: galleryData[10].url, caption: "唐装襦裙 · 国风之美" },
            { url: galleryData[13].url, caption: "古风意境 · 花开时节" },
            { url: galleryData[3].url, caption: "旗袍上衣 · 东方韵味" },
        ]
    },
];

// ===== 留言数据 =====
const messageData = [
    { nick: "元心引力", text: "元元生日快乐！永远支持你，期待更多精彩作品！", time: "2026-06-20" },
    { nick: "双鱼座女孩", text: "从第一次看到你的穿搭视频就喜欢上了，你真的很棒！", time: "2026-06-18" },
    { nick: "蜀地小粉丝", text: "同为四川人，为你骄傲！古风造型真的太美了～", time: "2026-06-15" },
    { nick: "星河入梦", text: "你的每一次更新都是我期待的，继续加油呀！", time: "2026-06-12" },
];
