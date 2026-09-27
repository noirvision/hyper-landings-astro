/**
 * Rithm: shared site data (brand, footer). Page copy lives in the pages;
 * everything visual lives in theme.css.
 */
import logo from './assets/icons/rithm-logo.svg';
import hyperLogo from './assets/icons/hyper.svg';

export const brand = { logo, logoAlt: 'Rithm' };

export const footer = {
  ...brand,
  hyperLogo,
  // Rithm's own "Launched with Hyper" lines, as published.
  hyperText: ['The best way to fund and launch your app.', 'Celebrating over £170m raised for our founders.'],
  copyright: 'Copyright Rithm© 2026. All Rights Reserved.',
  legalLinks: [
    { href: '/terms-and-conditions', label: 'Terms and Conditions' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
  ],
  layout: 'compact' as const,
};

export const head = {
  favicon: '/images/favicon.png',
  appleTouchIcon: '/images/webclip.png',
};
