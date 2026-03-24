# Spicy Specs Phase 1B: Build Pipeline & Static Site

> **Execution:** Use the subagent-driven-development workflow to implement this plan.

**Goal:** Build a static site generator that uses Amplifier CLI agents to create HTML pages from markdown specs, producing a browsable site in `dist/`.

**Architecture:** The build script discovers markdown specs in `specs/`, parses frontmatter with `gray-matter`, converts markdown to HTML with `marked`, then shells out to `amplifier run --mode single` to have an AI agent wrap each page in a complete, styled HTML document. Template prompt files guide the agent's output but don't rigidly constrain it -- the agent has creative freedom within the design system. The result is a static site with individual spec pages, a library index, a specs.json metadata index, CSS with design tokens, and copied image assets.

**Tech Stack:** Node.js 20, vitest (testing), gray-matter (frontmatter), marked (markdown-to-HTML), Amplifier CLI (agentic HTML generation)

**Reference Design:** `docs/plans/2026-03-24-spicy-specs-phase1-design.md`

---

## Task 1: Spec Discovery and Parsing Module

Write a reusable module that finds all markdown spec files and parses them into structured data. This module replaces the ad-hoc `findSpecFiles()` function currently duplicated in `test/specs-valid.test.js`.

**Files:**
- Create: `test/parse-specs.test.js`
- Create: `build/parse-specs.js`

**Step 1: Write the failing tests**

Create file `test/parse-specs.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { discoverSpecs, parseSpec } from '../build/parse-specs.js';

describe('discoverSpecs', () => {
  it('finds markdown files in specs directory', () => {
    const files = discoverSpecs('specs');
    expect(files.length).toBeGreaterThan(0);
    expect(files.every(f => f.endsWith('.md'))).toBe(true);
  });
});

describe('parseSpec', () => {
  it('parses frontmatter metadata from a spec file', () => {
    const spec = parseSpec('specs/philosophy/ruthless-simplicity.md');
    expect(spec.slug).toBe('ruthless-simplicity');
    expect(spec.metadata.title).toBe('Ruthless Simplicity');
    expect(spec.metadata.category).toBe('philosophy');
    expect(spec.metadata.tags).toContain('simplicity');
    expect(spec.metadata.spiceLevel).toBe(3);
  });

  it('converts markdown body to HTML', () => {
    const spec = parseSpec('specs/philosophy/ruthless-simplicity.md');
    expect(spec.htmlContent).toContain('<h2');
    expect(spec.htmlContent).toContain('Core Principle');
    expect(spec.body).toContain('## Core Principle');
    expect(spec.body).not.toContain('<h2');
  });
});
```

**Step 2: Run tests to verify they fail**

Run:
```bash
npx vitest run test/parse-specs.test.js
```

Expected: FAIL -- module `../build/parse-specs.js` does not exist.

**Step 3: Write the implementation**

Create file `build/parse-specs.js`:

```js
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { validateFrontmatter } from './validate-frontmatter.js';

/**
 * Recursively discover all .md files in a directory.
 * @param {string} dir - Root directory to search
 * @returns {string[]} Sorted array of absolute file paths
 */
export function discoverSpecs(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...discoverSpecs(full));
    } else if (entry.endsWith('.md')) {
      files.push(full);
    }
  }
  return files.sort();
}

/**
 * Parse a spec markdown file into structured data.
 * Validates frontmatter and converts markdown body to HTML.
 * @param {string} filePath - Path to the .md file
 * @returns {{ slug: string, metadata: object, body: string, htmlContent: string }}
 * @throws {Error} If frontmatter validation fails
 */
export function parseSpec(filePath) {
  const raw = readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  const validation = validateFrontmatter(data);
  if (!validation.valid) {
    throw new Error(`Invalid frontmatter in ${filePath}: ${validation.errors.join(', ')}`);
  }

  const htmlContent = marked.parse(content);

  return {
    slug: data.slug,
    metadata: data,
    body: content,
    htmlContent,
  };
}
```

**Step 4: Run tests to verify they pass**

Run:
```bash
npx vitest run test/parse-specs.test.js
```

Expected: All 3 tests PASS.

**Step 5: Run the full test suite to confirm no regressions**

Run:
```bash
npm test
```

Expected: All tests PASS (7 existing + 3 new = 10 total).

**Step 6: Commit**

```bash
git add build/parse-specs.js test/parse-specs.test.js
git commit -m "feat: add spec discovery and parsing module with tests"
```

---

## Task 2: Specs JSON Index Builder

