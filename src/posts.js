// Posts across every section, newest first. Kept separate from sections.js
// because it imports astro:content — only runtime pages use it, never the
// content config (which would create a load-order cycle).

import { getCollection } from 'astro:content';
import { sectionNames } from './sections.js';

export async function getAllPosts() {
  const lists = await Promise.all(sectionNames.map((name) => getCollection(name)));
  return lists.flat().sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
