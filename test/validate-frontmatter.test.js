import { describe, it, expect } from 'vitest';
import { validateFrontmatter } from '../build/validate-frontmatter.js';

describe('validateFrontmatter', () => {
  it('accepts valid frontmatter with all required fields', () => {
    const data = {
      title: 'Ruthless Simplicity',
      slug: 'ruthless-simplicity',
      category: 'philosophy',
      spiceLevel: 3,
      tags: ['simplicity', 'yagni'],
      summary: 'Build the simplest thing that could possibly work',
      created: '2026-03-24',
      updated: '2026-03-24',
      author: 'spicy-specs-team',
    };
    const result = validateFrontmatter(data);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('rejects frontmatter missing required fields', () => {
    const data = { title: 'Incomplete Spec' };
    const result = validateFrontmatter(data);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    // Note: 'slug' removed from required fields in Astro 5 (ID derived from file path)
    expect(result.errors).toContain('Missing required field: category');
    expect(result.errors).toContain('Missing required field: summary');
  });

  it('rejects invalid category values', () => {
    const data = {
      title: 'Bad Category',
      slug: 'bad-category',
      category: 'cookbook',
      spiceLevel: 1,
      tags: [],
      summary: 'This has a bad category',
      created: '2026-03-24',
      updated: '2026-03-24',
      author: 'test',
    };
    const result = validateFrontmatter(data);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/Invalid category/);
  });

  it('rejects spiceLevel outside 0-5 range', () => {
    const data = {
      title: 'Too Spicy',
      slug: 'too-spicy',
      category: 'spec',
      spiceLevel: 7,
      tags: [],
      summary: 'Way too spicy',
      created: '2026-03-24',
      updated: '2026-03-24',
      author: 'test',
    };
    const result = validateFrontmatter(data);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/spiceLevel must be between 0 and 5/);
  });

  it('rejects non-array tags', () => {
    const data = {
      title: 'Bad Tags',
      slug: 'bad-tags',
      category: 'pattern',
      spiceLevel: 2,
      tags: 'not-an-array',
      summary: 'Tags should be an array',
      created: '2026-03-24',
      updated: '2026-03-24',
      author: 'test',
    };
    const result = validateFrontmatter(data);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/tags must be an array/);
  });
});