Write a module that transforms parsed spec objects into a JSON-serializable index containing only metadata (no body content). This index powers client-side filtering in future phases.

**Files:**
- Create: `test/build-index.test.js`
- Create: `build/build-index.js`

**Step 1: Write the failing tests**

Create file `test/build-index.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { buildSpecsIndex } from '../build/build-index.js';

describe('buildSpecsIndex', () => {
  const mockSpecs = [
    {
      slug: 'test-spec',
      metadata: {
        title: 'Test Spec',
        category: 'pattern',
        spiceLevel: 2,
        tags: ['test', 'example'],
        summary: 'A test specification',
        author: 'tester',
        created: '2026-03-24',
        updated: '2026-03-24',
      },
      body: '# Test\n\nLong body content here...',
      htmlContent: '<h1>Test</h1>\n<p>Long body content here...</p>',
    },
  ];

  it('maps parsed specs to index entries with all required fields', () => {
    const index = buildSpecsIndex(mockSpecs);

    expect(index).toHaveLength(1);
    expect(index[0]).toEqual({
      slug: 'test-spec',
      title: 'Test Spec',
      category: 'pattern',
      spiceLevel: 2,
      tags: ['test', 'example'],
      summary: 'A test specification',
      author: 'tester',
      created: '2026-03-24',
      updated: '2026-03-24',
    });
  });

  it('excludes body and htmlContent from index entries', () => {
    const index = buildSpecsIndex(mockSpecs);

    expect(index[0]).not.toHaveProperty('body');
    expect(index[0]).not.toHaveProperty('htmlContent');
  });

  it('defaults spiceLevel to 0 when missing', () => {
    const specsNoSpice = [{
      slug: 'no-spice',
      metadata: {
        title: 'No Spice',
        category: 'spec',
        tags: [],
        summary: 'Missing spiceLevel',
        author: 'test',
        created: '2026-03-24',
        updated: '2026-03-24',
      },
      body: '',
      htmlContent: '',
    }];

    const index = buildSpecsIndex(specsNoSpice);
    expect(index[0].spiceLevel).toBe(0);
  });
});
```

**Step 2: Run tests to verify they fail**

Run:
```bash
npx vitest run test/build-index.test.js
```

Expected: FAIL -- module `../build/build-index.js` does not exist.

**Step 3: Write the implementation**

Create file `build/build-index.js`:

```js
/**
 * Build a JSON-serializable index from parsed spec objects.
 * Includes only metadata fields -- no body or HTML content.
 * @param {Array} specs - Array of parsed spec objects from parseSpec()
 * @returns {Array} Index entries suitable for writing to specs.json
 */
export function buildSpecsIndex(specs) {
  return specs.map(spec => ({
    slug: spec.slug,
    title: spec.metadata.title,
    category: spec.metadata.category,
    spiceLevel: spec.metadata.spiceLevel ?? 0,
    tags: spec.metadata.tags ?? [],
    summary: spec.metadata.summary,
    author: spec.metadata.author,
    created: spec.metadata.created,
    updated: spec.metadata.updated,
  }));
}
```

**Step 4: Run tests to verify they pass**

Run:
```bash
npx vitest run test/build-index.test.js
```

Expected: All 3 tests PASS.

**Step 5: Run the full test suite**

Run:
```bash
npm test
```

Expected: All tests PASS (10 existing + 3 new = 13 total).

**Step 6: Commit**

```bash
git add build/build-index.js test/build-index.test.js
git commit -m "feat: add specs JSON index builder with tests"
```

---

## Task 3: CSS Design Foundation

Create the stylesheet with design tokens (colors, typography, spacing) and layout classes that the agent-generated HTML pages will reference. No test needed -- this is a visual asset.

**Files:**
- Create: `public/styles.css` (replacing `.gitkeep`)

**Step 1: Create the stylesheet**

Create file `public/styles.css`:

