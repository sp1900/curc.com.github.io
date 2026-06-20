(() => {
  "use strict";

  const data = window.KEIJO_NEWS_DATA;
  const announcementList = document.querySelector("#announcementList");
  if (!data || !announcementList) return;

  const categories = new Map(data.categories.map((category) => [category.id, category]));
  const items = [...data.items].sort((a, b) => {
    const dateOrder = b.date.localeCompare(a.date);
    return dateOrder || b.id.localeCompare(a.id);
  });

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderNewsItem(item) {
    const category = categories.get(item.category);
    return `
      <a class="news-item" href="${escapeHtml(item.url)}" data-category="${escapeHtml(item.category)}">
        <time class="news-date" datetime="${escapeHtml(item.date.replaceAll(".", "-"))}">${escapeHtml(item.date)}</time>
        <span class="news-category">${escapeHtml(category?.label || item.category)}</span>
        <span class="news-title">${escapeHtml(item.title)}</span>
        <span class="news-arrow" aria-hidden="true">›</span>
      </a>
    `;
  }

  announcementList.innerHTML = items.map(renderNewsItem).join("");

  document.querySelectorAll("[data-news-category-list]").forEach((list) => {
    const categoryItems = items.filter(
      (item) => item.category === list.dataset.newsCategoryList
    );

    list.innerHTML = categoryItems.length
      ? categoryItems
          .map(
            (item) =>
              `<a href="${escapeHtml(item.url)}"><time datetime="${escapeHtml(item.date.replaceAll(".", "-"))}">${escapeHtml(item.date)}</time>${escapeHtml(item.title)}</a>`
          )
          .join("")
      : "<p>目前沒有新的公告。</p>";
  });

  const updated = document.querySelector("#newsDataUpdated");
  if (updated && items[0]) updated.textContent = `更新日期：${items[0].date}`;
})();
