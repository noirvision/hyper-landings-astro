---
description: Replace an image on one of the sites, with its alt text
argument-hint: <site> <page> <which image> <new image file or path> [new alt text]
---

Replace an image on one of the sites, following CLAUDE.md exactly.

Request: $ARGUMENTS

1. Read CLAUDE.md. Identify the site, page and which image (find its `src:`/`icon:` entry in
   the page's content file, or `site.yaml` for logos and footer images). If unclear, ask me one
   short question listing the candidate images with their current alt text, and wait.
2. Get the new image: a file I attached or uploaded to the repo, or a path already in the
   repo. If there is no file, ask for it. Accept PNG, JPG, WebP, AVIF or SVG. Keep a similar
   shape (aspect ratio) to the old image and tell me if it is very different; the page
   layout will not change to fit it.
3. Create a new branch from the latest main (`content/<site>-image-<short-description>`).
4. Save the file under `sites/<site>/src/assets/` (icons under `src/assets/icons/`) with a
   short lowercase name with hyphens; do not delete the old file. Point the `src:` (or `icon:`)
   entry to it. Update `alt:` to describe the new image (use my alt text if given; otherwise
   write one in the site's spelling and ask me to confirm it in the reply). Keep `alt: ""`
   only for decorative images.
5. Run `npm run build:<site>`; fix any error it names. Check `git diff`.
6. Commit, push, open a PR to main with the CLAUDE.md template (old file → new file,
   alt before → after).
7. Wait for the Cloudflare preview, then reply with the preview link, the page to open, what
   changed, the PR link, and "Merge to publish; revert this PR to undo." Never merge.
