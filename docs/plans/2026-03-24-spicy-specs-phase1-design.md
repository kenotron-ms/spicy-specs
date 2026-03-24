# Spicy Specs Phase 1 Design — Curated Pattern Library for Agents

## Goal

Build a curated library of specifications, patterns, anti-patterns, and reference implementations that helps AI agents make better architectural decisions and write higher-quality code, served as a static site with semantic search, CLI, and MCP integration.

## Background

AI agents need access to battle-tested implementation guidance when making architectural decisions. Currently, this knowledge is scattered across documentation, blog posts, and tribal knowledge. Spicy Specs consolidates curated, opinionated specs into a searchable library that agents (and humans) can query before writing code.

The site uses a Tabasco-inspired "spicy" aesthetic with progressive enhancement — starting minimal in Phase 1 and layering in visual polish over subsequent phases.

## Approach

**Spiral development** — each phase delivers a complete, usable system that gets enhanced in subsequent spirals:

- **Phase 1 (current):** Core system — static site, search, basic voting, CLI, MCP
- **Phase 2:** Identity layer — GitHub OAuth, user profiles
- **Phase 3:** Comments — comment threads on specs
- **Phase 4:** LLM Moderation — scheduled Worker judges comment quality
- **Phase 5:** Reputation — track rep points, weighted voting
- **Phase 6:** Dual Sauce — separate "LLM Sauce" (comment quality) and "Human Sauce" (weighted votes) scores

**Key principle:** AI agents write markdown specs directly to the repo. Git push triggers automatic build and deployment. Everything flows from content-as-code.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Content Layer                            │
│   specs/[category]/[slug].md  →  Git repo (markdown + YAML)    │
└──────────────┬──────────────────────────────────────────────────┘
               │ git push
               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Build Pipeline                              │
│   GitHub Actions → parse markdown → generate embeddings         │
│   → push to Vectorize → generate static HTML → deploy          │
└──────┬──────────────────┬───────────────────┬───────────────────┘
       │                  │                   │
       ▼                  ▼                   ▼
┌──────────────┐  ┌───────────────┐  ┌────────────────┐
│  Cloudflare  │  │  Cloudflare   │  │   Cloudflare   │
│    Pages     │  │   Vectorize   │  │   Workers +    │
│ (static site)│  │ (embeddings)  │  │   KV (API)     │
└──────────────┘  └───────────────┘  └────────────────┘
       │                  │                   │
       ▼                  ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Access Layer                               │
│   Web Browser  |  CLI (spicy-specs)  |  MCP Server (Amplifier)  │
└─────────────────────────────────────────────────────────────────┘
```

**Stack:**

| Layer | Technology |
|-------|-----------|
| Content | Markdown files with YAML frontmatter in categorized git directories |
| Static Site | Cloudflare Pages (generated via custom Node.js script) |
| API | Cloudflare Workers for search and voting |
| Vector Store | Cloudflare Vectorize (semantic search via OpenAI embeddings) |
| Storage | Cloudflare KV (heat/vote tracking) |
| Integrations | CLI tool (`spicy-specs`) + MCP server (`spicy-specs-mcp`) |

## Components

### Content Model

**Directory Structure:**

```
specs/
├── patterns/           # Proven architectural patterns
├── antipatterns/        # Common mistakes to avoid
├── reference-apps/      # Working example implementations
├── philosophy/          # Core decision-making principles
└── specs/               # Detailed technical specifications
```

**Frontmatter Schema:**

```yaml
---
title: "Chat Streaming with SSE"
slug: "chat-streaming-sse"
category: "spec"            # spec | antipattern | reference-app | pattern | philosophy
spiceLevel: 2               # Initial value; overridden by dynamic heat calculation
tags: ["sse", "streaming", "real-time"]
summary: "Specification for implementing Server-Sent Events"
created: "2026-03-24"
updated: "2026-03-24"
author: "agent-or-human-name"
invariants: 13
antipatterns: 19
---
```

Markdown body supports mermaid diagrams via fenced code blocks.

### Build Process

**Trigger:** Git push to `main` → GitHub Actions

**Steps:**

1. Parse markdown files (`gray-matter` + `marked`/`markdown-it`)
2. Generate embeddings via OpenAI API (`text-embedding-3-small`, 1536 dimensions)
3. Batch upsert to Cloudflare Vectorize
4. Generate static HTML pages (library index, individual spec pages, search page)
5. Create `specs.json` index for client-side filtering
6. Copy static assets
7. Deploy to Cloudflare Pages

**Environment Variables:**

- `OPENAI_API_KEY` — for generating embeddings
- `CLOUDFLARE_ACCOUNT_ID` — Cloudflare account
- `CLOUDFLARE_VECTORIZE_INDEX_ID` — Vectorize index
- `CLOUDFLARE_API_TOKEN` — deployment and API access

### Static Site (Cloudflare Pages)

**Library View (Homepage):**
- Grid of spec cards with title, category badge, chili rating, metadata
- Filter by category
- Search box (client-side instant filter + semantic search via API)
- Sort by: Recent, Popular, Title

**Individual Spec Page:**
- Full markdown content rendered (including mermaid diagrams)
- Metadata sidebar
- Interactive "Add Sauce" button for voting
- Related specs (by tags or vector similarity)

**Search Results:**
- Ranked cards from semantic search
- Category and relevance indicators

**Progressive Enhancement:**
- Site is usable without JavaScript
- JS enhances: instant search, dynamic voting, sort controls

### API Layer (Cloudflare Workers)

**Search API — `GET /api/search`**

```
GET /api/search?q=error+boundaries&category=spec&limit=10

