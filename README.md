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
