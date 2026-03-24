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
  specs/               # for spec-type content
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
- Dynamic spec pages (`/e/[slug]`)
- Design tokens applied across all layouts and styles

## API Layer (Phase 1C)

### Cloudflare Resource Setup (One-Time)

Before deploying the API, create these Cloudflare resources:

**1. Vectorize Index:**
```bash
npx wrangler vectorize create spicy-specs-index --dimensions=1536 --metric=cosine
```
Copy the returned index name into `wrangler.toml` under `[[vectorize]]`.

**2. KV Namespace:**
```bash
npx wrangler kv namespace create HEAT_STORE
```
Copy the returned namespace ID into `wrangler.toml` under `[[kv_namespaces]]`.

**3. Set Worker Secrets:**
```bash
npx wrangler secret put OPENAI_API_KEY
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/search?q=...&category=...&limit=...` | GET | Semantic search across specs |
| `/api/heat/:slug` | GET | Get current heat count and chili level |
| `/api/heat/:slug` | POST | Increment heat (anonymous voting) |

### New Commands

```bash
npm run embeddings      # Generate embeddings and upsert to Vectorize
npm run dev:workers     # Run Workers locally with wrangler dev
```

### Environment Variables

See `.env.example` for all required variables. For GitHub Actions, add these as repository secrets:
- `OPENAI_API_KEY`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_VECTORIZE_INDEX_ID`

## License

MIT
