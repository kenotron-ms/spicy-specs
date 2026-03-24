# Spicy Specs

Curated library of specifications, patterns, and anti-patterns for AI agents.

## Development

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (localhost:4321)
npm run build      # Build static site
npm run preview    # Preview built site
npm test           # Run vitest tests
```

## Project Structure

```
specs/                   # Markdown specs organized by category
  antipatterns/
  patterns/
  philosophy/
  reference-apps/
  specs/
src/
  content/
    specs/               # Symlink → ../../specs
    config.ts            # Content collection schema
  layouts/               # Astro layout components
  pages/                 # Astro page routes
  styles/                # Global CSS and design tokens
build/                   # Validation utilities
test/                    # Vitest tests
```

## Adding a New Spec

1. Create `specs/[category]/[slug].md`
2. Add frontmatter:

```yaml
---
title: "Your Spec Title"
slug: "your-spec-slug"
category: "spec"         # spec | antipattern | reference-app | pattern | philosophy
spiceLevel: 2            # 0-5
tags: ["tag1", "tag2"]
summary: "One-line description"
created: "2026-03-24"
updated: "2026-03-24"
author: "your-name"
---

Your markdown content here.
```

3. Run `npm test` to validate frontmatter
4. Commit and push

## Phase 1A Complete

- Frontmatter validation (`build/validate-frontmatter.js`)
- Test infrastructure (vitest)
- Seed spec (`specs/philosophy/simplicity-first.md`)
- Design tokens (CSS custom properties)

## Phase 1B Complete

- Astro SSG setup (`astro.config.mjs`, content collections)
- Library index page (`/`) with spec grid
- Dynamic spec pages (`/specs/[slug]`)
- Design tokens applied across all layouts and styles

## License

MIT
