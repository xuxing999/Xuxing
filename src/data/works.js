// ─── 使用說明 ──────────────────────────────────────────────────────────────
// 1. 把作品截圖放進 public/works/ 資料夾（建議 400×400px 正方形）
// 2. 填入下方對應欄位：
//    image : 圖片路徑，例如 "/works/project1.png"（有填就顯示圖片，沒填顯示 emoji）
//    title : 作品名稱
//    desc  : 一行描述
//    url   : 作品連結（尚未上線填 "#"）
//    color : 主題色（十六進位），用於卡片底色與 Preview Panel 連結顏色
// ──────────────────────────────────────────────────────────────────────────

export const works = [

  // ── 真實作品（共 8 個，依序填入）────────────────────────────────────────
  {
    id: 1,
    image: "/works/project1.png",   // ← 把圖片放進 public/works/ 後改這裡
    emoji: "🤖",
    title: "作品名稱一",
    desc: "一行描述文字",
    url: "#",
    color: "#e05a2b",
  },
  {
    id: 2,
    image: "/works/project2.png",
    emoji: "💡",
    title: "作品名稱二",
    desc: "一行描述文字",
    url: "#",
    color: "#378ADD",
  },
  {
    id: 3,
    image: "/works/project3.png",
    emoji: "🎨",
    title: "作品名稱三",
    desc: "一行描述文字",
    url: "#",
    color: "#7F77DD",
  },
  {
    id: 4,
    image: "/works/project4.png",
    emoji: "📊",
    title: "作品名稱四",
    desc: "一行描述文字",
    url: "#",
    color: "#1D9E75",
  },
  {
    id: 5,
    image: "/works/project5.png",
    emoji: "🌐",
    title: "作品名稱五",
    desc: "一行描述文字",
    url: "#",
    color: "#D4537E",
  },
  {
    id: 6,
    image: "/works/project6.png",
    emoji: "🔮",
    title: "作品名稱六",
    desc: "一行描述文字",
    url: "#",
    color: "#534AB7",
  },
  {
    id: 7,
    image: "/works/project7.png",
    emoji: "📱",
    title: "作品名稱七",
    desc: "一行描述文字",
    url: "#",
    color: "#BA7517",
  },
  {
    id: 8,
    image: "/works/project8.png",
    emoji: "✨",
    title: "作品名稱八",
    desc: "一行描述文字",
    url: "#",
    color: "#639922",
  },

  // ── Coming Soon 佔位卡（維持旋轉不斷層，之後有新作品再替換）───────────────
  { id: 9,  emoji: "✦", title: "Coming Soon", desc: "即將推出的 AI 作品", url: "#", color: "#a09890" },
  { id: 10, emoji: "✦", title: "Coming Soon", desc: "即將推出的 AI 作品", url: "#", color: "#a09890" },
  { id: 11, emoji: "✦", title: "Coming Soon", desc: "即將推出的 AI 作品", url: "#", color: "#a09890" },
  { id: 12, emoji: "✦", title: "Coming Soon", desc: "即將推出的 AI 作品", url: "#", color: "#a09890" },
  { id: 13, emoji: "✦", title: "Coming Soon", desc: "即將推出的 AI 作品", url: "#", color: "#a09890" },
  { id: 14, emoji: "✦", title: "Coming Soon", desc: "即將推出的 AI 作品", url: "#", color: "#a09890" },
];
