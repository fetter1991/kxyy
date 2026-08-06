"""内存态数据源（T03 阶段）。

将 assets/js/data.js 的现有数据集转为接口端内存结构，字段对齐 api-contract.md。
T07 接管持久化后，本文件由 DB/文件存储替换，模型与端点不变（原则 8 渐进）。
媒体 URL 暂沿用 data.js 的相对路径，T04/T19 统一为 /media/*。
"""
from __future__ import annotations

from models import (
    AlbumItem, GalleryItem, GrowthContent, GrowthItem, GrowthMusic, GrowthVideo,
    ImageItem, Message, MusicTrack, Profile, VideoAlbum, VideoItem,
)

_G = lambda i: f"../assets/img/works/{i:02d}.jpg"


# ---------- GalleryItem（素材合集 G3/G4/G5） ----------
galleries: list[GalleryItem] = [
    GalleryItem(id="g1", title="时尚大片", author="开心元元", category="fashion",
        cover=_G(0), desc="绿色外套造型与精致时尚大片的合集，展现元元的潮流表现力。",
        images=[ImageItem(url=_G(0), caption="绿色外套造型 · 时尚大片"),
                ImageItem(url=_G(8), caption="精致造型 · 时尚大片"),
                ImageItem(url=_G(14), caption="琵琶造型 · 古韵风华"),
                ImageItem(url=_G(19), caption="生活日常 · 可爱瞬间")]),
    GalleryItem(id="g2", title="简约风格", author="开心元元", category="style",
        cover=_G(1), desc="白色裤子街拍、旗袍、汉服与多风格穿搭，呈现元元的百变风格。",
        images=[ImageItem(url=_G(1), caption="白色裤子街拍 · 简约风格"),
                ImageItem(url=_G(3), caption="旗袍上衣 · 东方韵味"),
                ImageItem(url=_G(5), caption="多风格搭配 · 时尚穿搭"),
                ImageItem(url=_G(9), caption="汉服古风 · 仙气飘飘"),
                ImageItem(url=_G(10), caption="唐装襦裙 · 国风之美")]),
    GalleryItem(id="g3", title="休闲日常", author="开心元元", category="scene",
        cover=_G(2), desc="牛仔裤休闲穿搭、三里屯街拍与美食生活记录，捕捉元元的日常瞬间。",
        images=[ImageItem(url=_G(2), caption="牛仔裤穿搭 · 休闲日常"),
                ImageItem(url=_G(6), caption="三里屯街拍 · 都市潮流"),
                ImageItem(url=_G(12), caption="汉服少女 · 扬琴旋律"),
                ImageItem(url=_G(15), caption="美食摄影 · 生活记录"),
                ImageItem(url=_G(16), caption="咖啡时光 · 惬意午后")]),
    GalleryItem(id="g4", title="清新氛围", author="开心元元", category="vibe",
        cover=_G(4), desc="草原旅拍、张园写真、古风意境与温暖聚餐，记录元元的清新氛围时刻。",
        images=[ImageItem(url=_G(4), caption="草原旅拍 · 自然清新"),
                ImageItem(url=_G(7), caption="张园写真 · 文艺气息"),
                ImageItem(url=_G(11), caption="传统汉服 · 清新氛围"),
                ImageItem(url=_G(13), caption="古风意境 · 花开时节"),
                ImageItem(url=_G(17), caption="餐厅打卡 · 美味时刻"),
                ImageItem(url=_G(18), caption="周末聚餐 · 温暖日常")]),
]


