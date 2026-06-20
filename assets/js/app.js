(() => {
  "use strict";

  const data = window.KEIJO_DATA;

  if (!data) {
    console.error("KEIJO_DATA is missing.");
    return;
  }

  const qs = (selector, parent = document) => parent.querySelector(selector);
  const qsa = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  const statusUpdated = qs("#statusUpdated");
  const dialogUpdatedTime = qs("#dialogUpdatedTime");
  const routeCardGrid = qs("#routeCardGrid");
  const statusLineList = qs("#statusLineList");
  const stationList = qs("#stationList");
  const originSelect = qs("#originSelect");
  const destinationSelect = qs("#destinationSelect");
  const fareResult = qs("#fareResult");
  const newsList = qs("#newsList");
  const statusDialog = qs("#statusDialog");
  const searchDialog = qs("#searchDialog");
  const newsData = window.KEIJO_NEWS_DATA;

  init();

  function init() {
    renderOperationStatus();
    renderRouteCards();
    renderStatusDialog();
    populateStationControls();
    renderNews("all");
    attachEvents();
  }

  function getStatusSummary(lines) {
    const delayed = lines.filter((line) => line.status !== "normal");
    const suspended = lines.filter((line) => line.status === "suspended");

    if (suspended.length) {
      return {
        label: `${suspended.length} 條路線暫停服務`,
        detail: `${suspended.map((line) => line.name).join("、")}請改用其他路線或替代交通。`,
        state: "suspended"
      };
    }

    if (!delayed.length) {
      return {
        label: "全線大致正常運行",
        detail: "各線列車依照時刻表運行。",
        state: "normal"
      };
    }

    return {
      label: `${delayed.length} 條路線有服務調整`,
      detail: `${delayed.map((line) => line.name).join("、")}請留意最新公告。`,
      state: "delay"
    };
  }

  function renderOperationStatus() {
    const statusSummary = getStatusSummary(data.lines);
    statusUpdated.textContent = `最近更新：${data.updatedAt}`;
    dialogUpdatedTime.textContent = `資料時間：${data.updatedAt}`;

    const summaryBox = qs("#operationSummary");
    summaryBox.innerHTML = `
      <strong>${statusSummary.label}</strong>
      <span>${statusSummary.detail}</span>
    `;

    const beacon = qs(".status-beacon");
    beacon.style.background = "#35c879";
    beacon.style.boxShadow = "0 0 0 4px rgba(53,200,121,.2)";
    if (statusSummary.state === "delay") {
      beacon.style.background = "#f1aa2c";
      beacon.style.boxShadow = "0 0 0 4px rgba(241,170,44,.22)";
    }
    if (statusSummary.state === "suspended") {
      beacon.style.background = "#ff6b5f";
      beacon.style.boxShadow = "0 0 0 4px rgba(255,107,95,.22)";
    }

    const navIcon = qs(".nav-status .nav-icon");
    if (navIcon) {
      navIcon.classList.remove("status-delay", "status-suspended");

      if (statusSummary.state === "delay") {
        navIcon.classList.add("status-delay");
      }

      if (statusSummary.state === "suspended") {
        navIcon.classList.add("status-suspended");
      }
    }
  }

  function renderRouteCards() {
    routeCardGrid.innerHTML = data.lines
      .map((line) => {
        const statusClass = line.status === "normal" ? "" : " delay";
        return `
          <a class="route-card" href="route/index.html#line-guide" style="--route-color:${line.color}">
            <span class="route-symbol">${line.symbol}</span>
            <strong>${line.name}</strong>
            <small>${line.subtitle}</small>
            <span class="route-status-mini${statusClass}">${line.statusLabel}</span>
          </a>
        `;
      })
      .join("");
  }

  function renderStatusDialog() {
    statusLineList.innerHTML = data.lines
      .map((line) => {
        const badgeClass = line.status === "normal" ? "" : " delay";
        return `
          <article class="status-line-row" style="--line-color:${line.color}">
            <span class="status-line-symbol">${line.symbol}</span>
            <div>
              <strong>${line.name}</strong>
              <small>${line.message}</small>
            </div>
            <span class="status-badge${badgeClass}">${line.statusLabel}</span>
          </article>
        `;
      })
      .join("");
  }

  function populateStationControls() {
    const datalistMarkup = data.stations
      .map((station) => `<option value="${station.name}">${station.code}・${station.line}</option>`)
      .join("");
    stationList.innerHTML = datalistMarkup;

    const selectMarkup = data.stations
      .map(
        (station) =>
          `<option value="${station.id}">${station.name}（${station.code}）</option>`
      )
      .join("");

    originSelect.insertAdjacentHTML("beforeend", selectMarkup);
    destinationSelect.insertAdjacentHTML("beforeend", selectMarkup);
  }

  function renderNews(filter) {
    const sourceItems = [...(newsData?.items || data.news)].sort((a, b) => {
      const dateOrder = b.date.localeCompare(a.date);
      return dateOrder || b.id.localeCompare(a.id);
    });
    const items =
      filter === "all"
        ? sourceItems
        : sourceItems.filter((item) => item.category === filter);

    newsList.innerHTML = items
      .map(
        (item) => {
          const category = newsData?.categories.find(
            (entry) => entry.id === item.category
          );
          const href = newsData
            ? `news/${item.url}`
            : item.url || "news/index.html";
          return `
          <a class="news-item" href="${href}" data-category="${item.category}">
            <time class="news-date">${item.date}</time>
            <span class="news-category">${category?.label || item.categoryLabel}</span>
            <span class="news-title">${item.title}</span>
            <span class="news-arrow" aria-hidden="true">›</span>
          </a>
        `;
        }
      )
      .join("");
  }

  function attachEvents() {
    window.addEventListener("keijo:operation-status-change", () => {
      renderOperationStatus();
      renderRouteCards();
      renderStatusDialog();
    });
    qs("#menuToggle").addEventListener("click", toggleMenu);
    qs("#fontSizeBtn").addEventListener("click", toggleFontSize);
    qs("#languageBtn").addEventListener("click", showLanguageNotice);
    qs("#statusDetailsBtn").addEventListener("click", () => openDialog(statusDialog));
    qs("#closeStatusDialog").addEventListener("click", () => statusDialog.close());
    qs("#closeStatusDialogBottom").addEventListener("click", () => statusDialog.close());
    qs("#siteSearchButton").addEventListener("click", () => openDialog(searchDialog));
    qs("#closeSearchDialog").addEventListener("click", () => searchDialog.close());
    qs("#stationSearchForm").addEventListener("submit", handleStationSearch);
    qs("#siteSearchForm").addEventListener("submit", handleSiteSearch);
    qs("#fareForm").addEventListener("submit", handleFareSearch);
    qs("#swapStations").addEventListener("click", swapStations);

    qsa("[data-news-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        qsa("[data-news-filter]").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        renderNews(button.dataset.newsFilter);
      });
    });

    qsa(".main-nav a").forEach((link) => {
      link.addEventListener("click", () => {
        qs("#mainNav").classList.remove("open");
        qs("#menuToggle").setAttribute("aria-expanded", "false");
      });
    });

    [statusDialog, searchDialog].forEach((dialog) => {
      dialog.addEventListener("click", (event) => {
        const box = dialog.getBoundingClientRect();
        const outside =
          event.clientX < box.left ||
          event.clientX > box.right ||
          event.clientY < box.top ||
          event.clientY > box.bottom;
        if (outside) dialog.close();
      });
    });
  }

  function toggleMenu() {
    const nav = qs("#mainNav");
    const button = qs("#menuToggle");
    const isOpen = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
  }

  function toggleFontSize() {
    document.body.classList.toggle("large-type");
    qs("#fontSizeBtn").textContent = document.body.classList.contains("large-type")
      ? "恢復標準字級"
      : "文字放大";
  }

  function showLanguageNotice() {
    alert("目前僅提供繁體中文頁面。");
  }

  function openDialog(dialog) {
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
      return;
    }
    dialog.setAttribute("open", "");
  }

  function handleStationSearch(event) {
    event.preventDefault();
    const input = qs("#stationSearchInput");
    const keyword = input.value.trim().toLowerCase();

    if (!keyword) {
      input.focus();
      return;
    }

    const match = data.stations.find(
      (station) =>
        station.name.toLowerCase().includes(keyword) ||
        station.code.toLowerCase() === keyword
    );

    if (!match) {
      alert("未找到符合條件的車站。請確認站名或車站編號後再查詢。");
      return;
    }

    alert(
      `${match.name}（${match.code}）\n可轉乘路線：${match.line}\n\n詳細出口、設施與無障礙資訊將於車站頁面陸續公開。`
    );
  }

  function handleSiteSearch(event) {
    event.preventDefault();
    const input = qs("#siteSearchInput");
    const result = qs("#siteSearchResult");
    const keyword = input.value.trim();

    if (!keyword) {
      result.textContent = "請輸入要搜尋的內容。";
      return;
    }

    const routes = [
      { terms: ["票價", "車票", "運賃", "套票", "定期票"], target: "fare/index.html", label: "車票與票價" },
      { terms: ["路線圖", "地圖", "南順"], target: "route/map.html", label: "地圖下載" },
      { terms: ["路線", "車站", "轉乘"], target: "route/index.html", label: "路線與車站" },
      { terms: ["延誤", "運行", "事故", "服務", "動線", "無障礙", "舒適"], target: "service/index.html#operation-guide", label: "乘車服務" },
      { terms: ["新聞", "公告", "東湖"], target: "news/index.html", label: "公告與新聞" },
      { terms: ["建設", "工程", "改善", "施工"], target: "projects/index.html", label: "建設與服務改善" },
      { terms: ["政策", "企業", "永續", "採購"], target: "company/index.html", label: "企業與永續" }
    ];

    const match = routes.find((item) =>
      item.terms.some((term) => keyword.includes(term))
    );

    if (!match) {
      result.textContent = `找不到「${keyword}」的直接結果。請嘗試「路線」、「票價」、「公告」或「乘車服務」。`;
      return;
    }

    result.innerHTML = `搜尋結果：<a href="${match.target}" id="searchResultLink">${match.label}</a>`;
    qs("#searchResultLink").addEventListener("click", () => searchDialog.close());
  }

  function handleFareSearch(event) {
    event.preventDefault();

    const origin = data.stations.find((station) => station.id === originSelect.value);
    const destination = data.stations.find(
      (station) => station.id === destinationSelect.value
    );

    if (!origin || !destination) {
      fareResult.classList.remove("has-result");
      fareResult.innerHTML = "<span>請選擇出發站及目的站。</span>";
      return;
    }

    if (origin.id === destination.id) {
      fareResult.classList.remove("has-result");
      fareResult.innerHTML = "<span>出發站與目的站不可相同。</span>";
      return;
    }

    const distance = Math.abs(destination.km - origin.km);
    const adultFare = calculateFare(distance);
    const childFare = Math.ceil(adultFare / 2 / 10) * 10;
    const travelTime = Math.max(4, Math.round(distance * 1.85 + 3));

    fareResult.classList.add("has-result");
    fareResult.innerHTML = `
      <div class="fare-result-grid">
        <div>
          <strong>${origin.name} → ${destination.name}</strong>
          <small>營業距離 ${distance.toFixed(1)} 公里</small>
        </div>
        <div>
          <small>成人普通票</small>
          <b>${adultFare}</b>
          <small>圓</small>
        </div>
        <div>
          <small>兒童普通票</small>
          <b>${childFare}</b>
          <small>圓</small>
        </div>
        <div>
          <small>預估時間</small>
          <b>${travelTime}</b>
          <small>分鐘</small>
        </div>
      </div>
    `;
  }

  function calculateFare(distance) {
    const band = data.fareRules.bands.find((item) => distance <= item.maxKm);
    return band ? band.fare : data.fareRules.minimum;
  }

  function swapStations() {
    const currentOrigin = originSelect.value;
    originSelect.value = destinationSelect.value;
    destinationSelect.value = currentOrigin;
  }
})();
