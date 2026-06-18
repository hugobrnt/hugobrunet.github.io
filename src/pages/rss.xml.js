// Generates /rss.xml from all posts, so people can subscribe.
import rss from '@astrojs/rss';
import { getAllPosts } from '../posts.js';

export async function GET(context) {
  const all = await getAllPosts();

  return rss({
    title: 'Your Name', // TODO: change
    description: 'Projects, essays, and CS notes.',
    site: context.site,
    items: all.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/${post.collection}/${post.id}/`,
    })),
  });
}
