# My Site

A minimal personal site: portfolio, essays, and CS learning notes.
Built with [Astro](https://astro.build), Markdown, and one CSS file.
Inspired by leimao.github.io.

## Daily workflow (the only thing you'll do 95% of the time)

Create a Markdown file in the right folder:

```
src/content/blog/      → CS posts
src/content/essays/    → essays
src/content/projects/  → portfolio entries
```

Example — `src/content/blog/my-post.md`:

```markdown
---
title: "My Post Title"
date: 2026-06-15
description: "One sentence shown in the RSS feed."   # optional
---

Your content here. Markdown, `code`, and $math$ all work.
```

The filename becomes the URL: `my-post.md` → `/blog/my-post/`.
Commit, push, done — the site rebuilds and deploys itself.

## Running locally

```bash
npm install     # once
npm run dev     # live-reloading preview at http://localhost:4321
```

## One-time setup (do these now)

1. Search the project for `TODO` (4 spots): your name, intro, email and
   links in `src/pages/index.astro`, `src/layouts/Base.astro`,
   `src/pages/rss.xml.js`, and your URL in `astro.config.mjs`.
2. Create a GitHub repo named `yourusername.github.io` and push this
   project to its `main` branch.
3. In the repo: Settings → Pages → Source → select **GitHub Actions**.

Every later `git push` deploys automatically (takes ~1 minute).

## Map of the code (~250 lines total)

```
astro.config.mjs                  site URL + math/code plugins (15 lines)
src/sections.js                   discovers sections from src/content/ folders
src/posts.js                      all posts across sections, newest first
src/content.config.ts             one collection per section + required front-matter
src/styles/global.css             ALL the styling (no framework)
src/layouts/Base.astro            the HTML shell: <head>, nav, Recent sidebar, footer
src/components/PostList.astro     "date  title" list rows (+ optional section tag)
src/pages/index.astro             homepage: your intro
src/pages/[section]/index.astro   builds one listing page per section
src/pages/[section]/[slug].astro  builds every individual post page
src/pages/rss.xml.js              builds /rss.xml
.github/workflows/deploy.yml      auto-deploy to GitHub Pages on push
```

How it works in one paragraph: at build time Astro reads every `.md`
file, validates its front-matter against `content.config.ts`, converts
the Markdown to HTML (highlighting code with Shiki and rendering `$...$`
math with KaTeX), and pours it into the page templates under
`src/pages/`. The result in `dist/` is plain static HTML + CSS — no
JavaScript is shipped to readers at all.

## Adding a new section later (e.g. "readings")

Just create the folder `src/content/readings/` and drop Markdown files in it.
That's the whole step. Sections are discovered from the folders under
`src/content/` (see `src/sections.js`), so the new section automatically gets a
navbar link, a `/readings/` listing page, a page per post, and a spot in the
`Recent` sidebar and RSS feed — no code changes.
