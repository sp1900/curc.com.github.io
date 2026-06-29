(() => {
  "use strict";

  const data = window.KEIJO_DATA;
  if (!data) return;

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  const transferRoutes = {
    "4": { label: "4", href: "jonggwan.html", color: "#E525D2", name: "縱貫線" },
    "5": { label: "5", href: "congling.html", color: "#3F805C", name: "從嶺線" },
    "8": { label: "8", href: "shanghuang.html", color: "#71364B", name: "上皇線" },
    "L1": { label: "L1", href: "tenshogang.html", color: "#3F7C95", name: "天從崗幹線" },
    "L2": { label: "L2", href: "seiboku.html", color: "#EF7A1F", name: "大西北幹線" },
    "YNR": {
      label: "國鐵",
      href: "https://passenger.kokutetsu.example/",
      color: "#0B3558",
      name: "南殷鐵道集團"
    }
  };

  function getTransferRoute(token) {
    if (token === "YNR") return transferRoutes.YNR;
    const routeCode = token.split("-")[0];
    return transferRoutes[routeCode] || null;
  }

  function isTransferToken(token) {
    return token === "YNR" || /^[A-Z]?\d+[A-Z]?-\d+$/.test(token);
  }

  function splitStationName(value) {
    let stationName = String(value).trim();
    const transfers = [];

    while (stationName.endsWith("）")) {
      const openIndex = stationName.lastIndexOf("（");
      if (openIndex < 0) break;

      const group = stationName.slice(openIndex + 1, -1);
      const tokens = group
        .split(/[、，,]/)
        .map((item) => item.trim())
        .filter(Boolean);

      if (!tokens.length || tokens.some((token) => !isTransferToken(token))) break;

      transfers.unshift(...tokens);
      stationName = stationName.slice(0, openIndex).trim();
    }

    return { stationName, transfers };
  }

  function createTransferChip(token) {
    const route = getTransferRoute(token);
    const label = route?.label || token.split("-")[0];
    const title = route
      ? `${route.name} ${token}`
      : `轉乘路線 ${token}`;
    const style = route ? ` style="--transfer-color:${route.color}"` : "";
    const content = `<span>${escapeHtml(label)}</span><small>${escapeHtml(token)}</small>`;

    if (!route?.href) {
      return `<span class="station-transfer-chip is-muted"${style} title="${escapeHtml(title)}">${content}</span>`;
    }

    const externalAttrs = token === "YNR" ? ' target="_blank" rel="noopener"' : "";
    return `<a class="station-transfer-chip"${style} href="${route.href}"${externalAttrs} title="${escapeHtml(title)}">${content}</a>`;
  }

  function createStationCard(name, className = "") {
    const cardClass = className ? ` station-card ${className}` : " station-card";
    const station = splitStationName(name);
    const transferMarkup = station.transfers.length
      ? `<div class="station-transfer-list" aria-label="可轉乘路線">${station.transfers.map(createTransferChip).join("")}</div>`
      : "";

    return `<article class="${cardClass.trim()}"><div class="station-name-block"><strong>${escapeHtml(station.stationName)}</strong>${transferMarkup}</div><div class="station-actions"><button type="button">位置圖</button><button type="button">車站資訊</button><button type="button">時刻表</button></div></article>`;
  }

  function createLane(name, laneName, options = {}) {
    const classes = ["station-lane", laneName];

    if (options.hasTrack) classes.push("has-track");
    if (options.end) classes.push(laneName === "main-lane" ? "main-end" : "branch-end");
    if (options.noTrack) classes.push("no-track");

    const card = name ? createStationCard(name, options.origin ? "branch-origin" : "") : "";
    return `<div class="${classes.join(" ")}">${card}</div>`;
  }

  function createStationRow(row) {
    if (row.split) {
      return `<div class="station-row branch-start branch-spacer"><div class="station-lane main-lane"></div><div class="station-lane branch-lane has-track"></div></div>`;
    }

    const mainLane = createLane(row.main, "main-lane", {
      end: row.mainEnd,
      noTrack: row.mainNoTrack,
      origin: row.mainOrigin,
    });
    const branchLane = createLane(row.branch, "branch-lane", {
      hasTrack: row.branch || row.branchTrack,
      end: row.branchEnd,
      noTrack: row.branchNoTrack,
      origin: row.branchOrigin,
    });

    return `<div class="station-row">${mainLane}${branchLane}</div>`;
  }

  function renderStationDiagrams() {
    document.querySelectorAll("[data-station-source]").forEach((panel) => {
      const source = document.getElementById(panel.dataset.stationSource);
      const diagram = panel.querySelector(".route-station-diagram");
      if (!source || !diagram) return;

      try {
        const rows = JSON.parse(source.textContent);
        diagram.innerHTML = rows.map(createStationRow).join("");
      } catch (error) {
        diagram.innerHTML = "";
      }
    });
  }

  function renderLineStatus() {
    document.querySelectorAll("[data-line-id]").forEach((card) => {
      const line = data.lines.find((item) => item.id === card.dataset.lineId);
      if (!line) return;

      const status = card.querySelector(".route-card-status");
      if (!status) return;

      status.textContent = line.statusLabel;
      status.classList.toggle("delay", line.status !== "normal");
    });
  }

  renderStationDiagrams();
  renderLineStatus();
  window.addEventListener("keijo:operation-status-change", renderLineStatus);
})();
