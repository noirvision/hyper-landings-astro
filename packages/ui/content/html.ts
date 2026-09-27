/**
 * Turning validated content (see fields.ts) into HTML for `set:html`.
 */

const ENTITIES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' };

/**
 * Rich text (a `richText()` field) as HTML: everything is escaped exactly as
 * Astro escapes text, then the three allowed pieces of markup — <em>…</em>,
 * <br> and &nbsp; — are let through.
 */
export function richHtml(value: string): string {
  return value
    .replace(/[&<>'"]/g, (c) => ENTITIES[c])
    .replace(/&lt;(\/?em|br)&gt;/g, '<$1>')
    .replace(/&amp;nbsp;/g, '&nbsp;');
}

/**
 * HTML of a Markdown document (a legal page) as the site's templates emit it:
 * no whitespace between block elements (Astro compresses template HTML) and no
 * generated heading ids (the pages never had them). Pass `entry.rendered.html`.
 */
export function documentHtml(html: string | undefined): string {
  if (!html) throw new Error('Markdown document has no rendered HTML');
  return html
    .replace(/<(h[1-6])([^>]*?) id="[^"]*"/g, '<$1$2')
    .replace(/>\s*\n\s*</g, '><')
    .replace(/\s*\n\s*(?=<\/?(?:ol|ul|li|p|h[1-6])[\s>])/g, '')
    .trim();
}
