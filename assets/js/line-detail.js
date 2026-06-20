(() => {
  "use strict";

  const data = window.KEIJO_DATA;
  if (!data) return;

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

  renderLineStatus();
  window.addEventListener("keijo:operation-status-change", renderLineStatus);
})();
