# spicy-specs.com Design

## Goal

Build a one-stop-shop library of entries (patterns, anti-patterns, specs, reference apps, philosophical records) for humans and agents — where an agent can reference a URL like `https://spicy-specs.com/e/chat-streaming-sse.md` and immediately have everything needed to implement something correctly, without relying on stale model training data.

## Background

Agents today rely on training data that goes stale. Developers copy-paste from scattered docs, blog posts, and READMEs that rot independently. There is no single authoritative source where a spec, its anti-patterns, its invariants, and a reference implementation live together — accessible to both humans reading a web page and agents fetching raw markdown.

spicy-specs.com fills that gap. It covers all domains: UX, infrastructure, backend, agentic systems, and visual/graphic design. It is modeled on Context7's simplicity for agent access and inspired by PHP.net's comment model for community annotations.

The existing `reference-apps` repo content (13 archetypes + ui-studio) will become entries of type `reference-app` in this library. The domain is already registered on Cloudflare.

## Chosen Approach

**Astro + Cloudflare Pages + D1 + Vectorize (Edge Native)**

Content lives in git as MDX files. Cloudflare handles all runtime concerns — Pages for hosting, D1 (edge SQLite) for comments, Vectorize for semantic search, Workers AI for embeddings. No external services. No traditional database server. Patterns remain authoritative as markdown files checked into the repo.

This approach was chosen because it keeps the entire stack on a single platform (Cloudflare), eliminates cold starts and external dependencies, and treats markdown files as the source of truth — the same model that has already worked for the reference-apps repo.

## Architecture

Single monorepo — site code and entry content together.

```
GitHub Repo (site code + entries)
/entries/{category}/{slug}.mdx
/entries/{category}/{slug}.impl.md   ← reference implementation (optional)
/src (Astro site)
       |
       | git push → CF Pages build
       ↓
Cloudflare Pages (static site + Functions)
├── Static: /e/{slug}.md        (raw markdown — agent fast path)
├── Static: /e/{slug}           (rendered HTML — human view)
├── Worker: /api/search         (Vectorize semantic search)
└── Worker: /api/comments       (D1 read/write)
       |                   |
  Vectorize              D1 (SQLite at edge)
 (semantic index)       (comments + moderation)
```

On every deploy, a build hook runs Workers AI to generate embeddings for new/changed entries and upserts into Vectorize. Every entry gets two static URLs — rendered HTML for humans and a `.md` URL for agents (static file, zero Worker overhead). Search and comments are Cloudflare Pages Functions colocated in the same repo.

## Content Model & Entry Structure

Every entry is a single MDX file at `/entries/{category}/{slug}.mdx`.

### Frontmatter Schema

```yaml
---
title: "Chat Streaming with SSE"
slug: "chat-streaming-sse"
type: spec | reference-app | pattern | philosophy | anti-pattern
category: ux | infra | backend | agentic | design
tags: [sse, streaming, chat, react]
summary: "One sentence — shown in search results and CLI output"
created: 2026-03-19
updated: 2026-03-19
status: draft | published
---
```

### Documentation Depths

There are two documentation depths depending on entry type.

**Canonical spec format** — for types `spec`, `pattern`, `anti-pattern`, `philosophy`. Follows the structure proven in the CHAT-STREAMING-AGENT-SPEC:

- Architecture overview (Mermaid or Graphviz diagram — NOT ASCII)
- Design decisions (non-negotiable, with ✅/❌ code examples)
- Anti-pattern registry (categorized, with test signals)
- Invariants table
- Implementation fast path (phased, with go/no-go gates)
- Known fragility areas (color-coded severity)

**Deep wiki format** — for type `reference-app`. Comprehensive system documentation:

