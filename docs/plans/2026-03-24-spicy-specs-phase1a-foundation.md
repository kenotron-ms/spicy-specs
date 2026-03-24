# Spicy Specs Phase 1A: Foundation & Cleanup

> **Execution:** Use the subagent-driven-development workflow to implement this plan.

**Goal:** Clean up old experiments, scaffold the fresh Node.js project structure, and create a seed spec with frontmatter validation — establishing the foundation for the build pipeline (Plan 2) and API/CLI/MCP (Plan 3).

**Architecture:** Content-as-code workflow where markdown specs live in `specs/[category]/` directories with YAML frontmatter. A custom Node.js build script (Plan 2) will parse these into a static site deployed to Cloudflare Pages. This plan creates the empty scaffold and validates the content model with a seed spec.

**Tech Stack:** Node.js 20, vitest (testing), gray-matter (frontmatter parsing), marked (markdown→HTML), commander (CLI), wrangler (Cloudflare Workers)

**Reference Design:** `docs/plans/2026-03-24-spicy-specs-phase1-design.md`

---

## Task 1: Remove Old React Clickthrough App

The old React clickthrough app (Vite + Tailwind + JSX) has been deleted from the working tree but the deletions are **not staged**. Stage and commit them.

**Files:**
- Remove: `index.html`, `package.json`, `package-lock.json`, `postcss.config.js`, `tailwind.config.js`, `vite.config.js`
- Remove: `src/` (all JSX components, screens, data, CSS)

**Step 1: Verify the React files are deleted from disk**

Run:
```bash
git status --short | grep 'D '
```

Expected: ~20 files containing `D` (some may be staged `D `, some unstaged ` D`). You should see `index.html`, `package.json`, `vite.config.js`, `src/App.jsx`, all the `src/components/*.jsx`, `src/screens/*.jsx`, etc.

**Step 2: Stage and commit the deletions**

Run:
```bash
git add -u
git commit -m "chore: remove old React clickthrough app"
```

Expected: Commit succeeds, 20 files deleted. `git add -u` stages all tracked-file changes (deletions).

---

## Task 2: Delete Untracked Experiment Files

Remove HTML mockups, Python scripts, forge output, and temp directories that are no longer needed. Keep design references (blueprints, frames, storyboards, moodboard).

**Files:**
- Delete: `community-notes.html`
- Delete: `library.html`
- Delete: `reference-entry.html`
- Delete: `search-results.html`
- Delete: `spec-entry.html`
- Delete: `generate_card_blueprint.py`
- Delete: `ui-studio/forge/` (entire directory — 56MB of old React forge output)
- Delete: `ui-studio/components/` (entire directory — 7.3MB of old component experiments)
- Delete: `ui-studio/blueprints/library/assets/temp/` (temp processing artifacts)
- Delete: `dist/` (36MB of old build output, already gitignored)
- Delete: `.ruff_cache/` (Python linter cache from old script)

**Step 1: Delete all untracked experiment files**

Run:
```bash
rm -f community-notes.html library.html reference-entry.html search-results.html spec-entry.html
rm -f generate_card_blueprint.py
rm -rf ui-studio/forge/
rm -rf ui-studio/components/
rm -rf ui-studio/blueprints/library/assets/temp/
rm -rf dist/
rm -rf .ruff_cache/
```

**Step 2: Verify only design references remain in ui-studio**

Run:
```bash
find ui-studio -type d -not -path '*/\.*' | sort
```

Expected output (only blueprints, frames, storyboards, moodboard, archived):
```
ui-studio
ui-studio/archived
ui-studio/blueprints
ui-studio/blueprints/community-notes
ui-studio/blueprints/community-notes/assets
ui-studio/blueprints/library
ui-studio/blueprints/library/assets
ui-studio/blueprints/reference-entry
ui-studio/blueprints/reference-entry/assets
ui-studio/blueprints/search-results
ui-studio/blueprints/search-results/assets
ui-studio/blueprints/spec-entry
ui-studio/blueprints/spec-entry/assets
ui-studio/frames
ui-studio/frames/community-notes
ui-studio/frames/library
ui-studio/frames/reference-entry
ui-studio/frames/search-results
ui-studio/frames/spec-entry
ui-studio/moodboard
ui-studio/moodboard/reference
ui-studio/storyboards
```

