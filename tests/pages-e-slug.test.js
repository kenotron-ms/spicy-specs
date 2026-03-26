import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const filePath = resolve(process.cwd(), 'src/pages/e/[slug].astro');

describe('src/pages/e/[slug].astro - dynamic spec route', () => {
  it('file exists', () => {
    expect(existsSync(filePath)).toBe(true);
  });

  it('imports getCollection from astro:content', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toMatch(/import\s+\{[^}]*getCollection[^}]*\}\s+from\s+['"]astro:content['"]/);
  });

  it('imports SpecLayout', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toMatch(/import\s+SpecLayout\s+from/);
  });

  it('exports getStaticPaths function', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toMatch(/export\s+async\s+function\s+getStaticPaths/);
  });

  it('getStaticPaths maps specs to slug params', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toMatch(/params:\s*\{[^}]*slug[^}]*\}/);
  });

  it('renders SpecLayout with all required frontmatter props', () => {
    const content = readFileSync(filePath, 'utf-8');
    // Check all required props are passed to SpecLayout
    expect(content).toMatch(/title=/);
    expect(content).toMatch(/category=/);
    expect(content).toMatch(/summary=/);
    expect(content).toMatch(/created=/);
    expect(content).toMatch(/updated=/);
    expect(content).toMatch(/author=/);
  });

  it('renders Content component inside SpecLayout slot', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toMatch(/<Content\s*\/>/);
  });

  it('calls render(spec) to get Content (Astro 5 pattern)', () => {
    const content = readFileSync(filePath, 'utf-8');
    // Astro 5 uses top-level render() from astro:content instead of spec.render()
    expect(content).toMatch(/render\(spec\)/);
  });

  it('destructures spec from Astro.props', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toMatch(/Astro\.props/);
  });
});