```css
/* Spicy Specs — Phase 1 Design Tokens & Layout */

/* ═══════════════════════════════════════
   Design Tokens
   ═══════════════════════════════════════ */

:root {
  /* Brand Colors */
  --spicy-red: #A83232;
  --parchment: #EFE7CD;
  --gold: #C9975B;
  --dark: #2D2D2D;

  /* Semantic Colors */
  --bg-primary: var(--parchment);
  --bg-card: #FFFFFF;
  --text-primary: var(--dark);
  --text-secondary: #666666;
  --accent: var(--spicy-red);
  --accent-hover: #8A2828;
  --border: #D4C9B0;

  /* Typography */
  --font-display: Georgia, 'Times New Roman', serif;
  --font-ui: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-code: 'Courier New', Courier, monospace;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;

  /* Layout */
  --max-width: 72rem;
  --content-width: 48rem;
}

/* ═══════════════════════════════════════
   Reset
   ═══════════════════════════════════════ */

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-ui);
  color: var(--text-primary);
  background-color: var(--bg-primary);
  line-height: 1.6;
}

/* ═══════════════════════════════════════
   Typography
   ═══════════════════════════════════════ */

h1, h2, h3 {
  font-family: var(--font-display);
  line-height: 1.2;
}

h1 { font-size: 2rem; margin-bottom: var(--space-lg); }
h2 { font-size: 1.5rem; margin-top: var(--space-xl); margin-bottom: var(--space-md); }
h3 { font-size: 1.25rem; margin-top: var(--space-lg); margin-bottom: var(--space-sm); }

a {
  color: var(--accent);
  text-decoration: none;
}

a:hover {
  color: var(--accent-hover);
  text-decoration: underline;
}

code {
  font-family: var(--font-code);
  background: rgba(0, 0, 0, 0.06);
  padding: 0.1em 0.3em;
  border-radius: 3px;
  font-size: 0.9em;
}

pre {
  background: var(--dark);
  color: var(--parchment);
  padding: var(--space-md);
  border-radius: 6px;
  overflow-x: auto;
  margin: var(--space-md) 0;
}

pre code {
  background: none;
  padding: 0;
  color: inherit;
}

/* ═══════════════════════════════════════
   Site Header
   ═══════════════════════════════════════ */

.site-header {
  background: var(--dark);
  color: var(--parchment);
  padding: var(--space-lg) var(--space-xl);
  text-align: center;
}

.site-header h1 {
  font-family: var(--font-display);
  color: var(--gold);
  margin-bottom: var(--space-xs);
}

.site-header p {
  color: var(--parchment);
  opacity: 0.8;
}

.site-header a {
  color: var(--gold);
}

.site-header a:hover {
  color: var(--parchment);
}

/* ═══════════════════════════════════════
   Layout
   ═══════════════════════════════════════ */

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--space-xl);
}

.content {
  max-width: var(--content-width);
  margin: 0 auto;
}

/* ═══════════════════════════════════════
   Category Badges
   ═══════════════════════════════════════ */

.badge {
  display: inline-block;
  padding: var(--space-xs) var(--space-sm);
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-spec { background: var(--spicy-red); color: white; }
.badge-pattern { background: var(--gold); color: var(--dark); }
.badge-antipattern { background: #C44D4D; color: white; }
.badge-reference-app { background: #4A7C59; color: white; }
.badge-philosophy { background: #5B6ABF; color: white; }

/* ═══════════════════════════════════════
   Spice Level
   ═══════════════════════════════════════ */

.spice-level {
  color: var(--spicy-red);
  font-size: 1rem;
}

/* ═══════════════════════════════════════
   Spec Cards (Library Index)
   ═══════════════════════════════════════ */

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-lg);
  margin-top: var(--space-xl);
}

.spec-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: var(--space-lg);
  transition: box-shadow 0.2s;
  text-decoration: none;
  color: inherit;
  display: block;
}

.spec-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-decoration: none;
}

.spec-card h3 {
  margin-top: var(--space-sm);
  font-size: 1.1rem;
}

.spec-card .summary {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: var(--space-sm) 0;
}

.spec-card .tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-top: var(--space-sm);
}

.tag {
  font-size: 0.75rem;
  color: var(--text-secondary);
  background: rgba(0, 0, 0, 0.04);
  padding: 2px 8px;
  border-radius: 3px;
}

/* ═══════════════════════════════════════
   Spec Page Layout
   ═══════════════════════════════════════ */

.spec-header {
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-lg);
  border-bottom: 2px solid var(--border);
}

.spec-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin-top: var(--space-md);
}

.spec-body {
  line-height: 1.7;
}

.spec-body ul,
.spec-body ol {
  padding-left: var(--space-xl);
  margin: var(--space-md) 0;
}

.spec-body li {
  margin-bottom: var(--space-xs);
}

.spec-body strong {
  color: var(--dark);
}

.spec-body blockquote {
  border-left: 4px solid var(--gold);
  padding: var(--space-sm) var(--space-md);
  margin: var(--space-md) 0;
  background: rgba(0, 0, 0, 0.02);
  color: var(--text-secondary);
}

/* ═══════════════════════════════════════
   Footer
   ═══════════════════════════════════════ */

.site-footer {
  text-align: center;
  padding: var(--space-xl);
  color: var(--text-secondary);
  font-size: 0.85rem;
  border-top: 1px solid var(--border);
  margin-top: var(--space-2xl);
}

/* ═══════════════════════════════════════
   Responsive
   ═══════════════════════════════════════ */

@media (max-width: 640px) {
  .container {
    padding: var(--space-md);
  }

  h1 { font-size: 1.5rem; }

  .specs-grid {
    grid-template-columns: 1fr;
  }

  .spec-meta {
    flex-direction: column;
    gap: var(--space-xs);
  }
}
```

