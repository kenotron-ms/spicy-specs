import { defineCollection, z } from 'astro:content';

const specsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    category: z.enum(['spec', 'antipattern', 'reference-app', 'pattern', 'philosophy']),
    spiceLevel: z.number().min(0).max(5).optional(),
    tags: z.array(z.string()).optional(),
    summary: z.string(),
    created: z.string(),
    updated: z.string(),
    author: z.string(),
  }),
});

export const collections = { specs: specsCollection };
