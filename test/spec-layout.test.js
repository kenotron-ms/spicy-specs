import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;
const LAYOUT_PATH = resolve(ROOT, 'src/layouts/SpecLayout.astro');

describe('SpecLayout.astro', () => {
  let layout;

  beforeAll(() => {
    layout = readFileSync(LAYOUT_PATH, 'utf-8');
  });

  it('src/layouts/SpecLayout.astro exists', () => {
    expect(existsSync(LAYOUT_PATH)).toBe(true);
  });

  describe('Props interface', () => {
    it('defines Props interface', () => {
      expect(layout).toMatch(/interface\s+Props/);
    });

    it('defines title as string prop', () => {
      expect(layout).toMatch(/title\s*:\s*string/);
    });

    it('defines category as string prop', () => {
      expect(layout).toMatch(/category\s*:\s*string/);
    });

    it('defines spiceLevel as optional number prop', () => {
      expect(layout).toMatch(/spiceLevel\s*\?\s*:\s*number/);
    });

    it('defines tags as optional string array prop', () => {
      expect(layout).toMatch(/tags\s*\?\s*:\s*string\[\]/);
    });

    it('defines summary as string prop', () => {
      expect(layout).toMatch(/summary\s*:\s*string/);
    });

    it('defines created as string prop', () => {
      expect(layout).toMatch(/created\s*:\s*string/);
    });

    it('defines updated as string prop', () => {
      expect(layout).toMatch(/updated\s*:\s*string/);
    });

    it('defines author as string prop', () => {
      expect(layout).toMatch(/author\s*:\s*string/);
    });

    it('destructures all props from Astro.props', () => {
      expect(layout).toMatch(/Astro\.props/);
      expect(layout).toContain('title');
      expect(layout).toContain('category');
      expect(layout).toContain('spiceLevel');
      expect(layout).toContain('tags');
      expect(layout).toContain('summary');
      expect(layout).toContain('created');
      expect(layout).toContain('updated');
      expect(layout).toContain('author');
    });
  });

  describe('getChiliRating helper function', () => {
    it('defines getChiliRating function', () => {
      expect(layout).toMatch(/function\s+getChiliRating|getChiliRating\s*=/);
    });

    it('returns empty string when no level provided', () => {
      // The function should handle falsy/undefined level
      expect(layout).toMatch(/getChiliRating[\s\S]*?(return\s+['"`]['"`]|''|""|``)/);
    });

    it('uses chili pepper emoji', () => {
      expect(layout).toContain('🌶️');
    });

    it('repeats chili emoji up to 5 times', () => {
      expect(layout).toMatch(/repeat|5/);
    });
  });

  describe('BaseLayout wrapping', () => {
    it('imports BaseLayout', () => {
      expect(layout).toMatch(/import\s+BaseLayout/);
      expect(layout).toContain('BaseLayout.astro');
    });

    it('uses BaseLayout with title prop', () => {
      expect(layout).toMatch(/<BaseLayout[^>]*title=/);
    });

    it('uses BaseLayout with description set to summary', () => {
      expect(layout).toMatch(/<BaseLayout[^>]*description=\{summary\}/);
    });
  });

  describe('HTML structure', () => {
    it('has article element with class spec-page', () => {
      expect(layout).toMatch(/<article[^>]*class="spec-page"/);
    });

    it('has header element with class spec-header', () => {
      expect(layout).toMatch(/<header[^>]*class="spec-header"/);
    });

    it('has .spec-meta div with category badge', () => {
      expect(layout).toMatch(/class="spec-meta"/);
      // Astro uses template literals for dynamic class names: `badge badge-${category}`
      expect(layout).toMatch(/badge badge-\$\{category\}|badge\s+badge-\{category\}/);
    });

    it('renders chili rating conditionally', () => {
      expect(layout).toMatch(/getChiliRating\(spiceLevel\)|chiliRating/);
    });

    it('has h1 with title', () => {
      expect(layout).toMatch(/<h1[^>]*>\s*\{title\}/);
    });

    it('has p.spec-summary with summary text', () => {
      expect(layout).toMatch(/<p[^>]*class="spec-summary"[^>]*>\s*\{summary\}/);
    });

    it('has .spec-details with author and created date', () => {
      expect(layout).toMatch(/class="spec-details"/);
      expect(layout).toContain('{author}');
      expect(layout).toContain('{created}');
    });

    it('renders updated date conditionally (only if different from created)', () => {
      expect(layout).toMatch(/updated\s*!==?\s*created|updated\s*&&\s*updated\s*!==?\s*created/);
      expect(layout).toContain('{updated}');
    });

    it('has conditional .spec-tags section', () => {
      expect(layout).toMatch(/tags[\s\S]*?spec-tags|spec-tags[\s\S]*?tags/);
    });

    it('renders tags with # prefix', () => {
      expect(layout).toMatch(/#\s*\{tag\}|#\{tag\}|\`#\$\{/);
    });

    it('has div.spec-content wrapping slot', () => {
      expect(layout).toMatch(/<div[^>]*class="spec-content"/);
      expect(layout).toMatch(/<slot\s*\/>/);
    });
  });

  describe('Scoped styles', () => {
    it('has a <style> block', () => {
      expect(layout).toMatch(/<style>/);
    });

    it('.spec-page has max-width 800px and is centered', () => {
      expect(layout).toMatch(/\.spec-page[\s\S]*?800px/);
      expect(layout).toMatch(/\.spec-page[\s\S]*?(margin.*auto|auto.*margin)/);
    });

    it('.spec-header has bottom border', () => {
      expect(layout).toMatch(/\.spec-header[\s\S]*?border-bottom/);
    });

    it('.spec-meta is a flex row', () => {
      expect(layout).toMatch(/\.spec-meta[\s\S]*?display:\s*flex/);
    });

    it('uses :global() selectors for markdown content', () => {
      expect(layout).toMatch(/:global\(/);
    });

    it('.spec-content h2 has extra top margin and bottom border', () => {
      expect(layout).toMatch(/:global\([\s\S]*?\.spec-content[\s\S]*?h2[\s\S]*?margin|:global\(\.spec-content\s+h2\)/);
      expect(layout).toMatch(/:global\([\s\S]*?h2[\s\S]*?border/);
    });

    it('.spec-content ul/ol have left margin', () => {
      expect(layout).toMatch(/:global\([\s\S]*?ul|:global\([\s\S]*?ol/);
    });

    it('.spec-content li has xs bottom margin', () => {
      expect(layout).toMatch(/:global\([\s\S]*?li[\s\S]*?margin/);
      expect(layout).toMatch(/xs/);
    });

    it('.tag style uses rgba with spicy-red, spicy-red text', () => {
      expect(layout).toMatch(/\.tag[\s\S]*?rgba|\.tag[\s\S]*?spicy-red/);
    });

    it('.spec-details has flex with gap and smaller gray text', () => {
      expect(layout).toMatch(/\.spec-details[\s\S]*?display:\s*flex/);
      expect(layout).toMatch(/\.spec-details[\s\S]*?gap/);
      expect(layout).toMatch(/\.spec-details[\s\S]*?font-size/);
    });
  });
});
