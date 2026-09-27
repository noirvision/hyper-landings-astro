/**
 * Waitlist forms ([data-ui-waitlist]): no network request. On a valid submit
 * the form is hidden and the success message shown and focused.
 */
for (const block of document.querySelectorAll<HTMLElement>('[data-ui-waitlist]')) {
  const form = block.querySelector('form');
  const done = block.querySelector<HTMLElement>('[data-ui-waitlist-success]');
  if (!form || !done) continue;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // TODO: connect the waitlist webhook here. POST `new FormData(form)` to a
    // Cloudflare Pages Function that reads the webhook URL from a Pages
    // environment variable. Never commit endpoints or keys to the repo.

    form.hidden = true;
    done.hidden = false;
    done.focus();
  });
}
