(() => {
  const button = document.querySelector<HTMLButtonElement>('#abrir');
  const nav = document.querySelector<HTMLElement>('#nav');
  if (!button || !nav) return;
  document.documentElement.classList.add('has-navigation');
  const close = (restore = false) => {
    button.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    if (restore) button.focus();
  };
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') close(true);
  });
  document.addEventListener('click', event => {
    if (!(event.target as Element).closest('.navbar')) close();
  });
  nav.addEventListener('focusout', () => {
    setTimeout(() => { if (!nav.contains(document.activeElement) && document.activeElement !== button) close(); }, 0);
  });
  matchMedia('(min-width: 960px)').addEventListener('change', () => close());
})();
