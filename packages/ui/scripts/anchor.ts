/**
 * In-page links (href="#id"): scroll to the target and move focus into it —
 * to its first visible form field when it holds a form (e.g. "Join" buttons
 * → the waitlist), otherwise to the target itself. Smooth scrolling comes from
 * `scroll-behavior` in tokens/base.css and is off with prefers-reduced-motion.
 */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.addEventListener('click', (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="#"]');
  const id = link && decodeURIComponent(link.hash.slice(1));
  const target = id ? document.getElementById(id) : null;
  if (!target) return;
  event.preventDefault();

  target.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
  if (location.hash !== `#${id}`) history.pushState(null, '', `#${id}`);

  const field = [...target.querySelectorAll<HTMLElement>('input:not([type="hidden"]), select, textarea')].find(
    (el) => !el.closest('[hidden]'),
  );
  if (field) {
    field.focus({ preventScroll: true });
  } else {
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
});
