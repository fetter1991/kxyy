// ===== 图库数据 =====
const galleryData = [
    { url: "img/19.jpg", tag: "特征", filter: "fashion", caption: "绿色外套造型 · 时尚大片" },
    { url: "img/01.jpg", tag: "风格", filter: "style", caption: "白色裤子街拍 · 简约风格" },
    { url: "img/02.jpg", tag: "场景", filter: "scene", caption: "牛仔裤穿搭 · 休闲日常" },
    { url: "img/03.jpg", tag: "风格", filter: "style", caption: "旗袍上衣 · 东方韵味" },
    { url: "img/04.jpg", tag: "氛围", filter: "vibe", caption: "草原旅拍 · 自然清新" },
    { url: "img/05.jpg", tag: "风格", filter: "style", caption: "多风格搭配 · 时尚穿搭" },
    { url: "img/06.jpg", tag: "场景", filter: "scene", caption: "三里屯街拍 · 都市潮流" },
    { url: "img/07.jpg", tag: "氛围", filter: "vibe", caption: "张园写真 · 文艺气息" },
    { url: "img/08.jpg", tag: "特征", filter: "fashion", caption: "精致造型 · 时尚大片" },
    { url: "img/09.jpg", tag: "风格", filter: "style", caption: "汉服古风 · 仙气飘飘" },
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
    { title: "小宇", artist: "张震岳", duration: "03:42", durationSec: 222, type: "audio", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "彩色翅膀", artist: "开心元元", duration: "04:15", durationSec: 255, type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { title: "匆匆那年", artist: "开心元元", duration: "03:28", durationSec: 208, type: "audio", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { title: "桃花岛", artist: "开心元元", duration: "04:01", durationSec: 241, type: "video", videoUrl: "https://www.w3schools.com/html/movie.mp4" },
    { title: "一直很安静", artist: "开心元元", duration: "03:55", durationSec: 235, type: "audio", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    { title: "若梦", artist: "开心元元", duration: "04:30", durationSec: 270, type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { title: "卜卦", artist: "开心元元", duration: "03:18", durationSec: 198, type: "audio", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { title: "叹云兮", artist: "鞠婧祎", duration: "04:08", durationSec: 248, type: "audio", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
    { title: "探故知", artist: "开心元元", duration: "03:50", durationSec: 230, type: "audio", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
    { title: "马马嘟嘟骑", artist: "开心元元", duration: "04:22", durationSec: 262, type: "video", videoUrl: "https://www.w3schools.com/html/movie.mp4" },
    { title: "虫儿飞", artist: "开心元元", duration: "03:35", durationSec: 215, type: "audio", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
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

// ===== 成长历程数据 =====
const growthData = [
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
            text: "元元大王短片《编号2002》是元宝基于元形象创作的一部AI短片。影片融合了科幻与情感元素，通过AI技术呈现出独特的视觉效果，展现了元元在AI创作领域的全新探索与突破。这部短片不仅是技术与艺术的结合，更是对元元形象的深度诠释。",
            video: {
                title: "编号2002 AI短片",
                videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
            }
        }
    },
    {
        date: "2025/12/27",
        title: "宠粉赛冠军",
        desc: "恭喜元元在抖音2025年嘉年华10万龙粉赛道中获得冠军，感谢每一位粉丝的支持与陪伴！",
        status: "",
        cover: galleryData[6].url,
        type: "article",
        content: {
            image: galleryData[6].url,
            caption: "宠粉赛冠军 · 荣耀时刻",
            text: "恭喜元元在抖音2025年嘉年华10万龙粉赛道中获得冠军！这份荣誉属于元元，也属于每一位支持她的粉丝。从初识到相守，感谢大家一路的陪伴与鼓励，未来我们继续携手前行，创造更多精彩！"
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
            text: "抖音宠粉赛火热开启中！活动时间为2025/12/26，粉丝们积极参与为元元打call。活动虽已结束，但元元与粉丝之间的温暖互动永不停止。感谢每一位参与活动的粉丝，你们的支持是元元前进的最大动力。",
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
            text: "随着短视频平台的崛起，开心元元凭借高质量的穿搭视频和独特的个人魅力，抖音粉丝突破百万大关。她成为知名时尚博主，每一次更新都牵动着数百万粉丝的心。这是元元成长路上的重要里程碑，也是新的起点。"
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
            text: "在时尚领域站稳脚跟后，开心元元开始探索音乐的无限可能。她将古风元素融入现代音乐，用扬琴等传统乐器演绎当代旋律，开创了属于自己的音乐风格。这次古风音乐特辑获得了粉丝们的热烈反响。",
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
            text: "在元元生日这天，团队特别策划了一场生日企划活动。粉丝们在评论区留下了无数温暖的祝福，元元也用精美的照片和真诚的文字回馈大家的爱。这一天，是元元与粉丝共同创造的美好回忆。"
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
            text: "开心元元在三里屯的街拍穿搭引发了新一轮时尚热潮。她将都市潮流元素与个人风格完美融合，每一套搭配都成为粉丝们争相模仿的对象。这次穿搭分享也让更多人认识了这位时尚博主。"
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
            text: "一次偶然的古风造型分享让开心元元一夜出圈。身着汉服的她仙气飘飘，传统与现代的碰撞引发了大量关注，粉丝数迅速突破万人大关。这次出圈不仅让她被更多人认识，也坚定了她在古风领域深耕的信心。"
        }
    },
];