No `forge/`, `components/`, or `temp/` directories should appear.

**Step 3: Verify no HTML or Python files remain in root**

Run:
```bash
ls *.html *.py 2>/dev/null || echo "Clean — no stray files"
```

Expected: `Clean — no stray files`

**Step 4: Stage design reference files and commit**

The approved frames and statechart are currently untracked. Stage and commit everything:

Run:
```bash
git add ui-studio/frames/community-notes/approved.png
git add ui-studio/frames/library/approved.png
git add ui-studio/frames/reference-entry/approved.png
git add ui-studio/frames/search-results/approved.png
git add ui-studio/frames/spec-entry/approved.png
git add ui-studio/storyboards/statechart.md
git add ui-studio/blueprints/library/assets/chili-icon-transparent.png
git add ui-studio/blueprints/library/assets/header-emblem-processed.png
git commit -m "chore: remove experiments, preserve design references"
```

Expected: Commit succeeds. Untracked experiment files are gone; design references are tracked.

---

## Task 3: Initialize Fresh Node.js Project

Create a new `package.json` from scratch with all Phase 1 dependencies and scripts.

**Files:**
- Create: `package.json`

**Step 1: Create package.json**

Create file `package.json` with this exact content:

```json
{
  "name": "spicy-specs",
  "version": "0.1.0",
  "description": "Curated library of specs, patterns, and anti-patterns for AI agents",
  "type": "module",
  "scripts": {
    "build": "node build/generate.js",
    "test": "vitest run",
    "test:watch": "vitest",
    "dev:workers": "wrangler dev workers/index.js",
    "preview": "npx serve dist"
  },
  "keywords": ["specs", "patterns", "anti-patterns", "ai-agents"],
  "license": "MIT",
  "engines": {
    "node": ">=20"
  },
  "dependencies": {
    "commander": "^14.0.3",
    "gray-matter": "^4.0.3",
    "marked": "^17.0.5"
  },
  "devDependencies": {
    "vitest": "^4.1.1",
    "wrangler": "^4.77.0"
  }
}
```

**Step 2: Install dependencies**

Run:
```bash
npm install
```

Expected: Installs successfully. `node_modules/` directory appears. `package-lock.json` is generated.

**Step 3: Verify installation**

Run:
```bash
npx vitest --version
```

Expected: Prints vitest version (e.g., `vitest/4.1.1`).

---

## Task 4: Create Project Directory Structure

Create all directories defined in the design document. Use `.gitkeep` files so empty directories are tracked by git.

**Files:**
- Create: `specs/patterns/.gitkeep`
- Create: `specs/antipatterns/.gitkeep`
- Create: `specs/reference-apps/.gitkeep`
- Create: `specs/philosophy/.gitkeep`
- Create: `specs/specs/.gitkeep`
- Create: `build/templates/.gitkeep`
- Create: `workers/.gitkeep`
- Create: `cli/.gitkeep`
- Create: `mcp/.gitkeep`
- Create: `public/.gitkeep`
- Create: `.github/workflows/.gitkeep`
- Create: `test/.gitkeep`

**Step 1: Create all directories with .gitkeep files**

Run:
```bash
mkdir -p specs/patterns specs/antipatterns specs/reference-apps specs/philosophy specs/specs
mkdir -p build/templates
mkdir -p workers cli mcp public
mkdir -p .github/workflows
mkdir -p test

touch specs/patterns/.gitkeep
touch specs/antipatterns/.gitkeep
touch specs/reference-apps/.gitkeep
touch specs/philosophy/.gitkeep
touch specs/specs/.gitkeep
touch build/templates/.gitkeep
touch workers/.gitkeep
touch cli/.gitkeep
touch mcp/.gitkeep
touch public/.gitkeep
touch .github/workflows/.gitkeep
touch test/.gitkeep
```

**Step 2: Verify directory structure matches design**