**Step 2: Remove the .gitkeep placeholder**

Run:
```bash
rm public/.gitkeep
```

**Step 3: Verify the file exists and contains design tokens**

Run:
```bash
grep --count 'spicy-red' public/styles.css
```

Expected: At least 2 occurrences (variable declaration + badge usage).

**Step 4: Commit**

```bash
git add public/styles.css
git rm --cached public/.gitkeep 2>/dev/null || true
git commit -m "feat: add CSS design foundation with tokens and layout"
```

---

## Task 4: Template Prompt Files

Create the prompt files that guide the Amplifier agent when generating HTML pages. These are NOT rigid templates -- they're instructions the agent follows with creative freedom.

**Files:**
- Create: `build/templates/spec-page-prompt.md` (replacing `.gitkeep`)
- Create: `build/templates/library-index-prompt.md`

**Step 1: Create the spec page prompt**

Create file `build/templates/spec-page-prompt.md`:

```markdown
Generate a complete, self-contained HTML page for a single specification in the Spicy Specs pattern library.

## Spec Metadata

{{METADATA}}

## Rendered HTML Content

The following is the spec's markdown body already converted to HTML. Embed it directly in the page -- do not re-process or modify it:

{{HTML_CONTENT}}

## Page Requirements

1. Output ONLY the raw HTML document. No markdown fences, no explanatory text, no commentary. The very first characters of your response must be `<!DOCTYPE html>`.
2. Include `<!DOCTYPE html>` and a complete `<html lang="en">` document structure.
3. Link to `/styles.css` in the `<head>` (the stylesheet already exists; do not generate inline styles that duplicate it).
4. Set `<title>` to the spec title followed by " — Spicy Specs".
5. Add `<meta name="viewport" content="width=device-width, initial-scale=1">` and a `<meta name="description">` using the spec's summary.
6. Structure the page using semantic HTML5 elements: `<header>`, `<main>`, `<article>`, `<footer>`.
7. Use these CSS classes from the stylesheet (they are already styled -- just apply them):
   - `.site-header` — dark top bar containing site name and a link back to `/`
   - `.container` and `.content` — centered layout wrappers
   - `.badge .badge-{{CATEGORY}}` — colored category badge (e.g., `<span class="badge badge-philosophy">philosophy</span>`)
   - `.spec-header` — wrapper for the title block with border-bottom
   - `.spec-meta` — flex row of metadata items (author, date, tags)
   - `.spec-body` — wrapper around the rendered HTML content
   - `.spice-level` — container for chili emoji display
   - `.tag` — individual tag pills
   - `.site-footer` — bottom footer with site info
8. Display spice level as the chili emoji repeated N times where N is the spiceLevel value (e.g., spiceLevel 3 = three chili emojis).
9. Show tags as `.tag` elements inside the `.spec-meta` section.
10. Include a "Back to Library" link in the header that points to `/`.
11. The page must be fully readable and functional without any JavaScript.
12. Keep the HTML clean and minimal. Do not add features, scripts, or elements not listed here.
```

**Step 2: Create the library index prompt**

Create file `build/templates/library-index-prompt.md`:

