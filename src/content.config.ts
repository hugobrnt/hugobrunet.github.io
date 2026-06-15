// This file tells Astro: "my content lives in these folders, and every
// post must have this front-matter". If you forget a title or mistype a
// date, the build fails with a clear error instead of a broken page.

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// All three sections share the same shape, so define it once.
const section = (folder) =>
  defineCollection({
    loader: glob({ pattern: '**/*.md', base: `./src/content/${folder}` }),
    schema: z.object({
      title: z.string(),
      date: z.coerce.date(),
      description: z.string().optional(),
    }),
  });

export const collections = {
  blog: section('blog'),       // CS learning posts
  essays: section('essays'),   // essays about anything
  projects: section('projects'), // portfolio entries
};
