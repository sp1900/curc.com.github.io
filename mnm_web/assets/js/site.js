(() => {
  const header = document.querySelector('.site-header');
  const brandRow = header?.querySelector('.brand-inner');
  const navigation = header?.querySelector('.main-nav');

  if (!header || !brandRow || !navigation) return;

  document.documentElement.classList.add('has-mobile-nav');
  navigation.id = navigation.id || 'primary-navigation';

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'mobile-nav-toggle';
  toggle.setAttribute('aria-controls', navigation.id);
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<span class="mobile-nav-icon" aria-hidden="true"></span><span>選單</span>';

  brandRow.insertBefore(toggle, brandRow.querySelector('.site-search'));

  function setOpen(open) {
    navigation.classList.toggle('is-open', open);
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a') && window.matchMedia('(max-width: 680px)').matches) {
      setOpen(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  window.matchMedia('(min-width: 681px)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
})();
