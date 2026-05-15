// ─── 使用說明 ──────────────────────────────────────────────────────────────
// type  : 'photo' | 'video'
// image : 縮圖路徑，放在 public/gallery/，例如 "/gallery/shot1.jpg"
// video : 僅 video 類型填寫，例如 "/gallery/clip1.mp4"
// title : 作品標題
// meta  : 年份、地點等自由填寫，例如 "2024 · 台灣"
// color : 卡片背景色（圖片載入前的底色）
// ──────────────────────────────────────────────────────────────────────────

export const gallery = [

  // ── 照片 / 影片 ──────────────────────────────────────────────────────────
  {
    id: 1,
    type: 'photo',
    image: '/gallery/craftsman-light.jpg',
    title: '職人之光',
    meta: '雲林',
    color: '#3a2a1a',
  },
  {
    id: 2,
    type: 'photo',
    image: '/gallery/paddy-rhythm.jpg',
    title: '大地的韻律',
    meta: '忘憂谷',
    color: '#4a7a3a',
  },
  {
    id: 3,
    type: 'photo',
    image: '/gallery/bangkok-sunset.jpg',
    title: '暮色之城',
    meta: '曼谷',
    color: '#c45a1a',
  },
  {
    id: 4,
    type: 'photo',
    image: '/gallery/vintage-cafe.jpg',
    title: '光陰的刻痕',
    meta: '白水咖啡',
    color: '#8a5a2a',
  },
  {
    id: 5,
    type: 'photo',
    image: '/gallery/golden-pampas.jpg',
    title: '鑲金的晚風',
    meta: '火炎山',
    color: '#c8902a',
  },
  {
    id: 6,
    type: 'photo',
    image: '/gallery/spring-blossoms.jpg',
    title: '繁花掠影',
    meta: '內湖東湖樂活公園',
    color: '#b07aaa',
  },
  {
    id: 7,
    type: 'photo',
    image: '/gallery/concert-lights.jpg',
    title: '律動的核心',
    meta: '大穎演唱會',
    color: '#1a1a3a',
  },

  // ── 佔位（維持旋轉不斷層，之後替換）────────────────────────────────────
  { id: 8,  type: 'photo', image: '', title: '', meta: '', color: '#a09890' },
  { id: 9,  type: 'photo', image: '', title: '', meta: '', color: '#a09890' },
  { id: 10, type: 'photo', image: '', title: '', meta: '', color: '#a09890' },
  { id: 11, type: 'photo', image: '', title: '', meta: '', color: '#a09890' },
  { id: 12, type: 'photo', image: '', title: '', meta: '', color: '#a09890' },
  { id: 13, type: 'photo', image: '', title: '', meta: '', color: '#a09890' },
  { id: 14, type: 'photo', image: '', title: '', meta: '', color: '#a09890' },
];
