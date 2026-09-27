# Brief D: edit-by-chat workflow for non-developers

## Context
Monorepo `noirvision/hyper-landings-astro`: shared library `packages/ui` and
three live sites (`sites/oddacademia`, `sites/policybox`, `sites/rithm`) on
Cloudflare Pages. Every branch gets a Cloudflare preview; production deploys
from `main`. Read `README.md` and `briefs/` first.

Goal: a non-technical person opens Claude Code in the browser, picks this
repo, writes "On the Rithm home page, change the hero heading to X", and gets a
pull request with a preview link to check before anything goes live. Nobody
edits code by hand; nothing reaches `main` without a PR.

This session is a refactor plus tooling. The three sites must not change
visually at all.

## Preflight — do this first
- Create your working branch and push it immediately. If the push fails,
  stop and tell me before doing any work.
- Build all three sites on main and keep screenshots of every page at 1440,
  1024, 768 and 390 as baselines. Also keep the built HTML for a text diff.

## 1. Content out of code
- Move every piece of visible copy on all 9 pages into data files, one file per
  page, per site: headings, paragraphs, button labels, placeholders, alt text,
  link targets, form messages, footer texts, SEO title/description/OG.
- Use Astro content collections with a schema (zod) for each page, so a broken
  edit (missing field, wrong type, empty heading) fails the build, and therefore
  fails the preview, instead of reaching the live site.
- Landing pages: YAML is fine; pick the format a non-developer reads most
  easily and justify it. Legal pages: Markdown.
- Images referenced from data files by path, with alt text next to them.
- Components and pages only read data; no copy left hard-coded in `.astro`
  files of the sites (library defaults like aria labels may stay).
- Result check: the built HTML of all 9 pages is identical to the baseline
  (after normalising hashed file names), and screenshots are pixel-identical.

## 2. CLAUDE.md (repo root)
Written for Claude sessions started by a non-developer. It must cover:
- What the repo is, the three sites and their live URLs.
- Where each page's content lives (a table: site, page, file).
- The allowed scope: content files and images under the sites' asset folders.
  Never touch `packages/ui`, `theme.css`, layouts, configs, `reference/`,
  `package*.json` or CI, unless the person explicitly asks for a design or
  code change — then explain that it needs a developer and stop.
- Always: new branch, one PR per request, never push to `main`, never merge.
- Keep each site's spelling (British on Rithm and PolicyBox) and tone.
- After pushing: wait for the Cloudflare preview, then reply with the preview
  link, the page to open, and a before/after of every changed text.
- PR description template: what was asked, what changed (before → after),
  preview link, and "Merge to publish; revert this PR to undo".
- If a request is ambiguous (which page, which heading), ask one short
  question before editing.
- How to undo a published change: open a revert PR of the original PR.

## 3. Commands
Add project commands in `.claude/commands/`:
- `edit-text` — change a text on a page (site, page, what, new text).
- `replace-image` — replace an image and its alt text.
- `preview` — find and return the preview link for the current PR.
- `undo` — open a revert PR for a merged content PR.
Each command follows CLAUDE.md and ends with the preview link.
Some browser setups may not load project commands, so also put each command's
full text as a ready-to-paste prompt in the editor guide (below).

## 4. Checks on every PR
- GitHub Actions workflow on pull requests: `npm ci`, `astro check` for all
  sites and the library, and the build of all three sites. Name the job clearly
  (it will become a required check).
- The content schema must make the build fail with a readable message that
  names the file and field.

## 5. Editor guide
`EDITING.md` for a non-technical person, short and in plain English:
- Open Claude Code in the browser, pick the repo, write the request (with
  three example requests).
- Open the preview link, check the page on phone and desktop.
- Merge to publish (with the exact buttons on GitHub), or ask Claude to change
  it again.
- Undo a published change.
- What to do if the preview fails.
- The ready-to-paste prompts for the four commands.

## 6. Prove it works
- Do one real sample edit through the documented flow, in a separate branch
  and PR from your main PR: change one short text on the Rithm home page.
  Show that the diff touches only that content file and that the built HTML
  differs only in that string. Leave that sample PR open (do not merge) and
  link it in your report.
- Show a failing case: an edit that breaks the schema makes the build fail
  with a readable message (do this locally, don't push it).

## Verification
- All 9 pages: pixel-identical to the baselines at all four widths, built HTML
  identical after normalisation.
- `astro check` clean; clean-clone build of all three sites with the exact
  Pages commands; the new workflow passes on your PR.
- No secrets anywhere.
- Background jobs: record each background process's PID from `$!` at launch and
  wait on it with an exit condition tied to the process dying (`wait` /
  `kill -0 PID` check), not only to an expected string in its output. Don't
  find your own processes with `pgrep` patterns. Stop every server you started
  before finishing.

## Delivery
- PR to `main` with a full description. Move this file to `briefs/brief-d.md`
  in the PR.
- Report: the content format and why, the file table, the schema approach,
  CLAUDE.md summary, the commands, the workflow name, both proofs (sample PR
  link, failing-build message), regression results, and the exact branch
  protection settings you recommend for `main` (I will set them myself).
- Do not offer to watch the PR.