Run:
```bash
find specs build workers cli mcp public .github test -type f | sort
```

Expected:
```
.github/workflows/.gitkeep
build/templates/.gitkeep
cli/.gitkeep
mcp/.gitkeep
public/.gitkeep
specs/antipatterns/.gitkeep
specs/patterns/.gitkeep
specs/philosophy/.gitkeep
specs/reference-apps/.gitkeep
specs/specs/.gitkeep
test/.gitkeep
workers/.gitkeep
```

---

## Task 5: Update Configuration Files

Update `.gitignore` for the new project structure and create an `.env.example` documenting required environment variables.

**Files:**
- Modify: `.gitignore`
- Create: `.env.example`

**Step 1: Replace .gitignore with project-appropriate version**

Overwrite `.gitignore` with this exact content:

```gitignore
# Dependencies
node_modules/

# Build output
dist/

# Cloudflare
.wrangler/

# Environment
.env
.env.local
.env.*.local

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Python (legacy)
.ruff_cache/
__pycache__/
```

Key changes from the old `.gitignore`:
- **Removed `build/`** — our build scripts (`build/generate.js`, `build/templates/`) must be tracked
- **Added `.wrangler/`** — local Cloudflare Workers dev state
- **Added `.ruff_cache/`** — in case Python linter runs again
- **Simplified** — removed unused entries (pem files, lerna, yarn)

**Step 2: Create .env.example**

Create file `.env.example` with this exact content:

```bash
# Required for build pipeline (embedding generation)
OPENAI_API_KEY=sk-your-key-here

# Required for Cloudflare deployment
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token

# Required for Vectorize integration
CLOUDFLARE_VECTORIZE_INDEX_ID=your-index-id
```

**Step 3: Verify .gitignore works correctly**

Run:
```bash
git status --short build/
```

Expected: `build/templates/.gitkeep` should appear as untracked (`??`), proving the `build/` directory is NOT gitignored.

---

## Task 6: Create Seed Spec with Frontmatter Validation (TDD)

Write a frontmatter validation utility using TDD, then create a seed spec that passes validation. This utility will be reused by the build pipeline in Plan 2.

**Files:**
- Create: `test/validate-frontmatter.test.js`
- Create: `build/validate-frontmatter.js`
- Create: `specs/philosophy/ruthless-simplicity.md`

**Step 1: Write the failing test**

Create file `test/validate-frontmatter.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { validateFrontmatter } from '../build/validate-frontmatter.js';

describe('validateFrontmatter', () => {
  it('accepts valid frontmatter with all required fields', () => {
    const data = {
      title: 'Ruthless Simplicity',
      slug: 'ruthless-simplicity',
      category: 'philosophy',
      spiceLevel: 3,
      tags: ['simplicity', 'yagni'],
      summary: 'Build the simplest thing that could possibly work',
      created: '2026-03-24',
      updated: '2026-03-24',
      author: 'spicy-specs-team',
    };
    const result = validateFrontmatter(data);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('rejects frontmatter missing required fields', () => {
    const data = { title: 'Incomplete Spec' };
    const result = validateFrontmatter(data);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors).toContain('Missing required field: slug');
    expect(result.errors).toContain('Missing required field: category');
    expect(result.errors).toContain('Missing required field: summary');
  });

  it('rejects invalid category values', () => {
    const data = {
      title: 'Bad Category',
      slug: 'bad-category',
      category: 'cookbook',
      spiceLevel: 1,
      tags: [],
      summary: 'This has a bad category',
      created: '2026-03-24',
      updated: '2026-03-24',
      author: 'test',
    };
    const result = validateFrontmatter(data);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/Invalid category/);
  });

  it('rejects spiceLevel outside 0-5 range', () => {
    const data = {
      title: 'Too Spicy',
      slug: 'too-spicy',
      category: 'spec',
      spiceLevel: 7,
      tags: [],
      summary: 'Way too spicy',
      created: '2026-03-24',
      updated: '2026-03-24',
      author: 'test',
    };
    const result = validateFrontmatter(data);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/spiceLevel must be between 0 and 5/);
  });

  it('rejects non-array tags', () => {
    const data = {
      title: 'Bad Tags',
      slug: 'bad-tags',
      category: 'pattern',
      spiceLevel: 2,
      tags: 'not-an-array',
      summary: 'Tags should be an array',
      created: '2026-03-24',
      updated: '2026-03-24',
      author: 'test',
    };
    const result = validateFrontmatter(data);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/tags must be an array/);
  });
});
```

