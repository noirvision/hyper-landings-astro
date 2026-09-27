/**
 * Policy Box: the shape of every content file in src/content/. A file that
 * doesn't match (missing or misspelt field, wrong type, empty text, missing
 * image) fails the build with the file and field named. Developers only.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  z,
  group,
  images,
  text,
  richText,
  paragraphs,
  href,
  email,
  link,
  seo,
  legalPage,
} from '@noirvision/ui/content/fields.ts';

const file = (pattern: string) => glob({ pattern, base: './src/content' });
const contentDir = new URL('./content/', import.meta.url);

/** Shared by every page: logos, social links, footer, browser icons. */
const site = defineCollection({
  loader: file('site.yaml'),
  schema: ({ image }) => {
    const img = images(image, contentDir);
    return group({
      logo: img.picture(),
      socials: z.array(group({ label: text(), href: href(), icon: img.file() })),
      footer: group({
        logo: img.picture(),
        emailLabel: text(),
        email: email(),
        hyperLogo: img.file(),
        copyright: text(),
        legalLinks: z.array(link()).min(1),
      }),
      browserIcons: group({ favicon: href(), appleTouchIcon: href() }),
    });
  },
});

/** Home page. */
const home = defineCollection({
  loader: file('home.yaml'),
  schema: ({ image }) => {
    const img = images(image, contentDir);
    return group({
      seo: seo(),
      hero: group({ headingMuted: text(), heading: text(), paragraphs: paragraphs(), image: img.picture() }),
      waitlist: group({
        heading: richText(),
        text: text(),
        dropdownIcon: img.file(),
        dropdownPlaceholder: text(),
        dropdownLabel: text(),
        options: z.array(text()).min(1),
        emailPlaceholder: text(),
        button: text(),
        successMessage: text(),
      }),
      why: group({
        heading: richText(),
        listLabel: text(),
        cards: z.array(group({ icon: img.file(), title: text(), text: text(), image: img.picture() })).min(1),
      }),
      howItWorks: group({
        heading: richText(),
        steps: z.array(group({ title: text(), text: text() })).min(1),
        image: img.picture(),
      }),
      features: group({
        heading: richText(),
        rows: z.array(group({ icon: img.file(), title: text(), text: text(), image: img.picture() })).min(1),
      }),
      alternateUses: group({
        heading: richText(),
        paragraphs: paragraphs(),
        items: z.array(group({ icon: img.file(), title: text(), text: text() })).min(1),
      }),
      whiteLabel: group({ heading: richText(), text: text(), button: link() }),
      contact: group({
        heading: richText(),
        text: text(),
        cards: z.array(group({ icon: img.file(), title: text(), text: text(), button: link() })).min(1),
      }),
    });
  },
});

/** Privacy policy and terms (Markdown). */
const legal = defineCollection({
  loader: file('{privacy-policy,terms-and-conditions}.md'),
  schema: legalPage(),
});

export const collections = { site, home, legal };
