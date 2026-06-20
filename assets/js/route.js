(() => {
  "use strict";

  const data = window.KEIJO_DATA;
  const lineDirectoryList = document.querySelector("#lineDirectoryList");
  const stationSearchForm = document.querySelector("#routeStationSearchForm");
  const stationSearchInput = document.querySelector("#routeStationSearchInput");
  const stationList = document.querySelector("#routeStationList");
  const stationResult = document.querySelector("#routeStationSearchResult");
  const linePageMap = {
    "line-4": "jonggwan.html",
    "line-5": "congling.html",
    "line-8": "shanghuang.html",
    "line-l1a": "tenshogang.html",
    "line-l1s": "shingang-airport.html",
    "line-l2a": "seiboku.html",
    "line-l2b": "chengling.html"
  };

  if (!data || !lineDirectoryList) return;

  function renderLineDirectory() {
    lineDirectoryList.innerHTML = data.lines
      .map((line) => {
        const statusClass = line.status === "normal" ? "" : " delay";
        const description = line.subtitle || line.serviceName || line.trunkName || "";
        const href = linePageMap[line.id] || "#line-guide";

        return `
          <a class="line-directory-item${statusClass}" href="${href}" style="--route-color:${line.color}">
            <span>${line.symbol}</span>
            <div>
              <strong>${line.name}</strong>
              <small>${description}</small>
            </div>
            <b>${line.statusLabel}</b>
          </a>
        `;
      })
      .join("");
  }

  renderLineDirectory();
  window.addEventListener("keijo:operation-status-change", renderLineDirectory);

  if (stationList) {
    stationList.innerHTML = data.stations
      .map((station) => `<option value="${station.name}">${station.code}・${station.line}</option>`)
      .join("");
  }

  if (stationSearchForm && stationSearchInput && stationResult) {
    stationSearchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      renderStationResult(stationSearchInput.value);
    });

    document.querySelectorAll("[data-station-query]").forEach((link) => {
      link.addEventListener("click", () => {
        stationSearchInput.value = link.dataset.stationQuery;
        renderStationResult(link.dataset.stationQuery);
      });
    });
  }

  function renderStationResult(value) {
    const keyword = value.trim().toLowerCase();

    if (!keyword) {
      stationSearchInput.focus();
      return;
    }

    const match = data.stations.find(
      (station) =>
        station.name.toLowerCase().includes(keyword) ||
        station.code.toLowerCase() === keyword
    );

    if (!match) {
      stationResult.innerHTML = "<p>未找到符合條件的車站。請確認站名或車站編號後再查詢。</p>";
      return;
    }

    stationResult.innerHTML = `
      <article class="station-result-card">
        <span>${match.code}</span>
        <div>
          <strong>${match.name}</strong>
          <p>可利用路線：${match.line}</p>
          <small>出口、電梯、廁所、服務櫃台及首末班車資訊，請以車站公告及站內標示為準。</small>
        </div>
      </article>
    `;
  }
})();