```markdown
Generate a complete, self-contained HTML page for the Spicy Specs library homepage — a card grid showing all specifications in the library.

## Specs Index Data

The following JSON array contains metadata for every spec in the library:

{{SPECS_JSON}}

## Page Requirements

1. Output ONLY the raw HTML document. No markdown fences, no explanatory text, no commentary. The very first characters of your response must be `<!DOCTYPE html>`.
2. Include `<!DOCTYPE html>` and a complete `<html lang="en">` document structure.
3. Link to `/styles.css` in the `<head>` (the stylesheet already exists; do not generate inline styles that duplicate it).
4. Set `<title>` to "Spicy Specs — Curated Pattern Library for AI Agents".
5. Add `<meta name="viewport" content="width=device-width, initial-scale=1">` and a `<meta name="description">`.
6. Structure the page using semantic HTML5 elements: `<header>`, `<main>`, `<footer>`.
7. Use these CSS classes from the stylesheet (they are already styled -- just apply them):
   - `.site-header` — dark top bar with the site name "Spicy Specs" as an `<h1>` with gold color, plus a short tagline paragraph
   - `.container` — centered layout wrapper
   - `.specs-grid` — CSS grid container for the cards
   - `.spec-card` — individual card (make each card an `<a>` tag linking to `/e/[slug].html`)
   - `.badge .badge-[category]` — colored category badge inside each card
   - `.spice-level` — chili emoji display
   - `.summary` — summary paragraph
   - `.tags` and `.tag` — tag container and individual tag pills
   - `.site-footer` — bottom footer
8. For each spec in the JSON array, render a card showing: category badge, title, spice level (chili emojis repeated N times), summary, and tags.
9. Display a count of total specs somewhere on the page (e.g., "42 specs in the library").
10. The page must be fully readable and functional without any JavaScript.
11. Keep the HTML clean and minimal. Do not add features, scripts, or elements not listed here.
```

**Step 3: Remove the .gitkeep placeholder**

Run:
```bash
rm build/templates/.gitkeep
```

**Step 4: Verify both prompt files exist and contain expected content**

Run:
```bash
head -1 build/templates/spec-page-prompt.md
head -1 build/templates/library-index-prompt.md
```

Expected: First lines are "Generate a complete, self-contained HTML page for a single specification..." and "Generate a complete, self-contained HTML page for the Spicy Specs library homepage..." respectively.

**Step 5: Commit**

```bash
git add build/templates/spec-page-prompt.md build/templates/library-index-prompt.md
git rm --cached build/templates/.gitkeep 2>/dev/null || true
git commit -m "feat: add agent template prompts for spec and index pages"
```

---

## Task 5: Amplifier CLI Generator Module

Write the module that constructs prompts from templates + spec data and calls the Amplifier CLI to generate HTML. The prompt-building functions are pure and testable. The CLI invocation function is a thin wrapper around `execSync`.

**Files:**
- Create: `test/amplifier-generate.test.js`
- Create: `build/amplifier-generate.js`

**Step 1: Write the failing tests**

Create file `test/amplifier-generate.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { buildSpecPagePrompt, buildLibraryIndexPrompt } from '../build/amplifier-generate.js';

describe('buildSpecPagePrompt', () => {
  it('interpolates spec metadata and HTML content into the template', () => {
    const spec = {
      slug: 'test-spec',
      metadata: {
        title: 'Test Spec',
        category: 'pattern',
        spiceLevel: 2,
        tags: ['test'],
        summary: 'A test specification',
        author: 'tester',
        created: '2026-03-24',
        updated: '2026-03-24',
      },
      htmlContent: '<h1>Test</h1><p>Body content here</p>',
    };

    const prompt = buildSpecPagePrompt(spec, 'build/templates/spec-page-prompt.md');

    // Template placeholders are replaced
    expect(prompt).not.toContain('{{METADATA}}');
    expect(prompt).not.toContain('{{HTML_CONTENT}}');
    expect(prompt).not.toContain('{{CATEGORY}}');
    // Actual data is present
    expect(prompt).toContain('"title": "Test Spec"');
    expect(prompt).toContain('<h1>Test</h1><p>Body content here</p>');
    expect(prompt).toContain('badge-pattern');
  });
});

describe('buildLibraryIndexPrompt', () => {
  it('interpolates specs index JSON into the template', () => {
    const specsIndex = [
      {
        slug: 'test',
        title: 'Test',
        category: 'spec',
        spiceLevel: 1,
        tags: ['a'],
        summary: 'Test summary',
      },
    ];

    const prompt = buildLibraryIndexPrompt(specsIndex, 'build/templates/library-index-prompt.md');

    // Template placeholder is replaced
    expect(prompt).not.toContain('{{SPECS_JSON}}');
    // JSON data is embedded
    expect(prompt).toContain('"slug": "test"');
    expect(prompt).toContain('"title": "Test"');
  });
});
```

**Step 2: Run tests to verify they fail**

Run:
```bash
npx vitest run test/amplifier-generate.test.js
```

Expected: FAIL -- module `../build/amplifier-generate.js` does not exist.

**Step 3: Write the implementation**

Create file `build/amplifier-generate.js`:

