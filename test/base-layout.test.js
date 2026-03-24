import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;
const LAYOUT_PATH = resolve(ROOT, 'src/layouts/BaseLayout.astro');

describe('BaseLayout.astro', () => {
  let layout;

  beforeAll(() => {
    layout = readFileSync(LAYOUT_PATH, 'utf-8');
  });

  it('src/layouts/BaseLayout.astro exists', () => {
    expect(existsSync(LAYOUT_PATH)).toBe(true);
  });

  describe('Props interface', () => {
    it('defines Props interface with title (string)', () => {
      expect(layout).toMatch(/interface\s+Props/);
      expect(layout).toMatch(/title\s*:\s*string/);
    });

    it('defines description as optional string prop', () => {
      expect(layout).toMatch(/description\s*\??\s*:\s*string/);
    });

    it('destructures title and description from Astro.props', () => {
      expect(layout).toMatch(/Astro\.props/);
      expect(layout).toContain('title');
      expect(layout).toContain('description');
    });

    it('provides default value for description', () => {
      expect(layout).toContain("Curated library of specs, patterns, and anti-patterns for AI agents");
    });
  });

  describe('HTML structure', () => {
    it('has DOCTYPE html declaration', () => {
      expect(layout).toContain('<!DOCTYPE html>');
    });

    it('html element has lang="en"', () => {
      expect(layout).toContain('lang="en"');
    });

    it('has charset UTF-8 meta tag', () => {
      expect(layout).toMatch(/charset[^>]*UTF-8/i);
    });

    it('has viewport meta tag', () => {
      expect(layout).toMatch(/name="viewport"/);
      expect(layout).toContain('width=device-width');
    });

    it('has description meta tag using description prop', () => {
      expect(layout).toMatch(/name="description"/);
      expect(layout).toMatch(/\{description\}/);
    });

    it('sets title as "{title} | Spicy Specs"', () => {
      expect(layout).toMatch(/\{title\}\s*\|\s*Spicy Specs/);
    });

    it('links to /styles/global.css stylesheet', () => {
      expect(layout).toMatch(/href="\/styles\/global\.css"/);
      expect(layout).toMatch(/rel="stylesheet"/);
    });
  });

  describe('Header', () => {
    it('has header element with class site-header', () => {
      expect(layout).toMatch(/<header[^>]*class="site-header"/);
    });

    it('has container div inside header', () => {
      // The container div should appear within header context
      expect(layout).toMatch(/<header[\s\S]*?class="container"[\s\S]*?<\/header>/);
    });

    it('has h1 with spicy emoji and Spicy Specs text', () => {
      expect(layout).toContain('🌶️');
      expect(layout).toContain('Spicy Specs');
    });

    it('has nav with link to "/" labeled "Library"', () => {
      expect(layout).toMatch(/<nav[\s\S]*?<\/nav>/);
      expect(layout).toMatch(/href="\/"/);
      expect(layout).toContain('Library');
    });
  });

  describe('Main', () => {
    it('has main element with container class wrapping slot', () => {
      expect(layout).toMatch(/<main[\s\S]*?<\/main>/);
      expect(layout).toMatch(/class="container"/);
      expect(layout).toMatch(/<slot\s*\/>/);
    });
  });

  describe('Footer', () => {
    it('has footer element with class site-footer', () => {
      expect(layout).toMatch(/<footer[^>]*class="site-footer"/);
    });

    it('has copyright with 2026 Spicy Specs text', () => {
      expect(layout).toContain('2026 Spicy Specs');
    });

    it('has "Built with Astro" text', () => {
      expect(layout).toContain('Built with Astro');
    });
  });

  describe('Scoped styles', () => {
    it('has a <style> block', () => {
      expect(layout).toMatch(/<style>/);
    });

    it('.site-header uses spicy-red background', () => {
      expect(layout).toMatch(/\.site-header[\s\S]*?background[\s\S]*?spicy-red/);
    });

    it('.site-header uses parchment color', () => {
      expect(layout).toMatch(/\.site-header[\s\S]*?color[\s\S]*?parchment/);
    });

    it('.site-header has padding', () => {
      expect(layout).toMatch(/\.site-header[\s\S]*?padding/);
    });

    it('.site-header has xl bottom margin', () => {
      expect(layout).toMatch(/\.site-header[\s\S]*?margin[\s\S]*?xl/);
    });

    it('.site-title has 2rem font-size', () => {
      expect(layout).toMatch(/\.site-title[\s\S]*?2rem/);
    });

    it('.site-title uses parchment color', () => {
      expect(layout).toMatch(/\.site-title[\s\S]*?color[\s\S]*?parchment/);
    });

    it('nav links use parchment color', () => {
      expect(layout).toMatch(/nav\s+a[\s\S]*?color[\s\S]*?parchment/);
    });

    it('nav links use font-weight 600', () => {
      expect(layout).toMatch(/nav\s+a[\s\S]*?font-weight:\s*600/);
    });

    it('nav links use gold on hover', () => {
      expect(layout).toMatch(/nav\s+a:hover[\s\S]*?gold/);
    });

    it('.site-footer has xl top margin', () => {
      expect(layout).toMatch(/\.site-footer[\s\S]*?margin[\s\S]*?xl/);
    });

    it('.site-footer has lg padding', () => {
      expect(layout).toMatch(/\.site-footer[\s\S]*?padding[\s\S]*?lg/);
    });

    it('.site-footer has spicy-red top border', () => {
      expect(layout).toMatch(/\.site-footer[\s\S]*?border[\s\S]*?spicy-red/);
    });

    it('.site-footer has centered text', () => {
      expect(layout).toMatch(/\.site-footer[\s\S]*?text-align:\s*center/);
    });

    it('.site-footer has dark text', () => {
      expect(layout).toMatch(/\.site-footer[\s\S]*?color[\s\S]*?dark/);
    });
  });
});
