/**
 * Rithm: the shape of every content file in src/content/. A file that doesn't
 * match (missing or misspelt field, wrong type, empty text, missing image)
 * fails the build with the file and field named. Developers only.
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
  link,
  seo,
  legalPage,
} from '@noirvision/ui/content/fields.ts';

const file = (pattern: string) => glob({ pattern, base: './src/content' });
const contentDir = new URL('./content/', import.meta.url);

/** Shared by every page: logo, footer, browser icons. */
const site = defineCollection({
  loader: file('site.yaml'),
  schema: ({ image }) => {
    const img = images(image, contentDir);
    return group({
      logo: img.picture(),
      footer: group({
        logo: img.picture(),
        hyperLogo: img.file(),
        hyperText: z.array(text()).min(1),
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
      form: group({ emailPlaceholder: text(), button: text(), successMessage: text() }),
      hero: group({ heading: text(), text: text(), image: img.picture() }),
      solutions: group({
        eyebrow: text(),
        eyebrowIcon: img.file(),
        heading: richText(),
        paragraphs: paragraphs(),
        image: img.picture(),
      }),
      features: group({
        eyebrow: text(),
        eyebrowIcon: img.file(),
        heading: richText(),
        listLabel: text(),
        cards: z.array(group({ icon: img.file(), title: text(), text: text() })).min(1),
      }),
      understand: group({
        eyebrow: text(),
        eyebrowIcon: img.file(),
        heading: richText(),
        paragraphs: paragraphs(),
        image: img.picture(),
        backgroundImage: img.file(),
      }),
      join: group({ heading: richText(), text: text(), image: img.picture() }),
    });
  },
});

/** Privacy policy and terms (Markdown). */
const legal = defineCollection({
  loader: file('{privacy-policy,terms-and-conditions}.md'),
  schema: legalPage(),
});

export const collections = { site, home, legal };