```js
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

/**
 * Build the prompt for generating a single spec page.
 * Reads the template file and interpolates spec data into it.
 * @param {object} spec - Parsed spec object from parseSpec()
 * @param {string} templatePath - Path to spec-page-prompt.md
 * @returns {string} Complete prompt ready for the Amplifier agent
 */
export function buildSpecPagePrompt(spec, templatePath) {
  let template = readFileSync(templatePath, 'utf-8');

  const metadataStr = JSON.stringify(spec.metadata, null, 2);

  template = template.replaceAll('{{METADATA}}', metadataStr);
  template = template.replaceAll('{{HTML_CONTENT}}', spec.htmlContent);
  template = template.replaceAll('{{CATEGORY}}', spec.metadata.category);

  return template;
}

/**
 * Build the prompt for generating the library index page.
 * Reads the template file and interpolates the specs index JSON.
 * @param {Array} specsIndex - Specs index array from buildSpecsIndex()
 * @param {string} templatePath - Path to library-index-prompt.md
 * @returns {string} Complete prompt ready for the Amplifier agent
 */
export function buildLibraryIndexPrompt(specsIndex, templatePath) {
  let template = readFileSync(templatePath, 'utf-8');

  const specsJson = JSON.stringify(specsIndex, null, 2);
  template = template.replaceAll('{{SPECS_JSON}}', specsJson);

  return template;
}

/**
 * Call the Amplifier CLI with a prompt and return the agent's response.
 * Shells out to `amplifier run --mode single --output-format json`.
 * @param {string} prompt - The full prompt to send to the agent
 * @returns {string} The agent's response text (expected to be HTML)
 */
export function callAmplifier(prompt) {
  const output = execSync(
    'amplifier run --mode single --output-format json 2>/dev/null',
    {
      input: prompt,
      encoding: 'utf8',
      timeout: 120_000,
      maxBuffer: 10 * 1024 * 1024,
    }
  );

  // Output may contain non-JSON lines before the JSON block (e.g., "Bundle prepared")
  // Find the JSON object by matching the last {...} block
  const jsonMatch = output.match(/\{[\s\S]*\}\s*$/);
  if (!jsonMatch) {
    throw new Error('No JSON response found in Amplifier output');
  }

  const result = JSON.parse(jsonMatch[0]);

  if (result.status !== 'success') {
    throw new Error(`Amplifier returned status: ${result.status}`);
  }

  let html = result.response;

  // Strip markdown code fences if agent wrapped the output
  if (html.startsWith('```')) {
    html = html.replace(/^```(?:html)?\n/, '').replace(/\n```\s*$/, '');
  }

  return html.trim();
}
```

**Step 4: Run tests to verify they pass**

Run:
```bash
npx vitest run test/amplifier-generate.test.js
```

Expected: Both tests PASS.

**Step 5: Run the full test suite**

Run:
```bash
npm test
```

Expected: All tests PASS (13 existing + 2 new = 15 total).

**Step 6: Commit**

```bash
git add build/amplifier-generate.js test/amplifier-generate.test.js
git commit -m "feat: add Amplifier CLI generator with prompt builders and tests"
```

---

## Task 6: Build Orchestrator

Create the main build script that wires all modules together: discover specs, parse them, generate HTML pages via Amplifier, build the JSON index, and copy static assets to `dist/`.

**Files:**
- Create: `build/generate.js`

**Step 1: Create the build orchestrator**

Create file `build/generate.js`:

```js
import { mkdirSync, writeFileSync, copyFileSync, existsSync } from 'fs';
import { join } from 'path';
import { discoverSpecs, parseSpec } from './parse-specs.js';
import { buildSpecsIndex } from './build-index.js';
import {
  buildSpecPagePrompt,
  buildLibraryIndexPrompt,
  callAmplifier,
} from './amplifier-generate.js';

const DIST_DIR = 'dist';
const SPECS_DIR = 'specs';
const TEMPLATES_DIR = 'build/templates';
const PUBLIC_DIR = 'public';
const ASSETS_SRC = 'ui-studio/blueprints/library/assets';

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

function copyAssets() {
  // Copy CSS
  copyFileSync(join(PUBLIC_DIR, 'styles.css'), join(DIST_DIR, 'styles.css'));
  console.log('   styles.css');

  // Copy image assets
  const imageAssets = ['chili-icon-transparent.png', 'header-emblem-processed.png'];
  for (const asset of imageAssets) {
    const src = join(ASSETS_SRC, asset);
    if (existsSync(src)) {
      copyFileSync(src, join(DIST_DIR, 'assets', asset));
      console.log(`   assets/${asset}`);
    } else {
      console.warn(`   ⚠ Missing: ${src}`);
    }
  }
}

