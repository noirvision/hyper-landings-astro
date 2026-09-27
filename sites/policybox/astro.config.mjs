// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';

export default defineConfig({
  // Used for absolute Open Graph URLs. Update when a custom domain is attached.
  site: 'https://policybox-astro.pages.dev',
  output: 'static',
  trailingSlash: 'never',
  build: {
    // Emit privacy-policy.html etc. so Cloudflare Pages serves clean routes
    // (/privacy-policy) without a trailing-slash redirect.
    format: 'file',
  },
  markdown: {
    // Legal pages (src/content/*.md) print their text as written: no curly
    // quotes or dashes, no automatic links from bare web addresses.
    processor: satteri({ features: { gfm: false, smartPunctuation: false } }),
  },
});
