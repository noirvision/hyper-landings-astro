/**
 * Scroll-snap slider: the track scrolls natively (swipe, trackpad, keyboard);
 * this script only wires the dots and arrow keys.
 *
 * Markup: [data-ui-slider] > [data-ui-slider-track] > slides,
 *         [data-ui-slider] > [data-ui-slider-dots] > button × slides.
 * When the track doesn't scroll (e.g. it's a grid on desktop) the dots are
 * hidden by CSS and nothing here has any visible effect.
 */
for (const slider of document.querySelectorAll<HTMLElement>('[data-ui-slider]')) {
  const track = slider.querySelector<HTMLElement>('[data-ui-slider-track]');
  const dots = [...slider.querySelectorAll<HTMLButtonElement>('[data-ui-slider-dots] button')];
  if (!track) continue;
  const slides = [...track.children] as HTMLElement[];

  const setActive = (index: number) => {
    dots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle('is-active', active);
      if (active) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    slides.forEach((slide, i) => slide.toggleAttribute('inert', i !== index && isScrollable()));
  };
  const isScrollable = () => track.scrollWidth > track.clientWidth + 1;
  const current = () => Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
  const goTo = (index: number) => {
    const target = slides[Math.max(0, Math.min(slides.length - 1, index))];
    if (!target) return;
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: smooth ? 'smooth' : 'auto' });
  };

  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
  track.addEventListener('keydown', (event) => {
    if (!isScrollable()) return;
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (step) {
      event.preventDefault();
      goTo(current() + step);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      goTo(event.key === 'Home' ? 0 : slides.length - 1);
    }
  });

  let frame = 0;
  const update = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => setActive(current()));
  };
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  setActive(0);
}
