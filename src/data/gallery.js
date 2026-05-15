// ─── 使用說明 ──────────────────────────────────────────────────────────────
// type  : 'photo' | 'video'
// image : 縮圖路徑，放在 public/gallery/，例如 "/gallery/shot1.jpg"
// video : 僅 video 類型填寫，例如 "/gallery/clip1.mp4"
// title : 作品標題
// meta  : 年份、地點等自由填寫，例如 "2024 · 台灣"
// color : 卡片背景色（圖片載入前的底色）
// ──────────────────────────────────────────────────────────────────────────

export const gallery = [

  // ── 照片 / 影片（依序填入）───────────────────────────────────────────────
  {
    id: 1,
    type: 'photo',
    image: '/gallery/wheel-strategy.png',
    title: '美股期權 Wheel Strategy 收租追蹤器',
    meta: '',
    color: '#39D353',
  },
  {
    id: 2,
    type: 'photo',
    image: '',
    title: '',
    meta: '',
    color: '#5B8A6A',
  },
  {
    id: 3,
    type: 'photo',
    image: '/gallery/i-am-fine.png',
    title: '我很好',
    meta: '',
    color: '#2E9E6B',
  },
  {
    id: 4,
    type: 'photo',
    image: '/gallery/cinematch.png',
    title: '影伴 (CineMatch)',
    meta: '',
    color: '#9B2335',
  },
  {
    id: 5,
    type: 'photo',
    image: '/gallery/tsla-options.png',
    title: 'TSLA 期權收租',
    meta: '',
    color: '#E31937',
  },
  {
    id: 6,
    type: 'photo',
    image: '/gallery/apple-motion.png',
    title: 'Apple 動效展示',
    meta: '',
    color: '#1d1d1f',
  },
  {
    id: 7,
    type: 'photo',
    image: '/gallery/taiwan-peaks.png',
    title: '收集百岳',
    meta: '',
    color: '#1B72BE',
  },
  {
    id: 8,
    type: 'photo',
    image: '',
    title: '',
    meta: '',
    color: '#a09890',
  },

  // ── 佔位（維持旋轉不斷層，之後替換）────────────────────────────────────
  { id: 9,  type: 'photo', image: '', title: '', meta: '', color: '#a09890' },
  { id: 10, type: 'photo', image: '', title: '', meta: '', color: '#a09890' },
  { id: 11, type: 'photo', image: '', title: '', meta: '', color: '#a09890' },
  { id: 12, type: 'photo', image: '', title: '', meta: '', color: '#a09890' },
  { id: 13, type: 'photo', image: '', title: '', meta: '', color: '#a09890' },
  { id: 14, type: 'photo', image: '', title: '', meta: '', color: '#a09890' },
];