**Step 2: Run the test to verify it fails**

Run:
```bash
npx vitest run test/validate-frontmatter.test.js
```

Expected: FAIL — module `../build/validate-frontmatter.js` does not exist.

**Step 3: Write the implementation**

Create file `build/validate-frontmatter.js`:

```js
const VALID_CATEGORIES = ['spec', 'antipattern', 'reference-app', 'pattern', 'philosophy'];
const REQUIRED_FIELDS = ['title', 'slug', 'category', 'summary', 'created', 'updated', 'author'];

/**
 * Validate spec frontmatter against the content model schema.
 * @param {object} data - Parsed frontmatter object (from gray-matter)
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateFrontmatter(data) {
  const errors = [];

  for (const field of REQUIRED_FIELDS) {
    if (!data[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (data.category && !VALID_CATEGORIES.includes(data.category)) {
    errors.push(`Invalid category "${data.category}". Must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }

  if (data.spiceLevel != null && (data.spiceLevel < 0 || data.spiceLevel > 5)) {
    errors.push('spiceLevel must be between 0 and 5');
  }

  if (data.tags != null && !Array.isArray(data.tags)) {
    errors.push('tags must be an array');
  }

  return { valid: errors.length === 0, errors };
}
```

**Step 4: Run the test to verify it passes**

Run:
```bash
npx vitest run test/validate-frontmatter.test.js
```

Expected: All 5 tests PASS.

**Step 5: Write the seed spec integration test**

Add a second test file that validates actual spec files on disk. Create file `test/specs-valid.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { validateFrontmatter } from '../build/validate-frontmatter.js';

function findSpecFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...findSpecFiles(full));
    } else if (entry.endsWith('.md')) {
      files.push(full);
    }
  }
  return files;
}

describe('spec files on disk', () => {
  const specFiles = findSpecFiles('specs');

  it('has at least one spec file', () => {
    expect(specFiles.length).toBeGreaterThan(0);
  });

  for (const file of specFiles) {
    it(`${file} has valid frontmatter`, () => {
      const raw = readFileSync(file, 'utf-8');
      const { data } = matter(raw);
      const result = validateFrontmatter(data);
      expect(result.errors).toEqual([]);
      expect(result.valid).toBe(true);
    });
  }
});
```

**Step 6: Run the integration test to verify it fails**

Run:
```bash
npx vitest run test/specs-valid.test.js
```

Expected: FAIL — "has at least one spec file" fails because no `.md` files exist in `specs/` yet.

**Step 7: Create the seed spec**

Create file `specs/philosophy/ruthless-simplicity.md`:

```markdown
---
title: "Ruthless Simplicity"
slug: "ruthless-simplicity"
category: "philosophy"
spiceLevel: 3
tags: ["simplicity", "yagni", "less-is-more", "mvp"]
summary: "Build the simplest thing that could possibly work, then iterate. Complexity is a debt that compounds."
created: "2026-03-24"
updated: "2026-03-24"
author: "spicy-specs-team"
---

# Ruthless Simplicity

## Core Principle

Every line of code is a liability. Every abstraction is a bet on the future. Make the smallest bet that delivers value, then iterate with evidence.

## Invariants

1. **No speculative generality.** Don't build for requirements that don't exist yet.
2. **One way to do it.** If there are two ways to accomplish something, pick one and delete the other.
3. **Boring technology wins.** Choose the most boring tool that solves the problem.
4. **Delete before you add.** When adding a feature, first look for code to remove.
5. **Measure before you optimize.** Intuition about performance is usually wrong.

## Anti-Patterns to Avoid

