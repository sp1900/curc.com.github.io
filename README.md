# 京城市鐵官方網站

這是一個不依賴框架、可直接開啟的靜態網站。設計方向為：

- 南殷鐵道集團旗下城市交通子公司
- 藍色與橙色企業識別
- 日本／香港公營鐵道機構式的行政網站氣質
- 方正、克制、資訊密度較高
- 公共政策、資訊公開和建設進度具有明顯入口

## 已完成

- 響應式首頁框架
- 全線運行狀況摘要
- 各路線運行狀況對話框
- 路線入口卡片
- 車站名稱／編號搜尋原型
- 快速票價查詢器
- 票價、兒童票價、距離與預估時間試算
- 最新消息分類
- 網站內搜尋原型
- 文字放大
- 手機版導覽選單
- 公共政策與行政資訊區塊
- 路線與車站導覽頁
- 南順地鐵系統路線圖下載頁
- 乘車服務、車票與票價、建設與服務改善、企業與永續等母目錄頁
- 公告列表、單篇公告頁與公告範本
- favicon、apple-touch-icon 與 theme-color

## 檔案結構

```text
keijo-city-rail/
├─ index.html
├─ route/
│  ├─ index.html
│  ├─ map.html
│  ├─ tenshogang.html
│  ├─ jonggwan.html
│  ├─ congling.html
│  ├─ shanghuang.html
│  ├─ shingang-airport.html
│  ├─ seiboku.html
│  └─ chengling.html
├─ service/
│  └─ index.html
├─ fare/
│  └─ index.html
├─ news/
│  ├─ index.html
│  ├─ 20260617-01.html
│  ├─ 20260612-01.html
│  ├─ 20260608-01.html
│  └─ templates/
│     └─ announcement-template.html
├─ projects/
│  └─ index.html
├─ company/
│  └─ index.html
├─ assets/
│  ├─ css/
│  │  └─ main.css
│  ├─ images/
│  │  ├─ cur-favicon.png
│  │  └─ keijo-city-rail-logo.png
│  ├─ news/
│  │  ├─ images/
│  │  │  └─ 20260617-01-main.png
│  │  └─ attachments/
│  │     ├─ 20260617-01-service-adjustment.pdf
│  │     ├─ 20260612-01-construction-notice.pdf
│  │     └─ 20260608-01-safety-report-summary.pdf
│  ├─ pdf/
│  │  ├─ keijo-city-rail-map.pdf
│  │  └─ keijo-city-rail-network-map.pdf
│  └─ js/
│     ├─ site-data.js
│     ├─ news-data.js
│     ├─ news-index.js
│     ├─ operation-data.js
│     ├─ operation-system.js
│     ├─ operation-status.js
│     ├─ line-detail.js
│     ├─ route.js
│     └─ app.js
├─ README.md
└─ DESIGN-NOTES.md
```

## 使用方式

直接用瀏覽器開啟 `index.html` 即可。

若要使用本地開發伺服器：

```bash
python -m http.server 8000
```

然後開啟：

```text
http://localhost:8000/
```

## 資料與程式分工

路線、車站、新聞與票價級距等基礎資料集中於：

```text
assets/js/site-data.js
```

`site-data.js` 是基礎世界觀與營運資料。除非明確要修改世界觀設定，否則不得任意更改路線名稱、路線代號、站名、幹線名稱、路線顏色或既有營運設定。

模擬運行事件的機率、理由與延誤範圍集中於：

```text
assets/js/operation-data.js
```

運行狀況抽選、跨頁保存與到期更新由 `assets/js/operation-system.js` 負責。結果維持 20 至 30 分鐘；各頁必須先載入 `site-data.js`，再依序載入 `operation-data.js` 與 `operation-system.js`，最後才載入畫面顯示程式。

修改外觀：

```text
assets/css/main.css
```

修改功能：

```text
assets/js/app.js
```

路線與車站導覽頁的資料渲染：

```text
assets/js/route.js
```

全站運行資訊彈窗：

```text
assets/js/operation-status.js
```

路線專屬頁的運行狀態顯示：

```text
assets/js/line-detail.js
```

公告單篇頁面採靜態 HTML 維護。新增公告時，請複製：

```text
news/templates/announcement-template.html
```

公告編號建議使用 `YYYYMMDD-XX`，例如 `20260617-01.html`。公告圖片放在 `assets/news/images/`，公告附件放在 `assets/news/attachments/`。

完成公告頁後，只需在以下檔案的 `items` 加入一筆索引資料：

```text
assets/js/news-data.js
```

首頁公告、公告列表、分類公告及公告資料日期均會自動同步，不應再直接修改 `news/index.html` 內的公告項目。`assets/js/news-index.js` 負責公告列表頁的排序與分類顯示。

## 子頁 head 標準

根目錄頁面使用：

```html
<link rel="icon" type="image/png" sizes="32x32" href="assets/images/cur-favicon.png">
<link rel="apple-touch-icon" href="assets/images/cur-favicon.png">
<meta name="theme-color" content="#2C718F">
<link rel="stylesheet" href="assets/css/main.css">
```

一層子目錄下的頁面，例如 `route/`、`service/`、`fare/`、`news/`、`projects/`、`company/`，使用：

```html
<link rel="icon" type="image/png" sizes="32x32" href="../assets/images/cur-favicon.png">
<link rel="apple-touch-icon" href="../assets/images/cur-favicon.png">
<meta name="theme-color" content="#2C718F">
<link rel="stylesheet" href="../assets/css/main.css">
```

## 連結與錨點規範

- 主導覽使用母目錄頁，例如 `route/index.html`、`fare/index.html`、`service/index.html`。
- 頁內入口如需使用 `#anchor`，必須確認目標頁存在相同 id。
- 路線與車站相關頁面集中於 `route/`。
- 乘車服務相關頁面集中於 `service/`。
- 公告相關頁面集中於 `news/`。
- 建設、乘客服務改善與旅客動線改善集中於 `projects/`，但即時乘車指引仍應連回 `service/`。

## 公告系統規範

- `news/index.html` 是公告列表頁，內容由 `assets/js/news-data.js` 自動產生。
- 單篇公告以公告編號命名，例如 `news/20260617-01.html`。
- 單篇公告固定包含：公告編號、公告日期、分類、更新日期、標題、主文、可選大圖、附件與返回列表連結。
- 單篇公告頂部保留 `ANNOUNCEMENT DATA` 註解區，方便維護人員辨識資料。
- 附件不放入 `assets/pdf/`，應放入 `assets/news/attachments/`。
- 公告圖片不放入 `assets/images/`，應放入 `assets/news/images/`。
- 新公告只在 `assets/js/news-data.js` 登記一次；首頁和分類列表不得另行複製公告資料。

## 下一階段建議

1. 將路線卡片連接至獨立路線頁。
2. 建立車站詳情頁與完整車站列表。
3. 將票價查詢升級為路網最短路徑計算。
4. 建立路線詳情頁。
5. 將公告列表維護流程整理成更穩定的資料格式。
6. 加入真正的繁中／英文切換。
