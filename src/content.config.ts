// This file tells Astro: "my content lives in these folders, and every
// post must have this front-matter". If you forget a title or mistype a
// date, the build fails with a clear error instead of a broken page.
//
// The sections are discovered from disk (see sections.js): one collection per
// folder under src/content/. Add a folder → it becomes a section automatically.

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { sectionNames } from './sections.js';

// Every section shares the same shape, so define it once.
const section = (folder) =>
  defineCollection({
    loader: glob({ pattern: '**/*.md', base: `./src/content/${folder}` }),
    schema: z.object({
      title: z.string(),
      date: z.coerce.date(),
      description: z.string().optional(),
    }),
  });

export const collections = Object.fromEntries(
  sectionNames.map((name) => [name, section(name)])
);