Response:
{
  "results": [
    {
      "slug": "error-boundary-patterns",
      "title": "Error Boundary Patterns",
      "category": "spec",
      "summary": "...",
      "score": 0.92
    }
  ],
  "took_ms": 45
}
```

Queries Cloudflare Vectorize with the search term embedded via OpenAI, optionally filtered by category.

**Heat API — `/api/heat/:slug`**

```
GET /api/heat/chat-streaming-sse
Response: { "heat": 142, "chiliLevel": 4 }

POST /api/heat/chat-streaming-sse
Response: { "heat": 143, "chiliLevel": 4, "added": true }
```

Stored in Cloudflare KV with key `spec:[slug]:heat`. Chili rating calculated dynamically:

```js
Math.min(5, Math.floor(heatCount / 10))
```

Frontmatter `spiceLevel` is the initial value before any votes are cast. No login required in Phase 1 (anonymous voting).

### CLI Tool

**Package:** `spicy-specs` (installable via npm/npx)

**Commands:**

```bash
# Search specs semantically
spicy-specs search "error boundaries"

# Search with category filter
spicy-specs search "streaming" --category=spec

# Get a specific spec
spicy-specs get chat-streaming-sse

# List all specs by category
spicy-specs list --category=pattern

# List all categories
spicy-specs categories
```

**Output Formats:**

```bash
# Default: formatted text
spicy-specs search "websocket"

# JSON output (for piping to other tools)
spicy-specs search "websocket" --json

# Markdown output (for agent consumption)
spicy-specs search "websocket" --markdown
```

**Implementation:**
- Node.js CLI using `commander` for argument parsing
- Hits same Worker API endpoints as web app (`/api/search`)
- Stores API endpoint URL in config file (`~/.spicy-specs/config.json`)
- Optional: cache recent searches locally for offline browsing

**Example Output:**

```
$ spicy-specs search "error boundaries"

🌶️ SPICY SPECS SEARCH RESULTS

1. Error Boundary Patterns (SPEC) 🌶️🌶️
   React-specific error boundary implementation
   → spicy-specs.com/e/error-boundary-patterns

2. Graceful Degradation (PATTERN) 🌶️🌶️🌶️
   Handling component failures without breaking the app
   → spicy-specs.com/e/graceful-degradation

