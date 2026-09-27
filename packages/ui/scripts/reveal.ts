/**
 * Scroll reveal: CSS transitions (tokens/base.css) toggled by IntersectionObserver.
 *
 * An element with [data-reveal] gets .is-revealed once its top edge passes
 * `data-reveal-offset` percent of the viewport height above the bottom edge
 * (default 20, as in the Webflow "scroll into view" triggers). Runs once per
 * element. Nothing is hidden unless this script runs, and the CSS only hides
 * on desktop without reduced motion, so here we just reveal everything else.
 */
const elements = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
const motionOk =
  window.matchMedia('(min-width: 992px)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (elements.length && motionOk && 'IntersectionObserver' in window) {
  const observers = new Map<string, IntersectionObserver>();
  const observerFor = (offset: string) => {
    let observer = observers.get(offset);
    if (!observer) {
      observer = new IntersectionObserver(
        (entries, obs) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        },
        { rootMargin: `0px 0px -${offset}% 0px` },
      );
      observers.set(offset, observer);
    }
    return observer;
  };

  for (const el of elements) {
    // Anything already above the viewport (e.g. a restored scroll position) shows at once.
    if (el.getBoundingClientRect().bottom < 0) el.classList.add('is-revealed');
    else observerFor(el.dataset.revealOffset ?? '20').observe(el);
  }
  // Apply the hidden state at once, not as a 1s fade-out: transitions are off
  // (.ui-reveal-init, tokens/base.css) until the styles have been flushed.
  const root = document.documentElement;
  root.classList.add('ui-reveal-init', 'ui-reveal-ready');
  void getComputedStyle(elements[0]).opacity;
  root.classList.remove('ui-reveal-init');
}
