import { describe, it, expect } from 'vitest';
import { parseAllSpecs } from '../build/generate-embeddings.js';

describe('parseAllSpecs', () => {
  it('finds and parses all spec files from specs/ directory', () => {
    const specs = parseAllSpecs('specs');
    expect(specs.length).toBeGreaterThan(0);
  });

  it('returns objects with slug, title, category, summary, and textToEmbed', () => {
    const specs = parseAllSpecs('specs');
    const spec = specs[0];
    expect(spec).toHaveProperty('slug');
    expect(spec).toHaveProperty('title');
    expect(spec).toHaveProperty('category');
    expect(spec).toHaveProperty('summary');
    expect(spec).toHaveProperty('textToEmbed');
  });

  it('parses ruthless-simplicity spec correctly', () => {
    const specs = parseAllSpecs('specs');
    const rs = specs.find((s) => s.slug === 'ruthless-simplicity');
    expect(rs).toBeDefined();
    expect(rs.title).toBe('Ruthless Simplicity');
    expect(rs.category).toBe('philosophy');
    expect(rs.summary).toContain('simplest thing');
  });

  it('textToEmbed combines title and summary', () => {
    const specs = parseAllSpecs('specs');
    const rs = specs.find((s) => s.slug === 'ruthless-simplicity');
    expect(rs.textToEmbed).toContain('Ruthless Simplicity');
    expect(rs.textToEmbed).toContain('simplest thing');
  });
});
