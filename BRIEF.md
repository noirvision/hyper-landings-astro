# Brief B: Policy Box on the shared library

## Context
Monorepo `noirvision/hyper-landings-astro`: shared library `packages/ui`
(@noirvision/ui), first site `sites/oddacademia` (merged in PR #1, live at
https://oddacademia-astro.pages.dev). Read `README.md` and the library code
before you start; the library's conventions are the rules here.

This session: add Policy Box as the second site, `sites/policybox`, 3 pages
(index, privacy-policy, terms-and-conditions), built from the library.
Reference: `reference/policybox/` — the Webflow export, published Sep 26, 2026.
Its texts match the live site (policybox.webflow.io) except for the fixes listed
below. The live site is probably blocked by your network; serve the export
locally and use it as the visual target, as in session A. If its CDN scripts
(jQuery, nice-select) are blocked, the static layout is still the target.

A third site (Rithm, dark theme) comes next, so keep every addition generic.

## Preflight — do this first
- Create your working branch and push it immediately. If the push fails
  (403 or similar), stop and tell me before doing any work.
- Run `npm run build:oddacademia` on main as a baseline and keep screenshots of
  the Odd Academia build at 1440 and 390 (all 3 pages) for the regression check.

## Library rules
- Reuse existing components. Where Policy Box differs, extend a component with
  a prop or variant instead of copying it. Add a new component only for a truly
  new section type; name it by role, never by site.
- No site names or site values inside `packages/ui`. Sites set tokens in
  `theme.css` and data in `content.ts`, as Odd Academia does.
- Site-only styles only for one-off decoration; list each one in the report.
- Any change to a shared component must leave Odd Academia visually unchanged,
  except the ring fix below. Compare its new build against the baseline
  screenshots and report any difference.

## Sections (suggested mapping — decide and justify in the report)
- Header: logo + social icons → `Header`.
- Hero: left-aligned two-line heading with a lighter first line ("Decisions" /
  "made simple"), two paragraphs, product screenshot on the right in
  perspective, bleeding off the edge → a variant of `Hero`.
- "Find out more": one-row form — select (placeholder "Insert your industry";
  options User, Partner, Investor), email ("Insert your email"), button
  "Join Waitlist" → `WaitlistForm`. Give the section `id="waitlist"`.
- "Why choose PolicyBox?": four cards of mixed sizes, each with icon, title,
  text and a product image → a `FeatureGrid` variant or a new grid component.
- "How it works for AML": three numbered steps with a vertical line, product
  image on the right → a `Steps` variant.
- "Elaboration on Features": alternating rows with product images → `FeatureRows`.
- "Alternate Uses": heading and two paragraphs on the left, five icon items in
  a grid on the right → new library component.
- "White Label Opportunities": centred heading, one line, button → a small
  CTA section (new component, or `Section` + `SectionHeading` + `Button`).
- "Find out more about our AML Stream": blue panel, heading, line, two cards
  with icon, title, text and button → an `AudienceCards` variant.
- Footer: dark, logo, email, "Launched with Hyper", socials, copyright, legal
  links → `Footer`, themed by tokens.
The product screenshots stay images; only the page's own text must be HTML.

## Interactions
- Read the export's IX2 data (in its webflow.js) and match distance, duration,
  easing, trigger and delays with the library's reveal, as in session A.
- Dropdown: native select, placeholder not selectable, same as Odd Academia.
- Form: no network request; show the success message; TODO for the webhook.
- "Click here" and both "Find out More" buttons scroll to `#waitlist`; smooth
  scrolling off under reduced motion; focus lands on the first form field.

## Content fixes (exhaustive — no other copy changes)
1. Footer copyright: ©2025 → ©2026 on all three pages.
2. "Al" written with a lowercase L where "AI" is meant → "AI": the hero
   paragraph (twice) and the "For AML Users" card. Search the whole export
   for other cases and list every fix.
3. Privacy page: remove the empty `<h2>` (a zero-width joiner) under the title.
4. Footer "|" between the legal links: follow the export's CSS (it is not
   visible on the live site); report what you did.
5. Links: logo → "/"; "Click here" and both "Find out More" → "#waitlist".
6. Footer credit line: "Portfolio rebuild by noirvision — original built in
   Webflow for Hyper."
Keep the original title, description and OG tags.

## Carry-over from session A
- `Steps`: the nodes on the connecting line are filled navy; in the original
  they are transparent rings. Fix it in the library. This is the one intended
  visual change to Odd Academia.

## SEO / indexing / repo
- noindex both ways (`_headers` + meta), `_redirects` for the `.html` URLs,
  exactly as Odd Academia.
- No secrets, webhook URLs or tokens anywhere.
- Update the README: the Policy Box row, its Pages settings, any new
  component and its props.

## Verification
- Screenshots at 1440 and 390 of all 3 pages vs the local export. Static
  layout should match; do not chase image re-encoding noise or 1px rounding.
- Odd Academia regression check against the baseline (see Library rules).
- No JS errors; reveal, select, form, scroll-to-form and reduced motion work.
- Lighthouse before (export) and after (new build), mobile and desktop.
- `astro check` clean; a clean-clone build with the exact Pages command.
- If the network blocks a tool, name the host and continue.
- Background jobs: record each background process's PID from `$!` at launch and
  wait on it with an exit condition tied to the process dying (`wait` /
  `kill -0 PID` check), not only to an expected string in its output. Don't
  find your own processes with `pgrep` patterns. Stop every server you started
  before finishing.

## Delivery
- PR to `main` with a full description.
- Report: new and changed components with props, what stayed site-only and why,
  the Odd Academia regression result, visible differences, JS/CSS weight
  before/after, Lighthouse before/after, content changes, and the Pages settings
  table for Policy Box (project name `policybox-astro`; watch paths
  `sites/policybox/*`, `packages/ui/*`, `package.json`, `package-lock.json`,
  `.nvmrc`).
- Do not offer to watch the PR.
