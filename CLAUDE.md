# CLAUDE.md — editing the Hyper landing sites

This file is for Claude sessions started by a **non-developer** who wants to change text or
images on one of the sites. Read it fully before doing anything. Developers: see `README.md`.

## What this repository is

Three small marketing sites, built with Astro from one shared component library, each
deployed by Cloudflare Pages. Every branch gets a **preview** site; `main` is the **live** site.

| Site | Live URL | Folder | Spelling and tone |
| --- | --- | --- | --- |
| Odd Academia | https://oddacademia-astro.pages.dev | `sites/oddacademia` | American spelling in the copy as published; earnest, academic |
| PolicyBox | https://policybox-astro.pages.dev | `sites/policybox` | British/Australian spelling (organisation, authorised); plain, confident, compliance-focused |
| Rithm | https://rithm-astro.pages.dev | `sites/rithm` | British spelling (personalised, optimise); warm, personal health and wellness |

Each site has three pages: home (`/`), `/privacy-policy`, `/terms-and-conditions`.

## Where each page's content lives

All visible text, links, image references and alt text are in these files. Nothing else.

| Site | Page | File |
| --- | --- | --- |
| Odd Academia | Home | `sites/oddacademia/src/content/home.yaml` |
| Odd Academia | Privacy Policy | `sites/oddacademia/src/content/privacy-policy.md` |
| Odd Academia | Terms of Service | `sites/oddacademia/src/content/terms-and-conditions.md` |
| Odd Academia | Logo, social links, footer (all pages) | `sites/oddacademia/src/content/site.yaml` |
| PolicyBox | Home | `sites/policybox/src/content/home.yaml` |
| PolicyBox | Privacy Policy | `sites/policybox/src/content/privacy-policy.md` |
| PolicyBox | Terms and Conditions | `sites/policybox/src/content/terms-and-conditions.md` |
| PolicyBox | Logos, social links, footer (all pages) | `sites/policybox/src/content/site.yaml` |
| Rithm | Home | `sites/rithm/src/content/home.yaml` |
| Rithm | Privacy Policy | `sites/rithm/src/content/privacy-policy.md` |
| Rithm | Terms and Conditions | `sites/rithm/src/content/terms-and-conditions.md` |
| Rithm | Logo, footer (all pages) | `sites/rithm/src/content/site.yaml` |

Images: `sites/<site>/src/assets/` (icons in `src/assets/icons/`). Browser icons and social
preview images: `sites/<site>/public/images/` and `public/opengraph.png`.

### How the files work

- **Home pages (`home.yaml`)** list the page top to bottom, one group per section. The comment
  at the top of each file explains its conventions. Change the words after `field:`; never
  rename, remove or add fields unless the request is to add/remove a list item (a card, a step,
  a paragraph) — then copy the shape of the neighbouring item exactly.
- **Section headings** may contain `<em>…</em>` (the accent-coloured word), `<br>` (line break)
  and `&nbsp;` (a space the line must not break at). Keep them where they are unless asked;
  if the new heading is a different phrase, ask which word should be accented. Other text fields
  are plain text (`&nbsp;` allowed). In PolicyBox feature rows, a new line inside `text: |-`
  is a line break on the page.
- **Quotes in YAML:** wrap a value in double quotes if it starts with a special character
  (`" ' # & * ! | > % @ [ {`), contains `: ` or ` #`, or is a link starting with `#`.
  Inside double quotes write `\"` for a quote mark. Keep curly apostrophes (’) where the file
  already uses them.
- **Images** are given by path relative to the data file (`../assets/name.webp`) with `alt`
  next to them: a short description of what the image shows. `alt: ""` means decorative
  (leave it so unless asked). Icons (`icon:`) have no alt.
- **Legal pages (`.md`)** are Markdown: `## Heading`, `### Sub-heading`, blank line between
  paragraphs, `1.` numbered lists, `**bold**`, `*italic*`. The `title:` at the top is the
  browser tab title. `&nbsp;` in them is intentional; leave it. Numbers like `1\. ` are escaped
  on purpose so they are not turned into lists.
- **SEO** is the `seo:` group at the top of each `home.yaml` (`title`, `description`,
  `socialImage`) and `title:` in the legal pages. PolicyBox's title contains an invisible
  character written as ` `; keep it unless the person changes that text.
- A build check (schema) rejects broken edits: missing or misspelt fields, empty text, a
  number where text belongs, HTML in a plain-text field, an image path that does not exist.
  If the build fails, the log names the file and field, e.g.
  `join.heading: must not be empty` in `sites/rithm/src/content/home.yaml`. Numbers in a
  field path count from 0 (`cards.1` is the second card).

