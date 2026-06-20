(() => {
  const tabs = Array.from(document.querySelectorAll('.route-button-grid [role="tab"]'));
  const panel = document.querySelector('#route-detail');

  if (!tabs.length || !panel) return;

  const badge = panel.querySelector('.route-detail-badge');
  const title = panel.querySelector('#route-detail-title');
  const englishName = panel.querySelector('.route-detail-english');
  const stationArea = panel.querySelector('.station-list-placeholder');
  const selectedRouteName = panel.querySelector('.selected-route-name');

  function selectRoute(tab) {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });

    const { routeNumber, routeName, routeEnglish, routeColor } = tab.dataset;
    badge.textContent = routeNumber;
    title.textContent = routeName;
    englishName.textContent = routeEnglish;
    selectedRouteName.textContent = routeName;
    panel.style.setProperty('--selected-line-color', routeColor);
    panel.setAttribute('aria-labelledby', tab.id);
    stationArea.hidden = false;
  }

  tabs.forEach((tab, index) => {
    tab.tabIndex = index === 0 ? 0 : -1;
    tab.addEventListener('click', () => selectRoute(tab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();

      let nextIndex = tabs.indexOf(tab);
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (nextIndex + 1) % tabs.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (nextIndex - 1 + tabs.length) % tabs.length;

      tabs[nextIndex].focus();
      selectRoute(tabs[nextIndex]);
    });
  });
})();