function build() {
  console.log('');
  console.log('  Spicy Specs Build');
  console.log('  =================');

  // 1. Discover and parse specs
  console.log('');
  console.log('  Discovering specs...');
  const specFiles = discoverSpecs(SPECS_DIR);
  console.log(`  Found ${specFiles.length} spec(s)`);

  const specs = [];
  for (const filePath of specFiles) {
    console.log(`  Parsing: ${filePath}`);
    specs.push(parseSpec(filePath));
  }

  // 2. Create output directories
  ensureDir(join(DIST_DIR, 'e'));
  ensureDir(join(DIST_DIR, 'assets'));

  // 3. Generate individual spec pages via Amplifier
  console.log('');
  console.log('  Generating spec pages...');
  for (const spec of specs) {
    process.stdout.write(`  [amplifier] ${spec.slug}...`);
    const prompt = buildSpecPagePrompt(
      spec,
      join(TEMPLATES_DIR, 'spec-page-prompt.md')
    );
    const html = callAmplifier(prompt);
    writeFileSync(join(DIST_DIR, 'e', `${spec.slug}.html`), html);
    console.log(' done');
  }

  // 4. Build specs.json index
  console.log('');
  console.log('  Building specs.json...');
  const specsIndex = buildSpecsIndex(specs);
  writeFileSync(
    join(DIST_DIR, 'specs.json'),
    JSON.stringify(specsIndex, null, 2)
  );
  console.log(`  ${specsIndex.length} entries written`);

  // 5. Generate library index page via Amplifier
  console.log('');
  process.stdout.write('  [amplifier] index.html...');
  const indexPrompt = buildLibraryIndexPrompt(
    specsIndex,
    join(TEMPLATES_DIR, 'library-index-prompt.md')
  );
  const indexHtml = callAmplifier(indexPrompt);
  writeFileSync(join(DIST_DIR, 'index.html'), indexHtml);
  console.log(' done');

  // 6. Copy static assets
  console.log('');
  console.log('  Copying static assets...');
  copyAssets();

  // Done
  console.log('');
  console.log(`  Build complete: ${specs.length} spec page(s) + index`);
  console.log(`  Output: ${DIST_DIR}/`);
  console.log('');
}

try {
  build();
} catch (err) {
  console.error('');
  console.error(`  Build failed: ${err.message}`);
  console.error('');
  process.exit(1);
}
```

**Step 2: Verify the script can be loaded (syntax check)**

Run:
```bash
node -e "import('./build/generate.js').catch(() => {})" 2>&1 || echo "Syntax OK or expected import error"
```

This just confirms there are no syntax errors. The actual build will run in the next task.

**Step 3: Commit**

```bash
git add build/generate.js
git commit -m "feat: add build orchestrator wiring all modules together"
```

---

## Task 7: Run the Build

Execute the full build pipeline. This is the moment of truth -- Amplifier agents will generate HTML pages from the seed spec.

**Files:**
- No new files. Verifies existing files produce correct output in `dist/`.

**Step 1: Run the build**

Run:
```bash
npm run build
```

This will take 30-60 seconds because it makes two Amplifier CLI calls (one for the spec page, one for the index). Watch the console output for progress.

Expected output (approximately):
```
  Spicy Specs Build
  =================

  Discovering specs...
  Found 1 spec(s)
  Parsing: specs/philosophy/ruthless-simplicity.md

  Generating spec pages...
  [amplifier] ruthless-simplicity... done

  Building specs.json...
  1 entries written

  [amplifier] index.html... done

  Copying static assets...
   styles.css
   assets/chili-icon-transparent.png
   assets/header-emblem-processed.png

  Build complete: 1 spec page(s) + index
  Output: dist/
```

If the build fails, check:
- Is `amplifier` CLI installed and in PATH? Run `which amplifier` to verify.
- Is an API provider configured? Run `amplifier provider list` to check.
- Are there network issues? The Amplifier CLI needs to reach the LLM API.

**Step 2: Verify the output directory structure**

Run:
```bash
find dist -type f | sort
```

Expected:
```
dist/assets/chili-icon-transparent.png
dist/assets/header-emblem-processed.png
dist/e/ruthless-simplicity.html
dist/index.html
dist/specs.json
dist/styles.css
```

**Step 3: Verify the generated HTML is valid**

Run:
```bash
head -3 dist/index.html
```

Expected: First line should be `<!DOCTYPE html>` (the agent was instructed to start with this).

Run:
```bash
head -3 dist/e/ruthless-simplicity.html
```

Expected: Same -- starts with `<!DOCTYPE html>`.

**Step 4: Verify specs.json content**

Run:
```bash
cat dist/specs.json
```

Expected output:
```json
[
  {
    "slug": "ruthless-simplicity",
    "title": "Ruthless Simplicity",
    "category": "philosophy",
    "spiceLevel": 3,
    "tags": [
      "simplicity",
      "yagni",
      "less-is-more",
      "mvp"
    ],
    "summary": "Build the simplest thing that could possibly work, then iterate. Complexity is a debt that compounds.",
    "author": "spicy-specs-team",
    "created": "2026-03-24",
    "updated": "2026-03-24"
  }
]
```

**Step 5: Verify the CSS was copied correctly**

Run:
```bash
grep 'spicy-red' dist/styles.css | head -1
```

Expected: `  --spicy-red: #A83232;`