- Building "flexible" systems before you have two concrete use cases
- Adding configuration options "just in case"
- Choosing a framework for features you might need someday
- Premature abstraction (DRY applied too early with too few examples)

## When to Apply

Always. This is the default stance. Deviate only with evidence that complexity is required, and document why.
```

**Step 8: Run all tests to verify everything passes**

Run:
```bash
npx vitest run
```

Expected: All tests PASS (5 unit tests + 2 integration tests = 7 total).

---

## Task 7: Update README and Final Commit

Update the README to reflect the new project direction, then commit all scaffolding work.

**Files:**
- Modify: `README.md`

**Step 1: Update README.md**

Overwrite `README.md` with this exact content:

```markdown
# Spicy Specs

A curated library of specifications, patterns, anti-patterns, and reference implementations for AI agents and humans.

## What's Inside

- **Specs** — Detailed technical specifications for complex implementations
- **Patterns** — Proven architectural patterns with invariants and trade-offs
- **Anti-Patterns** — Common mistakes to avoid with specific examples and fixes
- **Reference Apps** — Working example implementations
- **Philosophy** — Core principles that guide decision-making

## Architecture

Content-as-code: AI agents write markdown specs → git push → auto-build → deploy to Cloudflare Pages.

- **Static site:** Cloudflare Pages (Node.js custom build script)
- **API:** Cloudflare Workers (search via Vectorize, voting via KV)
- **Vector store:** Cloudflare Vectorize (semantic search via OpenAI embeddings)
- **Access:** Web, CLI (`spicy-specs`), MCP server (Amplifier)

## Development

```bash
npm install          # Install dependencies
npm test             # Run tests
npm run build        # Generate static site (requires .env)
npm run preview      # Serve built site locally
npm run dev:workers  # Run Workers locally
```

## Adding a Spec

Create a markdown file in `specs/[category]/[slug].md` with YAML frontmatter:

```yaml
---
title: "Your Spec Title"
slug: "your-spec-slug"
category: "spec"         # spec | antipattern | reference-app | pattern | philosophy
spiceLevel: 2            # 0-5, overridden by community votes
tags: ["tag1", "tag2"]
summary: "One-line description"
created: "2026-03-24"
updated: "2026-03-24"
author: "your-name"
---

Your markdown content here.
```

## License

MIT
```

**Step 2: Commit all scaffolding**

Run:
```bash
git add -A
git status
```

Verify the staged files include:
- `.env.example`
- `.github/workflows/.gitkeep`
- `.gitignore`
- `README.md`
- `build/validate-frontmatter.js`
- `build/templates/.gitkeep`
- `cli/.gitkeep`
- `mcp/.gitkeep`
- `package.json`
- `package-lock.json`
- `public/.gitkeep`
- `specs/` directories with `.gitkeep` files
- `specs/philosophy/ruthless-simplicity.md`
- `test/validate-frontmatter.test.js`
- `test/specs-valid.test.js`
- `workers/.gitkeep`

Then commit:

Run:
```bash
git commit -m "chore: Phase 1A scaffold — fresh Node.js project, directory structure, seed spec with validation"
```

Expected: Commit succeeds.

**Step 3: Run all tests one final time to confirm green**

Run:
```bash
npm test
```

Expected: All 7 tests PASS. The project is ready for Plan 2 (Build Pipeline & Static Site).

---

## Summary of Commits

After completing all tasks, the git log should show:

1. `chore: remove old React clickthrough app` (Task 1)
2. `chore: remove experiments, preserve design references` (Task 2)
3. `chore: Phase 1A scaffold — fresh Node.js project, directory structure, seed spec with validation` (Task 7)

## What's Next

**Plan 2 (Build Pipeline & Static Site)** will:
- Use `build/validate-frontmatter.js` in the build pipeline
- Parse `specs/philosophy/ruthless-simplicity.md` as the first real content
- Generate HTML from templates in `build/templates/`
- Output to `dist/` for Cloudflare Pages deployment

**Plan 3 (API, CLI, MCP)** will:
- Implement Cloudflare Workers in `workers/`
- Build CLI tool in `cli/`
- Build MCP server in `mcp/`