# ---------- AlbumItem（作品/相册，统一 worksData） ----------
albums: list[AlbumItem] = [
    AlbumItem(id="a1", title="春日街拍特辑",
        cover=_G(1), desc="以白色系为主的春日穿搭街拍，展现清新简约的时尚态度。",
        likes="12.3万", views="89.5万",
        images=[ImageItem(url=_G(1), caption="白色裤子街拍 · 简约风格"),
                ImageItem(url=_G(2), caption="牛仔裤穿搭 · 休闲日常"),
                ImageItem(url=_G(5), caption="多风格搭配 · 时尚穿搭"),
                ImageItem(url=_G(6), caption="三里屯街拍 · 都市潮流"),
                ImageItem(url=_G(8), caption="精致造型 · 时尚大片"),
                ImageItem(url=_G(0), caption="绿色外套造型 · 时尚大片")]),
    AlbumItem(id="a2", title="汉服古风写真",
        cover=_G(9), desc="身着传统汉服，在古典场景中演绎东方之美，仙气十足。",
        likes="25.6万", views="156.8万",
        images=[ImageItem(url=_G(9), caption="汉服古风 · 仙气飘飘"),
                ImageItem(url=_G(10), caption="唐装襦裙 · 国风之美"),
                ImageItem(url=_G(11), caption="传统汉服 · 清新氛围"),
                ImageItem(url=_G(12), caption="汉服少女 · 扬琴旋律"),
                ImageItem(url=_G(13), caption="古风意境 · 花开时节"),
                ImageItem(url=_G(14), caption="琵琶造型 · 古韵风华")]),
    AlbumItem(id="a3", title="三里屯潮流穿搭",
        cover=_G(6), desc="都市街头的潮流穿搭分享，融合时尚元素与个人风格。",
        likes="8.9万", views="67.2万",
        images=[ImageItem(url=_G(6), caption="三里屯街拍 · 都市潮流"),
                ImageItem(url=_G(1), caption="白色裤子街拍 · 简约风格"),
                ImageItem(url=_G(5), caption="多风格搭配 · 时尚穿搭"),
                ImageItem(url=_G(2), caption="牛仔裤穿搭 · 休闲日常"),
                ImageItem(url=_G(8), caption="精致造型 · 时尚大片"),
                ImageItem(url=_G(0), caption="绿色外套造型 · 时尚大片")]),
    AlbumItem(id="a4", title="旗袍韵味系列",
        cover=_G(3), desc="改良旗袍上衣搭配，展现传统与现代的完美融合。",
        likes="18.7万", views="112.4万",
        images=[ImageItem(url=_G(3), caption="旗袍上衣 · 东方韵味"),
                ImageItem(url=_G(9), caption="汉服古风 · 仙气飘飘"),
                ImageItem(url=_G(10), caption="唐装襦裙 · 国风之美"),
                ImageItem(url=_G(14), caption="琵琶造型 · 古韵风华"),
                ImageItem(url=_G(11), caption="传统汉服 · 清新氛围"),
                ImageItem(url=_G(13), caption="古风意境 · 花开时节")]),
    AlbumItem(id="a5", title="张园文艺写真",
        cover=_G(7), desc="在充满历史感的张园取景，记录文艺气息的午后时光。",
        likes="9.2万", views="54.3万",
        images=[ImageItem(url=_G(7), caption="张园写真 · 文艺气息"),
                ImageItem(url=_G(15), caption="美食摄影 · 生活记录"),
                ImageItem(url=_G(16), caption="咖啡时光 · 惬意午后"),
                ImageItem(url=_G(17), caption="餐厅打卡 · 美味时刻"),
                ImageItem(url=_G(18), caption="周末聚餐 · 温暖日常"),
                ImageItem(url=_G(19), caption="生活日常 · 可爱瞬间")]),
    AlbumItem(id="a6", title="古风音乐特辑",
        cover=_G(14), desc="身着汉服弹奏传统乐器，将音乐与古风完美结合。",
        likes="22.1万", views="134.6万",
        images=[ImageItem(url=_G(14), caption="琵琶造型 · 古韵风华"),
                ImageItem(url=_G(12), caption="汉服少女 · 扬琴旋律"),
                ImageItem(url=_G(9), caption="汉服古风 · 仙气飘飘"),
                ImageItem(url=_G(10), caption="唐装襦裙 · 国风之美"),
                ImageItem(url=_G(13), caption="古风意境 · 花开时节"),
                ImageItem(url=_G(3), caption="旗袍上衣 · 东方韵味")]),
]


