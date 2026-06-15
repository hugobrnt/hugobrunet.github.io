// @ts-check
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';   // lets you write $...$ math in Markdown
import rehypeKatex from 'rehype-katex'; // renders that math to HTML at build time

export default defineConfig({
  // TODO: change this to your real URL, e.g. 'https://yourusername.github.io'
  site: 'https://hugobrunet.github.io',

  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      // dual themes so code blocks stay readable in both light and dark mode
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },
});
