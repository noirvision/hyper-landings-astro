// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Used for absolute Open Graph URLs. Update when a custom domain is attached.
  site: 'https://oddacademia-astro.pages.dev',
  output: 'static',
  trailingSlash: 'never',
  build: {
    // Emit privacy-policy.html etc. so Cloudflare Pages serves clean routes
    // (/privacy-policy) without a trailing-slash redirect.
    format: 'file',
  },
});