# ---------- VideoAlbum（视频专辑分组） ----------
videos: list[VideoAlbum] = [
    VideoAlbum(name="作品集", videos=[
        VideoItem(id="v1", title="编号2002", url="../assets/video/若梦.mp4",
            cover=_G(0), orientation="landscape",
            desc="元元主演的概念短片，以赛博都市为舞台讲述温暖故事。", durationSec=90),
        VideoItem(id="v2", title="【美工组独家】谁能拒绝元元下播之后的一只舞蹈？",
            url="../assets/video/【美工组独家】谁能拒绝元元下播之后的一只舞蹈？.mp4",
            cover=_G(9), orientation="portrait",
            desc="下播后的即兴舞蹈，元气满满的治愈瞬间。", durationSec=45),
        VideoItem(id="v3", title="生日特别企划", url="../assets/video/1.mp4",
            cover=_G(5), orientation="portrait",
            desc="生日特别企划，与粉丝共创的温暖回忆。", durationSec=60),
    ]),
    VideoAlbum(name="日常记录", videos=[
        VideoItem(id="v4", title="小猫摇头", url="../assets/video/小猫摇头.mp4",
            cover=_G(1), orientation="landscape",
            desc="元元跟着节奏摇头晃脑的可爱日常。", durationSec=72),
        VideoItem(id="v5", title="小猫摇头(外套版)", url="../assets/video/小猫摇头(外套版).mp4",
            cover=_G(10), orientation="portrait",
            desc="换上外套版的元元，依旧萌力全开。", durationSec=58),
        VideoItem(id="v6", title="三里屯探店记录", url="../assets/video/WeChat_20250401105748.mp4",
            cover=_G(6), orientation="landscape",
            desc="三里屯街头的探店 vlog，边走边逛的快乐。", durationSec=65),
        VideoItem(id="v7", title="咖啡午后日常", url="../assets/video/WeChat_20250401105748.mp4",
            cover=_G(16), orientation="landscape",
            desc="一杯咖啡的惬意午后，慢生活的小确幸。", durationSec=68),
        VideoItem(id="v8", title="周末美食分享", url="../assets/video/1.mp4",
            cover=_G(17), orientation="portrait",
            desc="周末聚会美食大赏，治愈系吃喝日常。", durationSec=55),
    ]),
    VideoAlbum(name="国风写真", videos=[
        VideoItem(id="v9", title="琵琶弹奏特辑", url="../assets/video/1.mp4",
            cover=_G(14), orientation="portrait",
            desc="古韵琵琶演绎，东方美学的视觉呈现。", durationSec=50),
        VideoItem(id="v10", title="草原旅拍Vlog", url="../assets/video/WeChat_20250401105748.mp4",
            cover=_G(4), orientation="landscape",
            desc="一望无际的草原上，记录自由奔跑的元元。", durationSec=80),
        VideoItem(id="v11", title="张园文艺时光", url="../assets/video/1.mp4",
            cover=_G(7), orientation="portrait",
            desc="文艺气息满满的张园，午后的静谧时光。", durationSec=42),
        VideoItem(id="v12", title="唐装国风写真", url="../assets/video/WeChat_20250401105748.mp4",
            cover=_G(11), orientation="landscape",
            desc="唐装襦裙国风写真，东方韵味拉满。", durationSec=75),
    ]),
]


# ---------- MusicTrack（常驻音频播放器） ----------
music: list[MusicTrack] = [
    MusicTrack(id="m1", title="小宇", artist="张震岳", durationSec=227,
        audioUrl="../assets/music/xiaoyu.mp3", avatar="../assets/img/avatar/张震岳.png"),
    MusicTrack(id="m2", title="安河桥", artist="宋冬野", durationSec=250,
        audioUrl="../assets/music/anheqiao.aac", avatar="../assets/img/avatar/宋冬野.png"),
    MusicTrack(id="m3", title="彩色翅膀", artist="Sasablue", durationSec=204,
        audioUrl="../assets/music/caisechibang.aac", avatar="../assets/img/avatar/Sasablue.png"),
    MusicTrack(id="m4", title="匆匆那年", artist="王菲", durationSec=241,
        audioUrl="../assets/music/congcongnanian.aac", avatar="../assets/img/avatar/王菲.png"),
    MusicTrack(id="m5", title="若梦", artist="周深", durationSec=244,
        audioUrl="../assets/music/ruomeng.aac", avatar="../assets/img/avatar/周深.png"),
    MusicTrack(id="m6", title="叹云兮", artist="鞠婧祎", durationSec=285,
        audioUrl="../assets/music/tanyunxi.aac", avatar="../assets/img/avatar/鞠婧祎.png"),
    MusicTrack(id="m7", title="马马嘟嘟骑", artist="郭斯与帆", durationSec=177,
        audioUrl="../assets/music/mamaduduqi.aac", avatar="../assets/img/avatar/郭斯与帆.png"),
]


# ---------- Message（留言） ----------
messages: list[Message] = [
    Message(id="msg1", user="元心引力", content="元元生日快乐！永远支持你，期待更多精彩作品！", createdAt="2026-06-20"),
    Message(id="msg2", user="双鱼座女孩", content="从第一次看到你的穿搭视频就喜欢上了，你真的很棒！", createdAt="2026-06-18"),
    Message(id="msg3", user="蜀地小粉丝", content="同为四川人，为你骄傲！古风造型真的太美了～", createdAt="2026-06-15"),
    Message(id="msg4", user="星河入梦", content="你的每一次更新都是我期待的，继续加油呀！", createdAt="2026-06-12"),
]


# ---------- Profile（个人资料 / 外链 + 倒计时预留） ----------
profile: Profile = Profile(
    avatar="../assets/img/avatar/元元.png",
    links={
        "douyin": "https://www.douyin.com/user/kaixinyuanyuan",
        "live": "https://www.douyin.com/kaixinyuanyuan/live",
    },
    countdown=None,  # T12 填充具体目标时间
)


