/*
 * 公告索引資料
 *
 * 新增公告時：
 * 1. 複製 news/templates/announcement-template.html 並建立公告頁。
 * 2. 在 items 最上方加入一筆資料。
 *
 * url 以 news/ 目錄為基準，例如 20260617-01.html。
 * 首頁與公告列表會自動依日期排序並同步更新。
 */
window.KEIJO_NEWS_DATA = {
  categories: [
    { id: "service", label: "服務", title: "服務公告" },
    { id: "project", label: "建設", title: "建設公告" },
    { id: "ticket", label: "票務", title: "票務公告" },
    { id: "company", label: "企業", title: "企業資訊" }
  ],
  items: [
    {
      id: "20260617-01",
      date: "2026.06.17",
      category: "service",
      title: "日間服務提升：天從崗幹線班次優化及東湖支線服務調整",
      url: "20260617-01.html"
    },
    {
      id: "20260612-01",
      date: "2026.06.12",
      category: "project",
      title: "寰宇門站轉乘大廳改善工程第二階段施工公告",
      url: "20260612-01.html"
    },
    {
      id: "20260608-01",
      date: "2026.06.08",
      category: "company",
      title: "京城市鐵發布 2025 年度安全與服務品質報告",
      url: "20260608-01.html"
    },
    {
      id: "20260603-01",
      date: "2026.06.03",
      category: "service",
      title: "夏季大型活動期間部分車站人流管制預告",
      url: "index.html#service-news"
    },
    {
      id: "20260528-01",
      date: "2026.05.28",
      category: "project",
      title: "南港線月台安全門更新工程期程說明",
      url: "index.html#project-news"
    },
    {
      id: "20260520-01",
      date: "2026.05.20",
      category: "company",
      title: "京城市鐵採購資訊公開方式調整通知",
      url: "index.html#company-news"
    }
  ]
};
