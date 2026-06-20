# 都營南順地鐵網站

此目錄為都營南順地鐵的乘客網站。網站採用靜態 HTML，所有頁面共用 `assets/css/main.css`。

## 資訊架構

- `index.html`：首頁、旅程規劃、運行資訊及主要服務入口
- `travel/`：車票與路線
- `route/`：路線索引及路線圖，屬於「車票與路線」專門內容
- `services/`：服務及設施
- `responsibility/`：企業責任
- `business/`：附屬事業
- `metrogo/`：MetroGo App
- `assets/`：共用樣式、圖片及 PDF

## 維護原則

1. 新頁面應放在對應功能的母目錄，並使用 `index.html` 作為該功能入口。
2. 內頁沿用 `section-hero`、`section-subnav`、`content-section`、`feature-card`、`service-list` 及 `notice-panel` 等共用元件。
3. 主導覽固定為「車票與路線、服務及設施、企業責任、附屬事業、MetroGo App」。新增頁面時只標示所屬功能為 `active`。
4. 未確認的站名、票價、數字、商戶及政策不可自行補寫。可先放置停用的 `placeholder-action` 按鈕，待資料確認後改為正式連結。
5. 修改目錄層級後，需重新檢查圖片、樣式、PDF、首頁及京城市鐵網站的相對路徑。
