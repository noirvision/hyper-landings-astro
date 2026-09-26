# Brief A: Hyper landings monorepo + shared UI library, rebuilt Odd Academia

## Context
Repo `noirvision/hyper-landings-astro` (public, currently only this brief).
Goal of the series: a monorepo of Hyper landing pages, originally built in Webflow,
rebuilt in Astro on one shared component library with per-site themes — so a new
landing is assembled from existing components instead of copied.

Starting point: `noirvision/oddacademia-astro` (public) — a finished 1:1 Astro
migration of the Odd Academia landing (3 pages), still using Webflow CSS,
webflow.js and jQuery. Its `source/` folder is the original Webflow export.
Live reference: https://oddacademia-astro.pages.dev

This session: set up the monorepo and the shared library, and rebuild Odd Academia
on it. The next session will add Policy Box from the same library; a third site
(Rithm, dark theme) comes later. Design the library for that range: light and dark
themes, different fonts and accent colours, same section types.

## Preflight — do this first
- Create your working branch and push it immediately. If the push fails
  (403 or similar), stop and tell me before doing any work.
- Clone `https://github.com/noirvision/oddacademia-astro` (public) as reference.
  If cloning is blocked, stop and tell me.

## Structure
```
package.json           npm workspaces: packages/*, sites/*
packages/ui/           shared library (@noirvision/ui)
  tokens/              base tokens as CSS custom properties
  components/          section and element components (.astro)
  layouts/             base layout (head, meta, fonts, noindex, credit line)
  scripts/             small vanilla JS: reveal-on-scroll, select, slider
sites/oddacademia/     the site: pages, content, images, theme
  src/theme.css        site tokens only (colours, fonts, radii, shadows…)
reference/oddacademia/ copy of the original Webflow export (from source/)
```
- Latest stable Astro, static output, npm workspaces, **Node 24** (engines, .nvmrc).
- `site` for Odd Academia: `https://oddacademia-astro.pages.dev`.

## Library rules
- Components own their markup and styles (scoped `<style>`), and read every
  visual decision from CSS custom properties. No Webflow class names or Webflow
  CSS in the library.
- Sites pass content through props and slots, and set tokens in `theme.css`.
  A site must not override component internals.
- Components needed for Odd Academia, named by role not by site: header, hero with
  product visual, waitlist form (dropdown + email + button; also a single-field
  variant), feature grid ("Why choose"), steps ("How it works"), alternating
  feature rows (text + image, flip), audience CTA cards ("Join us"), footer
  (landing and legal variants, with "Launched with Hyper"), legal page layout,
  social links, section heading, button, image (wrapping `<Picture>`).
- Keep the component count honest: extract what is reusable; keep one-off markup
  in the site.

## Interactions — replace Webflow
- No webflow.js, no jQuery, no nice-select in the result.
- Scroll reveal: CSS + IntersectionObserver, respects `prefers-reduced-motion`.
  Match the original's feel (direction, distance, duration, stagger) closely, not
  frame-exactly.
- Dropdown: native `<select>` styled to match the original.
- Mobile slider: CSS scroll-snap + dots, keyboard accessible.
- Forms: no network request on submit — show the success state, hide the form,
  TODO where a webhook will be connected. No `action` attribute.

## Images, SEO, content
- `astro:assets` `<Picture>`: AVIF + WebP, `fallbackFormat` WebP, responsive
  widths, width/height, lazy below the fold, eager + `fetchpriority="high"` for the
  hero. Do not use `display: contents` on `<picture>` in flex/grid.
- `noindex` via `_headers` (`X-Robots-Tag: noindex` for `/*`) and meta robots;
  original title/description/OG. `_redirects` for old `.html` URLs.
- Credit line in footer: "Portfolio rebuild by noirvision — original built in
  Webflow for Hyper."
- Fix obvious typos ("independent thinks") and remove Webflow placeholder text in
  the terms page ("you may not:some text"). Never invent copy or legal text. List
  every content change.

## Deploy setup (for me, after merge)
- Each site gets its own Cloudflare Pages project connected to this repo. Work out
  the exact settings that build one site from the monorepo root (build command,
  output directory, root directory, `NODE_VERSION=24`, build watch paths so a
  change to one site doesn't rebuild the others, while a change to `packages/ui`
  rebuilds all). Verify the build command works locally from a clean clone, then
  write the settings in README as a per-site table.

## Repo hygiene
- `.gitignore`: node_modules, dist, .astro, .DS_Store, *.zip.
- No secrets, webhook URLs, keys or tokens. Secrets scan before the final push.
- Before overwriting any existing file, read it and merge.
- README: purpose of the monorepo, structure, how to add a new site (step by step,
  written for someone who will do it with Claude Code), run/build, deploy table,
  "Design and content © their respective owners. Rebuilt by noirvision for
  portfolio purposes."

## Verification (keep it proportionate)
- Clean build of the site from the repo root.
- Screenshots at 1440px and 390px of all 3 pages vs the live reference
  (https://oddacademia-astro.pages.dev). Static layout should match; do not chase
  image re-encoding noise or 1px rounding. Animations: check they run and feel
  similar; describe any visible difference.
- No JS errors; reveal, select, slider and form work; reduced-motion respected.
- Lighthouse on the new build vs the live reference (`npx lighthouse` is fine).
  The SEO score is capped by the intentional noindex — expected.
- If the network blocks a tool, name the host and continue.
- Background jobs: record each background process's PID from `$!` at launch and wait
  on it with an exit condition tied to the process dying (`wait` / `kill -0 PID`
  check), not only to an expected string in its output. Don't find your own
  processes with `pgrep` patterns. Stop every server you started before finishing.

## Delivery
- PR to `main` with a full description.
- Report: library structure and component list with props, what stayed site-only
  and why, interaction replacements and any visible differences, JS/CSS weight
  before/after, Lighthouse before/after, content changes, the Pages settings table.
- Do not offer to watch the PR.
