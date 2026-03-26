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
      expect(page).toMatch(/import.*getCollection.*from\s+['""]astro:content['"]/);
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

    it('renders chili icons using Array.from', () => {
      // Redesign: getChiliRating() removed; uses Array.from with <img> elements instead
      expect(page).toMatch(/Array\.from/);
      expect(page).toMatch(/chili-icon|card-spice/);
    });

    it('uses chili-icon-transparent.png for spice ratings', () => {
      // Redesign: emoji replaced by <img src="chili-icon-transparent.png">
      expect(page).toContain('chili-icon-transparent.png');
    });

    it('renders chili icons conditionally (spiceLevel != null)', () => {
      // Redesign: uses `spiceLevel != null` guard instead of getChiliRating returning ''
      expect(page).toMatch(/spiceLevel\s*!=\s*null|card-spice/);
    });

    it('chili icon count based on spiceLevel (uses 5 slots)', () => {
      expect(page).toMatch(/repeat|5/);
    });
  });

  describe('HTML structure', () => {
    it('uses BaseLayout with title="Library"', () => {
      expect(page).toMatch(/<BaseLayout[^>]*title=["']Library["']/);
    });

    it('has .controls-bar section with search and filters', () => {
      // Redesign: .library-intro replaced with .controls-bar (search + entry count + filter pills)
      expect(page).toMatch(/class="controls-bar"/);
    });

    it('has entry count display', () => {
      // Redesign: no h1 "Spicy Specs Library"; instead shows dynamic entry count
      expect(page).toMatch(/entry-count|SHOWING.*ENTRIES/);
    });

    it('has filter pills for category filtering', () => {
      // Redesign: replaces intro paragraph; filter-pills enable client-side category filtering
      expect(page).toMatch(/filter-pills|filter-pill/);
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

    it('has .card-banner with category display', () => {
      // Redesign: .card-header with badge replaced by .card-banner with category text
      expect(page).toMatch(/class="card-banner"/);
    });

    it('renders chili rating when spiceLevel is present', () => {
      // Redesign: uses card-spice div with img icons instead of getChiliRating()
      expect(page).toMatch(/card-spice|spiceLevel/);
    });

    it('has link to /e/{spec.id} using spec.id (Astro 5)', () => {
      // Redesign: Astro 5 uses spec.id instead of spec.slug for URL generation
      expect(page).toMatch(/href=\{`\/e\/\$\{spec\.id\}`\}|href=\{\/e\/\$\{spec\.id\}\}/);
    });

    it('has .card-body with centered card content', () => {
      // Redesign: .card-summary removed; card content lives in .card-body
      expect(page).toMatch(/class="card-body"/);
    });

    it('has .card-slug-footer with spec URL', () => {
      // Redesign: replaces .card-meta; shows the spec's URL as a visual footer
      expect(page).toMatch(/card-slug-footer/);
      expect(page).toMatch(/spec\.id/);
    });

    it('has data-category attribute on cards for filtering', () => {
      // Redesign: .card-tags replaced by data-* attributes for client-side filtering
      expect(page).toMatch(/data-category=\{spec\.data\.category\}/);
    });

    it('has data-tags attribute on cards for search', () => {
      // Redesign: tags rendered as data-tags for search instead of visible .card-tags section
      expect(page).toMatch(/data-tags=/);
      expect(page).toMatch(/spec\.data\.tags/);
    });

    it('has .card-title with spec title', () => {
      // Redesign: h2 still present but as .card-title
      expect(page).toMatch(/class="card-title"/);
      expect(page).toMatch(/spec\.data\.title/);
    });
  });

  describe('Scoped styles', () => {
    it('has a <style> block', () => {
      expect(page).toMatch(/<style>/);
    });

    it('.entry-count has centered text alignment', () => {
      // Redesign: .library-intro intro replaced; .entry-count is centered
      expect(page).toMatch(/\.entry-count[\s\S]*?text-align:\s*center/);
    });

    it('.controls-bar has padding and border styling', () => {
      // Redesign: replaces .library-intro styles; controls-bar has bottom border
      expect(page).toMatch(/\.controls-bar[\s\S]*?padding/);
      expect(page).toMatch(/\.controls-bar[\s\S]*?border/);
    });

    it('.spec-grid uses CSS grid', () => {
      expect(page).toMatch(/\.spec-grid[\s\S]*?display:\s*grid/);
    });

    it('.spec-grid uses repeat() for column layout', () => {
      // Redesign: auto-fill/minmax replaced with fixed repeat(N, 1fr) columns
      expect(page).toMatch(/\.spec-grid[\s\S]*?repeat\(/);
    });

    it('.spec-grid has responsive breakpoints via media queries', () => {
      // Redesign: responsiveness via @media breakpoints instead of auto-fill
      expect(page).toMatch(/@media/);
      expect(page).toMatch(/spec-grid/);
    });

    it('.spec-card has parchment background', () => {
      expect(page).toMatch(/\.spec-card[\s\S]*?background/);
    });

    it('.spec-card uses category color variable for border', () => {
      // Redesign: #ddd border replaced by dynamic --cat-color per category
      expect(page).toMatch(/\.spec-card[\s\S]*?--cat-color/);
    });

    it('.spec-card has border-radius', () => {
      expect(page).toMatch(/\.spec-card[\s\S]*?border-radius[\s\S]*?\d+px/);
    });

    it('.spec-card:hover uses category-based box-shadow', () => {
      expect(page).toMatch(/\.spec-card:hover[\s\S]*?border|\.spec-card:hover[\s\S]*?shadow/);
    });

    it('.spec-card:hover has box-shadow', () => {
      expect(page).toMatch(/\.spec-card:hover[\s\S]*?shadow/);
    });

    it('.card-banner has category background color', () => {
      // Redesign: .card-header replaced with .card-banner (flex removed; simple ribbon)
      expect(page).toMatch(/\.card-banner[\s\S]*?background-color:\s*var\(--cat-color\)/);
    });

    it('h2 links use dark color', () => {
      expect(page).toMatch(/h2[\s\S]*?a[\s\S]*?dark|h2\s+a[\s\S]*?dark/);
    });

    it('.card-title a:hover uses category color', () => {
      // Redesign: hover color uses --cat-color (per category) instead of --spicy-red
      expect(page).toMatch(/\.card-title\s+a:hover|card-title[\s\S]*?a:hover/);
    });

    it('.card-slug-footer has top border separator', () => {
      // Redesign: .card-meta replaced by .card-slug-footer with border-top separator
      expect(page).toMatch(/\.card-slug-footer[\s\S]*?border-top/);
    });

    it('.card-slug-footer has small font-size', () => {
      // Redesign: .card-meta replaced by .card-slug-footer with small monospace font
      expect(page).toMatch(/\.card-slug-footer[\s\S]*?font-size/);
    });

    it('.tag has border-radius (pill style)', () => {
      expect(page).toMatch(/\.tag[\s\S]*?border-radius/);
    });

    it('.tag has rgba background (spicy-red tinted)', () => {
      expect(page).toMatch(/\.tag[\s\S]*?rgba/);
    });
  });
});
