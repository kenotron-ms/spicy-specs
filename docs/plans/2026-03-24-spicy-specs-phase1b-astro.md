# Spicy Specs Phase 1B: Astro Static Site

> **Execution:** Use the subagent-driven-development workflow to implement this plan.

**Goal:** Replace custom build pipeline with Astro to generate a working static site from markdown specs  
**Architecture:** Adopt Astro's content collections for spec management, use `.astro` components for layouts, generate static HTML with Cloudflare Pages adapter  
**Tech Stack:** Astro 5, Cloudflare Pages adapter, content collections, existing vitest tests

---

## Context

Phase 1A delivered frontmatter validation, test infrastructure, seed spec, and directory structure. We initially planned to build a custom static site generator with agentic HTML generation, but decided to **adopt Astro** instead to focus on what's unique (semantic search, CLI, MCP, curated content).

Agents help **AUTHOR markdown specs**. Astro handles the boring HTML generation.

## What We're Keeping from Phase 1A

- ✅ `specs/` directory with markdown files and subdirectories
- ✅ Frontmatter schema (title, slug, category, spiceLevel, tags, summary, author, dates)
- ✅ Seed spec (`specs/philosophy/ruthless-simplicity.md`)
- ✅ Design tokens (Spicy Red #A83232, Parchment #EFE7CD, Gold #C9975B, Dark #2D2D2D)
- ✅ Validation utility at `build/validate-frontmatter.js` (still useful for pre-commit checks)
- ✅ All existing vitest tests

## What We're Replacing

- ❌ Custom build script → Astro's build system
- ❌ Template files → Astro layouts/components
- ❌ Manual markdown conversion (`marked`) → Astro's built-in markdown handling

## Success Criteria

- [ ] `npm run build` generates complete static site in `dist/`
- [ ] `npm run dev` runs Astro dev server with hot reload
- [ ] Library index shows grid of all specs with category badges
- [ ] Individual spec pages render markdown content with metadata
- [ ] Design tokens applied (Spicy Red, Parchment, Gold, Dark)
- [ ] All existing validation tests still pass
- [ ] Site is readable without JavaScript (Astro default)

---

## Task 1: Install Astro and Configure Project

**Files:**
- Modify: `package.json`
- Create: `astro.config.mjs`

**Step 1: Install Astro dependencies**

Run:
```bash
npm install astro@^5.0.0 @astrojs/cloudflare@^12.0.0
```

Expected: Dependencies added to `package.json`, `node_modules` updated

**Step 2: Remove replaced dependencies**

Run:
```bash
npm uninstall marked commander
```

Expected: `marked` and `commander` removed from `package.json`  
(We keep `gray-matter` for validation utility, keep `vitest` for tests)

**Step 3: Update build scripts in package.json**

Edit the `scripts` section to:
```json
"scripts": {
  "build": "astro build",
  "dev": "astro dev",
  "preview": "astro preview",
  "test": "vitest run",
  "test:watch": "vitest",
  "dev:workers": "wrangler dev workers/index.js"
}
```

**Step 4: Create Astro config**

Create: `astro.config.mjs`
```js
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  site: 'https://spicy-specs.com',
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: false,
    },
  },
});
```

**Step 5: Verify Astro runs**

Run: `npm run dev`

Expected: Astro dev server starts (may show 404 since we have no pages yet)  
Output should include: `astro v5.x.x started in XXXms`

Stop the server (Ctrl+C).

**Step 6: Commit**

```bash
git add package.json package-lock.json astro.config.mjs
git commit -m "feat: install Astro with Cloudflare adapter"
```

---

## Task 2: Create Astro Directory Structure

**Files:**
- Create: `src/` directory
- Create: `src/content/` directory
- Create: `src/layouts/` directory
- Create: `src/pages/` directory
- Create: `src/styles/` directory
- Create symlink: `src/content/specs` → `../../specs`

**Step 1: Create Astro directories**

Run:
```bash
mkdir -p src/content src/layouts src/pages src/styles
```

Expected: New directories created under `src/`

**Step 2: Create symlink for specs**

Run:
```bash
cd src/content && ln -s ../../specs specs && cd ../..
```

Expected: `src/content/specs` symlinks to `specs/` at repo root

**Step 3: Verify symlink works**

Run:
```bash
ls -la src/content/specs
```

Expected: Output shows symlink pointing to `../../specs` and lists subdirectories (philosophy/, patterns/, etc.)

**Step 4: Commit**

```bash
git add src/
git commit -m "feat: create Astro directory structure with specs symlink"
```

---

## Task 3: Configure Content Collections Schema

**Files:**
- Create: `src/content/config.ts`

**Step 1: Create content collections config**

Create: `src/content/config.ts`
```typescript
import { defineCollection, z } from 'astro:content';

const specsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    category: z.enum(['spec', 'antipattern', 'reference-app', 'pattern', 'philosophy']),
    spiceLevel: z.number().min(0).max(5).optional(),
    tags: z.array(z.string()).optional(),
    summary: z.string(),
    created: z.string(),
    updated: z.string(),
    author: z.string(),
  }),
});

export const collections = {
  specs: specsCollection,
};
```

**Step 2: Verify schema works with dev server**

Run: `npm run dev`

Expected: Astro starts without errors, content collection is recognized  
Check terminal output for content collection messages

Stop the server (Ctrl+C).

**Step 3: Commit**

```bash
git add src/content/config.ts
git commit -m "feat: configure content collections for specs"
```

---

## Task 4: Create Global CSS with Design Tokens

**Files:**
- Create: `src/styles/global.css`

**Step 1: Create global stylesheet**

Create: `src/styles/global.css`
```css
/* Design Tokens */
:root {
  --spicy-red: #A83232;
  --parchment: #EFE7CD;
  --gold: #C9975B;
  --dark: #2D2D2D;
  
  --font-display: Georgia, serif;
  --font-ui: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  --font-code: 'Courier New', Courier, monospace;
  
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
}

/* Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-ui);
  color: var(--dark);
  background-color: var(--parchment);
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  margin-top: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  color: var(--dark);
}

h1 {
  font-size: 2.5rem;
  color: var(--spicy-red);
}

h2 {
  font-size: 2rem;
}

h3 {
  font-size: 1.5rem;
}

a {
  color: var(--spicy-red);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

code {
  font-family: var(--font-code);
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.125rem 0.25rem;
  border-radius: 3px;
  font-size: 0.9em;
}

pre {
  background-color: var(--dark);
  color: var(--parchment);
  padding: var(--spacing-sm);
  border-radius: 5px;
  overflow-x: auto;
  margin: var(--spacing-sm) 0;
}

pre code {
  background: none;
  color: inherit;
  padding: 0;
}

/* Utility Classes */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-spec { background-color: #3B82F6; color: white; }
.badge-pattern { background-color: #10B981; color: white; }
.badge-antipattern { background-color: #EF4444; color: white; }
.badge-philosophy { background-color: var(--gold); color: var(--dark); }
.badge-reference-app { background-color: #8B5CF6; color: white; }
```

**Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: create global CSS with design tokens"
```

---

## Task 5: Create Base Layout

**Files:**
- Create: `src/layouts/BaseLayout.astro`

**Step 1: Create base layout**

Create: `src/layouts/BaseLayout.astro`
```astro
---
interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Curated library of specs, patterns, and anti-patterns for AI agents' } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content={description}>
  <title>{title} | Spicy Specs</title>
  <link rel="stylesheet" href="/styles/global.css">
</head>
<body>
  <header class="site-header">
    <div class="container">
      <h1 class="site-title">🌶️ Spicy Specs</h1>
      <nav>
        <a href="/">Library</a>
      </nav>
    </div>
  </header>
  
  <main class="container">
    <slot />
  </main>
  
  <footer class="site-footer">
    <div class="container">
      <p>&copy; 2026 Spicy Specs. Built with Astro.</p>
    </div>
  </footer>
</body>
</html>

<style>
  .site-header {
    background-color: var(--spicy-red);
    color: var(--parchment);
    padding: var(--spacing-md) 0;
    margin-bottom: var(--spacing-xl);
  }
  
  .site-title {
    margin: 0;
    font-size: 2rem;
    color: var(--parchment);
  }
  
  .site-header nav {
    margin-top: var(--spacing-sm);
  }
  
  .site-header a {
    color: var(--parchment);
    margin-right: var(--spacing-md);
    font-weight: 600;
  }
  
  .site-header a:hover {
    color: var(--gold);
  }
  
  .site-footer {
    margin-top: var(--spacing-xl);
    padding: var(--spacing-lg) 0;
    border-top: 2px solid var(--spicy-red);
    text-align: center;
    color: var(--dark);
  }
</style>
```

**Step 2: Verify base layout**

Run: `npm run dev`

Expected: Dev server starts without errors  
(We'll see the layout in action when we create pages)

Stop the server (Ctrl+C).

**Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: create base layout with header and footer"
```

---

## Task 6: Create Spec Layout

**Files:**
- Create: `src/layouts/SpecLayout.astro`

**Step 1: Create spec-specific layout**

Create: `src/layouts/SpecLayout.astro`
```astro
---
import BaseLayout from './BaseLayout.astro';

interface Props {
  title: string;
  category: string;
  spiceLevel?: number;
  tags?: string[];
  summary: string;
  created: string;
  updated: string;
  author: string;
}

const { title, category, spiceLevel, tags, summary, created, updated, author } = Astro.props;

function getChiliRating(level: number | undefined): string {
  if (!level) return '';
  return '🌶️'.repeat(Math.min(level, 5));
}
---

<BaseLayout title={title} description={summary}>
  <article class="spec-page">
    <header class="spec-header">
      <div class="spec-meta">
        <span class={`badge badge-${category}`}>{category}</span>
        {spiceLevel && <span class="chili-rating">{getChiliRating(spiceLevel)}</span>}
      </div>
      <h1>{title}</h1>
      <p class="spec-summary">{summary}</p>
      <div class="spec-details">
        <span>By {author}</span>
        <span>Created: {created}</span>
        {updated !== created && <span>Updated: {updated}</span>}
      </div>
      {tags && tags.length > 0 && (
        <div class="spec-tags">
          {tags.map(tag => <span class="tag">#{tag}</span>)}
        </div>
      )}
    </header>
    
    <div class="spec-content">
      <slot />
    </div>
  </article>
</BaseLayout>

<style>
  .spec-page {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .spec-header {
    margin-bottom: var(--spacing-xl);
    padding-bottom: var(--spacing-lg);
    border-bottom: 2px solid var(--spicy-red);
  }
  
  .spec-meta {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
  }
  
  .chili-rating {
    font-size: 1.5rem;
    line-height: 1;
  }
  
  .spec-summary {
    font-size: 1.25rem;
    color: var(--dark);
    margin: var(--spacing-sm) 0;
  }
  
  .spec-details {
    display: flex;
    gap: var(--spacing-md);
    font-size: 0.9rem;
    color: #666;
    margin-top: var(--spacing-sm);
  }
  
  .spec-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
    margin-top: var(--spacing-sm);
  }
  
  .tag {
    background-color: rgba(168, 50, 50, 0.1);
    color: var(--spicy-red);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.875rem;
  }
  
  .spec-content {
    line-height: 1.8;
  }
  
  .spec-content :global(h2) {
    margin-top: var(--spacing-lg);
    border-bottom: 1px solid #ddd;
    padding-bottom: var(--spacing-xs);
  }
  
  .spec-content :global(ul),
  .spec-content :global(ol) {
    margin-left: var(--spacing-md);
    margin-top: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
  }
  
  .spec-content :global(li) {
    margin-bottom: var(--spacing-xs);
  }
</style>
```

**Step 2: Commit**

```bash
git add src/layouts/SpecLayout.astro
git commit -m "feat: create spec layout with metadata and styling"
```

---

## Task 7: Create Library Index Page

**Files:**
- Create: `src/pages/index.astro`

**Step 1: Create homepage with spec grid**

Create: `src/pages/index.astro`
```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';

const allSpecs = await getCollection('specs');

// Sort by updated date (most recent first)
const sortedSpecs = allSpecs.sort((a, b) => {
  const dateA = new Date(a.data.updated);
  const dateB = new Date(b.data.updated);
  return dateB.getTime() - dateA.getTime();
});

function getChiliRating(level: number | undefined): string {
  if (!level) return '';
  return '🌶️'.repeat(Math.min(level, 5));
}
---

<BaseLayout title="Library">
  <div class="library-intro">
    <h1>Spicy Specs Library</h1>
    <p>Curated specifications, patterns, and anti-patterns for AI agents and humans who care about quality.</p>
  </div>
  
  <div class="spec-grid">
    {sortedSpecs.map((spec) => (
      <article class="spec-card">
        <div class="card-header">
          <span class={`badge badge-${spec.data.category}`}>{spec.data.category}</span>
          {spec.data.spiceLevel && (
            <span class="chili-rating">{getChiliRating(spec.data.spiceLevel)}</span>
          )}
        </div>
        <h2>
          <a href={`/e/${spec.data.slug}`}>{spec.data.title}</a>
        </h2>
        <p class="card-summary">{spec.data.summary}</p>
        <div class="card-meta">
          <span class="author">By {spec.data.author}</span>
          <span class="date">{spec.data.updated}</span>
        </div>
        {spec.data.tags && spec.data.tags.length > 0 && (
          <div class="card-tags">
            {spec.data.tags.slice(0, 3).map(tag => (
              <span class="tag">#{tag}</span>
            ))}
          </div>
        )}
      </article>
    ))}
  </div>
</BaseLayout>

<style>
  .library-intro {
    text-align: center;
    margin-bottom: var(--spacing-xl);
  }
  
  .library-intro h1 {
    font-size: 3rem;
    margin-bottom: var(--spacing-sm);
  }
  
  .library-intro p {
    font-size: 1.25rem;
    color: #666;
  }
  
  .spec-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: var(--spacing-lg);
    margin-top: var(--spacing-xl);
  }
  
  .spec-card {
    background-color: white;
    border: 2px solid #ddd;
    border-radius: 8px;
    padding: var(--spacing-md);
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  
  .spec-card:hover {
    border-color: var(--spicy-red);
    box-shadow: 0 4px 12px rgba(168, 50, 50, 0.1);
  }
  
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--spacing-sm);
  }
  
  .chili-rating {
    font-size: 1.25rem;
    line-height: 1;
  }
  
  .spec-card h2 {
    font-size: 1.5rem;
    margin: var(--spacing-sm) 0;
  }
  
  .spec-card h2 a {
    color: var(--dark);
  }
  
  .spec-card h2 a:hover {
    color: var(--spicy-red);
  }
  
  .card-summary {
    color: #666;
    margin: var(--spacing-sm) 0;
    line-height: 1.6;
  }
  
  .card-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    color: #999;
    margin-top: var(--spacing-sm);
    padding-top: var(--spacing-sm);
    border-top: 1px solid #eee;
  }
  
  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
    margin-top: var(--spacing-sm);
  }
  
  .tag {
    background-color: rgba(168, 50, 50, 0.1);
    color: var(--spicy-red);
    padding: 0.125rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
  }
</style>
```

**Step 2: Test homepage in dev server**

Run: `npm run dev`

Expected: Dev server starts, navigate to `http://localhost:4321`  
Should see: Library page with "Ruthless Simplicity" spec card displayed

**Step 3: Verify spec card displays correctly**

Check in browser:
- Category badge shows "philosophy"
- Chili rating shows 🌶️🌶️🌶️ (3 chilies)
- Title, summary, author, date visible
- Tags visible (#simplicity, #yagni, etc.)

Stop the server (Ctrl+C).

**Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: create library index page with spec grid"
```

---

## Task 8: Create Dynamic Spec Page Routes

**Files:**
- Create: `src/pages/e/[slug].astro`

**Step 1: Create dynamic route for individual specs**

Create: `src/pages/e/[slug].astro`
```astro
---
import { getCollection } from 'astro:content';
import SpecLayout from '../../layouts/SpecLayout.astro';

export async function getStaticPaths() {
  const specs = await getCollection('specs');
  return specs.map((spec) => ({
    params: { slug: spec.data.slug },
    props: { spec },
  }));
}

const { spec } = Astro.props;
const { Content } = await spec.render();
---

<SpecLayout
  title={spec.data.title}
  category={spec.data.category}
  spiceLevel={spec.data.spiceLevel}
  tags={spec.data.tags}
  summary={spec.data.summary}
  created={spec.data.created}
  updated={spec.data.updated}
  author={spec.data.author}
>
  <Content />
</SpecLayout>
```

**Step 2: Test spec page in dev server**

Run: `npm run dev`

Expected: Dev server starts, navigate to `http://localhost:4321/e/ruthless-simplicity`  
Should see: Full spec page with rendered markdown content

**Step 3: Verify spec page displays correctly**

Check in browser:
- Header shows category badge and chili rating
- Title and summary display
- Metadata (author, dates) visible
- Tags display
- Markdown content renders with proper headings, lists, formatting
- Links from homepage work

Stop the server (Ctrl+C).

**Step 4: Commit**

```bash
git add src/pages/e/
git commit -m "feat: create dynamic spec page routes"
```

---

## Task 9: Build Static Site and Verify

**Files:**
- Verify: `dist/` directory (generated)

**Step 1: Build static site**

Run: `npm run build`

Expected: Build completes successfully  
Output should show:
- Content collections processed
- Pages generated (index.html, e/ruthless-simplicity/index.html)
- Static assets copied
- Build complete

**Step 2: Verify dist directory structure**

Run:
```bash
ls -la dist/
ls -la dist/e/
```

Expected:
- `dist/index.html` exists
- `dist/e/ruthless-simplicity/index.html` exists
- `dist/_astro/` contains compiled assets

**Step 3: Preview built site**

Run: `npm run preview`

Expected: Preview server starts, navigate to shown URL  
Site should work identically to dev server

**Step 4: Test navigation**

In browser:
1. Visit homepage → should show spec grid
2. Click "Ruthless Simplicity" card → should navigate to spec page
3. Click "Library" in header → should return to homepage

Stop the preview server (Ctrl+C).

**Step 5: Verify existing tests still pass**

Run: `npm test`

Expected: All 7 tests pass  
- validateFrontmatter tests: 5 passing
- spec files validation tests: 2 passing (at least one spec, ruthless-simplicity valid)

**Step 6: Commit**

```bash
git add dist/
git commit -m "build: generate static site with Astro"
```

---

## Task 10: Update Documentation and Final Commit

**Files:**
- Modify: `README.md`

**Step 1: Update README with new commands**

Edit `README.md` to reflect Astro setup:

```markdown
# Spicy Specs

Curated library of specifications, patterns, and anti-patterns for AI agents.

## Development

```bash
# Install dependencies
npm install

# Run dev server (http://localhost:4321)
npm run dev

# Build static site
npm run build

# Preview built site
npm run preview

# Run tests
npm test
```

## Project Structure

```
specs/              # Markdown specs organized by category
src/
  content/
    specs/          # Symlink to specs/ (Astro content collection)
  layouts/          # Astro layouts
  pages/            # Astro pages (become routes)
  styles/           # Global CSS with design tokens
build/              # Validation utilities (still used)
test/               # Vitest tests
```

## Adding a New Spec

1. Create markdown file in appropriate category: `specs/[category]/[slug].md`
2. Add required frontmatter (see existing specs for schema)
3. Run `npm test` to validate frontmatter
4. Commit and push - site rebuilds automatically

## Phase 1A Complete ✓

- Frontmatter validation utility
- Test infrastructure with vitest
- Seed spec (Ruthless Simplicity)
- Design tokens defined

## Phase 1B Complete ✓

- Astro static site generator
- Content collections for specs
- Library index page
- Individual spec pages
- Design tokens applied
```

**Step 2: Commit README update**

```bash
git add README.md
git commit -m "docs: update README for Astro setup"
```

**Step 3: Final verification**

Run:
```bash
npm test && npm run build
```

Expected: All tests pass, build succeeds

**Step 4: Review changes**

Run: `git log --oneline -10`

Expected: See all commits from this phase:
- Install Astro
- Create directory structure
- Configure content collections
- Create CSS and layouts
- Create pages
- Build verification
- Documentation update

---

## Phase 1B Complete! 🎉

You now have:
- ✅ Working Astro static site with Cloudflare adapter
- ✅ Content collections configured for `specs/` directory
- ✅ Library index page with spec grid
- ✅ Individual spec pages with markdown rendering
- ✅ Design tokens applied (Spicy Red, Parchment, Gold, Dark)
- ✅ All existing validation tests passing
- ✅ Dev server with hot reload (`npm run dev`)
- ✅ Static build pipeline (`npm run build`)

## Next Steps (Phase 1C)

- Embedding generation script (OpenAI → Cloudflare Vectorize)
- Search API (Cloudflare Workers)
- Heat/voting API (Cloudflare Workers)
- Client-side enhancements (search UI, voting buttons)

## Troubleshooting

**If content collection not found:**
- Verify symlink: `ls -la src/content/specs`
- Restart dev server after creating symlink

**If CSS not loading:**
- Check `public/` directory doesn't have conflicting files
- Verify path in BaseLayout is `/styles/global.css` (not `../styles`)

**If builds fail:**
- Check all specs have valid frontmatter: `npm test`
- Ensure Node.js >= 20: `node --version`
