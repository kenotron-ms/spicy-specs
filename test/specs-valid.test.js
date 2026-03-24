import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { validateFrontmatter } from '../build/validate-frontmatter.js';

function findSpecFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...findSpecFiles(full));
    } else if (entry.endsWith('.md')) {
      files.push(full);
    }
  }
  return files;
}

describe('spec files on disk', () => {
  const specFiles = findSpecFiles('specs');

  it('has at least one spec file', () => {
    expect(specFiles.length).toBeGreaterThan(0);
  });

  for (const file of specFiles) {
    it(`${file} has valid frontmatter`, () => {
      const raw = readFileSync(file, 'utf-8');
      const { data } = matter(raw);
      const result = validateFrontmatter(data);
      expect(result.errors).toEqual([]);
      expect(result.valid).toBe(true);
    });
  }
});
