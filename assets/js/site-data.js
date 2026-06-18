window.KEIJO_DATA = {
  updatedAt: "2026-06-17 08:30",
  lines: [
    {
      id: "line-4",
      code: "4",
      symbol: "4",
      name: "縱貫線",
      serviceName: "四號線",
      subtitle: "京城中軸與主要轉乘走廊",
      status: "normal",
      statusLabel: "正常運行",
      message: "全線列車依照時刻表正常運行。",
      color: "#E525D2"
    },
    {
      id: "line-5",
      code: "5",
      symbol: "5",
      name: "從嶺線",
      serviceName: "五號線",
      subtitle: "南咸、大學城方向通勤主線",
      status: "normal",
      statusLabel: "正常運行",
      message: "全線列車依照時刻表正常運行。",
      color: "#3F805C"
    },
    {
      id: "line-8",
      code: "8",
      symbol: "8",
      name: "上皇線",
      serviceName: "八號線",
      subtitle: "連絡上皇政務區與東側住宅帶",
      status: "normal",
      statusLabel: "正常運行",
      message: "全線列車依照時刻表正常運行。",
      color: "#71364B"
    },
    {
      id: "line-l1a",
      code: "L1A",
      symbol: "L1A",
      name: "天從崗線",
      trunkName: "天從崗幹線",
      subtitle: "夏林、寰宇門、東湖南方向",
      status: "normal",
      statusLabel: "正常運行",
      message: "全線列車依照時刻表正常運行。",
      color: "#3F7C95"
    },
    {
      id: "line-l1s",
      code: "L1S",
      symbol: "L1S",
      name: "新崗機場快線",
      trunkName: "天從崗幹線",
      subtitle: "新崗機場快速聯絡服務",
      status: "normal",
      statusLabel: "正常運行",
      message: "全線列車依照時刻表正常運行。",
      color: "#53ADD2"
    },
    {
      id: "line-l2a",
      code: "L2A",
      symbol: "L2A",
      name: "西北線",
      trunkName: "大西北幹線",
      subtitle: "京城西北新市鎮聯絡線",
      status: "delay",
      statusLabel: "部分延誤",
      message: "因新會路站有乘客需要救護服務，部分列車約延誤 5 分鐘。",
      color: "#EF7A1F"
    },
    {
      id: "line-l2b",
      code: "L2B",
      symbol: "L2B",
      name: "成陵線",
      trunkName: "大西北幹線",
      subtitle: "成陵副都心與北岸地區支線",
      status: "normal",
      statusLabel: "正常運行",
      message: "全線列車依照時刻表正常運行。",
      color: "#EF7A1F"
    }
  ],
  stations: [
    { id: "S01", code: "K01", name: "夏林", line: "天從崗幹線", km: 0 },
    { id: "S02", code: "K02", name: "佑白路", line: "天從崗幹線", km: 3.2 },
    { id: "S03", code: "K03", name: "靖江公園", line: "天從崗幹線", km: 6.1 },
    { id: "S04", code: "K04", name: "寰宇門", line: "天從崗幹線／北岸線", km: 9.4 },
    { id: "S05", code: "K05", name: "御林園", line: "天從崗幹線", km: 13.8 },
    { id: "S06", code: "K06", name: "明華路", line: "天從崗幹線", km: 17.2 },
    { id: "S07", code: "K07", name: "東外城", line: "天從崗幹線", km: 21.3 },
    { id: "S08", code: "K08", name: "東湖南", line: "天從崗幹線／東湖支線", km: 26.1 },
    { id: "S09", code: "E11", name: "江岸車站", line: "江岸線／東西線", km: 31.0 },
    { id: "S10", code: "N06", name: "南水庫", line: "北岸線", km: 35.4 },
    { id: "S11", code: "R12", name: "南咸", line: "從嶺線", km: 39.7 },
    { id: "S12", code: "R15", name: "大學城", line: "從嶺線", km: 44.5 }
  ],
  news: [
    {
      id: "20260617-01",
      date: "2026.06.17",
      category: "service",
      categoryLabel: "服務",
      title: "日間服務提升：天從崗幹線班次優化及東湖支線服務調整",
      url: "news/20260617-01.html"
    },
    {
      id: "20260612-01",
      date: "2026.06.12",
      category: "project",
      categoryLabel: "建設",
      title: "寰宇門站轉乘大廳改善工程第二階段施工公告",
      url: "news/20260612-01.html"
    },
    {
      id: "20260608-01",
      date: "2026.06.08",
      category: "company",
      categoryLabel: "企業",
      title: "京城市鐵發布 2025 年度安全與服務品質報告",
      url: "news/20260608-01.html"
    },
    {
      id: "20260603-01",
      date: "2026.06.03",
      category: "service",
      categoryLabel: "服務",
      title: "夏季大型活動期間部分車站人流管制預告",
      url: "news/index.html#service-news"
    },
    {
      id: "20260528-01",
      date: "2026.05.28",
      category: "project",
      categoryLabel: "建設",
      title: "南港線月台安全門更新工程期程說明",
      url: "news/index.html#project-news"
    },
    {
      id: "20260520-01",
      date: "2026.05.20",
      category: "company",
      categoryLabel: "企業",
      title: "京城市鐵採購資訊公開方式調整通知",
      url: "news/index.html#company-news"
    }
  ],
  fareRules: {
    minimum: 150,
    bands: [
      { maxKm: 5, fare: 150 },
      { maxKm: 10, fare: 180 },
      { maxKm: 15, fare: 220 },
      { maxKm: 20, fare: 260 },
      { maxKm: 30, fare: 300 },
      { maxKm: 999, fare: 340 }
    ]
  }
};
