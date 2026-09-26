# Hyper landings — Astro monorepo

Landing pages originally built in Webflow for [Hyper](https://www.hyperhq.com/), rebuilt in
[Astro](https://astro.build) on one shared component library. Each site is a thin layer —
content, images and a theme file — on top of `@noirvision/ui`, so a new landing is assembled
from existing sections instead of copied from an old one.

| Site | Folder | Live |
| --- | --- | --- |
| Odd Academia | `sites/oddacademia` | https://oddacademia-astro.pages.dev |

Next up: Policy Box (light), then Rithm (dark theme).

## Structure

```
package.json            npm workspaces (packages/*, sites/*), Node 24
packages/ui/            @noirvision/ui — the shared library
  tokens/base.css       base design tokens (CSS custom properties) + element defaults + reveal CSS
  components/           section and element components (.astro, scoped styles)
  layouts/              BaseLayout (head, meta, noindex, fonts preload, reveal), LegalLayout
  scripts/              vanilla TS: reveal-on-scroll, select, slider, waitlist form
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
reference/oddacademia/  the original Webflow export, kept for comparison (not built)
```

### Library rules

- Components own their markup and scoped styles, and read every visual decision from
  `--ui-*` custom properties. No Webflow class names or Webflow CSS.
- Sites pass content through props and slots and set token values in `src/theme.css`.
  A site never styles a component's internals. One-off decoration that exists on only one
  site stays in that site's page (e.g. the thick accent rule on Odd Academia's index).
- Section spacing and backgrounds are tokens too: `<Section spacing="steps">` reads
  `--ui-space-steps-top`, `--ui-space-steps-bottom` (+ `-tablet`, `-mobile`) and
  `--ui-bg-steps`, falling back to the defaults.
- Breakpoints are fixed across the library: desktop ≥992px, tablet ≤991px, mobile ≤767px,
  small ≤479px.

### Components

| Component | Role | Main props / slots |
| --- | --- | --- |
| `Section` | Rounded panel + container | `tone` (plain/accent/deep), `spacing` (token name), `as` |
| `SectionHeading` | Section title, `<em>` = accent word | `as`, `size`, `mobileSize`, `align`, `gap` |
| `Header` | Logo + social links | `logo`, `logoAlt`, `homeHref`, `socials`, `reveal` |
| `Hero` | Hero with product visual | `title`, `lead`, `image`, `imageAlt`, `imageWidth`, `tone`; slots `header`, default |
| `WaitlistForm` | Dropdown + email + button, or email only | `heading`, `options` (omit → single field), `selectPlaceholder`, `emailPlaceholder`, `buttonLabel`, `successMessage`, `id` |
| `FeatureGrid` | "Why choose" grid, slider below 992px | `items` ({image, title, text}), `label`, `imageWidth`; slot `heading` |
| `Steps` | "How it works" | `heading`, `steps` ({title, text}), `layout` (path/stack), `offsets`, `tone` |
| `FeatureRows` | Alternating text + image rows | `heading`, `rows` ({title, lead, text, image, flip}), `tone`, `imageWidth` |
| `AudienceCards` | "Join us" audience CTAs | `heading`, `cards` ({icon, title, text, href?}), `tone` |
| `Footer` | Footer with "Launched with Hyper" + credit line | `logo`, `logoAlt`, `email`, `socials`, `copyright`, `legalLinks`, `current`, `variant` (landing/legal), `hyperText` |
| `SocialLinks` | Icon links | `links` ({href, label, icon}), `size`, `sizeSmall` |
| `Button` | Button or link-as-button | `href?`, native attributes; sized by `--ui-button-*` |
| `Image` | `<Picture>`: AVIF + WebP, WebP fallback | `src`, `alt`, `width`, `widths`, `sizes`, `priority` |
| `BaseLayout` | `<head>`, `<main>`, reveal script | `title`, `description`, `ogImage`, `noindex`, `favicon`, `appleTouchIcon`, `preloadFonts`; slots default, `head`, `footer` |
| `LegalLayout` | Legal page: header, prose, legal footer | BaseLayout props + `header`, `footer`; default slot = the legal HTML |

### Interactions (no Webflow, no jQuery)

- **Scroll reveal** — add `data-reveal="up|left|right|fade"` (optional
  `data-reveal-offset`, `--ui-reveal-delay`). CSS transitions + IntersectionObserver, desktop only
  (as in the Webflow originals), off with `prefers-reduced-motion`, and nothing is hidden without JS.
- **Dropdown** — native `<select>`; the placeholder is not selectable. In Chromium the open list
  is styled with `appearance: base-select`; other browsers show their native list.
- **Slider** — CSS scroll-snap; dots and arrow/Home/End keys wired by `scripts/slider.ts`.
- **Forms** — no request on submit: the form hides and the success message shows. The
  `TODO` in `packages/ui/scripts/form.ts` marks where a webhook goes.

## Run and build

Requires Node 24 (`.nvmrc`). Run everything from the repo root.

```sh
npm install
npm run dev:oddacademia       # http://localhost:4321
npm run build:oddacademia     # static site in sites/oddacademia/dist
npm run preview:oddacademia   # serve the build
npm run build                 # build every site
```

## Deploy (Cloudflare Pages)

One Pages project per site, all connected to this repository. Set **Root directory** to the
repo root (leave it empty) so npm installs the workspaces from the root `package-lock.json`;
Pages runs `npm clean-install` automatically before the build command.

| Setting | Odd Academia |
| --- | --- |
| Project name | `oddacademia-astro` (matches `site`; if you create a differently named project, update `site` in `astro.config.mjs`) |
| Production branch | `main` |
| Framework preset | None |
| Root directory | *(empty — repository root)* |
| Build command | `npm run build:oddacademia` |
| Build output directory | `sites/oddacademia/dist` |
| Environment variable | `NODE_VERSION` = `24` |
| Build watch paths — include | `sites/oddacademia/*`, `packages/ui/*`, `package.json`, `package-lock.json`, `.nvmrc` |
| Build watch paths — exclude | *(none)* |

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
   `packages/ui/tokens/base.css` for the full list with defaults. Dark sites set
   `--ui-color-page`, `--ui-color-text` and the field/menu colours. Swap the font import in
   `src/layouts/fonts.ts`.
4. **Content.** Replace `src/content.ts` (brand, socials, footer), images in `src/assets`, and
   `public/` files (favicon, `opengraph.png`, `_headers`, `_redirects`). Write the pages by
   composing components; keep copy verbatim from the reference (fix obvious typos only and
   list them in the PR).
5. **New components.** If a section is genuinely new, add it to `packages/ui/components`
   named by role, not by site, reading only tokens. Check it doesn't change existing sites
   (`npm run build`).
6. **Verify.** Build from the root, compare screenshots at 1440px and 390px against the
   reference, check reveal / select / slider / form, run Lighthouse.
7. **Deploy.** Create the Pages project with the table above (swap the folder and script
   names).

## Credits

Design and content © their respective owners. Rebuilt by noirvision for portfolio purposes.
