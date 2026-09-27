/**
 * Building blocks for the sites' content schemas (src/content.config.ts).
 *
 * Every page's copy lives in a data file (YAML for landing pages, Markdown for
 * legal pages). These fields validate it at build time, so a broken edit — a
 * missing or misspelt field, a number where text belongs, an empty heading, an
 * image path that doesn't exist — fails the build (and so the Cloudflare
 * preview) with a message naming the file and the field, instead of reaching
 * the live site.
 *
 * Messages are written for the person reading the failed build, not for a
 * developer: they say what the field must contain.
 */
import { existsSync } from 'node:fs';
import { z } from 'astro/zod';

/** Inline markup allowed in rich text: accent word, line break, non-breaking space. */
const RICH_MARKUP = /<em>|<\/em>|<br>|&nbsp;/g;
const HAS_TAG = /<\/?[a-z!][^>]*>/i;

const kind = (what: string) => (issue: { input?: unknown }) =>
  issue.input === undefined ? `is missing — add ${what}` : `must be ${what}, not ${JSON.stringify(issue.input)}`;

const notBlank = (s: string) => s.trim() !== '';

/**
 * One piece of plain text shown on the page. Never empty; no HTML.
 * `&nbsp;` is allowed and becomes a non-breaking space.
 */
export const text = () =>
  z
    .string({ error: kind('text (a word or sentence)') })
    .refine(notBlank, 'must not be empty')
    .refine((s) => !HAS_TAG.test(s), 'must be plain text: formatting such as <em> or <br> is not allowed in this field')
    .transform((s) => s.replaceAll('&nbsp;', '\u00a0'));

/**
 * Text that may carry the page's inline markup, rendered as HTML:
 * `<em>word</em>` (the accent / highlighted word), `<br>` (line break) and
 * `&nbsp;` (a space the line must not break at). Anything else is rejected.
 */
export const richText = () =>
  z
    .string({ error: kind('text (a word or sentence)') })
    .refine(notBlank, 'must not be empty')
    .refine((s) => !HAS_TAG.test(s.replace(RICH_MARKUP, '')), 'may only use <em>…</em>, <br> and &nbsp; as formatting')
    .refine(
      (s) => (s.match(/<em>/g) ?? []).length === (s.match(/<\/em>/g) ?? []).length,
      'has an <em> without its closing </em> (or the other way round)',
    );

/** One or more paragraphs, each a piece of plain text. */
export const paragraphs = () =>
  z
    .array(text(), { error: kind('a list of paragraphs (each on its own line starting with "- ")') })
    .min(1, 'needs at least one paragraph');

/** A link target: a page on the site (/…), a section on the page (#…), a web address or an email link. */
export const href = () =>
  z
    .string({ error: kind('a link (e.g. /privacy-policy, #waitlist or https://…)') })
    .refine(
      (s) => /^(\/|#|https?:\/\/|mailto:)\S*$/.test(s),
      'must be a link starting with /, #, https:// or mailto: (no spaces)',
    );

/** An email address. */
export const email = () => z.email({ error: 'must be an email address, e.g. hello@example.com' });

/** Alternative text of an image: what it shows, for screen readers. "" only for purely decorative images. */
export const alt = () =>
  z.string({
    error: (i) =>
      i.input === undefined
        ? 'is missing — describe the image (or write alt: "" if it is purely decorative)'
        : 'must be text',
  });

/**
 * A group of fields. Unknown (e.g. misspelt) field names are an error, so a
 * typo can't silently drop a text from the page.
 */
export const group = <T extends z.core.$ZodLooseShape>(shape: T) =>
  z.strictObject(shape, {
    error: (issue) =>
      issue.code === 'unrecognized_keys'
        ? `unknown field ${issue.keys.map((k) => `"${k}"`).join(', ')} — check the spelling against the other entries`
        : undefined,
  });

/**
 * Image fields for one site. `image` is the helper from the collection's
 * schema function; `contentDir` the folder of the data files
 * (`new URL('./content/', import.meta.url)` in content.config.ts), which image
 * paths are relative to (e.g. ../assets/hero.webp). A path to a file that
 * doesn't exist fails with the data file and field named.
 */
export function images<T extends z.ZodType>(image: () => T, contentDir: URL) {
  /** An image file (icons, decorative images). */
  const file = () =>
    z
      .string({ error: kind('the path of an image file, e.g. ../assets/photo.webp') })
      .refine((path) => existsSync(new URL(path, contentDir)), {
        error: (issue) =>
          `image file not found: ${String(issue.input)} (paths start from src/content/, e.g. ../assets/photo.webp)`,
      })
      // image() takes the path string at runtime; its declared input type is the resolved image.
      .pipe(image() as unknown as z.ZodType<z.output<T>, string>);
  /** A content image: the file and its description (alt text). */
  const picture = () => group({ src: file(), alt: alt() });
  return { file, picture };
}

/** A button or link: its label and where it goes. */
export const link = () => group({ label: text(), href: href() });

/**
 * SEO: the browser tab / search title and, for pages that have one, the
 * description and the social preview image (a file in public/, e.g. /opengraph.png).
 */
export const seo = () =>
  group({
    title: text(),
    description: text().optional(),
    socialImage: href().optional(),
    /** Emit og:title / twitter:title (default true; false for a page published without them). */
    socialTitle: z.boolean({ error: 'must be true or false' }).optional(),
  });

/** Legal page (Markdown): the front matter above the document. */
export const legalPage = () =>
  group({
    /** Browser tab / search title. */
    title: text(),
  });

export { z };
