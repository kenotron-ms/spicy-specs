import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;
const CSS_PATH = resolve(ROOT, 'src/styles/global.css');

describe('Global CSS with design tokens', () => {
  let css;

  beforeAll(() => {
    css = readFileSync(CSS_PATH, 'utf-8');
  });

  it('src/styles/global.css exists', () => {
    expect(existsSync(CSS_PATH)).toBe(true);
  });

  describe('design tokens in :root', () => {
    it('defines primary red color tokens', () => {
      // Redesign: --spicy-red split into --color-deep-red and --color-bright-red
      expect(css).toContain('--color-deep-red');
      expect(css).toContain('--color-bright-red');
    });

    it('defines parchment color token', () => {
      // Redesign: --parchment renamed to --color-parchment
      expect(css).toContain('--color-parchment');
    });

    it('defines gold color token', () => {
      // Redesign: --gold renamed to --color-aged-gold
      expect(css).toContain('--color-aged-gold');
    });

    it('defines dark color token', () => {
      // Redesign: --dark renamed to --color-dark-brown and --color-near-black
      expect(css).toContain('--color-dark-brown');
    });

    it('defines --font-display with Playfair Display serif', () => {
      // Redesign: --font-display now uses Playfair Display as primary
      expect(css).toContain("--font-display: 'Playfair Display'");
      expect(css).toContain('serif');
    });

    it('defines --font-body for body text', () => {
      // Redesign: --font-ui removed; --font-body (Merriweather) used for body text
      expect(css).toContain('--font-body:');
      expect(css).toContain('Merriweather');
    });

    it('defines --font-code with monospace stack', () => {
      expect(css).toContain("--font-code: 'Courier New', Courier, monospace");
    });

    it('defines --spacing-xs at 0.5rem', () => {
      expect(css).toContain('--spacing-xs: 0.5rem');
    });

    it('defines --spacing-sm at 1rem', () => {
      expect(css).toContain('--spacing-sm: 1rem');
    });

    it('defines --spacing-md at 1.5rem', () => {
      expect(css).toContain('--spacing-md: 1.5rem');
    });

    it('defines --spacing-lg at 2rem', () => {
      expect(css).toContain('--spacing-lg: 2rem');
    });

    it('defines --spacing-xl at 3rem', () => {
      expect(css).toContain('--spacing-xl: 3rem');
    });
  });

  describe('base styles', () => {
    it('applies box-sizing reset', () => {
      expect(css).toContain('box-sizing');
      expect(css).toContain('border-box');
    });

    it('body uses --font-body', () => {
      // Redesign: body font changed from --font-ui to --font-body (Merriweather)
      expect(css).toMatch(/body\s*\{[^}]*font-family:\s*var\(--font-body\)/s);
    });

    it('body uses --text-body for color', () => {
      // Redesign: body color uses --text-body semantic token instead of --dark
      expect(css).toMatch(/body\s*\{[^}]*color:\s*var\(--text-body\)/s);
    });

    it('body has parchment background color', () => {
      // Redesign: body background is a warm parchment value (not var(--parchment))
      expect(css).toMatch(/body\s*\{[^}]*background-color/s);
    });

    it('body has line-height', () => {
      // Redesign: line-height uses var(--line-normal) = 1.5 instead of literal 1.6
      expect(css).toMatch(/body\s*\{[^}]*line-height/s);
    });

    it('headings use --font-display', () => {
      expect(css).toMatch(/h[123][^{]*\{[^}]*font-family:\s*var\(--font-display\)/s);
    });

    it('h1 uses display font size token', () => {
      // Redesign: h1 uses var(--text-display-lg) = 3rem instead of literal 2.5rem
      expect(css).toMatch(/h1[^{]*\{[^}]*font-size:\s*var\(--text-display-lg\)/s);
    });

    it('headings use --text-heading color', () => {
      // Redesign: headings use --text-heading semantic token instead of --spicy-red
      expect(css).toMatch(/h[12345][^{]*\{[^}]*color:\s*var\(--text-heading\)/s);
    });

    it('h2 uses heading font size token', () => {
      // Redesign: h2 uses var(--text-heading-lg) = 1.75rem instead of literal 2rem
      expect(css).toMatch(/h2[^{]*\{[^}]*font-size:\s*var\(--text-heading-lg\)/s);
    });

    it('h3 uses heading font size token', () => {
      // Redesign: h3 uses var(--text-heading-md) = 1.5rem
      expect(css).toMatch(/h3[^{]*\{[^}]*font-size:\s*var\(--text-heading-md\)/s);
    });

    it('links use --color-bright-red color', () => {
      // Redesign: links use --color-bright-red instead of --spicy-red
      expect(css).toMatch(/a[^{]*\{[^}]*color:\s*var\(--color-bright-red\)/s);
    });

    it('links have underline on hover', () => {
      expect(css).toMatch(/a:hover[^{]*\{[^}]*text-decoration:\s*underline/s);
    });

    it('code uses monospace font', () => {
      expect(css).toMatch(/code[^{]*\{[^}]*font-family:\s*var\(--font-code\)/s);
    });

    it('code has subtle background', () => {
      expect(css).toMatch(/code[^{]*\{[^}]*background/s);
    });

    it('code has border-radius (rounded)', () => {
      expect(css).toMatch(/code[^{]*\{[^}]*border-radius/s);
    });

    it('pre block has dark background (color-dark-brown)', () => {
      // Redesign: pre uses --color-dark-brown instead of --dark
      expect(css).toMatch(/pre[^{]*\{[^}]*background-color:\s*var\(--color-dark-brown\)/s);
    });

    it('pre block has parchment text color (via --bg-main)', () => {
      // Redesign: pre text color uses --bg-main (resolves to --color-parchment) instead of --parchment
      expect(css).toMatch(/pre[^{]*\{[^}]*color:\s*var\(--bg-main\)/s);
    });
  });

  describe('utility classes', () => {
    it('.container has max-width 1200px', () => {
      expect(css).toMatch(/\.container[^{]*\{[^}]*max-width:\s*1200px/s);
    });

    it('.container is centered (margin auto)', () => {
      expect(css).toMatch(/\.container[^{]*\{[^}]*margin[^}]*auto/s);
    });

    it('.container has padding', () => {
      expect(css).toMatch(/\.container[^{]*\{[^}]*padding/s);
    });

    it('.badge is inline-block', () => {
      expect(css).toMatch(/\.badge[^{]*\{[^}]*display:\s*inline-block/s);
    });

    it('.badge has border-radius (pill shape)', () => {
      expect(css).toMatch(/\.badge[^{]*\{[^}]*border-radius/s);
    });

    it('.badge has uppercase text-transform', () => {
      expect(css).toMatch(/\.badge[^{]*\{[^}]*text-transform:\s*uppercase/s);
    });

    it('.badge-spec uses --badge-spec color variable', () => {
      // Redesign: badge colors use CSS variables, not hard-coded hex values
      expect(css).toMatch(/\.badge-spec[^{]*\{[^}]*var\(--badge-spec\)/s);
    });

    it('.badge-pattern uses --badge-pattern color variable', () => {
      expect(css).toMatch(/\.badge-pattern[^{]*\{[^}]*var\(--badge-pattern\)/s);
    });

    it('.badge-antipattern uses --badge-antipattern color variable', () => {
      expect(css).toMatch(/\.badge-antipattern[^{]*\{[^}]*var\(--badge-antipattern\)/s);
    });

    it('.badge-philosophy uses --badge-philosophy color variable', () => {
      // Redesign: badge-philosophy uses CSS variable (resolves to near-black) instead of --gold
      expect(css).toMatch(/\.badge-philosophy[^{]*\{[^}]*var\(--badge-philosophy\)/s);
    });

    it('.badge-reference-app uses --badge-reference-app color variable', () => {
      // Redesign: badge-reference-app uses CSS variable (resolves to aged-gold) instead of purple
      expect(css).toMatch(/\.badge-reference-app[^{]*\{[^}]*var\(--badge-reference-app\)/s);
    });
  });
});
