// 临时 Mock 数据（T04 4.2）：字段严格对齐 docs/api-contract.md。
// 接口就绪后仅改 apiClient 开关，组件无感（原则 2）。
import type {
  AlbumItem, GalleryItem, GrowthItem, Message, MusicTrack, Profile, VideoAlbum,
} from '../types'

const G = (i: number) => `../assets/img/works/${String(i).padStart(2, '0')}.jpg`

export const galleries: GalleryItem[] = [
  { id: 'g1', title: '时尚大片', author: '开心元元', category: 'fashion', cover: G(0),
    desc: '绿色外套造型与精致时尚大片的合集，展现元元的潮流表现力。',
    images: [
      { url: G(0), caption: '绿色外套造型 · 时尚大片' },
      { url: G(8), caption: '精致造型 · 时尚大片' },
      { url: G(14), caption: '琵琶造型 · 古韵风华' },
      { url: G(19), caption: '生活日常 · 可爱瞬间' },
    ] },
  { id: 'g2', title: '简约风格', author: '开心元元', category: 'style', cover: G(1),
    desc: '白色裤子街拍、旗袍、汉服与多风格穿搭，呈现元元的百变风格。',
    images: [
      { url: G(1), caption: '白色裤子街拍 · 简约风格' },
      { url: G(3), caption: '旗袍上衣 · 东方韵味' },
      { url: G(5), caption: '多风格搭配 · 时尚穿搭' },
      { url: G(9), caption: '汉服古风 · 仙气飘飘' },
      { url: G(10), caption: '唐装襦裙 · 国风之美' },
    ] },
  { id: 'g3', title: '休闲日常', author: '开心元元', category: 'scene', cover: G(2),
    desc: '牛仔裤休闲穿搭、三里屯街拍与美食生活记录，捕捉元元的日常瞬间。',
    images: [
      { url: G(2), caption: '牛仔裤穿搭 · 休闲日常' },
      { url: G(6), caption: '三里屯街拍 · 都市潮流' },
      { url: G(12), caption: '汉服少女 · 扬琴旋律' },
      { url: G(15), caption: '美食摄影 · 生活记录' },
      { url: G(16), caption: '咖啡时光 · 惬意午后' },
    ] },
  { id: 'g4', title: '清新氛围', author: '开心元元', category: 'vibe', cover: G(4),
    desc: '草原旅拍、张园写真、古风意境与温暖聚餐，记录元元的清新氛围时刻。',
    images: [
      { url: G(4), caption: '草原旅拍 · 自然清新' },
      { url: G(7), caption: '张园写真 · 文艺气息' },
      { url: G(11), caption: '传统汉服 · 清新氛围' },
      { url: G(13), caption: '古风意境 · 花开时节' },
      { url: G(17), caption: '餐厅打卡 · 美味时刻' },
      { url: G(18), caption: '周末聚餐 · 温暖日常' },
    ] },
]

