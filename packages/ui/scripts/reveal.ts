/**
 * Scroll reveal: CSS transitions (tokens/base.css) toggled by IntersectionObserver.
 *
 * An element with [data-reveal] gets .is-revealed once its top edge passes
 * `data-reveal-offset` percent of the viewport height above the bottom edge
 * (default 20, as in the Webflow "scroll into view" triggers). Runs once per
 * element. Nothing is hidden unless this script runs, and the CSS only hides
 * on desktop without reduced motion, so here we just reveal everything else.
 *
 * An element can also be scrolled past without ever intersecting (fast
 * scrolling, the End key, an anchor jump, a restored scroll position). On load
 * and after every scroll, any element still pending that is already above the
 * viewport is revealed at once, without a transition (.ui-reveal-instant) —
 * it is off-screen, so nobody would see the animation, and it must not stay
 * hidden for when the visitor scrolls back up.
 */
const elements = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
const motionOk =
  window.matchMedia('(min-width: 992px)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (elements.length && motionOk && 'IntersectionObserver' in window) {
  const pending = new Set<HTMLElement>();
  const observers = new Map<string, IntersectionObserver>();
  const reveal = (el: HTMLElement, instant = false) => {
    if (instant) el.classList.add('ui-reveal-instant');
    el.classList.add('is-revealed');
    pending.delete(el);
    observers.get(el.dataset.revealOffset ?? '20')?.unobserve(el);
  };
  const observerFor = (offset: string) => {
    let observer = observers.get(offset);
    if (!observer) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && pending.has(entry.target as HTMLElement)) reveal(entry.target as HTMLElement);
          }
        },
        { rootMargin: `0px 0px -${offset}% 0px` },
      );
      observers.set(offset, observer);
    }
    return observer;
  };

  // Reveal, without animation, whatever is still pending but already above the viewport.
  const sweep = () => {
    for (const el of pending) if (el.getBoundingClientRect().bottom < 0) reveal(el, true);
    if (!pending.size) {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pageshow', sweep);
    }
  };
  let frame = 0;
  const onScroll = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(sweep);
  };

  for (const el of elements) {
    pending.add(el);
    observerFor(el.dataset.revealOffset ?? '20').observe(el);
  }
  sweep();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('pageshow', sweep);

  // Apply the hidden state at once, not as a 1s fade-out: transitions are off
  // (.ui-reveal-init, tokens/base.css) until the styles have been flushed.
  const root = document.documentElement;
  root.classList.add('ui-reveal-init', 'ui-reveal-ready');
  void getComputedStyle(elements[0]).opacity;
  root.classList.remove('ui-reveal-init');
}