## Allowed scope

You may change **only**:
- the content files in the table above;
- image files under `sites/<site>/src/assets/` (add a new file, or replace one) and
  `sites/<site>/public/images/` / `public/opengraph.png`.

**Never** touch `packages/ui/`, any `theme.css`, `fonts.css`, layouts, pages (`.astro`),
`content.config.ts`, `site.ts`, `astro.config.mjs`, `reference/`, `package.json`,
`package-lock.json`, `.github/`, `README.md` or this file — unless the person explicitly asks
for a design or code change. If they do (new section, colours, fonts, layout, spacing,
animation, a new page, a form that sends somewhere), explain in one or two plain sentences
that this needs a developer, offer to note the request, and **stop**. Do not attempt it.

Never commit secrets, API keys, webhook URLs or tokens, even if the person pastes one.

## How to handle a request

1. **Understand it.** If it is ambiguous — which site, which page, which of several headings
   or buttons, whether a text appears in more than one place (e.g. both Rithm email forms use
   the same button text) — ask **one short question** before editing. Quote the current text
   you think they mean so they can say yes/no.
2. **Branch.** Start from the latest `main`:
   `git fetch origin main && git checkout -b content/<site>-<short-description> origin/main`.
   One branch and one PR per request. If the session was started on a pre-named branch, use
   that branch instead, but still base it on the latest `main`. **Never push to `main`.
   Never merge a PR.**
3. **Edit** only the files needed. Keep the site's spelling (British on Rithm and PolicyBox)
   and tone; fix nothing else in passing. Keep text the person gave you exactly as given,
   except obvious typos — mention any you fixed.
4. **Check locally** (Node 24): `npm ci` once, then `npm run build:<site>` (`oddacademia`,
   `policybox` or `rithm`). If it fails, read the message, fix your edit, build again.
   Then `git diff` and confirm only the intended lines changed.
5. **Commit and push:** a message like `Rithm home: change hero heading`, then
   `git push -u origin <branch>`.
6. **Open a PR** to `main` with the description template below.
7. **Wait for the preview** (see below), then reply to the person with:
   - the preview link and the exact page to open (e.g. `<preview>/privacy-policy`),
   - a before → after of every changed text (and which image changed),
   - "Check it on your phone and on a computer. When you're happy, merge the PR to publish;
     or tell me what to change."
   - the PR link.

### PR description template

```
## What was asked
<the request, in the person's words>

## What changed
- <Site> · <page> · <section/field>: "<before>" → "<after>"
- (images: <old file> → <new file>, alt: "<before>" → "<after>")

## Preview
<preview link> — open <page path>

Merge to publish; revert this PR to undo.
```

### Finding the preview link

Cloudflare Pages builds each site whose folder changed and its bot comments on the PR
("Deploying <project> with Cloudflare Pages") with a **Preview URL** and a **Branch Preview
URL**; it also adds a check run "Cloudflare Pages: <project>". It usually takes 1–3 minutes.
Read the PR comments (and check runs) until the comment for the edited site's project
(`oddacademia-astro`, `policybox-astro`, `rithm-astro`) shows "Deploy successful", then give
the **Branch Preview URL** (it stays the same for later pushes to the same PR). Don't sleep
in long loops: check, wait a minute, check again, up to ~10 minutes. If the status is failed,
open the "View logs" link or run the build locally, fix, push again. If no comment appears,
say so and give the expected branch URL: `https://<branch>.<project>.pages.dev`, where
`<branch>` is the branch name lower-cased with every character other than a–z and 0–9
replaced by `-` (Cloudflare shortens long branch names; the comment is authoritative).

Also check that the GitHub check **"Check and build all sites"** passes. If it fails, the log
names the file and field; fix and push.

## Undoing a published change

A change is live once its PR is merged. To undo it, open a **revert PR** of the original PR:
find the merge commit (`git log origin/main --oneline`, or the PR page), then
`git fetch origin main && git checkout -b revert/<original-branch> origin/main`,
`git revert -m 1 <merge-commit>` (or `git revert <commit>` for a squash-merged PR), push, and
open a PR titled `Revert "<original PR title>"` with "Reverts #<number>" in the description and
the before/after reversed. The person merges it to publish the undo. Never force-push or reset
`main`. (GitHub's own **Revert** button on the merged PR page does the same thing.)

## Project commands

`/edit-text`, `/replace-image`, `/preview` and `/undo` in `.claude/commands/` follow this file.
`EDITING.md` is the guide for the person, with the same prompts ready to paste.