Found 2 results in 45ms
```

### MCP Server (Amplifier Integration)

**Server:** `spicy-specs-mcp`

**Tools Exposed:**

**1. `search_specs`** — Semantic search across the library

```json
{
  "name": "search_specs",
  "description": "Search Spicy Specs using semantic search. Returns relevant specifications, patterns, and anti-patterns.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": { "type": "string", "description": "Search query (semantic search enabled)" },
      "category": { "type": "string", "enum": ["spec", "antipattern", "reference-app", "pattern", "philosophy"] },
      "limit": { "type": "number", "default": 5 }
    },
    "required": ["query"]
  }
}
```

**2. `get_spec`** — Fetch full content of a specific spec by slug

```json
{
  "name": "get_spec",
  "inputSchema": {
    "type": "object",
    "properties": {
      "slug": { "type": "string", "description": "Spec slug (e.g., 'chat-streaming-sse')" }
    },
    "required": ["slug"]
  }
}
```

**3. `list_specs`** — List all specs, optionally filtered by category

```json
{
  "name": "list_specs",
  "inputSchema": {
    "type": "object",
    "properties": {
      "category": { "type": "string", "enum": ["spec", "antipattern", "reference-app", "pattern", "philosophy"] }
    }
  }
}
```

**Amplifier Skill Integration:**

The MCP server is wrapped in an Amplifier skill that emphasizes the curated, decision-guiding nature of the library:

```yaml
# ~/.amplifier/skills/spicy-specs.md
---
skill:
  name: spicy-specs
  description: Query curated specifications, patterns, and anti-patterns for making better architectural and implementation decisions
  mcp_server: spicy-specs-mcp
---
```

**Skill description emphasizes:**
- **Specs** — Detailed technical specifications for complex implementations (SSE streaming, WebSocket state management, error boundaries)
- **Patterns** — Proven architectural patterns with invariants and trade-offs (Saga orchestration, event sourcing, CQRS)
- **Anti-Patterns** — Common mistakes to avoid with specific violation examples and fixes (premature optimization, infinite scroll pitfalls)
- **Reference Apps** — Working example implementations with deployment-ready code (auth flows, payment integrations)
- **Philosophy** — Core principles that guide decision-making (ruthless simplicity, composition over inheritance)

**When to use:** Before implementing complex features. Starting a new feature? Search patterns first. Facing architectural decisions? Look for established patterns. Debugging unexpected behavior? Check known anti-patterns.

## Data Flow

### Content Authoring → Deployment

```
Agent/Human writes spec → git push → GitHub Actions triggers →
  1. gray-matter parses frontmatter + body
  2. OpenAI embeds summary + title → 1536-dim vector
  3. Vector upserted to Cloudflare Vectorize (keyed by slug)
  4. HTML generated from markdown templates
  5. specs.json index created for client-side filtering
  6. Static files deployed to Cloudflare Pages
  7. Workers deployed via wrangler
```

### Search Query Flow

```
User/Agent submits query →
  Client-side: instant filter on title/tags from specs.json
  Semantic: POST to /api/search →
    Worker embeds query via OpenAI →
    Vectorize similarity search →
    Return ranked results with scores
```

### Voting Flow

```
User clicks "Add Sauce" →
  POST /api/heat/:slug →
    Worker increments KV counter (spec:[slug]:heat) →
    Calculates chiliLevel: min(5, floor(heat / 10)) →
    Returns updated heat + chiliLevel →
  Client updates chili display
```

## Error Handling

- **Build failures:** GitHub Actions reports errors; deployment does not proceed if build fails
- **Embedding API failures:** Build retries with exponential backoff; fails loudly if OpenAI is unreachable
- **Search API errors:** Worker returns structured error JSON with status codes; client shows fallback message
- **KV write failures:** Heat API returns error; client retains previous state (optimistic UI reverts)
- **Missing specs:** 404 pages generated at build time; API returns 404 JSON for unknown slugs
- **Rate limiting:** Workers enforce basic rate limiting on heat POST to prevent vote manipulation

## Testing Strategy

- **Build pipeline:** Unit tests for markdown parsing, frontmatter validation, HTML generation
- **API Workers:** Integration tests using Miniflare (local Cloudflare Workers simulator)
- **CLI:** Unit tests for command parsing; integration tests hitting local API
- **MCP Server:** Tool invocation tests verifying correct request/response shape
- **End-to-end:** Add a test spec, trigger build, verify it appears in search results and renders correctly
- **Visual regression:** Manual verification against ui-studio blueprints for Phase 1; automated in later phases

## Deployment Configuration

### GitHub Actions Workflow (`.github/workflows/deploy.yml`)

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm ci
      - name: Build static site
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          CLOUDFLARE_VECTORIZE_INDEX_ID: ${{ secrets.CLOUDFLARE_VECTORIZE_INDEX_ID }}
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        run: node build/generate.js
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: spicy-specs
          directory: dist
      - name: Deploy Workers
        run: npx wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

### Cloudflare Workers Configuration (`wrangler.toml`)

```toml
name = "spicy-specs-api"
main = "workers/index.js"
compatibility_date = "2024-01-01"

