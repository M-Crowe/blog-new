import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const postsCollection = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/posts',
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
    tags: z.array(z.string()),
    cover: z.string().optional(),
    author: z.string().optional(),
    authorUrl: z.string().optional(),
    aiGenerated: z.boolean().optional(),
    aiModel: z.string().optional(),
  }),
});

export const collections = {
  posts: postsCollection,
};