**Step 6: Preview the site in a browser**

Run:
```bash
npx serve dist -l 3000 &
echo "Site available at http://localhost:3000"
```

Open these URLs in a browser and verify:
- `http://localhost:3000/` -- Library index with card for "Ruthless Simplicity"
- `http://localhost:3000/e/ruthless-simplicity.html` -- Full spec page with content
- Pages use the Spicy Specs color scheme (dark header, parchment background, gold accents)
- Content is readable without JavaScript

Then stop the server:
```bash
kill %1 2>/dev/null
```

If a page doesn't look right (wrong colors, missing content, broken layout), the issue is likely in the Amplifier-generated HTML not using the correct CSS classes. Re-run the build -- each run produces fresh agent output that may vary slightly.

---

## Task 8: All Tests Green + Final Commit

Run the complete test suite to confirm nothing is broken, then make the final commit for Phase 1B.

**Step 1: Run all tests**

Run:
```bash
npm test
```

Expected: All 15 tests PASS:
- `test/validate-frontmatter.test.js` (5 tests) -- from Phase 1A
- `test/specs-valid.test.js` (2 tests) -- from Phase 1A
- `test/parse-specs.test.js` (3 tests) -- Task 1
- `test/build-index.test.js` (3 tests) -- Task 2
- `test/amplifier-generate.test.js` (2 tests) -- Task 5

**Step 2: Verify git status is clean except dist/**

Run:
```bash
git status
```

Expected: Only untracked files in `dist/` (which is gitignored). All source files should be committed.

If any source files are uncommitted, stage and commit them now:
```bash
git add -A
git status
```

**Step 3: Final commit (if needed) and push**

If there are any remaining changes:
```bash
git commit -m "chore: Phase 1B complete — build pipeline with agentic HTML generation"
```

Push to remote:
```bash
git push origin main
```

---

## Summary

### What Was Built

| File | Purpose |
|------|---------|
| `build/parse-specs.js` | Discovers and parses markdown spec files |
| `build/build-index.js` | Builds JSON metadata index from parsed specs |
| `build/amplifier-generate.js` | Constructs prompts and calls Amplifier CLI for HTML generation |
| `build/generate.js` | Main build orchestrator (entry point for `npm run build`) |
| `build/templates/spec-page-prompt.md` | Agent prompt template for individual spec pages |
| `build/templates/library-index-prompt.md` | Agent prompt template for the library index page |
| `public/styles.css` | CSS with design tokens, typography, and layout classes |
| `test/parse-specs.test.js` | Tests for spec discovery and parsing |
| `test/build-index.test.js` | Tests for JSON index builder |
| `test/amplifier-generate.test.js` | Tests for prompt construction |

### Commits (Expected)

1. `feat: add spec discovery and parsing module with tests` (Task 1)
2. `feat: add specs JSON index builder with tests` (Task 2)
3. `feat: add CSS design foundation with tokens and layout` (Task 3)
4. `feat: add agent template prompts for spec and index pages` (Task 4)
5. `feat: add Amplifier CLI generator with prompt builders and tests` (Task 5)
6. `feat: add build orchestrator wiring all modules together` (Task 6)
7. `chore: Phase 1B complete — build pipeline with agentic HTML generation` (Task 8)

### Success Criteria

- [x] `npm run build` generates complete static site in `dist/`
- [x] Individual spec pages render markdown content with metadata
- [x] Library index shows grid of all specs with category badges
- [x] `specs.json` contains metadata for all specs
- [x] Pages are readable in a browser without JavaScript
- [x] Design tokens applied (Spicy Red, Parchment, Gold, Dark)
- [x] All tests passing (15 total)

### What's Next

**Phase 1C (future)** could add:
- Client-side filtering JavaScript (`public/app.js`)
- GitHub Actions CD pipeline (`.github/workflows/deploy.yml`)
- Search page stub for when the API layer is ready
- Additional seed specs to test multi-card layout
