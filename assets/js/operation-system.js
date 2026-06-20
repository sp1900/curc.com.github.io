(() => {
  "use strict";

  const siteData = window.KEIJO_DATA;
  const operationData = window.KEIJO_OPERATION_DATA;
  if (!siteData || !operationData || !Array.isArray(siteData.lines)) return;

  const windowNamePrefix = `${operationData.storageKey}:`;
  const normalStatus = {
    status: "normal",
    statusLabel: "正常運行",
    message: "全線列車依照時刻表正常運行。"
  };
  let expiryTimer;
  let activeSnapshot;

  function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function chooseWeighted(items, weightKey = "weight") {
    const total = items.reduce((sum, item) => sum + item[weightKey], 0);
    let draw = Math.random() * total;

    for (const item of items) {
      draw -= item[weightKey];
      if (draw < 0) return item;
    }

    return items[items.length - 1];
  }

  function isBusyTime(date) {
    const hour = date.getHours();
    return operationData.busyHours.some(
      (period) => hour >= period.start && hour < period.end
    );
  }

  function formatUpdatedAt(timestamp) {
    const date = new Date(timestamp);
    const pad = (value) => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function selectLineIds(count) {
    const ids = siteData.lines.map((line) => line.id);

    for (let index = ids.length - 1; index > 0; index -= 1) {
      const swapIndex = randomInteger(0, index);
      [ids[index], ids[swapIndex]] = [ids[swapIndex], ids[index]];
    }

    return ids.slice(0, Math.min(count, ids.length));
  }

  function createSnapshot() {
    const now = new Date();
    const busy = isBusyTime(now);
    const outcome = chooseWeighted(
      busy ? operationData.outcomes.busy : operationData.outcomes.regular
    );
    const duration = randomInteger(
      operationData.durationMinutes.min,
      operationData.durationMinutes.max
    );
    const incidents = selectLineIds(outcome.affectedLines).map((lineId) => {
      const type = chooseWeighted(
        operationData.eventTypes,
        busy ? "busyWeight" : "regularWeight"
      );
      const minutes = randomInteger(type.delayMinutes.min, type.delayMinutes.max);
      const reason = type.reasons[randomInteger(0, type.reasons.length - 1)];

      return {
        lineId,
        eventType: type.id,
        status: "delay",
        statusLabel: type.statusLabel,
        message: reason.replace("{minutes}", String(minutes)),
        delayMinutes: minutes
      };
    });

    return {
      version: operationData.version,
      outcome: outcome.id,
      busy,
      createdAt: now.getTime(),
      expiresAt: now.getTime() + duration * 60 * 1000,
      incidents
    };
  }

  function parseSnapshot(raw) {
    if (!raw) return null;

    try {
      const snapshot = JSON.parse(raw);
      if (
        snapshot.version !== operationData.version ||
        !Number.isFinite(snapshot.createdAt) ||
        !Number.isFinite(snapshot.expiresAt) ||
        !Array.isArray(snapshot.incidents)
      ) {
        return null;
      }
      return snapshot;
    } catch (_error) {
      return null;
    }
  }

  function loadSnapshot() {
    let storedSnapshot = null;
    let navigationSnapshot = null;

    try {
      storedSnapshot = parseSnapshot(localStorage.getItem(operationData.storageKey));
    } catch (_error) {
      storedSnapshot = null;
    }

    if (window.name.startsWith(windowNamePrefix)) {
      navigationSnapshot = parseSnapshot(window.name.slice(windowNamePrefix.length));
    }

    if (!storedSnapshot) return navigationSnapshot;
    if (!navigationSnapshot) return storedSnapshot;
    return storedSnapshot.createdAt >= navigationSnapshot.createdAt
      ? storedSnapshot
      : navigationSnapshot;
  }

  function saveSnapshot(snapshot) {
    const raw = JSON.stringify(snapshot);

    try {
      localStorage.setItem(operationData.storageKey, raw);
    } catch (_error) {
      // window.name keeps direct file navigation consistent if storage is unavailable.
    }

    window.name = `${windowNamePrefix}${raw}`;
  }

  function applySnapshot(snapshot) {
    siteData.updatedAt = formatUpdatedAt(snapshot.createdAt);

    siteData.lines.forEach((line) => {
      Object.assign(line, normalStatus);
    });

    snapshot.incidents.forEach((incident) => {
      const line = siteData.lines.find((item) => item.id === incident.lineId);
      if (!line) return;
      line.status = incident.status;
      line.statusLabel = incident.statusLabel;
      line.message = incident.message;
    });
  }

  function scheduleExpiry(snapshot) {
    window.clearTimeout(expiryTimer);
    const remaining = Math.max(0, snapshot.expiresAt - Date.now());
    expiryTimer = window.setTimeout(refreshSnapshot, remaining + 50);
  }

  function refreshSnapshot() {
    let snapshot = loadSnapshot();
    if (!snapshot || snapshot.expiresAt <= Date.now()) {
      snapshot = createSnapshot();
      saveSnapshot(snapshot);
    }

    activeSnapshot = snapshot;
    applySnapshot(snapshot);
    scheduleExpiry(snapshot);
    window.dispatchEvent(
      new CustomEvent("keijo:operation-status-change", { detail: snapshot })
    );
    return snapshot;
  }

  window.addEventListener("storage", (event) => {
    if (event.key !== operationData.storageKey) return;
    const snapshot = parseSnapshot(event.newValue);
    if (!snapshot || snapshot.expiresAt <= Date.now()) return;
    activeSnapshot = snapshot;
    window.name = `${windowNamePrefix}${event.newValue}`;
    applySnapshot(snapshot);
    scheduleExpiry(snapshot);
    window.dispatchEvent(
      new CustomEvent("keijo:operation-status-change", { detail: snapshot })
    );
  });

  refreshSnapshot();
  window.KEIJO_OPERATION_SYSTEM = {
    getSnapshot: () => activeSnapshot
  };
})();
