import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;
const CONFIG_PATH = resolve(ROOT, 'src/content/config.ts');

describe('Content Collections configuration (src/content/config.ts)', () => {
  let content;

  beforeAll(() => {
    if (existsSync(CONFIG_PATH)) {
      content = readFileSync(CONFIG_PATH, 'utf-8');
    }
  });

  it('src/content/config.ts exists', () => {
    expect(existsSync(CONFIG_PATH)).toBe(true);
  });

  it('imports defineCollection from astro:content', () => {
    expect(content).toMatch(/import\s*\{[^}]*defineCollection[^}]*\}\s*from\s*['"]astro:content['"]/);
  });

  it('imports z from astro:content', () => {
    expect(content).toMatch(/import\s*\{[^}]*\bz\b[^}]*\}\s*from\s*['"]astro:content['"]/);
  });

  it('defines a specsCollection using defineCollection', () => {
    expect(content).toMatch(/defineCollection\s*\(/);
  });

  it('sets collection type to "content"', () => {
    expect(content).toMatch(/type\s*:\s*['"]content['"]/);
  });

  it('schema has title as z.string()', () => {
    expect(content).toMatch(/title\s*:\s*z\.string\(\)/);
  });

  it('schema has slug as z.string().optional() (required by Astro v5 — slug is stripped before schema validation)', () => {
    // Astro v5 strips `slug` from frontmatter data before passing to Zod validation.
    // Using z.string().optional() ensures the dev server starts without errors
    // while still declaring the field in the schema.
    expect(content).toMatch(/slug\s*:\s*z\.string\(\)\.optional\(\)/);
  });

  it('schema has category as z.enum with all required values', () => {
    expect(content).toMatch(/category\s*:\s*z\.enum\s*\(/);
    expect(content).toMatch(/'spec'/);
    expect(content).toMatch(/'antipattern'/);
    expect(content).toMatch(/'reference-app'/);
    expect(content).toMatch(/'pattern'/);
    expect(content).toMatch(/'philosophy'/);
  });

  it('schema has spiceLevel as optional number with min 0 max 5', () => {
    expect(content).toMatch(/spiceLevel\s*:\s*z\.number\(\)\.min\(0\)\.max\(5\)\.optional\(\)/);
  });

  it('schema has tags as optional array of strings', () => {
    expect(content).toMatch(/tags\s*:\s*z\.array\(z\.string\(\)\)\.optional\(\)/);
  });

  it('schema has summary as z.string()', () => {
    expect(content).toMatch(/summary\s*:\s*z\.string\(\)/);
  });

  it('schema has created as z.string()', () => {
    expect(content).toMatch(/created\s*:\s*z\.string\(\)/);
  });

  it('schema has updated as z.string()', () => {
    expect(content).toMatch(/updated\s*:\s*z\.string\(\)/);
  });

  it('schema has author as z.string()', () => {
    expect(content).toMatch(/author\s*:\s*z\.string\(\)/);
  });

  it('exports collections with specs key', () => {
    expect(content).toMatch(/export\s+const\s+collections\s*=\s*\{[^}]*specs\s*:/);
  });
});
