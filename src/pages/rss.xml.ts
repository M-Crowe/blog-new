import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig } from '../lib/config';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts');
  const sortedPosts = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: siteConfig.site.title,
    description: siteConfig.site.description,
    site: context.site || siteConfig.site.url,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.excerpt,
      link: `/posts/${post.id.replace(/\.md$/, '')}/`,
      author: post.data.author || siteConfig.author.name,
      categories: post.data.tags,
    })),
    customData: `<language>zh-CN</language>`,
  });
}
