// ─── 使用說明 ──────────────────────────────────────────────────────────────
// type  : 'photo' | 'video'
// image : 縮圖路徑，放在 public/gallery/，例如 "/gallery/shot1.jpg"
// video : 僅 video 類型填寫，例如 "/gallery/clip1.mp4"
// title : 作品標題
// desc  : 一兩句描述，顯示於預覽面板
// meta  : 拍攝地點，顯示於燈箱
// color : 卡片背景色（圖片載入前的底色）
// ──────────────────────────────────────────────────────────────────────────

export const gallery = [

  // ── 照片 / 影片 ──────────────────────────────────────────────────────────
  {
    id: 1,
    type: 'photo',
    image: '/gallery/craftsman-light.jpg',
    title: '職人之光',
    desc: '在鐵板騰起的雲霧中，我看見了專注。老師傅的雙手與孩子的眼神交織，光影在那一刻變得有滋有味。',
    meta: '雲林',
    color: '#3a2a1a',
  },
  {
    id: 2,
    type: 'photo',
    image: '/gallery/paddy-rhythm.jpg',
    title: '大地的韻律',
    desc: '綠色以一種極其自律的方式鋪排開來。層層稻浪在柔和散光下，呈現出土地給予視覺最深沉的撫慰。',
    meta: '忘憂谷',
    color: '#4a7a3a',
  },
  {
    id: 3,
    type: 'photo',
    image: '/gallery/bangkok-sunset.jpg',
    title: '暮色之城',
    desc: '那顆橙紅色的圓日，像火漆印章封存整座城市的喧騰。文明的線條遇上自然餘暉，美感異常純粹。',
    meta: '曼谷',
    color: '#c45a1a',
  },
  {
    id: 4,
    type: 'photo',
    image: '/gallery/vintage-cafe.jpg',
    title: '光陰的刻痕',
    desc: '斑駁的紅門與金色字跡在午後陽光下訴說往事。時間的重量，靜靜流淌在門環與藤椅之間。',
    meta: '白水咖啡',
    color: '#8a5a2a',
  },
  {
    id: 5,
    type: 'photo',
    image: '/gallery/golden-pampas.jpg',
    title: '鑲金的晚風',
    desc: '逆光是最好的濾鏡。每一根芒草都被夕陽勾勒出耀眼的邊界，捕捉著一天中最燦爛的溫柔。',
    meta: '火炎山',
    color: '#c8902a',
  },
  {
    id: 6,
    type: 'photo',
    image: '/gallery/spring-blossoms.jpg',
    title: '繁花掠影',
    desc: '迷離的散景將現實抽離。這不是在看花，而是在看一場關於春天的、溫柔的夢。',
    meta: '內湖東湖樂活公園',
    color: '#b07aaa',
  },
  {
    id: 7,
    type: 'photo',
    image: '/gallery/concert-lights.jpg',
    title: '律動的核心',
    desc: '光芒從中心刺破黑暗，鏡面球反射的不只是光，更是當下的律動與幾何美感。',
    meta: '大穎演唱會',
    color: '#1a1a3a',
  },

  {
    id: 8,
    type: 'video',
    image: '/gallery/wind-footprints-thumb.jpg',
    video: '/gallery/wind-footprints.mp4',
    title: '風的腳印',
    desc: '你看不見風，卻能看見它走過的痕跡。稻浪一波接著一波，那是風在大地上留下的字跡。',
    meta: '忘憂谷',
    color: '#5a7a4a',
  },

  // ── 佔位（維持旋轉不斷層，之後替換）────────────────────────────────────
  { id: 9,  type: 'photo', image: '', title: '', desc: '', meta: '', color: '#a09890' },
  { id: 9,  type: 'photo', image: '', title: '', desc: '', meta: '', color: '#a09890' },
  { id: 10, type: 'photo', image: '', title: '', desc: '', meta: '', color: '#a09890' },
  { id: 11, type: 'photo', image: '', title: '', desc: '', meta: '', color: '#a09890' },
  { id: 12, type: 'photo', image: '', title: '', desc: '', meta: '', color: '#a09890' },
  { id: 13, type: 'photo', image: '', title: '', desc: '', meta: '', color: '#a09890' },
  { id: 14, type: 'photo', image: '', title: '', desc: '', meta: '', color: '#a09890' },
];