# ---------- GrowthItem（成长历程时间轴，多态 content） ----------
growth: list[GrowthItem] = [
    GrowthItem(id="gr1", date="2025-12-28", title="元元大王短片《编号2002》",
        shortTitle="编号2002",
        desc="元宝基于元形象创作的一部AI短片，融合了科幻与情感元素，展现了元元在AI创作领域的全新探索。",
        status="最新", cover=_G(0), type="video",
        content=GrowthContent(image=_G(0), caption="编号2002 · AI短片",
            text="元元大王短片《编号2002》是元宝基于元形象创作的一部AI短片。影片融合了科幻与情感元素，通过AI技术呈现出独特的视觉效果，展现了元元在AI创作领域的全新探索与突破。",
            video=GrowthVideo(title="编号2002 AI短片", videoUrl="https://www.w3schools.com/html/mov_bbb.mp4"))),
    GrowthItem(id="gr2", date="2025-12-27", title="宠粉赛冠军",
        desc="恭喜元元在抖音2025年嘉年华10万龙粉赛道中获得冠军，感谢每一位粉丝的支持与陪伴！",
        status="", cover=_G(6), type="article",
        content=GrowthContent(image=_G(6), caption="宠粉赛冠军 · 荣耀时刻",
            text="恭喜元元在抖音2025年嘉年华10万龙粉赛道中获得冠军！这份荣誉属于元元，也属于每一位支持她的粉丝。未来我们继续携手前行，创造更多精彩！")),
    GrowthItem(id="gr3", date="2025-12-26", title="抖音·宠粉赛",
        shortTitle="宠粉赛",
        desc="抖音宠粉赛火热开启中，活动时间为2025/12/26，快来为元元打call吧！",
        status="已结束", cover=_G(9), type="music",
        content=GrowthContent(image=_G(9), caption="宠粉赛 · 元元加油",
            text="抖音宠粉赛火热开启中！活动虽已结束，但元元与粉丝之间的温暖互动永不停止。",
            music=GrowthMusic(title="涵光初现", artist="开心元元",
                audioUrl="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", duration="03:42"))),
    GrowthItem(id="gr4", date="2025-11-15", title="百万粉丝达成",
        shortTitle="百万粉丝",
        desc="抖音粉丝突破百万大关，成为知名时尚博主。",
        status="", cover=_G(14), type="article",
        content=GrowthContent(image=_G(14), caption="百万粉丝 · 里程碑",
            text="随着短视频平台的崛起，开心元元凭借高质量的穿搭视频和独特的个人魅力，抖音粉丝突破百万大关。这是元元成长路上的重要里程碑，也是新的起点。")),
    GrowthItem(id="gr5", date="2025-09-20", title="古风音乐特辑",
        shortTitle="古风音乐",
        desc="身着汉服弹奏传统乐器，将音乐与古风完美结合。",
        status="", cover=_G(12), type="music",
        content=GrowthContent(image=_G(12), caption="汉服少女 · 扬琴旋律",
            text="她将古风元素融入现代音乐，用扬琴等传统乐器演绎当代旋律，开创了属于自己的音乐风格。",
            music=GrowthMusic(title="星河入梦", artist="开心元元",
                audioUrl="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", duration="03:55"))),
    GrowthItem(id="gr6", date="2025-06-21", title="生日特别企划",
        shortTitle="生日企划",
        desc="元元生日当天发布特别企划，与粉丝共同庆祝。",
        status="已结束", cover=_G(4), type="image",
        content=GrowthContent(image=_G(4), caption="生日企划 · 温暖时刻",
            text="在元元生日这天，团队特别策划了一场生日企划活动。这一天，是元元与粉丝共同创造的美好回忆。")),
    GrowthItem(id="gr7", date="2025-03-08", title="三里屯潮流穿搭",
        shortTitle="潮流穿搭",
        desc="都市街头的潮流穿搭分享，融合时尚元素与个人风格。",
        status="", cover=_G(7), type="article",
        content=GrowthContent(image=_G(7), caption="三里屯街拍 · 都市潮流",
            text="开心元元在三里屯的街拍穿搭引发了新一轮时尚热潮。每一套搭配都成为粉丝们争相模仿的对象。")),
    GrowthItem(id="gr8", date="2024-12-01", title="古风出圈",
        shortTitle="古风出圈",
        desc="凭借独特的古风造型获得大量关注，身着汉服仙气飘飘。",
        status="", cover=_G(10), type="article",
        content=GrowthContent(image=_G(10), caption="汉服古风 · 仙气飘飘",
            text="一次偶然的古风造型分享让开心元元一夜出圈。粉丝数迅速突破万人大关。")),
]
