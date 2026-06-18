// Sections are discovered from the filesystem: every folder under src/content/
// is a section. Drop a new folder in (with .md files) and it automatically
// appears in the navbar and gets its own listing + post pages — no code edits.
//
// This module is pure Node (no astro:content import) so content.config.ts can
// import it while it is still defining the collections.

import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Resolve from the project root (cwd) — not import.meta.url — so the path stays
// correct after this module is bundled into dist/ during the build. This mirrors
// the glob `base: ./src/content/...` in content.config.ts.
const contentDir = join(process.cwd(), 'src', 'content');

// src/content/ may not exist on a fresh checkout (git doesn't track empty
// directories, so it's absent until the first post folder is committed). Guard
// against that so the build succeeds with zero sections instead of crashing.
export const sectionNames = existsSync(contentDir)
  ? readdirSync(contentDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort()
  : [];

// Folder name → page heading, e.g. "blog" → "Blog". The navbar uses the raw
// (lowercase) folder name as its label.
export const titleCase = (s) => s.charAt(0).toUpperCase() + s.slice(1);
