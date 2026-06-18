(() => {
  "use strict";

  const data = window.KEIJO_DATA;
  if (!data) return;

  const qs = (selector, parent = document) => parent.querySelector(selector);
  const qsa = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  init();

  function init() {
    const dialog = ensureDialog();
    renderStatusDialog(dialog);
    updateOperationNavIcon();
    bindOperationTriggers(dialog);
  }

  function ensureDialog() {
    const existing = qs("#statusDialog");
    if (existing) return existing;

    document.body.insertAdjacentHTML(
      "beforeend",
      `
        <dialog class="status-dialog" id="statusDialog">
          <div class="dialog-header">
            <div>
              <small>TRAIN OPERATION STATUS</small>
              <h2>各線運行狀況</h2>
            </div>
            <button type="button" id="closeStatusDialog" aria-label="關閉">×</button>
          </div>
          <div class="dialog-body" id="statusLineList"></div>
          <div class="dialog-footer">
            <span id="dialogUpdatedTime"></span>
            <button type="button" class="primary-button" id="closeStatusDialogBottom">關閉</button>
          </div>
        </dialog>
      `
    );

    return qs("#statusDialog");
  }

  function renderStatusDialog(dialog) {
    const list = qs("#statusLineList", dialog);
    const updatedTime = qs("#dialogUpdatedTime", dialog);
    if (!list || !updatedTime) return;

    updatedTime.textContent = `資料時間：${data.updatedAt}`;
    list.innerHTML = data.lines
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

  function updateOperationNavIcon() {
    const state = getOperationState();
    getOperationLinks().forEach((link) => {
      const icon = qs(".nav-icon", link);
      if (!icon) return;

      icon.classList.remove("status-delay", "status-suspended");
      if (state === "delay") icon.classList.add("status-delay");
      if (state === "suspended") icon.classList.add("status-suspended");
    });
  }

  function bindOperationTriggers(dialog) {
    const triggers = new Set([
      ...getOperationLinks(),
      ...qsa("[data-operation-status-trigger]")
    ]);

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        openDialog(dialog);
      });
    });

    qsa("#closeStatusDialog, #closeStatusDialogBottom", dialog).forEach((button) => {
      button.addEventListener("click", () => closeDialog(dialog));
    });

    dialog.addEventListener("click", (event) => {
      const box = dialog.getBoundingClientRect();
      const outside =
        event.clientX < box.left ||
        event.clientX > box.right ||
        event.clientY < box.top ||
        event.clientY > box.bottom;
      if (outside) closeDialog(dialog);
    });
  }

  function getOperationLinks() {
    return qsa(".main-nav a").filter((link) =>
      link.textContent.trim().includes("運行資訊")
    );
  }

  function getOperationState() {
    if (data.lines.some((line) => line.status === "suspended")) return "suspended";
    if (data.lines.some((line) => line.status !== "normal")) return "delay";
    return "normal";
  }

  function openDialog(dialog) {
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
      return;
    }
    dialog.setAttribute("open", "");
  }

  function closeDialog(dialog) {
    if (dialog.open && typeof dialog.close === "function") {
      dialog.close();
      return;
    }
    dialog.removeAttribute("open");
  }
})();
