// ─── 使用說明 ──────────────────────────────────────────────────────────────
// 1. 把作品圖片放進 public/works/ 資料夾（建議 400×400px 正方形）
// 2. 填入下方對應欄位：
//    image : 圖片路徑，例如 "/works/project1.png"（填了就整張卡片顯示你的圖，沒填顯示 emoji）
//    title : 作品名稱
//    desc  : 一行描述
//    url   : 作品連結（尚未上線填 "#"）
//    color : 主題色（十六進位），用於卡片底色與 Preview Panel 連結顏色
// ──────────────────────────────────────────────────────────────────────────

export const works = [

  // ── 真實作品（共 8 個，依序填入）────────────────────────────────────────
  {
    id: 1,
    emoji: "📈",
    title: "美股期權 Wheel Strategy 收租追蹤器",
    desc: "專為 Wheel Strategy 設計的隱私優先追蹤工具，免帳號、零伺服器，即刻掌握美股收租績效。",
    url: "https://wheel-strategy-nine.vercel.app",
    color: "#39D353",
  },
  {
    id: 2,
    emoji: "🎵",
    title: "台北音樂地圖",
    desc: "專為音樂迷打造的跨平台互動地圖，一鍵探索台北黑膠店、Live House 與地下音樂場所。",
    url: "https://echo-map-xi.vercel.app",
    color: "#5B8A6A",
  },
  {
    id: 3,
    emoji: "💚",
    title: "我很好",
    desc: "專為獨居長輩打造的數位報平安橋樑，用最不打擾的方式傳遞關懷，讓長輩自在、子女安心。",
    url: "https://i-am-fine.vercel.app",
    color: "#2E9E6B",
  },
  {
    id: 4,
    emoji: "🎬",
    title: "影伴 (CineMatch)",
    desc: "快閃式觀影同好媒合平台，訊息 24 小時自動銷毀，不論分票、徵友或映後討論都能精準找伴。",
    url: "https://cinematch-gamma-flame.vercel.app",
    color: "#9B2335",
  },
  {
    id: 5,
    emoji: "✦",
    title: "Coming Soon",
    desc: "即將推出的 AI 作品",
    url: "#",
    color: "#a09890",
  },
  {
    id: 6,
    emoji: "✦",
    title: "Coming Soon",
    desc: "即將推出的 AI 作品",
    url: "#",
    color: "#a09890",
  },
  {
    id: 7,
    emoji: "✦",
    title: "Coming Soon",
    desc: "即將推出的 AI 作品",
    url: "#",
    color: "#a09890",
  },
  {
    id: 8,
    emoji: "✦",
    title: "Coming Soon",
    desc: "即將推出的 AI 作品",
    url: "#",
    color: "#a09890",
  },

  // ── Coming Soon 佔位卡（維持旋轉不斷層，之後有新作品再替換）───────────────
  { id: 9,  emoji: "✦", title: "Coming Soon", desc: "即將推出的 AI 作品", url: "#", color: "#a09890" },
  { id: 10, emoji: "✦", title: "Coming Soon", desc: "即將推出的 AI 作品", url: "#", color: "#a09890" },
  { id: 11, emoji: "✦", title: "Coming Soon", desc: "即將推出的 AI 作品", url: "#", color: "#a09890" },
  { id: 12, emoji: "✦", title: "Coming Soon", desc: "即將推出的 AI 作品", url: "#", color: "#a09890" },
  { id: 13, emoji: "✦", title: "Coming Soon", desc: "即將推出的 AI 作品", url: "#", color: "#a09890" },
  { id: 14, emoji: "✦", title: "Coming Soon", desc: "即將推出的 AI 作品", url: "#", color: "#a09890" },
];
