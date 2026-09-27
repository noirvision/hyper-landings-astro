# Brief C: Rithm on the shared library

## Context
Monorepo `noirvision/hyper-landings-astro`: shared library `packages/ui`, sites
`sites/oddacademia` and `sites/policybox` (both live on Cloudflare Pages). Read
`README.md`, `briefs/brief-b.md` and the library code first; the library's
conventions are the rules here.

This session: add Rithm as the third site, `sites/rithm`, 3 pages (index,
privacy-policy, terms-and-conditions), built from the library. It is the first
dark theme, so this is the test of whether the library is really theme-driven.

References:
- `reference/rithm/` — the Webflow export, published Sep 27, 2026. Its texts
  match the live site (rithm-lp.webflow.io), except for the fixes below.
- `reference/rithm/live-desktop.png` — a full-page screenshot of the live site
  (device pixel ratio 3). It is the visual truth for typography, because the
  export's commercial font files were deliberately left out of the repo.
The live site is probably blocked by your network. Serve the export locally as
the layout target, as in sessions A and B.

## Preflight — do this first
- Create your working branch and push it immediately. If the push fails,
  stop and tell me before doing any work.
- Build Odd Academia and Policy Box on main as baselines and keep screenshots
  at 1440 and 390 (all pages) for the regression check.

## Fonts (licensing — read carefully)
- The export uses Avenir Roman and Avenir Medium (commercial). Their files are
  not in the repo and must never be added to it, in any form or conversion.
- Replace Avenir with the closest free font from Fontsource. Compare candidates
  such as Nunito Sans, Figtree and Mulish against `live-desktop.png` by
  x-height, width and weight, and tune with `size-adjust`, metric overrides and
  weight tokens, as in session B. Self-host it with its licence file.
- When you serve the export locally, map its Avenir `@font-face` names to the
  chosen replacement (in your scratch copy only), so layout comparisons are fair.
- Archivo and Space Grotesk are free: self-host them the same way.
- Report the chosen font, why, and the measurements.

## Library rules
- Reuse existing components and the variants added in session B. Where Rithm
  differs, extend with a prop or variant instead of copying. New components only
  for truly new section types, named by role, never by site.
- No site names or site values in `packages/ui`. Sites set tokens in
  `theme.css` and data in `content.ts`.
- Dark theme must come from tokens only. If a component has a hard-coded colour
  that blocks it, turn that colour into a token whose default keeps the current
  look.
- Site-only styles only for one-off decoration; list each in the report.
- Odd Academia and Policy Box must stay visually unchanged. Compare their new
  builds against the baselines and report any difference.

## Sections (suggested mapping — decide and justify in the report)
- Hero: large logo above the heading, green heading "Feel your Rithm",
  paragraph, one-field email form ("Your email here" / "Join Now"), and on the
  right a phone mockup over a black-and-white athlete photo → `Hero` split
  variant with a composed media area.
- "The world's first hyper-personalised AI health and wellness companion":
  image card on the left, eyebrow label with an arrow icon ("SOLUTIONS"),
  heading, two paragraphs → a two-column media + text section (a `FeatureRows`
  variant, or a new component if none fits).
- "Your health in your hands": eyebrow "CHECK THIS", heading, three dark cards
  with icon, title and text → `FeatureCards` or `FeatureGrid`.
- "Understand what's actually happening, all in one place": eyebrow, heading,
  paragraph over a dark athlete photo on the left, image card on the right →
  the same two-column section, reversed, with a background image.
- "Know yourself / Discover your Rithm": light green panel with heading, text,
  one-field form and a phone-in-hand image bleeding off the bottom right →
  `CallToAction` variant with a form and media.
- Footer: logo, legal links with "|", copyright, "Launched with Hyper" with
  Rithm's own two lines of Hyper text → `Footer`, themed by tokens.
- Green and violet background glows: decoration via tokens or site-only CSS.
The eyebrow label (arrow icon + uppercase text) will likely be a new
`SectionHeading` prop. Product screenshots and photos stay images; all page
text must be HTML.

## Interactions
- Match the export's IX2 reveal data (distance, duration, easing, trigger,
  delays), as in session B.
- Both forms: no network request; show the success message; TODO for the
  webhook.

## Content fixes (exhaustive — no other copy changes)
1. Copyright: ©2026 on all three pages (the legal pages say ©2024).
2. Legal pages: remove the empty `<p>` elements (zero-width joiners) used as
   spacers; spacing comes from `LegalLayout`.
3. Legal pages footer: remove the three social icons with `#` links, so the
   footer matches the home page, which has none.
4. Logo link → "/".
5. Typos:
   - "with our the AI powered personalised health companion" →
     "with our AI-powered personalised health companion"
   - "holistic insights that that understands" →
     "holistic insights that understand"
   - "optimise your healthy and wellness" → "optimise your health and wellness"
   - "so you don't have do the hard work" → "so you don't have to do the hard work"
   Keep British spelling elsewhere.
6. Keep Rithm's own Hyper footer text as it is.
7. Footer credit line: "Portfolio rebuild by noirvision — original built in
   Webflow for Hyper."
Keep the original title, description and OG tags.

## SEO / indexing / repo
- noindex both ways (`_headers` + meta) and `_redirects` for the `.html` URLs,
  exactly as the other sites.
- No secrets, webhook URLs or tokens. No commercial font files anywhere.
- Update the README: the Rithm row, its Pages settings, any new component or
  variant and its props.

## Verification
- Screenshots at 1440, 1024, 768 and 390 of all 3 pages vs the local export
  (with the font mapping). Typography vs `live-desktop.png`. Don't chase image
  re-encoding noise or 1px rounding.
- Odd Academia and Policy Box regression checks against the baselines.
- No JS errors; reveal, both forms and reduced motion work.
- Lighthouse before (export) and after (new build), mobile and desktop.
- `astro check` clean for all sites and the library; a clean-clone build with
  the exact Pages command.
- If the network blocks a tool, name the host and continue.
- Background jobs: record each background process's PID from `$!` at launch and
  wait on it with an exit condition tied to the process dying (`wait` /
  `kill -0 PID` check), not only to an expected string in its output. Don't
  find your own processes with `pgrep` patterns. Stop every server you started
  before finishing.

## Delivery
- PR to `main` with a full description.
- Report: new and changed components with props, token changes, what stayed
  site-only and why, both regression results, visible differences, JS/CSS
  weight before/after, Lighthouse before/after, content changes, the font
  decision, and the Pages settings table for Rithm (project name `rithm-astro`;
  watch paths `sites/rithm/*`, `packages/ui/*`, `package.json`,
  `package-lock.json`, `.nvmrc`).
- Move this file to `briefs/brief-c.md` in the PR.
- Do not offer to watch the PR.
