# Hyper landings — Astro monorepo

Landing pages originally built in Webflow for [Hyper](https://www.hyperhq.com/), rebuilt in
[Astro](https://astro.build) on one shared component library. Each site is a thin layer —
content, images and a theme file — on top of `@noirvision/ui`, so a new landing is assembled
from existing sections instead of copied from an old one.

| Site | Folder | Live |
| --- | --- | --- |
| Odd Academia | `sites/oddacademia` | https://oddacademia-astro.pages.dev |
| Policy Box | `sites/policybox` | https://policybox-astro.pages.dev (once the Pages project exists) |
| Rithm | `sites/rithm` | https://rithm-astro.pages.dev (once the Pages project exists) — dark theme |

## Structure

```
package.json            npm workspaces (packages/*, sites/*), Node 24
packages/ui/            @noirvision/ui — the shared library
  tokens/base.css       base design tokens (CSS custom properties) + element defaults + reveal CSS
  components/           section and element components (.astro, scoped styles)
  layouts/              BaseLayout (head, meta, noindex, fonts preload, reveal), LegalLayout
  scripts/              vanilla TS: reveal-on-scroll, in-page links, select, slider, waitlist form
  assets/               shared assets (Hyper logo)
sites/oddacademia/
  astro.config.mjs      site URL, static output, clean URLs
  public/               _headers, _redirects, favicon, OG image
  src/theme.css         the site's token values — the only place its look is defined
  src/content.ts        brand, socials, footer data shared by all pages
  src/layouts/          Site.astro / Legal.astro: fonts + theme + library layout
  src/pages/            index, privacy-policy, terms-and-conditions
  src/assets/           content images and icons (optimised at build time)
  src/images/           theme artwork referenced from theme.css
sites/policybox/        same shape; src/fonts holds self-hosted Figtree (WOFF2, OFL licence alongside)
sites/rithm/            same shape, dark theme; src/fonts holds Nunito Sans, Archivo, Space Grotesk (OFL licences alongside)
reference/<site>/       the original Webflow exports, kept for comparison (not built)
```

### Library rules

- Components own their markup and scoped styles, and read every visual decision from
  `--ui-*` custom properties. No Webflow class names or Webflow CSS.
- Sites pass content through props and slots and set token values in `src/theme.css`.
  A site never styles a component's internals. One-off decoration that exists on only one
  site stays in that site's page (e.g. the thick accent rule on Odd Academia's index).
- Section spacing, backgrounds, margins and corners are tokens too: `<Section spacing="steps">` reads
  `--ui-space-steps-top`, `--ui-space-steps-bottom` (+ `-tablet`, `-mobile`), `--ui-bg-steps`,
  `--ui-margin-steps` and `--ui-radius-steps`, falling back to the defaults (`--ui-panel-gap-y` /
  `-x`, `--ui-radius-panel`). A theme may redefine any token inside a media query (Policy Box does
  for ≤479px).
- Variants are layout, not look: a component's `layout`/`variant` prop picks a structure
  (e.g. `Hero layout="split"`), and tokens still decide every colour, size and space.
- Breakpoints are fixed across the library: desktop ≥992px, tablet ≤991px, mobile ≤767px,
  small ≤479px.
- Themes are tokens only, light or dark. Colours a component used to hard-code are tokens whose
  default keeps the old look (e.g. `--ui-color-heading`, default the text colour). Rithm is the dark
  reference: `--ui-color-page`/`-text`, `--ui-color-deep` set to the page colour, and
  `--ui-color-text-muted-opacity: 1`.

### Components

| Component | Role | Main props / slots |
| --- | --- | --- |
| `Section` | Rounded panel + container | `tone` (plain/accent/deep), `spacing` (token name; also reads `--ui-container-max-{name}`), `as` |
| `SectionHeading` | Section title; `<em>` = accent word, or a highlighter bar if the site sets `--ui-heading-mark`. Colour `--ui-color-heading` | `as`, `size`, `mobileSize`, `align`, `gap` (xs/sm/md/lg/xl, each a token per breakpoint), `eyebrow` + `eyebrowIcon` (uppercase label above, `--ui-eyebrow-*`; reveals like the heading) |
| `Header` | Logo + social links | `logo`, `logoAlt`, `homeHref`, `socials`, `bar` (floating pill), `reveal` (`true` or `{ delay, logoDistance }`), `socialSize`, `socialSizeSmall` |
| `Hero` | Hero with product visual | `layout` (centered/split), `visual` (split: bleed/contained — centred at `imageWidth`, e.g. a phone over a `--ui-hero-backdrop` photo), `mobileAlign` (start/center), `reveal` (split delays `{ copy, title, lead, content, visual }`, `copy: null` = off), `title`, `titleMuted` (lighter first line), `lead` (string or paragraphs), `image`, `imageAlt`, `imageWidth`, `tone`; slots `header` (top row, only rendered when given), `brand` (split: above the title), default (under the lead, e.g. a form) |
| `WaitlistForm` | Dropdown + email + button, or email only | `layout` (separate/inline: button inside the bar), `heading` or slot `heading`, `lead`, `options` (omit → single field), `selectPlaceholder`, `selectLabel`, `selectIcon`, `emailPlaceholder`, `buttonLabel`, `successMessage`, `id`, `revealGroup` (`{ delay, offset }`), `reveal` (`false` when a parent block reveals it) |
| `FeatureGrid` | "Why choose" grid, slider below 992px | `items` ({image, title, text}), `label`, `imageWidth`; slot `heading` |
| `FeatureCards` | "Why choose" as mixed-size cards (bento), or plain icon cards | `items` ({icon, title, text, image?, imageWidth, span {cols, rows}, bleed bottom/right/none, reveal}), `label`, `columns`, `iconLayout` (inline/stacked: icon above the title), `reveal` (`{ offset, grid: 'fade'\|'up', gridOffset }`); slot `heading` |
| `MediaText` | One text block beside one image ("Solutions") | `eyebrow`, `eyebrowIcon`, `heading` or slot `heading`, `text` (paragraphs), `image`, `imageAlt`, `imageWidth`, `flip` (image right), `backdrop` + `backdropWidth` (decorative photo at the bottom-left, desktop), `revealOffset` |
| `Steps` | "How it works" | `layout` (path/stack/list), `heading` or slot `heading`, `steps` ({title, text, textWidth}), `offsets`, `tone`, `image`/`imageAlt`/`imageWidth` (list) |
| `FeatureRows` | Alternating text + image rows | `variant` (rules/cards), `heading` or slot `heading`, `rows` ({icon, title, lead, text, image, flip}; `\n` in text = line break), `tone`, `imageWidth` |
| `FeatureList` | Heading + intro left, icon items right ("Alternate uses") | `heading` or slot `heading`, `intro` (paragraphs), `items` ({icon, title, text}), `columns`, `tone` |
| `CallToAction` | Centred heading, line, button; or a coloured panel with a form and an image | `layout` (centered/panel), `heading` or slot `heading`, `text`, `button` ({label, href}, optional), `image`/`imageAlt`/`imageWidth` (panel, desktop), `reveal` (up/left), `tone`; default slot (panel) = the action, e.g. a `WaitlistForm` |
| `AudienceCards` | Audience CTAs ("Join us") | `variant` (columns/glass), `heading` or slot `heading`, `lead`, `cards` ({icon, title, text, href?, cta? {label, href}}), `tone`, `as` |
| `Footer` | Footer with "Launched with Hyper" + credit line | `layout` (split/card/compact: logo, legal links and copyright stacked left, Hyper right, no panel), `logo`, `logoAlt`, `email`, `emailLabel`, `socials`, `copyright`, `legalLinks`, `current`, `variant` (landing/legal), `hyperText`, `hyperLogo`, `frame`, `reveal`; default slot = content inside the card above the rows |
| `SocialLinks` | Icon links | `links` ({href, label, icon}), `size`, `sizeSmall` |
| `Button` | Button or link-as-button | `href?`, `variant` (primary/inverse), native attributes; sized by `--ui-button-*` (incl. `-font-size`, `-hover-filter`/`-hover-opacity`, `-transition`) |
| `Image` | `<Picture>`: AVIF + WebP, WebP fallback | `src`, `alt`, `width`, `widths`, `sizes`, `priority` |
| `BaseLayout` | `<head>`, `<main>`, reveal + in-page-link scripts | `title`, `description`, `ogImage`, `noindex`, `favicon`, `appleTouchIcon`, `preloadFonts`, `ogTitle` (default true); slots default, `head`, `footer` |
| `LegalLayout` | Legal page: header, prose, legal footer | BaseLayout props + `header`, `footer`; default slot = the legal HTML. Document rhythm by tokens (`--ui-prose-h2-gap`, `--ui-prose-h3-space`, `--ui-prose-heading-font`), never spacer paragraphs |

Each component's header comment lists the tokens it reads beyond `tokens/base.css`.

### Interactions (no Webflow, no jQuery)

- **Scroll reveal** — add `data-reveal="up|left|right|fade"` (optional
  `data-reveal-offset`, `--ui-reveal-delay`). CSS transitions + IntersectionObserver, desktop only
  (as in the Webflow originals), off with `prefers-reduced-motion`, and nothing is hidden without JS.
- **Dropdown** — native `<select>`; the placeholder is not selectable. In Chromium the open list
  is styled with `appearance: base-select`; other browsers show their native list.
- **Slider** — CSS scroll-snap; dots and arrow/Home/End keys wired by `scripts/slider.ts`.
- **Forms** — no request on submit: the form hides and the success message shows. The
  `TODO` in `packages/ui/scripts/form.ts` marks where a webhook goes.
- **In-page links** — `href="#waitlist"` scrolls smoothly (instantly with reduced motion) and
  moves focus to the first field of the form there (`scripts/anchor.ts`).

## Run and build

Requires Node 24 (`.nvmrc`). Run everything from the repo root.

```sh
npm install
npm run dev:oddacademia       # http://localhost:4321
npm run build:oddacademia     # static site in sites/oddacademia/dist
npm run preview:oddacademia   # serve the build
npm run dev:policybox         # same three scripts per site
npm run dev:rithm
npm run build                 # build every site
```

## Deploy (Cloudflare Pages)

One Pages project per site, all connected to this repository. Set **Root directory** to the
repo root (leave it empty) so npm installs the workspaces from the root `package-lock.json`;
Pages runs `npm clean-install` automatically before the build command.

| Setting | Odd Academia | Policy Box | Rithm |
| --- | --- | --- | --- |
| Project name | `oddacademia-astro` | `policybox-astro` | `rithm-astro` |
| Production branch | `main` | `main` | `main` |
| Framework preset | None | None | None |
| Root directory | *(empty — repository root)* | *(empty — repository root)* | *(empty — repository root)* |
| Build command | `npm run build:oddacademia` | `npm run build:policybox` | `npm run build:rithm` |
| Build output directory | `sites/oddacademia/dist` | `sites/policybox/dist` | `sites/rithm/dist` |
| Environment variable | `NODE_VERSION` = `24` | `NODE_VERSION` = `24` | `NODE_VERSION` = `24` |
| Build watch paths — include | `sites/oddacademia/*`, `packages/ui/*`, `package.json`, `package-lock.json`, `.nvmrc` | `sites/policybox/*`, `packages/ui/*`, `package.json`, `package-lock.json`, `.nvmrc` | `sites/rithm/*`, `packages/ui/*`, `package.json`, `package-lock.json`, `.nvmrc` |
| Build watch paths — exclude | *(none)* | *(none)* | *(none)* |

The project name matches `site` in the site's `astro.config.mjs`; if you create a differently named
project, update `site` there.

The watch paths mean a change under another `sites/*` folder does not rebuild this site, while any
change to `packages/ui` (or the root dependencies) rebuilds every site.

Per site, `public/_headers` sends `X-Robots-Tag: noindex` for every URL and every page also has
`<meta name="robots" content="noindex">` (portfolio copies). `public/_redirects` maps the old
Webflow `.html` URLs to the clean routes. `site` in `astro.config.mjs` is used for absolute
Open Graph URLs — update it if the project gets another name or a custom domain.

### Secrets

Never commit secrets, webhook URLs, API keys or tokens. When the waitlist webhook is connected,
its URL goes into a Pages environment variable read server-side (e.g. by a Pages Function),
never into client code.

## Add a new site (step by step, with Claude Code)

1. **Reference.** Copy the Webflow export into `reference/<site>/` and note the live URL.
   Ask Claude Code to list the page's sections and map each to a library component
   (table above). Anything that doesn't map is either a new *reusable* component (it will
   appear on other landings) or one-off markup that stays in the site.