[env.production]
routes = [
  { pattern = "spicy-specs.com/api/*", zone_name = "spicy-specs.com" }
]

[[kv_namespaces]]
binding = "HEAT_STORE"
id = "<kv-namespace-id>"

[[vectorize]]
binding = "VECTORIZE"
index_name = "spicy-specs-index"
```

### Local Development

```bash
npm run build          # Generate static site
npm run dev:workers    # Test Workers locally (wrangler dev)
npm run preview        # Serve dist/ folder
```

## Visual Aesthetic (Phase 1)

Phase 1 uses clean, minimal design with the core spicy brand established:

| Token | Value |
|-------|-------|
| Spicy Red | `#A83232` |
| Parchment | `#EFE7CD` |
| Gold | `#C9975B` |
| Dark | `#2D2D2D` |

**Typography:**
- **Display:** Georgia (serif)
- **UI:** System sans-serif stack
- **Code:** Courier / monospace

**Chili Rating:** CSS-only implementation (clip-path or inline SVG). Clean card layout with color-coded category banners. No ornate assets yet — reserved for Phase 2+.

Reference `ui-studio/` blueprints for design tokens, spacing, and colors when implementing Phase 2 enhancements.

## Repository Structure (Phase 1)

```
spicy-specs/
├── specs/                        # Markdown specs organized by category
│   ├── patterns/
│   ├── antipatterns/
│   ├── reference-apps/
│   ├── philosophy/
│   └── specs/
├── build/
│   ├── generate.js               # Main build script
│   ├── templates/                # HTML templates
│   └── embeddings.js             # Vectorize integration
├── workers/
│   ├── search.js                 # Search API worker
│   └── heat.js                   # Voting API worker
├── cli/
│   └── spicy-specs.js            # CLI tool
├── mcp/
│   └── server.js                 # MCP server
├── public/
│   ├── styles.css                # Phase 1 styles
│   └── app.js                    # Client-side interactions
├── ui-studio/                    # Design references (preserved)
├── docs/plans/                   # Design documents
└── .github/workflows/
    └── deploy.yml                # CD pipeline
```

## Pre-Implementation Cleanup

Before building Phase 1, clean up old experiments:

- **Delete:** `ui-studio/forge/`, `ui-studio/components/`, `*.html` root files, `generate_card_blueprint.py`, `temp/` directories
- **Keep:** `ui-studio/frames/*/approved.png`, `ui-studio/storyboards/`, `ui-studio/blueprints/` (as design references)
- **Git commit:** `chore: remove forge output and temporary experiments`

## Success Criteria

- [ ] AI agents can write markdown specs directly to repo
- [ ] Git push triggers automatic build and deployment
- [ ] Specs are searchable semantically (CLI, web, MCP)
- [ ] "Add Sauce" voting works and updates dynamically
- [ ] Site is usable without JavaScript (progressive enhancement)
- [ ] CLI returns relevant specs for agent queries
- [ ] MCP tools work in Amplifier sessions

## Open Questions

- Exact rate limiting strategy for anonymous voting (IP-based? Cookie-based?)
- Whether to cache OpenAI embeddings locally to avoid regenerating unchanged specs
- Domain setup: custom domain (`spicy-specs.com`) vs Cloudflare Pages default URL for Phase 1
- Whether `specs.json` should include full body text or just metadata for client-side filtering
