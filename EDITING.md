# Editing the sites — a guide for non-developers

You can change the text and images on the three sites (Odd Academia, PolicyBox and Rithm) by
asking Claude in plain English. Claude makes the change on a copy, gives you a **preview
link** to check, and nothing goes live until you press **Merge** on GitHub.

Live sites: https://oddacademia-astro.pages.dev · https://policybox-astro.pages.dev ·
https://rithm-astro.pages.dev

## 1. Ask for the change

1. Go to **https://claude.ai/code** and sign in.
2. Pick the repository **noirvision/hyper-landings-astro** and start a new session.
3. Write what you want, naming the **site**, the **page** and the **text**. For example:
   - "On the Rithm home page, change the hero heading to *Know your body*."
   - "On the PolicyBox home page, change the button *Click here* to *Talk to us*."
   - "Replace the photo in the Odd Academia *Key Features* section with the attached image;
     it shows a researcher reading at a desk."

   More examples: "Update the copyright year in the Rithm footer to 2027", "Fix the typo
   'amanner' in the Rithm privacy policy".
4. If Claude asks a question (for example, which of two headings you mean), answer it.
5. Claude replies with a **preview link**, the page to open, and a before → after of every
   change, plus a link to the **pull request** (PR) — the proposed change on GitHub.

One request = one PR. For a second, unrelated change, start a new request.

## 2. Check the preview

Open the preview link (and the page Claude names). Check it **on your phone and on a
computer**: the new text is right, nothing else moved, the page looks normal. The preview is
a private copy; the live site hasn't changed.

Not right? Tell Claude in the same session, e.g. "Make it shorter" or "Use a capital K". It
updates the same PR and gives you the preview link again.

## 3. Publish (merge)

1. Open the PR link Claude gave you (you must be signed in to GitHub).
2. Scroll to the bottom. Wait until the checks show a green tick (**All checks have
   passed**), including **Check and build all sites**.
3. Click the green **Merge pull request** button (it may say **Squash and merge**), then
   **Confirm merge**.
4. The live site updates within a few minutes. Reload it to see the change (you may need a
   hard refresh).

To drop a change instead, click **Close pull request** at the bottom of the PR.

## 4. Undo a published change

Ask Claude: "Undo the change from PR #12" (or describe it: "undo yesterday's change to the
Rithm hero heading"). Claude opens a new PR that puts the old text back and gives you a
preview link. Check it, then merge it as in step 3.

Alternatively, on GitHub: open the merged PR, click **Revert** near the bottom, then **Create
pull request**, and merge that new PR.

## 5. If the preview fails

- The PR shows a **red cross**, or Claude says the preview failed: usually the edit broke a
  rule (an empty heading, a missing image). Tell Claude "The preview failed, please fix it" —
  it reads the error, which names the file and the field, and fixes it.
- No preview link after about 10 minutes: ask Claude "What is the preview link for my PR?"
  (or use the `/preview` prompt below).
- Claude says the request "needs a developer": that is a design or code change (new
  sections, colours, fonts, layout, forms). Send the request to your developer.
- Never merge a PR with a red cross — nothing broken can reach the live site as long as you
  only merge green PRs.

## 6. Ready-to-paste prompts

### Change a text

In Claude Code, type `/edit-text` followed by your request. If that doesn't work, paste this instead and fill in the part in brackets:

```text
Change a text on one of the sites, following CLAUDE.md exactly.

Request: [site, page, which text, new text — e.g. Rithm, home page, hero heading, "Feel your best"]

1. Read CLAUDE.md. Identify the site (Odd Academia, PolicyBox or Rithm), the page (home,
   privacy policy, terms) and the exact text to change, using the content file table. Open
   that file and find the current text. If the site, page or text is missing or ambiguous
   (several matches, or the text is also used elsewhere), ask me one short question, quoting
   the candidates, and wait.
2. If the request is really a design or code change, say it needs a developer and stop.
3. Create a new branch from the latest main (`content/<site>-<short-description>`).
4. Change only that text in the content file. Keep the site's spelling and tone, the
   heading markup (`<em>`, `<br>`, `&nbsp;`) unless told otherwise, and YAML quoting rules.
5. Run `npm ci` (if needed) and `npm run build:<site>`; fix any error it names. Check
   `git diff` touches only the intended line(s).
6. Commit, push, and open a PR to main with the CLAUDE.md description template.
7. Wait for the Cloudflare preview of that site, then reply with: the preview link and the
   page to open, the before → after text, the PR link, and "Merge to publish; revert this PR
   to undo." Never merge.
```

### Replace an image

In Claude Code, type `/replace-image` followed by your request. If that doesn't work, paste this instead and fill in the part in brackets:

```text
Replace an image on one of the sites, following CLAUDE.md exactly.

Request: [site, page, which image, the new image (attach it), new description — e.g. PolicyBox, home page, the "How it works" screenshot, attached file, "PolicyBox onboarding checklist"]

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
```

### Get the preview link

In Claude Code, type `/preview` followed by your request. If that doesn't work, paste this instead and fill in the part in brackets:

```text
Find the preview link for a pull request, following CLAUDE.md ("Finding the preview link").

PR: [PR number or link, or leave empty] (if empty: the open PR for the current branch; if there is none, ask me which).

1. Find the PR and the site(s) it changes (from its files: `sites/<site>/...`).
2. Read the PR comments from the Cloudflare Pages bot ("Deploying <site>-astro with Cloudflare
   Pages") and the "Cloudflare Pages: <project>" check runs. If a deploy is still in progress,
   check again every minute for up to ~10 minutes.
3. Reply with, per changed site: the Branch Preview URL and the page(s) to open, the deploy
   status, and whether the "Check and build all sites" check passed. If a deploy failed, say
   so plainly, find why (the logs or a local `npm run build:<site>`), and offer to fix it.
4. End with the preview link.
```

### Undo a published change

In Claude Code, type `/undo` followed by your request. If that doesn't work, paste this instead and fill in the part in brackets:

```text
Undo a published (merged) change by opening a revert PR, following CLAUDE.md ("Undoing a
published change").

Change to undo: [PR number or link, or describe the change — e.g. the Rithm hero heading change from yesterday]

1. Find the merged PR. If I described the change instead of giving a number, list the
   matching recently merged PRs (title, date, what changed) and ask me to confirm which one.
   If the PR is not merged yet, don't revert: say it is not live and offer to close it instead.
2. Create a branch from the latest main (`revert/<original-branch>`) and revert the PR's
   merge commit (`git revert -m 1 <merge-commit>`, or `git revert <commit>` if it was
   squash-merged). If later changes conflict with the revert, stop and explain in plain words.
3. Run `npm run build:<site>`; check `git diff` is exactly the original change in reverse.
4. Push and open a PR titled `Revert "<original title>"`, with "Reverts #<number>" and the
   before → after (the other way round) in the description, plus "Merge to publish the undo."
5. Wait for the Cloudflare preview, then reply with the preview link, the page to open, what
   will go back to what, and the PR link. Never merge.
```