- Overview (what it is, problem it solves, who it's for)
- Architecture diagram (Mermaid/Graphviz — system topology)
- Component breakdown (each major piece: what it does, what it owns, what it depends on)
- Data flow diagram (separate diagram)
- State management documentation
- Key integration points (cross-boundary connections)
- Annotated file map
- Gotchas

### Reference Implementations

Reference implementations attach as a separate file alongside the MDX: `/entries/{category}/{slug}.impl.md`. The universal spec and grounded implementation stay in the same directory but are distinct files so agents can fetch only what they need.

### Migration Path

The existing `reference-apps` archetypes become `type: reference-app, category: ux` entries with deep wiki format. The CHAT-STREAMING-AGENT-SPEC becomes `type: spec, category: backend` with Mermaid diagrams replacing the ASCII art.

## Agent Access Layer

Three access modes, all stateless, all edge-served. Context7-inspired simplicity.

### Mode 1 — Direct Fetch by Slug (Fastest Path)

```
https://spicy-specs.com/e/chat-streaming-sse.md
```

Static file served from Cloudflare edge. No Worker involved. Agent puts this URL directly in its system prompt or calls `web_fetch`. Zero roundtrips, minimal tokens.

### Mode 2 — Search (Discovery Path)

```
GET /api/search?q=SSE+reconnect+streaming
GET /api/search?q=SSE&type=spec        ← type filter
```

Returns compact JSON — slug, title, type, category, summary, relevance score. No full content in results. Agent searches, picks the right entry, then fetches `.md` directly.

```json
[
  {
    "slug": "chat-streaming-sse",
    "type": "spec",
    "category": "backend",
    "summary": "Canonical SSE chat architecture with 19 anti-patterns..."
  }
]
```

### Mode 3 — CLI

```bash
npx spicy-specs search "SSE streaming"                        # compact list to stdout
npx spicy-specs get chat-streaming-sse                         # full entry markdown to stdout
npx spicy-specs get chat-streaming-sse --section invariants    # just one section
```

The `--section` flag is the key token-efficiency feature — agents can pull just the invariants table or anti-pattern registry from a large entry. A Cloudflare Worker parses the MDX on demand and extracts the requested section by heading. No preprocessing required.

The CLI ships as a separate npm package (`spicy-specs`) pointing at spicy-specs.com with an independent release cycle.

### Comments Endpoint

A separate endpoint for approved community comments (excluded from `.md`):

```
GET /e/{slug}/comments.json
```

## Comments System

PHP.net-inspired: authoritative content with community annotations. No forum, no voting, no karma. Just moderated wisdom surfaced below each entry.

### D1 Schema

```sql
CREATE TABLE comments (
  id          TEXT PRIMARY KEY,
  entry_slug  TEXT NOT NULL,
  author      TEXT,           -- optional display name, no auth required
  body        TEXT NOT NULL,  -- markdown
  status      TEXT DEFAULT 'pending',  -- pending | approved | rejected
  created_at  INTEGER NOT NULL
);
```

### Submission Flow

No user accounts. No authentication to submit. A comment is a name (optional), a markdown body, and the entry it belongs to. Submissions POST to a Cloudflare Worker that writes to D1 with `status: pending`.

### Display

Approved comments appear below the entry on the rendered HTML page — flat chronological list, no nested replies. Comments are excluded from the `.md` raw endpoint so the canonical entry stays clean for agents.

### Moderation

Moderation lives at `/admin/comments` — a server-rendered Astro page behind a Cloudflare Access rule. One-click approve/reject. No dashboard framework.

## Search System

Cloudflare Vectorize stores one embedding per entry — frontmatter fields plus the first 500 words of body concatenated. Workers AI generates embeddings using `@cf/baai/bge-base-en-v1.5` (fast, free within Cloudflare's plan).

### Indexing

The index rebuilds on every deploy via a Cloudflare Pages build plugin. Only changed entries are reindexed, not the full corpus.

### Query Flow

```
query → Workers AI embed(query) → Vectorize.query(vector, topK=10)
      → fetch metadata for matched slugs → return compact JSON
```

### Response Format

Results include: slug, title, type, category, summary, relevance score. No full content. The `?type=spec` filter scopes results so agents get precise matches.

## Authoring & Deployment

New entries are MDX files added via PR to the GitHub repo. PR diff is the review. Merge triggers a Cloudflare Pages build: static site generates, `.md` files are served, the embedding indexer runs for changed entries.

No CMS. No admin UI for content. Just files and git.

## Open Questions

- Final name for the npm CLI package (currently `spicy-specs`)
- Whether to support `/e/{slug}/section/{heading-slug}` as a URL pattern for direct section access (vs. only via CLI `--section` flag)
- MCP server wrapper for the CLI (Context7-style) — deferred until after v1
