/**
 * Odd Academia: shared site data (brand, contact, footer). Page copy lives in
 * the pages; everything visual lives in theme.css.
 */
import logo from './assets/icons/odd-academia_logo.svg';
import facebook from './assets/icons/facebook.svg';
import instagram from './assets/icons/instagram.svg';
import linkedin from './assets/icons/linkedin.svg';

export const brand = { logo, logoAlt: 'Odd Academia' };

export const socials = [
  { href: 'https://www.facebook.com/profile.php?id=61567286615576', label: 'Facebook', icon: facebook },
  { href: 'https://www.instagram.com/odd_academia/', label: 'Instagram', icon: instagram },
  { href: 'https://www.linkedin.com/company/odd-academia/about/', label: 'LinkedIn', icon: linkedin },
];

export const footer = {
  ...brand,
  email: 'se-on@oddacademia.com',
  socials,
  copyright: '©2026 oddAcademia. All rights reserved.',
  legalLinks: [
    { href: '/terms-and-conditions', label: 'Terms of Service' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
  ],
};

export const head = {
  favicon: '/images/favicon.png',
  appleTouchIcon: '/images/webclip.png',
};
