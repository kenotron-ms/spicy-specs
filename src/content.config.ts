import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const specs = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './specs',
    generateId: ({ entry }) => {
      const filename = entry.split('/').pop() ?? entry;
      return filename.replace(/\.(md|mdx)$/, '');
    },
  }),
  schema: z.object({
    title:        z.string(),
    category:     z.enum(['spec', 'antipattern', 'reference-app', 'pattern', 'philosophy']),
    spiceLevel:   z.number().min(0).max(5).optional(),
    tags:         z.array(z.string()).optional(),
    summary:      z.string(),
    created:      z.string(),
    updated:      z.string(),
    author:       z.string(),
    // Optional structured counts — surfaced on cards and in meta
    antipatterns: z.number().int().min(0).optional(),
    invariants:   z.number().int().min(0).optional(),
  }),
});

export const collections = { specs };