2. **Scaffold.** Copy `sites/oddacademia` to `sites/<site>`, then:
   - `package.json`: rename to `@noirvision/site-<site>`; add a font package if needed;
   - `astro.config.mjs`: set `site` to the site's `*.pages.dev` URL;
   - root `package.json`: add `dev:<site>`, `build:<site>`, `preview:<site>` scripts;
   - run `npm install` from the root.
3. **Theme.** Rewrite `src/theme.css` with the site's tokens — colours, fonts, radii,
   section spacing (`--ui-space-<name>-*`), backgrounds (`--ui-bg-<name>`). See
   `packages/ui/tokens/base.css` for the full list with defaults and each component's header
   comment for the tokens it adds. Dark sites set `--ui-color-page`, `--ui-color-text` and the
   field/menu colours. Swap the font import in `src/layouts/fonts.ts` (a fontsource package, or
   self-hosted WOFF2 files in `src/fonts` as Policy Box does). Only commit fonts whose licence
   allows redistribution (e.g. SIL OFL, with the licence file next to them). If the original
   uses a commercial font, pick the closest free one and tune it in `@font-face`
   (`size-adjust`, `ascent-override`/`descent-override`) and the `--ui-font-weight-*` tokens, as
   `sites/policybox/src/layouts/fonts.css` and `sites/rithm/src/layouts/fonts.css` do (the latter
   records how each value was measured against a screenshot of the live site).
4. **Content.** Replace `src/content.ts` (brand, socials, footer), images in `src/assets`, and
   `public/` files (favicon, `opengraph.png`, `_headers`, `_redirects`). Write the pages by
   composing components; keep copy verbatim from the reference (fix obvious typos only and
   list them in the PR).
5. **New components.** If a section differs only in layout, add a `layout`/`variant` prop to the
   existing component. If it is genuinely new, add it to `packages/ui/components` named by role,
   not by site, reading only tokens. Check it doesn't change existing sites: screenshot every
   site before and after (`npm run build`) and compare.
6. **Verify.** Build from the root, compare screenshots at 1440px and 390px against the
   reference, check reveal / select / slider / form, run Lighthouse.
7. **Deploy.** Create the Pages project with the table above (swap the folder and script
   names).

## Credits

Design and content © their respective owners. Rebuilt by noirvision for portfolio purposes.
