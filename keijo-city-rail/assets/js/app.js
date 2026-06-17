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

  const statusSummary = getStatusSummary(data.lines);

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
    if (!delayed.length) {
      return {
        label: "全線正常運行",
        detail: "目前沒有影響全線的重大事故。",
        state: "normal"
      };
    }

    return {
      label: `${delayed.length} 條路線有運行異常`,
      detail: `${delayed.map((line) => line.name).join("、")}，請留意最新資訊。`,
      state: "delay"
    };
  }

  function renderOperationStatus() {
    statusUpdated.textContent = `最後更新 ${data.updatedAt}`;
    dialogUpdatedTime.textContent = `資料時間：${data.updatedAt}`;

    const summaryBox = qs("#operationSummary");
    summaryBox.innerHTML = `
      <strong>${statusSummary.label}</strong>
      <span>${statusSummary.detail}</span>
    `;

    const beacon = qs(".status-beacon");
    if (statusSummary.state === "delay") {
      beacon.style.background = "#f1aa2c";
      beacon.style.boxShadow = "0 0 0 4px rgba(241,170,44,.22)";
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
    const items =
      filter === "all"
        ? data.news
        : data.news.filter((item) => item.category === filter);

    newsList.innerHTML = items
      .map(
        (item) => `
          <a class="news-item" href="#news" data-category="${item.category}">
            <time class="news-date">${item.date}</time>
            <span class="news-category">${item.categoryLabel}</span>
            <span class="news-title">${item.title}</span>
            <span class="news-arrow" aria-hidden="true">›</span>
          </a>
        `
      )
      .join("");
  }

  function attachEvents() {
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
      ? "恢復字級"
      : "文字放大";
  }

  function showLanguageNotice() {
    alert("目前提供繁體中文資訊。英文資訊請參閱另行公告。");
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
      alert("找不到符合的車站。請嘗試輸入完整站名或車站編號。");
      return;
    }

    alert(
      `${match.name}站（${match.code}）\n所屬路線：${match.line}\n\n出口、設施及首末班車資訊請以車站公告為準。`
    );
  }

  function handleSiteSearch(event) {
    event.preventDefault();
    const input = qs("#siteSearchInput");
    const result = qs("#siteSearchResult");
    const keyword = input.value.trim();

    if (!keyword) {
      result.textContent = "請輸入搜尋關鍵字。";
      return;
    }

    const routes = [
      { terms: ["票價", "車票", "運賃"], target: "#fare-search", label: "快速票價查詢" },
      { terms: ["路線", "車站", "地圖"], target: "#routes", label: "路線資訊" },
      { terms: ["延誤", "運行", "事故"], target: "#operation-status", label: "運行資訊" },
      { terms: ["新聞", "公告", "東湖"], target: "#news", label: "最新消息" },
      { terms: ["建設", "工程", "政策"], target: "#public-policy", label: "公共運輸政策" }
    ];

    const match = routes.find((item) =>
      item.terms.some((term) => keyword.includes(term))
    );

    if (!match) {
      result.textContent = `尚未找到「${keyword}」的對應內容。請嘗試輸入「票價」、「路線」、「運行」或「公告」。`;
      return;
    }

    result.innerHTML = `找到：<a href="${match.target}" id="searchResultLink">${match.label}</a>`;
    const resultLink = qs("#searchResultLink");
    resultLink.addEventListener("click", () => searchDialog.close());
  }

  function handleFareSearch(event) {
    event.preventDefault();

    const origin = data.stations.find((station) => station.id === originSelect.value);
    const destination = data.stations.find(
      (station) => station.id === destinationSelect.value
    );

    if (!origin || !destination) {
      fareResult.classList.remove("has-result");
      fareResult.innerHTML = "<span>請先選擇出發站及目的站。</span>";
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
          <small>試算距離 ${distance.toFixed(1)} 公里</small>
        </div>
        <div>
          <small>成人票價</small>
          <b>${adultFare}</b>
          <small>元</small>
        </div>
        <div>
          <small>兒童票價</small>
          <b>${childFare}</b>
          <small>元</small>
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
