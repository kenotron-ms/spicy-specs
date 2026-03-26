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
      expect(layout).toContain('Curated library of specs, patterns, and anti-patterns for AI agents');
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

    it('imports global.css', () => {
      expect(layout).toContain('global.css');
    });

    it('loads Google Fonts (Merriweather, Cinzel or Playfair)', () => {
      expect(layout).toMatch(/fonts\.googleapis\.com/);
      expect(layout).toMatch(/Merriweather|Cinzel|Playfair/);
    });
  });

  describe('Header', () => {
    it('has <header> element', () => {
      expect(layout).toMatch(/<header/);
    });

    it('has a link to "/" for home navigation', () => {
      expect(layout).toMatch(/href="\/"/);
    });

    it('has aria-label "Spicy Specs" on the home link', () => {
      expect(layout).toMatch(/aria-label="[^"]*Spicy Specs[^"]*"/);
    });

    it('has header-logo-area element (CSS background-image logo)', () => {
      expect(layout).toContain('header-logo-area');
    });

    it('references the wide logo image asset', () => {
      expect(layout).toContain('header-logo-wide.png');
    });

    it('has site-tagline with PATTERN LIBRARY text', () => {
      expect(layout).toContain('site-tagline');
      expect(layout).toContain('PATTERN LIBRARY');
    });

    it('has EST. 2026 in tagline', () => {
      expect(layout).toContain('2026');
    });
  });

  describe('Main', () => {
    it('has main element wrapping slot', () => {
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

    it('has footer text element', () => {
      expect(layout).toContain('footer-text');
    });
  });

  describe('Scoped styles', () => {
    it('has a <style> block', () => {
      expect(layout).toMatch(/<style>/);
    });

    it('.header-logo-area has background-image', () => {
      expect(layout).toMatch(/\.header-logo-area[\s\S]*?background-image/);
    });

    it('.header-logo-area has background-size: cover', () => {
      expect(layout).toMatch(/\.header-logo-area[\s\S]*?background-size[\s\S]*?cover/);
    });

    it('.header-logo-area uses padding-top for responsive height', () => {
      expect(layout).toMatch(/\.header-logo-area[\s\S]*?padding-top/);
    });

    it('.site-tagline has letter-spacing', () => {
      expect(layout).toMatch(/\.site-tagline[\s\S]*?letter-spacing/);
    });

    it('.site-footer has top margin', () => {
      expect(layout).toMatch(/\.site-footer[\s\S]*?margin/);
    });

    it('.site-footer has padding', () => {
      expect(layout).toMatch(/\.site-footer[\s\S]*?padding/);
    });

    it('.site-footer has centered text', () => {
      expect(layout).toMatch(/\.site-footer[\s\S]*?text-align:\s*center/);
    });
  });
});
