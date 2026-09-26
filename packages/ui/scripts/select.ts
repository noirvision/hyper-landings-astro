/**
 * Native <select> helpers for [data-ui-select]:
 * - mirrors "placeholder shown" into data-empty so CSS can style it;
 * - after a back/forward-cache restore, puts the form back on its placeholder
 *   (the browser would otherwise keep the last choice), like a fresh load.
 */
const selects = [...document.querySelectorAll<HTMLSelectElement>('select[data-ui-select]')];
const sync = (select: HTMLSelectElement) => {
  select.dataset.empty = String(select.value === '');
};

for (const select of selects) {
  sync(select);
  select.addEventListener('change', () => sync(select));
}

window.addEventListener('pageshow', (event) => {
  if (!event.persisted) return;
  for (const select of selects) {
    select.selectedIndex = 0;
    sync(select);
  }
});
