/**
 * Policy Box: shared site data (brand, contact, footer). Page copy lives in
 * the pages; everything visual lives in theme.css.
 */
import logo from './assets/icons/Policybox_logo-color.svg';
import footerLogo from './assets/icons/Policybox_logo-footer.svg';
import hyperLogo from './assets/icons/Hyper-Logo.svg';
import facebook from './assets/icons/facebook-alt.svg';
import instagram from './assets/icons/instagram.svg';
import linkedin from './assets/icons/linkedin.svg';

export const brand = { logo, logoAlt: 'PolicyBox' };

export const socials = [
  { href: 'https://www.facebook.com/profile.php?id=61580011452303', label: 'Facebook', icon: facebook },
  { href: 'https://www.instagram.com/policybox.com.au/', label: 'Instagram', icon: instagram },
  { href: 'https://www.linkedin.com/company/policybox/?viewAsMember=true', label: 'LinkedIn', icon: linkedin },
];

export const footer = {
  logo: footerLogo,
  logoAlt: 'PolicyBox',
  email: 'hello@policybox.com.au',
  emailLabel: 'Email:',
  socials,
  hyperLogo,
  copyright: 'PolicyBox©2026. All rights reserved.',
  legalLinks: [
    { href: '/terms-and-conditions', label: 'Terms and Conditions' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
  ],
  layout: 'card' as const,
};

export const head = {
  favicon: '/images/favicon.png',
  appleTouchIcon: '/images/webclip.png',
};
