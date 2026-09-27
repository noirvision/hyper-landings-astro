/**
 * Policy Box: shared site data (logos, socials, footer, browser icons), read
 * from src/content/site.yaml. Page copy lives in src/content/; everything
 * visual lives in theme.css.
 */
import { getEntry } from 'astro:content';

const entry = await getEntry('site', 'site');
if (!entry) throw new Error('src/content/site.yaml is missing');
const site = entry.data;

export const brand = { logo: site.logo.src, logoAlt: site.logo.alt };

export const socials = site.socials;

export const footer = {
  logo: site.footer.logo.src,
  logoAlt: site.footer.logo.alt,
  email: site.footer.email,
  emailLabel: site.footer.emailLabel,
  socials,
  hyperLogo: site.footer.hyperLogo,
  copyright: site.footer.copyright,
  legalLinks: site.footer.legalLinks,
  layout: 'card' as const,
};

export const head = site.browserIcons;