export const albums: AlbumItem[] = [
  {
    id: "a7",title: "苗疆",cover: G(1),
    desc: "苗疆民族风造型，氛围感十足",
    category: "民族古装",likes: "45.2 万",views: "72.6 万",
    images: [G(3), G(12), G(7), G(5), G(15)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a8",title: "小公主",cover: G(2),
    desc: "甜美小公主，华丽精致造型",
    category: "古装",likes: "28.7 万",views: "51.3 万",
    images: [G(9), G(2), G(11)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a9",title: "藏族",cover: G(3),
    desc: "藏族民族装扮，异域风情拉满",
    category: "民族风",likes: "66.4 万",views: "81.9 万",
    images: [G(1), G(14), G(6), G(18)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a10",title: "仙侠白月光",cover: G(4),
    desc: "清冷仙侠，仙气飘逸的扮相",
    category: "仙侠古装",likes: "33.1 万",views: "60.5 万",
    images: [G(8), G(3), G(13), G(2), G(17), G(10)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a11",title: "学生妹",cover: G(5),
    desc: "清新学生妹，青春元气造型",
    category: "现代",likes: "19.6 万",views: "37.8 万",
    images: [G(4), G(16)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a12",title: "凤冠霞帔",cover: G(6),
    desc: "古风婚嫁，华贵凤冠霞帔",
    category: "古装婚服",likes: "71.3 万",views: "92.4 万",
    images: [G(7), G(11), G(1), G(9)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a13",title: "虞姬",cover: G(7),
    desc: "虞姬古风，凄美绝代美人",
    category: "古装cos",likes: "52.8 万",views: "66.1 万",
    images: [G(13), G(5), G(2), G(18), G(10)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a14",title: "哪吒",cover: G(8),
    desc: "哪吒cos，飒爽少年感造型",
    category: "二次元cos",likes: "22.5 万",views: "41.7 万",
    images: [G(3), G(12), G(8)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a15",title: "蒙古族",cover: G(9),
    desc: "蒙古族服饰，豪迈民族风采",
    category: "民族风",likes: "38.4 万",views: "59.2 万",
    images: [G(15), G(6), G(1)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a16",title: "小青",cover: G(10),
    desc: "小青扮相，灵动妖媚古风",
    category: "古装cos",likes: "44.7 万",views: "70.3 万",
    images: [G(9), G(14), G(2), G(17)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a17",title: "兔子景观",cover: G(11),
    desc: "兔子主题，可爱梦幻氛围感",
    category: "创意造型",likes: "14.2 万",views: "26.9 万",
    images: [G(11), G(4), G(13)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a18",title: "镜妖",cover: G(12),
    desc: "镜妖诡美，魅惑古风妖系造型",
    category: "仙侠古装",likes: "27.1 万",views: "48.5 万",
    images: [G(7), G(16), G(3), G(10)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a19",title: "白狐",cover: G(13),
    desc: "白狐清冷，狐系古风美人",
    category: "仙侠古装",likes: "58.6 万",views: "77.2 万",
    images: [G(2), G(12), G(5)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a20",title: "妲己",cover: G(14),
    desc: "妲己妖媚，倾世红颜古风",
    category: "古装cos",likes: "63.9 万",views: "84.8 万",
    images: [G(14), G(8), G(1), G(15), G(6)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a21",title: "男狐狸",cover: G(15),
    desc: "男狐狸，邪魅俊逸古风少年",
    category: "古风cos",likes: "31.4 万",views: "53.7 万",
    images: [G(9), G(13)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a22",title: "墨云挽翠",cover: G(16),
    desc: "墨云挽翠，雅致国风造型",
    category: "古装",likes: "21.8 万",views: "42.3 万",
    images: [G(17), G(4)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a23",title: "小笼包",cover: G(17),
    desc: "软萌小笼包，可爱俏皮装扮",
    category: "创意造型",likes: "12.7 万",views: "24.1 万",
    images: [G(6), G(11)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a24",title: "红花黄裙",cover: G(18),
    desc: "红花黄裙，明艳亮眼古风穿搭",
    category: "古装",likes: "36.5 万",views: "61.4 万",
    images: [G(3), G(15)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a25",title: "状元",cover: G(19),
    desc: "状元扮相，风流俊雅古风",
    category: "古风cos",likes: "47.3 万",views: "68.6 万",
    images: [G(10), G(7)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a26",title: "赛博女仆",cover: G(1),
    desc: "赛博女仆，酷飒未来感造型",
    category: "二次元cos",likes: "54.1 万",views: "75.9 万",
    images: [G(12), G(2), G(18)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a27",title: "雪见",cover: G(2),
    desc: "雪见cos，灵动仙剑古风少女",
    category: "游戏cos",likes: "67.8 万",views: "88.3 万",
    images: [G(5), G(14)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a28",title: "桃花妹妹",cover: G(3),
    desc: "桃花妹妹，温婉柔美的古风",
    category: "古装",likes: "24.9 万",views: "45.6 万",
    images: [G(8), G(16)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a29",title: "金蛇",cover: G(4),
    desc: "金蛇妖系，冷艳魅惑古风",
    category: "仙侠古装",likes: "39.2 万",views: "64.7 万",
    images: [G(1), G(9)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a30",title: "婚纱",cover: G(5),
    desc: "唯美婚纱，浪漫优雅造型",
    category: "现代",likes: "74.5 万",views: "95.1 万",
    images: [G(13), G(4)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a31",title: "宁姚",cover: G(6),
    desc: "宁姚cos，侠气飒爽古风少女",
    category: "小说cos",likes: "42.6 万",views: "63.2 万",
    images: [G(11), G(6)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a32",title: "花神",cover: G(7),
    desc: "花神装扮，风华绝代花仙",
    category: "仙侠古装",likes: "61.7 万",views: "82.5 万",
    images: [G(17), G(3)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a33",title: "蝴蝶",cover: G(8),
    desc: "蝴蝶主题，翩跹灵动古风",
    category: "古装",likes: "29.3 万",views: "50.8 万",
    images: [G(10), G(15)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a34",title: "女仆",cover: G(9),
    desc: "经典女仆，甜美的洛丽塔装扮",
    category: "二次元cos",likes: "34.8 万",views: "57.4 万",
    images: [G(7), G(12)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a35",title: "战国袍",cover: G(10),
    desc: "战国袍，古朴大气先秦古风",
    category: "古风复原",likes: "55.4 万",views: "73.1 万",
    images: [G(2), G(14)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a36",title: "温柔女帝",cover: G(11),
    desc: "温柔女帝，端庄华贵帝王造型",
    category: "古装",likes: "69.2 万",views: "90.7 万",
    images: [G(9), G(5)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a37",title: "黑色小公主",cover: G(12),
    desc: "黑系小公主，冷艳暗黑风格",
    category: "创意造型",likes: "23.4 万",views: "44.5 万",
    images: [G(16), G(8)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a38",title: "年兽",cover: G(13),
    desc: "年兽cos，霸气异兽感装扮",
    category: "国风cos",likes: "48.5 万",views: "69.4 万",
    images: [G(1), G(13), G(4), G(11)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a39",title: "落花闻诏",cover: G(14),
    desc: "落花闻诏，雅致俊逸古风少年",
    category: "古风cos",likes: "37.7 万",views: "58.1 万",
    images: [G(7), G(15), G(2)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a40",title: "夜宴花城",cover: G(15),
    desc: "夜宴花城，华丽邪魅古风",
    category: "小说cos",likes: "77.6 万",views: "94.2 万",
    images: [G(10), G(6), G(18), G(3)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a41",title: "白鹤少年",cover: G(16),
    desc: "白鹤少年，飘逸清冷古风",
    category: "仙侠古装",likes: "51.9 万",views: "71.8 万",
    images: [G(12), G(9), G(14)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a42",title: "驰走西风",cover: G(17),
    desc: "驰走西风，江湖飒爽少年扮相",
    category: "江湖古风",likes: "40.3 万",views: "62.5 万",
    images: [G(5), G(17)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a43",title: "安琉璃",cover: G(18),
    desc: "安琉璃，红衣英气古风造型",
    category: "古装cos",likes: "32.2 万",views: "52.9 万",
    images: [G(1), G(13), G(8)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a44",title: "永夜蓝蝶刺绣",cover: G(19),
    desc: "永夜蓝蝶，冷艳刺绣古风",
    category: "仙侠古装",likes: "26.8 万",views: "47.1 万",
    images: [G(11), G(4), G(16)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a45",title: "小皇帝",cover: G(1),
    desc: "小皇帝，少年帝王英气装扮",
    category: "古风cos",likes: "43.7 万",views: "65.3 万",
    images: [G(7), G(2)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a46",title: "李星云",cover: G(2),
    desc: "李星云，不良人江湖少年cos",
    category: "动漫cos",likes: "70.4 万",views: "86.6 万",
    images: [G(9), G(15), G(6), G(12)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a47",title: "苗疆少年",cover: G(3),
    desc: "苗疆少年，少数民族少年装扮",
    category: "民族古装",likes: "56.3 万",views: "78.4 万",
    images: [G(3), G(14), G(10)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a48",title: "西装",cover: G(4),
    desc: "帅气西装，酷感现代造型",
    category: "现代",likes: "18.1 万",views: "35.2 万",
    images: [G(18), G(5)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a49",title: "陈美嘉",cover: G(5),
    desc: "陈美嘉，甜美邻家少女装扮",
    category: "现代cos",likes: "20.5 万",views: "39.6 万",
    images: [G(1), G(7), G(13)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a50",title: "赤伶",cover: G(6),
    desc: "赤伶，戏曲风美艳红妆造型",
    category: "戏曲国风",likes: "64.2 万",views: "83.7 万",
    images: [G(11), G(4), G(9), G(16)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a51",title: "小熊睡衣",cover: G(7),
    desc: "小熊睡衣，软萌居家甜妹造型",
    category: "现代",likes: "13.6 万",views: "28.3 万",
    images: [G(2), G(12)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a52",title: "伯爵夫人",cover: G(8),
    desc: "伯爵夫人，复古华丽欧式造型",
    category: "复古造型",likes: "35.1 万",views: "56.8 万",
    images: [G(8), G(15), G(3)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a53",title: "18号",cover: G(9),
    desc: "18号cos，酷飒短发二次元",
    category: "动漫cos",likes: "59.7 万",views: "79.5 万",
    images: [G(10), G(6)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a54",title: "青雀",cover: G(10),
    desc: "青雀cos，飘逸灵动古风少女",
    category: "游戏cos",likes: "49.4 万",views: "70.1 万",
    images: [G(14), G(1), G(17)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a55",title: "民国大小姐",cover: G(11),
    desc: "民国大小姐，温婉复古民国风",
    category: "民国风",likes: "25.3 万",views: "46.2 万",
    images: [G(5), G(13), G(7)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a56",title: "喜羊羊",cover: G(12),
    desc: "喜羊羊cos，清爽少年二次元",
    category: "动漫cos",likes: "30.8 万",views: "51.4 万",
    images: [G(9), G(2)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a57",title: "男蝴蝶",cover: G(13),
    desc: "男蝴蝶，妖冶华丽古风造型",
    category: "仙侠古装",likes: "41.5 万",views: "63.8 万",
    images: [G(11), G(4), G(16)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a58",title: "男色妖姬",cover: G(14),
    desc: "男色妖姬，魅惑艳丽古风扮相",
    category: "古风cos",likes: "53.6 万",views: "74.7 万",
    images: [G(1), G(12), G(8)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a59",title: "雪花女神龙",cover: G(15),
    desc: "雪花女神龙，江湖飒爽侠女",
    category: "武侠古装",likes: "68.1 万",views: "87.2 万",
    images: [G(15), G(3)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a60",title: "东方紫霞",cover: G(16),
    desc: "东方紫霞，侠气红衣古风造型",
    category: "武侠古装",likes: "46.8 万",views: "67.5 万",
    images: [G(7), G(10), G(14)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a61",title: "黑公子",cover: G(17),
    desc: "黑公子，冷峻贵气古风少年",
    category: "古风cos",likes: "33.9 万",views: "54.3 万",
    images: [G(6), G(18)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a62",title: "希腊",cover: G(18),
    desc: "希腊风，圣洁飘逸神话装扮",
    category: "异域造型",likes: "60.5 万",views: "80.1 万",
    images: [G(2), G(13), G(5)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a63",title: "白虎",cover: G(19),
    desc: "白虎主题，霸气神兽系古风",
    category: "仙侠古装",likes: "50.2 万",views: "72.3 万",
    images: [G(9), G(1), G(17)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a64",title: "男天使",cover: G(1),
    desc: "男天使，圣洁梦幻天使装扮",
    category: "奇幻造型",likes: "44.1 万",views: "66.8 万",
    images: [G(11), G(4), G(12)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a65",title: "白苗少年",cover: G(2),
    desc: "白苗少年，银饰民族特色造型",
    category: "民族古装",likes: "57.8 万",views: "77.1 万",
    images: [G(8), G(15), G(3)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a66",title: "魔尊",cover: G(3),
    desc: "魔尊，邪魅霸气魔界装扮",
    category: "仙侠古装",likes: "72.9 万",views: "91.6 万",
    images: [G(10), G(7)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a67",title: "古风小生",cover: G(4),
    desc: "古风小生，温润如玉古代公子",
    category: "古装",likes: "27.5 万",views: "48.9 万",
    images: [G(14), G(6), G(1)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a68",title: "贾宝玉",cover: G(5),
    desc: "贾宝玉，红楼贵公子古风cos",
    category: "名著cos",likes: "62.4 万",views: "81.3 万",
    images: [G(13), G(2), G(9)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a69",title: "锦衣将军",cover: G(6),
    desc: "锦衣将军，威风凛凛武将造型",
    category: "武侠古装",likes: "66.7 万",views: "85.4 万",
    images: [G(5), G(11), G(16)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a70",title: "吸血鬼",cover: G(7),
    desc: "吸血鬼，暗黑高贵奇幻造型",
    category: "奇幻cos",likes: "54.8 万",views: "76.3 万",
    images: [G(12), G(4)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a71",title: "短白发潮男",cover: G(8),
    desc: "短白发潮男，潮流酷感现代造型",
    category: "现代",likes: "21.2 万",views: "40.7 万",
    images: [G(18), G(7), G(3)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a72",title: "小棉花",cover: G(9),
    desc: "小棉花，软萌甜妹古风扮相",
    category: "古装",likes: "15.7 万",views: "31.5 万",
    images: [G(1), G(10)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a73",title: "正凤",cover: G(10),
    desc: "正凤头饰，华贵艳丽古风美人",
    category: "古装",likes: "38.9 万",views: "60.4 万",
    images: [G(15), G(8), G(14)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a74",title: "灰姑娘",cover: G(11),
    desc: "灰姑娘，童话风甜美少女装扮",
    category: "童话cos",likes: "22.9 万",views: "43.1 万",
    images: [G(9), G(2)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a75",title: "彼岸花",cover: G(12),
    desc: "彼岸花，凄美感拉满古风造型",
    category: "仙侠古装",likes: "47.9 万",views: "68.8 万",
    images: [G(13), G(6), G(11)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a76",title: "偏凤",cover: G(13),
    desc: "偏凤发饰，明艳动人古风美人",
    category: "古装",likes: "42.2 万",views: "64.4 万",
    images: [G(4), G(12)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a77",title: "机车服",cover: G(14),
    desc: "机车服，酷飒拽姐现代造型",
    category: "现代",likes: "29.8 万",views: "50.1 万",
    images: [G(17), G(5), G(1)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a78",title: "独孤伽罗",cover: G(15),
    desc: "独孤伽罗，端庄大气皇后古风",
    category: "历史古装",likes: "65.3 万",views: "84.1 万",
    images: [G(7), G(10), G(3)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a79",title: "萨勒芬妮",cover: G(16),
    desc: "萨勒芬妮，粉发甜妹游戏cos",
    category: "游戏cos",likes: "78.3 万",views: "93.5 万",
    images: [G(14), G(8)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a80",title: "港风",cover: G(17),
    desc: "复古港风，氛围感怀旧造型",
    category: "复古造型",likes: "31.7 万",views: "52.1 万",
    images: [G(2), G(16), G(9)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a81",title: "小狐狸",cover: G(18),
    desc: "小狐狸，娇俏灵动狐系古风",
    category: "仙侠古装",likes: "52.3 万",views: "71.2 万",
    images: [G(11), G(4)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a82",title: "白雪公主",cover: G(19),
    desc: "白雪公主，童话甜美少女cos",
    category: "童话cos",likes: "24.4 万",views: "45.7 万",
    images: [G(13), G(6), G(18)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a83",title: "嫦娥",cover: G(1),
    desc: "嫦娥，清冷仙气月宫仙子扮相",
    category: "神话古装",likes: "71.7 万",views: "89.8 万",
    images: [G(1), G(12), G(5)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a84",title: "元咩咩",cover: G(2),
    desc: "元咩咩，软萌可爱甜妹造型",
    category: "现代",likes: "17.3 万",views: "33.6 万",
    images: [G(7), G(10)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a85",title: "彝族",cover: G(3),
    desc: "彝族装扮，浓郁少数民族风情",
    category: "民族风",likes: "45.9 万",views: "67.1 万",
    images: [G(15), G(3), G(14)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a86",title: "病美人",cover: G(4),
    desc: "病美人，柔弱破碎感古风美人",
    category: "古装",likes: "58.1 万",views: "78.8 万",
    images: [G(9), G(2), G(17)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a87",title: "白发哥特",cover: G(5),
    desc: "白发哥特，暗黑华丽奇幻造型",
    category: "奇幻造型",likes: "36.2 万",views: "57.3 万",
    images: [G(11), G(4)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a88",title: "花魁",cover: G(6),
    desc: "花魁，艳丽妩媚古风美人造型",
    category: "古装",likes: "61.2 万",views: "82.7 万",
    images: [G(8), G(13), G(6)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a89",title: "XJ",cover: G(7),
    desc: "异域风情，特色民族风装扮",
    category: "民族风",likes: "40.8 万",views: "61.9 万",
    images: [G(1), G(16)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a90",title: "荷花精",cover: G(8),
    desc: "荷花精，清雅灵动花仙古风",
    category: "仙侠古装",likes: "28.4 万",views: "49.5 万",
    images: [G(12), G(7), G(10)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a91",title: "少女虞姬",cover: G(9),
    desc: "少女虞姬，青涩柔美的古风扮相",
    category: "古装cos",likes: "51.4 万",views: "70.7 万",
    images: [G(5), G(14), G(3)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a92",title: "彩绘女仆",cover: G(10),
    desc: "彩绘女仆，创意色彩二次元造型",
    category: "二次元cos",likes: "19.9 万",views: "38.4 万",
    images: [G(18), G(2)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a93",title: "元气喵",cover: G(11),
    desc: "元气喵，活泼俏皮猫系古风",
    category: "创意造型",likes: "23.8 万",views: "44.9 万",
    images: [G(9), G(11), G(1)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a94",title: "明制簪花",cover: G(12),
    desc: "明制簪花，温婉端庄明代汉服",
    category: "汉服",likes: "48.1 万",views: "69.9 万",
    images: [G(4), G(15), G(8)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a95",title: "黑发洋装",cover: G(13),
    desc: "黑发洋装，优雅复古洋装造型",
    category: "复古造型",likes: "26.2 万",views: "47.6 万",
    images: [G(13), G(6)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a96",title: "碧瑶",cover: G(14),
    desc: "碧瑶cos，灵动痴情仙侠少女",
    category: "游戏cos",likes: "69.6 万",views: "88.7 万",
    images: [G(10), G(17), G(7)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a97",title: "雪妃",cover: G(15),
    desc: "雪妃，清冷华贵的古风妃嫔",
    category: "古装",likes: "43.2 万",views: "65.8 万",
    images: [G(12), G(2), G(5)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a98",title: "白发猫耳女仆",cover: G(16),
    desc: "白发猫耳女仆，酷甜二次元",
    category: "二次元cos",likes: "34.3 万",views: "55.6 万",
    images: [G(1), G(9)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a99",title: "天天有喜狐九妹",cover: G(17),
    desc: "狐九妹，娇俏可爱狐妖古风",
    category: "影视cos",likes: "55.9 万",views: "75.4 万",
    images: [G(14), G(4), G(16)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a100",title: "药屋少女",cover: G(18),
    desc: "药屋少女，沉静温婉古风少女",
    category: "动漫cos",likes: "32.7 万",views: "53.4 万",
    images: [G(8), G(11), G(3)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a101",title: "小神仙",cover: G(19),
    desc: "小神仙，灵动飘逸仙系古风",
    category: "仙侠古装",likes: "41.1 万",views: "62.9 万",
    images: [G(13), G(6)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a102",title: "小恶魔",cover: G(1),
    desc: "小恶魔，暗黑甜酷洛丽塔装扮",
    category: "二次元cos",likes: "20.8 万",views: "40.2 万",
    images: [G(7), G(12), G(18)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a103",title: "踏雪寻梅",cover: G(2),
    desc: "踏雪寻梅，素雅清冷古风美人",
    category: "古装",likes: "37.3 万",views: "58.7 万",
    images: [G(2), G(10)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a104",title: "金绣红韵",cover: G(3),
    desc: "金绣红韵，艳丽华贵红色古风",
    category: "古装",likes: "50.7 万",views: "71.9 万",
    images: [G(15), G(5), G(1)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a105",title: "鹊精",cover: G(4),
    desc: "鹊精，灵秀鸟类仙系古风扮相",
    category: "仙侠古装",likes: "29.1 万",views: "49.9 万",
    images: [G(9), G(14), G(4)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a106",title: "哪吒传奇妲己",cover: G(5),
    desc: "哪吒传奇妲己，娇媚狐妖cos",
    category: "动漫cos",likes: "63.5 万",views: "83.2 万",
    images: [G(11), G(8)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a107",title: "粉红佳人",cover: G(6),
    desc: "粉红佳人，浪漫甜美的欧式造型",
    category: "奇幻造型",likes: "25.7 万",views: "46.9 万",
    images: [G(17), G(3), G(13)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a108",title: "宝莲灯嫦娥",cover: G(7),
    desc: "宝莲灯嫦娥，温婉清冷月宫仙子",
    category: "影视cos",likes: "73.4 万",views: "90.3 万",
    images: [G(6), G(12)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a109",title: "浮光碎影",cover: G(8),
    desc: "浮光碎影，明艳飘逸红衣古风",
    category: "古装",likes: "44.6 万",views: "66.3 万",
    images: [G(1), G(10), G(7)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a110",title: "少女虞姬",cover: G(9),
    desc: "少女虞姬，楚楚动人古风少女",
    category: "古装cos",likes: "35.6 万",views: "56.2 万",
    images: [G(5), G(15)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a111",title: "荷风蝶语",cover: G(10),
    desc: "荷风蝶语，清雅荷花系古风美人",
    category: "仙侠古装",likes: "30.3 万",views: "51.8 万",
    images: [G(14), G(2), G(9)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a112",title: "锦毛鼠",cover: G(11),
    desc: "锦毛鼠，灵动狡黠鼠系古风扮相",
    category: "武侠古装",likes: "47.4 万",views: "68.2 万",
    images: [G(4), G(11), G(16)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a113",title: "荷花妹妹",cover: G(12),
    desc: "荷花妹妹，清新淡雅花系古风",
    category: "古装",likes: "22.3 万",views: "42.6 万",
    images: [G(8), G(13)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a114",title: "绿宝石甜心",cover: G(13),
    desc: "绿宝石甜心，民族风精致装扮",
    category: "民族风",likes: "39.7 万",views: "60.9 万",
    images: [G(12), G(1), G(18)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
},
{
    id: "a115",title: "鎏金礼盒",cover: G(14),
    desc: "鎏金礼盒，贵气华丽古风造型",
    category: "古装",likes: "27.9 万",views: "48.3 万",
    images: [G(7), G(3)].map((u, i) => ({ url: u, caption: `图${i + 1}` }))
}
]

export const videos: VideoAlbum[] = [
  { name: '作品集', videos: [
    { id: 'v1', title: '编号2002', artist: '开心元元', url: '../assets/video/若梦.mp4', cover: G(0), orientation: 'landscape',
      desc: '元元主演的概念短片，以赛博都市为舞台讲述温暖故事。', durationSec: 90 },
    { id: 'v2', title: '【美工组独家】谁能拒绝元元下播之后的一只舞蹈？', artist: '开心元元',
      url: '../assets/video/【美工组独家】谁能拒绝元元下播之后的一只舞蹈？.mp4', cover: G(9),
      orientation: 'portrait', desc: '下播后的即兴舞蹈，元气满满的治愈瞬间。', durationSec: 45 },
    { id: 'v3', title: '生日特别企划', artist: '开心元元', url: '../assets/video/1.mp4', cover: G(5),
      orientation: 'portrait', desc: '生日特别企划，与粉丝共创的温暖回忆。', durationSec: 60 },
  ] },
  { name: '日常记录', videos: [
    { id: 'v4', title: '小猫摇头', artist: '开心元元', url: '../assets/video/小猫摇头.mp4', cover: G(1),
      orientation: 'landscape', desc: '元元跟着节奏摇头晃脑的可爱日常。', durationSec: 72 },
    { id: 'v5', title: '小猫摇头(外套版)', artist: '开心元元', url: '../assets/video/小猫摇头(外套版).mp4', cover: G(10),
      orientation: 'portrait', desc: '换上外套版的元元，依旧萌力全开。', durationSec: 58 },
    { id: 'v6', title: '三里屯探店记录', artist: '开心元元', url: '../assets/video/WeChat_20250401105748.mp4', cover: G(6),
      orientation: 'landscape', desc: '三里屯街头的探店 vlog，边走边逛的快乐。', durationSec: 65 },
    { id: 'v7', title: '咖啡午后日常', artist: '开心元元', url: '../assets/video/WeChat_20250401105748.mp4', cover: G(16),
      orientation: 'landscape', desc: '一杯咖啡的惬意午后，慢生活的小确幸。', durationSec: 68 },
    { id: 'v8', title: '周末美食分享', artist: '开心元元', url: '../assets/video/1.mp4', cover: G(17),
      orientation: 'portrait', desc: '周末聚会美食大赏，治愈系吃喝日常。', durationSec: 55 },
  ] },
  { name: '国风写真', videos: [
    { id: 'v9', title: '琵琶弹奏特辑', artist: '开心元元', url: '../assets/video/1.mp4', cover: G(14),
      orientation: 'portrait', desc: '古韵琵琶演绎，东方美学的视觉呈现。', durationSec: 50 },
    { id: 'v10', title: '草原旅拍Vlog', artist: '开心元元', url: '../assets/video/WeChat_20250401105748.mp4', cover: G(4),
      orientation: 'landscape', desc: '一望无际的草原上，记录自由奔跑的元元。', durationSec: 80 },
    { id: 'v11', title: '张园文艺时光', artist: '开心元元', url: '../assets/video/1.mp4', cover: G(7),
      orientation: 'portrait', desc: '文艺气息满满的张园，午后的静谧时光。', durationSec: 42 },
    { id: 'v12', title: '唐装国风写真', artist: '开心元元', url: '../assets/video/WeChat_20250401105748.mp4', cover: G(11),
      orientation: 'landscape', desc: '唐装襦裙国风写真，东方韵味拉满。', durationSec: 75 },
  ] },
]

export const music: MusicTrack[] = [
  { id: 'm1', title: '小宇', artist: '张震岳', durationSec: 227, audioUrl: '../assets/music/xiaoyu.mp3', avatar: '../assets/img/avatar/张震岳.png' },
  { id: 'm2', title: '安河桥', artist: '宋冬野', durationSec: 250, audioUrl: '../assets/music/anheqiao.aac', avatar: '../assets/img/avatar/宋冬野.png' },
  { id: 'm3', title: '彩色翅膀', artist: 'Sasablue', durationSec: 204, audioUrl: '../assets/music/caisechibang.aac', avatar: '../assets/img/avatar/Sasablue.png' },
  { id: 'm4', title: '匆匆那年', artist: '王菲', durationSec: 241, audioUrl: '../assets/music/congcongnanian.aac', avatar: '../assets/img/avatar/王菲.png' },
  { id: 'm5', title: '若梦', artist: '周深', durationSec: 244, audioUrl: '../assets/music/ruomeng.aac', avatar: '../assets/img/avatar/周深.png' },
  { id: 'm6', title: '叹云兮', artist: '鞠婧祎', durationSec: 285, audioUrl: '../assets/music/tanyunxi.aac', avatar: '../assets/img/avatar/鞠婧祎.png' },
  { id: 'm7', title: '马马嘟嘟骑', artist: '郭斯与帆', durationSec: 177, audioUrl: '../assets/music/mamaduduqi.aac', avatar: '../assets/img/avatar/郭斯与帆.png' },
]

export const messages: Message[] = [
  { id: 'msg1', user: '元心引力', content: '元元生日快乐！永远支持你，期待更多精彩作品！', createdAt: '2026-06-20' },
  { id: 'msg2', user: '双鱼座女孩', content: '从第一次看到你的穿搭视频就喜欢上了，你真的很棒！', createdAt: '2026-06-18' },
  { id: 'msg3', user: '蜀地小粉丝', content: '同为四川人，为你骄傲！古风造型真的太美了～', createdAt: '2026-06-15' },
  { id: 'msg4', user: '星河入梦', content: '你的每一次更新都是我期待的，继续加油呀！', createdAt: '2026-06-12' },
]

export const profile: Profile = {
  avatar: '../assets/img/works/00.jpg',
  name: '开心元元',
  englishName: 'KAI XIN YUAN YUAN',
  tagline: '「以热爱为名，与元元同行」',
  bio: '开心元元，2002年农历6月21日出生于辽宁省，身高182cm，是一位多才多艺的女孩。她热爱时尚穿搭与古风文化，在社交媒体上拥有庞大的粉丝群体，以清新自然的风格和精致的穿搭品味深受喜爱。',
  info: {
    height: '182cm',
    weight: '75kg',
    birthday: '06.21',
    hometown: '辽宁',
    zodiac: '巨蟹座',
    birthYear: '2002',
  },
  links: {
    douyin: 'https://www.douyin.com/user/MS4wLjABAAAAnxjd0mpwX3nH09pR9a8G9he9twYL_Zdoz4S58qkmJGbbi0Bcczqd9xYaopGAKj67',
    live: 'https://live.douyin.com/KXyy12345678',
  },
  countdown: null,
}

export const growth: GrowthItem[] = [
  { id: 'gr0', date: '2024-06-01', title: '梦的开始', shortTitle: '梦的开始',
    desc: '开心元元在社交媒体上发布了第一条短视频，以清新自然的风格和独特的穿搭品味，开启了她的自媒体之旅。', status: '', cover: G(2), type: 'article',
    content: { image: G(2), caption: '梦的开始 · 第一条短视频', text: '开心元元在社交媒体上发布了第一条短视频，以清新自然的风格和独特的穿搭品味，开启了她的自媒体之旅。' } },
  { id: 'gr_七擒', date: '2024-08-18', title: '七擒孟获', shortTitle: '七擒孟获',
    desc: '凭借“七擒孟获”系列创意内容迅速积累人气，元元开始被更多观众认识。', status: '', cover: G(3), type: 'article',
    content: { image: G(3), caption: '七擒孟获 · 创意出圈', text: '凭借“七擒孟获”系列创意内容迅速积累人气，元元开始被更多观众认识。' } },
  { id: 'gr_周年', date: '2024-10-05', title: '周年庆', shortTitle: '周年庆',
    desc: '开播周年庆活动，与粉丝共同回顾一路走来的点滴，感恩陪伴。', status: '', cover: G(8), type: 'article',
    content: { image: G(8), caption: '周年庆 · 感恩陪伴', text: '开播周年庆活动，与粉丝共同回顾一路走来的点滴，感恩陪伴。' } },
  { id: 'gr_生日24', date: '2025-06-21', title: '生日', shortTitle: '生日',
    desc: '元元生日当天，粉丝送上满满祝福，她也用一场特别直播回馈大家。', status: '', cover: G(5), type: 'image',
    content: { image: G(5), caption: '生日 · 双向奔赴', text: '元元生日当天，粉丝送上满满祝福，她也用一场特别直播回馈大家。' } },
  { id: 'gr4', date: '2025-11-15', title: '百万粉丝达成', shortTitle: '百万粉丝',
    desc: '抖音粉丝突破百万大关。', status: '', cover: G(14), type: 'article',
    content: { image: G(14), caption: '百万粉丝 · 里程碑', text: '抖音粉丝突破百万大关，成为知名时尚博主。' } },
  { id: 'gr5', date: '2025-09-20', title: '古风音乐特辑', shortTitle: '古风音乐',
    desc: '身着汉服弹奏传统乐器。', status: '', cover: G(12), type: 'music',
    content: { image: G(12), caption: '汉服少女 · 扬琴旋律', text: '将古风元素融入现代音乐。',
      music: { title: '星河入梦', artist: '开心元元', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', duration: '03:55' } } },
  { id: 'gr3', date: '2025-12-26', title: '抖音·宠粉赛', shortTitle: '宠粉赛',
    desc: '抖音宠粉赛火热开启中！', status: '已结束', cover: G(9), type: 'music',
    content: { image: G(9), caption: '宠粉赛 · 元元加油', text: '活动虽已结束，但温暖互动永不停止。',
      music: { title: '涵光初现', artist: '开心元元', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: '03:42' } } },
  { id: 'gr2', date: '2025-12-27', title: '宠粉赛冠军', shortTitle: '冠军',
    desc: '恭喜元元在抖音2025年嘉年华获得冠军！', status: '', cover: G(6), type: 'article',
    content: { image: G(6), caption: '宠粉赛冠军 · 荣耀时刻', text: '这份荣誉属于元元，也属于每一位支持她的粉丝。' } },
  { id: 'gr1', date: '2025-12-28', title: '元元大王短片《编号2002》', shortTitle: '编号2002',
    desc: '元宝基于元形象创作的一部AI短片，融合了科幻与情感元素。', status: '最新', cover: G(0), type: 'video',
    content: { image: G(0), caption: '编号2002 · AI短片', text: '影片融合了科幻与情感元素。',
      video: { title: '编号2002 AI短片', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' } } },
  { id: 'gr6', date: '2025-06-21', title: '生日特别企划', shortTitle: '生日企划',
    desc: '元元生日当天发布特别企划。', status: '已结束', cover: G(4), type: 'image',
    content: { image: G(4), caption: '生日企划 · 温暖时刻', text: '团队特别策划了一场生日企划活动。' } },
  { id: 'gr7', date: '2025-03-08', title: '三里屯潮流穿搭', shortTitle: '潮流穿搭',
    desc: '都市街头的潮流穿搭分享。', status: '', cover: G(7), type: 'article',
    content: { image: G(7), caption: '三里屯街拍 · 都市潮流', text: '街拍穿搭引发新一轮时尚热潮。' } },
  { id: 'gr8', date: '2024-12-01', title: '古风出圈', shortTitle: '古风出圈',
    desc: '凭借独特的古风造型获得大量关注。', status: '', cover: G(10), type: 'article',
    content: { image: G(10), caption: '汉服古风 · 仙气飘飘', text: '一次偶然的古风造型分享让开心元元一夜出圈。' } },
]
