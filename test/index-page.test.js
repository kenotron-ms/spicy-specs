import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;
const PAGE_PATH = resolve(ROOT, 'src/pages/index.astro');

describe('src/pages/index.astro', () => {
  let page;

  beforeAll(() => {
    if (existsSync(PAGE_PATH)) {
      page = readFileSync(PAGE_PATH, 'utf-8');
    }
  });

  it('src/pages/index.astro exists', () => {
    expect(existsSync(PAGE_PATH)).toBe(true);
  });

  describe('Frontmatter script', () => {
    it('imports getCollection from astro:content', () => {
      expect(page).toMatch(/import.*getCollection.*from\s+['"]astro:content['"]/);
    });

    it('imports BaseLayout', () => {
      expect(page).toMatch(/import\s+BaseLayout/);
      expect(page).toContain('BaseLayout.astro');
    });

    it('fetches specs with getCollection', () => {
      expect(page).toMatch(/getCollection\(['"]specs['"]\)/);
    });

    it('sorts by updated date descending', () => {
      expect(page).toMatch(/sort/);
      expect(page).toMatch(/updated/);
    });

    it('defines getChiliRating helper function', () => {
      expect(page).toMatch(/function\s+getChiliRating|getChiliRating\s*=/);
    });

    it('getChiliRating uses chili pepper emoji', () => {
      expect(page).toContain('🌶️');
    });

    it('getChiliRating returns empty string for falsy level', () => {
      expect(page).toMatch(/getChiliRating[\s\S]*?(return\s+['"`]['"`]|''|""|``)/);
    });

    it('getChiliRating repeats emoji (uses repeat or manual concat)', () => {
      expect(page).toMatch(/repeat|5/);
    });
  });

  describe('HTML structure', () => {
    it('uses BaseLayout with title="Library"', () => {
      expect(page).toMatch(/<BaseLayout[^>]*title=["']Library["']/);
    });

    it('has .library-intro section', () => {
      expect(page).toMatch(/class="library-intro"/);
    });

    it('has h1 "Spicy Specs Library"', () => {
      expect(page).toContain('Spicy Specs Library');
    });

    it('has subtitle paragraph in .library-intro', () => {
      expect(page).toMatch(/library-intro[\s\S]*?<p/);
    });

    it('has .spec-grid container', () => {
      expect(page).toMatch(/class="spec-grid"/);
    });

    it('iterates over specs (map or for loop)', () => {
      expect(page).toMatch(/\.map\(|for\s*\(|specs\.map/);
    });

    it('renders article.spec-card for each spec', () => {
      expect(page).toMatch(/article[^>]*class="spec-card"/);
    });

    it('has .card-header with category badge', () => {
      expect(page).toMatch(/class="card-header"/);
      expect(page).toMatch(/badge badge-\$\{|badge badge-/);
    });

    it('renders chili rating conditionally', () => {
      expect(page).toMatch(/getChiliRating|chiliRating/);
    });

    it('has h2 with link to /e/{spec.data.slug}', () => {
      expect(page).toMatch(/href=["']\/e\/\{spec\.data\.slug\}["']|href=\{`\/e\/\$\{spec\.data\.slug\}`\}/);
    });

    it('has p.card-summary with spec summary', () => {
      expect(page).toMatch(/class="card-summary"/);
      expect(page).toMatch(/spec\.data\.summary/);
    });

    it('has .card-meta with author and updated date', () => {
      expect(page).toMatch(/class="card-meta"/);
      expect(page).toMatch(/spec\.data\.author/);
      expect(page).toMatch(/spec\.data\.updated/);
    });

    it('has conditional .card-tags section', () => {
      expect(page).toMatch(/card-tags/);
      expect(page).toMatch(/spec\.data\.tags/);
    });

    it('renders first 3 tags only (slice)', () => {
      expect(page).toMatch(/slice\(0,\s*3\)|slice\(0,3\)/);
    });

    it('renders tags with # prefix', () => {
      expect(page).toMatch(/#\s*\{tag\}|#\{tag\}|`#\$\{/);
    });
  });

  describe('Scoped styles', () => {
    it('has a <style> block', () => {
      expect(page).toMatch(/<style>/);
    });

    it('.library-intro has centered text', () => {
      expect(page).toMatch(/\.library-intro[\s\S]*?text-align:\s*center|\.library-intro[\s\S]*?center/);
    });

    it('.library-intro h1 has large font-size (3rem)', () => {
      expect(page).toMatch(/\.library-intro[\s\S]*?3rem|library-intro[\s\S]*?h1[\s\S]*?3rem|h1[\s\S]*?3rem/);
    });

    it('.spec-grid uses CSS grid', () => {
      expect(page).toMatch(/\.spec-grid[\s\S]*?display:\s*grid/);
    });

    it('.spec-grid uses auto-fill with minmax', () => {
      expect(page).toMatch(/\.spec-grid[\s\S]*?auto-fill[\s\S]*?minmax/);
    });

    it('.spec-grid uses minmax(350px, 1fr)', () => {
      expect(page).toMatch(/minmax\(350px,\s*1fr\)/);
    });

    it('.spec-card has white background', () => {
      expect(page).toMatch(/\.spec-card[\s\S]*?background[\s\S]*?(white|#fff|#ffffff)/i);
    });

    it('.spec-card has 2px border with #ddd', () => {
      expect(page).toMatch(/\.spec-card[\s\S]*?border[\s\S]*?#ddd|\.spec-card[\s\S]*?2px[\s\S]*?#ddd/);
    });

    it('.spec-card has 8px border-radius', () => {
      expect(page).toMatch(/\.spec-card[\s\S]*?border-radius[\s\S]*?8px/);
    });

    it('.spec-card:hover uses spicy-red border', () => {
      expect(page).toMatch(/\.spec-card:hover[\s\S]*?spicy-red|\.spec-card:hover[\s\S]*?border/);
    });

    it('.spec-card:hover has box-shadow', () => {
      expect(page).toMatch(/\.spec-card:hover[\s\S]*?shadow/);
    });

    it('.card-header is flex with space-between', () => {
      expect(page).toMatch(/\.card-header[\s\S]*?display:\s*flex/);
      expect(page).toMatch(/\.card-header[\s\S]*?space-between/);
    });

    it('h2 links use dark color', () => {
      expect(page).toMatch(/h2[\s\S]*?a[\s\S]*?dark|h2\s+a[\s\S]*?dark/);
    });

    it('h2 links use spicy-red on hover', () => {
      expect(page).toMatch(/h2[\s\S]*?a:hover[\s\S]*?spicy-red/);
    });

    it('.card-meta has top border separator', () => {
      expect(page).toMatch(/\.card-meta[\s\S]*?border-top|\.card-meta[\s\S]*?border[\s\S]*?top/);
    });

    it('.card-meta has smaller font-size', () => {
      expect(page).toMatch(/\.card-meta[\s\S]*?font-size/);
    });

    it('.tag has border-radius (pill style)', () => {
      expect(page).toMatch(/\.tag[\s\S]*?border-radius/);
    });

    it('.tag has rgba background (spicy-red tinted)', () => {
      expect(page).toMatch(/\.tag[\s\S]*?rgba/);
    });
  });
});
