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
    it('defines --spicy-red color token', () => {
      expect(css).toContain('--spicy-red: #A83232');
    });

    it('defines --parchment color token', () => {
      expect(css).toContain('--parchment: #EFE7CD');
    });

    it('defines --gold color token', () => {
      expect(css).toContain('--gold: #C9975B');
    });

    it('defines --dark color token', () => {
      expect(css).toContain('--dark: #2D2D2D');
    });

    it('defines --font-display with Georgia serif', () => {
      expect(css).toContain('--font-display: Georgia, serif');
    });

    it('defines --font-ui with system font stack', () => {
      expect(css).toContain('--font-ui:');
      expect(css).toContain('-apple-system');
      expect(css).toContain('BlinkMacSystemFont');
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

    it('body uses --font-ui', () => {
      expect(css).toMatch(/body\s*\{[^}]*font-family:\s*var\(--font-ui\)/s);
    });

    it('body uses --dark for color', () => {
      expect(css).toMatch(/body\s*\{[^}]*color:\s*var\(--dark\)/s);
    });

    it('body uses --parchment for background', () => {
      expect(css).toMatch(/body\s*\{[^}]*background-color:\s*var\(--parchment\)/s);
    });

    it('body has 1.6 line-height', () => {
      expect(css).toMatch(/body\s*\{[^}]*line-height:\s*1\.6/s);
    });

    it('headings use --font-display', () => {
      expect(css).toMatch(/h[123][^{]*\{[^}]*font-family:\s*var\(--font-display\)/s);
    });

    it('h1 is 2.5rem', () => {
      expect(css).toMatch(/h1[^{]*\{[^}]*font-size:\s*2\.5rem/s);
    });

    it('h1 uses --spicy-red color', () => {
      expect(css).toMatch(/h1[^{]*\{[^}]*color:\s*var\(--spicy-red\)/s);
    });

    it('h2 is 2rem', () => {
      expect(css).toMatch(/h2[^{]*\{[^}]*font-size:\s*2rem/s);
    });

    it('h3 is 1.5rem', () => {
      expect(css).toMatch(/h3[^{]*\{[^}]*font-size:\s*1\.5rem/s);
    });

    it('links use --spicy-red color', () => {
      expect(css).toMatch(/a[^{]*\{[^}]*color:\s*var\(--spicy-red\)/s);
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

    it('pre block has dark background', () => {
      expect(css).toMatch(/pre[^{]*\{[^}]*background-color:\s*var\(--dark\)/s);
    });

    it('pre block has parchment text color', () => {
      expect(css).toMatch(/pre[^{]*\{[^}]*color:\s*var\(--parchment\)/s);
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

    it('.badge-spec has blue color (#3B82F6)', () => {
      expect(css).toMatch(/\.badge-spec[^{]*\{[^}]*#3B82F6/si);
    });

    it('.badge-pattern has green color (#10B981)', () => {
      expect(css).toMatch(/\.badge-pattern[^{]*\{[^}]*#10B981/si);
    });

    it('.badge-antipattern has red color (#EF4444)', () => {
      expect(css).toMatch(/\.badge-antipattern[^{]*\{[^}]*#EF4444/si);
    });

    it('.badge-philosophy uses gold color', () => {
      expect(css).toMatch(/\.badge-philosophy[^{]*\{[^}]*var\(--gold\)/s);
    });

    it('.badge-reference-app has purple color (#8B5CF6)', () => {
      expect(css).toMatch(/\.badge-reference-app[^{]*\{[^}]*#8B5CF6/si);
    });
  });
});
