# Phase 1D: CLI & MCP Integration — Implementation Plan

> **Execution:** Use the subagent-driven-development workflow to implement this plan.

**Goal:** Add command-line and MCP server access to the Spicy Specs library so developers and AI agents can search, browse, and fetch specs without a browser.

**Architecture:** Both the CLI tool (`cli/spicy-specs.js`) and the MCP server (`mcp/server.js`) are thin clients that call the same Cloudflare Workers API endpoints built in Phase 1C (`/api/search`, `/api/heat/:slug`). The CLI uses `commander` for argument parsing and supports three output formats (text, JSON, markdown). The MCP server implements JSON-RPC 2.0 and exposes three tools (`search_specs`, `get_spec`, `list_specs`).

**Tech Stack:** Node.js (ESM), vitest, commander (already in project), JSON-RPC 2.0, Cloudflare Workers API (Phase 1C)

---

## Existing Codebase Context

**Project type:** ESM (`"type": "module"` in package.json)
**Test framework:** vitest — all tests live in `test/` directory, flat naming (e.g., `test/workers-search.test.js`)
**Test pattern:** `import { describe, it, expect } from 'vitest'` — mocks are handwritten (no `vi.mock`), dependencies are injected via function parameters
**Directories:** `cli/` and `mcp/` exist with only `.gitkeep` files
**API endpoints (from Phase 1C):**
- `GET /api/search?q=...&category=...&limit=...` → `{ results: [...], took_ms: number }`
- `GET /api/heat/:slug` → `{ heat: number, chiliLevel: number }`
- `POST /api/heat/:slug` → `{ heat: number, chiliLevel: number, added: true }`
**Current test count:** 269 passing
**Spec files:** Live in `specs/` with subdirs per category. Only one exists: `specs/philosophy/ruthless-simplicity.md`

---

## Task 1: CLI Config Module

**Files:**
- Create: `cli/config.js`
- Create: `test/cli-config.test.js`

**What this does:** Handles reading and writing `~/.spicy-specs/config.json`. Provides defaults when the file doesn't exist. All file system operations are injectable for testing.

**Step 1: Write the failing tests**

Create `test/cli-config.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { loadConfig, getApiBase } from '../cli/config.js';

describe('loadConfig', () => {
  it('returns default config when readFile returns null', () => {
    const mockFs = { readFile: () => null };
    const config = loadConfig(mockFs);
    expect(config).toEqual({ apiBase: 'https://spicy-specs.com' });
  });

  it('parses JSON config from file contents', () => {
    const mockFs = {
      readFile: () => JSON.stringify({ apiBase: 'http://localhost:8787' }),
    };
    const config = loadConfig(mockFs);
    expect(config.apiBase).toBe('http://localhost:8787');
  });

  it('returns default config when readFile throws', () => {
    const mockFs = {
      readFile: () => { throw new Error('ENOENT'); },
    };
    const config = loadConfig(mockFs);
    expect(config).toEqual({ apiBase: 'https://spicy-specs.com' });
  });
});

describe('getApiBase', () => {
  it('returns apiBase from config', () => {
    const mockFs = {
      readFile: () => JSON.stringify({ apiBase: 'http://localhost:8787' }),
    };
    expect(getApiBase(mockFs)).toBe('http://localhost:8787');
  });

  it('returns default when no config file exists', () => {
    const mockFs = { readFile: () => null };
    expect(getApiBase(mockFs)).toBe('https://spicy-specs.com');
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npx vitest run test/cli-config.test.js`
Expected: FAIL — `cli/config.js` doesn't export anything yet

**Step 3: Write the implementation**

Create `cli/config.js`:

```js
import { readFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const DEFAULT_CONFIG = {
  apiBase: 'https://spicy-specs.com',
};

const CONFIG_PATH = join(homedir(), '.spicy-specs', 'config.json');

/**
 * Default filesystem adapter — reads the real config file.
 */
const defaultFs = {
  readFile: () => readFileSync(CONFIG_PATH, 'utf-8'),
};

/**
 * Load config from ~/.spicy-specs/config.json.
 * Returns defaults if file doesn't exist or is invalid.
 * @param {{ readFile: () => string|null }} [fs] - Injectable filesystem (for testing)
 * @returns {{ apiBase: string }}
 */
export function loadConfig(fs = defaultFs) {
  try {
    const raw = fs.readFile();
    if (!raw) return { ...DEFAULT_CONFIG };
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

/**
 * Get the API base URL from config.
 * @param {{ readFile: () => string|null }} [fs] - Injectable filesystem (for testing)
 * @returns {string}
 */
export function getApiBase(fs = defaultFs) {
  return loadConfig(fs).apiBase;
}
```

**Step 4: Run tests to verify they pass**

Run: `npx vitest run test/cli-config.test.js`
Expected: 5 tests PASS

**Step 5: Commit**

```bash
git add cli/config.js test/cli-config.test.js && git commit -m "feat(cli): add config module with injectable filesystem"
```

---

## Task 2: CLI Output Formatter

**Files:**
- Create: `cli/format.js`
- Create: `test/cli-format.test.js`

**What this does:** Formats API results into three output styles: human-readable text (with chili emojis), raw JSON, and markdown. Every CLI command pipes its results through a formatter.

**Step 1: Write the failing tests**

Create `test/cli-format.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { formatSearchResults, formatSpec, formatSpecList, formatCategories } from '../cli/format.js';

const sampleResults = {
  results: [
    { slug: 'error-boundary', title: 'Error Boundary Patterns', category: 'spec', summary: 'React error boundaries', score: 0.92 },
    { slug: 'graceful-degradation', title: 'Graceful Degradation', category: 'pattern', summary: 'Handling failures', score: 0.85 },
  ],
  took_ms: 45,
};

describe('formatSearchResults', () => {
  it('formats text output with chili emojis and numbered results', () => {
    const text = formatSearchResults(sampleResults, 'text');
    expect(text).toContain('SPICY SPECS SEARCH RESULTS');
    expect(text).toContain('1.');
    expect(text).toContain('Error Boundary Patterns');
    expect(text).toContain('SPEC');
    expect(text).toContain('2.');
    expect(text).toContain('Graceful Degradation');
    expect(text).toContain('Found 2 results');
  });

  it('formats JSON output as valid JSON string', () => {
    const json = formatSearchResults(sampleResults, 'json');
    const parsed = JSON.parse(json);
    expect(parsed.results).toHaveLength(2);
    expect(parsed.took_ms).toBe(45);
  });

  it('formats markdown output with headers and links', () => {
    const md = formatSearchResults(sampleResults, 'markdown');
    expect(md).toContain('# Search Results');
    expect(md).toContain('## 1. Error Boundary Patterns');
    expect(md).toContain('**Category:** spec');
  });

  it('handles empty results in text format', () => {
    const text = formatSearchResults({ results: [], took_ms: 10 }, 'text');
    expect(text).toContain('No results found');
  });
});

describe('formatSpec', () => {
  const spec = {
    slug: 'ruthless-simplicity',
    title: 'Ruthless Simplicity',
    category: 'philosophy',
    summary: 'Build the simplest thing',
    content: '# Ruthless Simplicity\n\nEvery line of code is a liability.',
    heat: 42,
    chiliLevel: 4,
  };

  it('formats text output with title and content', () => {
    const text = formatSpec(spec, 'text');
    expect(text).toContain('Ruthless Simplicity');
    expect(text).toContain('PHILOSOPHY');
    expect(text).toContain('Every line of code is a liability');
  });

  it('formats JSON output with all fields', () => {
    const json = formatSpec(spec, 'json');
    const parsed = JSON.parse(json);
    expect(parsed.slug).toBe('ruthless-simplicity');
    expect(parsed.content).toContain('Every line of code');
  });

  it('formats markdown output preserving body content', () => {
    const md = formatSpec(spec, 'markdown');
    expect(md).toContain('# Ruthless Simplicity');
    expect(md).toContain('Every line of code is a liability');
  });
});

describe('formatSpecList', () => {
  const specs = [
    { slug: 'spec-a', title: 'Spec A', category: 'spec', summary: 'Summary A' },
    { slug: 'pattern-b', title: 'Pattern B', category: 'pattern', summary: 'Summary B' },
  ];

  it('formats text output as a numbered list', () => {
    const text = formatSpecList(specs, 'text');
    expect(text).toContain('1.');
    expect(text).toContain('Spec A');
    expect(text).toContain('2.');
    expect(text).toContain('Pattern B');
  });

  it('formats JSON output as array', () => {
    const json = formatSpecList(specs, 'json');
    const parsed = JSON.parse(json);
    expect(parsed).toHaveLength(2);
  });
});

describe('formatCategories', () => {
  const categories = ['spec', 'antipattern', 'reference-app', 'pattern', 'philosophy'];

  it('formats text output as a list', () => {
    const text = formatCategories(categories, 'text');
    expect(text).toContain('spec');
    expect(text).toContain('antipattern');
    expect(text).toContain('philosophy');
  });

  it('formats JSON output as array', () => {
    const json = formatCategories(categories, 'json');
    const parsed = JSON.parse(json);
    expect(parsed).toHaveLength(5);
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npx vitest run test/cli-format.test.js`
Expected: FAIL — `cli/format.js` doesn't exist yet

**Step 3: Write the implementation**

Create `cli/format.js`:

```js
/**
 * Repeat chili emoji n times.
 * @param {number} level - 0-5
 * @returns {string}
 */
function chilies(level) {
  return '\u{1F336}\u{FE0F}'.repeat(level);
}

/**
 * Format search results for output.
 * @param {{ results: Array, took_ms: number }} data
 * @param {'text'|'json'|'markdown'} format
 * @returns {string}
 */
export function formatSearchResults(data, format) {
  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }

  if (format === 'markdown') {
    if (data.results.length === 0) {
      return '# Search Results\n\nNo results found.';
    }
    const items = data.results.map((r, i) =>
      `## ${i + 1}. ${r.title}\n\n**Category:** ${r.category} | **Score:** ${r.score}\n\n${r.summary}\n\n---`
    ).join('\n\n');
    return `# Search Results\n\n${items}\n\nFound ${data.results.length} results in ${data.took_ms}ms`;
  }

  // text format (default)
  if (data.results.length === 0) {
    return '\u{1F336}\u{FE0F} SPICY SPECS SEARCH RESULTS\n\nNo results found.';
  }
  const items = data.results.map((r, i) =>
    `${i + 1}. ${r.title} (${r.category.toUpperCase()}) ${chilies(Math.round(r.score * 5))}\n   ${r.summary}\n   \u2192 spicy-specs.com/e/${r.slug}`
  ).join('\n\n');
  return `\u{1F336}\u{FE0F} SPICY SPECS SEARCH RESULTS\n\n${items}\n\nFound ${data.results.length} results in ${data.took_ms}ms`;
}

/**
 * Format a single spec for output.
 * @param {{ slug: string, title: string, category: string, summary: string, content: string, heat: number, chiliLevel: number }} spec
 * @param {'text'|'json'|'markdown'} format
 * @returns {string}
 */
export function formatSpec(spec, format) {
  if (format === 'json') {
    return JSON.stringify(spec, null, 2);
  }

  if (format === 'markdown') {
    return `# ${spec.title}\n\n**Category:** ${spec.category} | **Heat:** ${spec.heat} ${chilies(spec.chiliLevel)}\n\n${spec.content}`;
  }

  // text format
  return `\u{1F336}\u{FE0F} ${spec.title} (${spec.category.toUpperCase()}) ${chilies(spec.chiliLevel)}\n\nHeat: ${spec.heat} | Chili Level: ${spec.chiliLevel}\n\n${spec.content}`;
}

/**
 * Format a list of specs for output.
 * @param {Array<{ slug: string, title: string, category: string, summary: string }>} specs
 * @param {'text'|'json'|'markdown'} format
 * @returns {string}
 */
export function formatSpecList(specs, format) {
  if (format === 'json') {
    return JSON.stringify(specs, null, 2);
  }

  if (format === 'markdown') {
    const items = specs.map((s, i) =>
      `## ${i + 1}. ${s.title}\n\n**Category:** ${s.category}\n\n${s.summary}`
    ).join('\n\n---\n\n');
    return `# All Specs\n\n${items}`;
  }

  // text format
  const items = specs.map((s, i) =>
    `${i + 1}. ${s.title} (${s.category.toUpperCase()})\n   ${s.summary}`
  ).join('\n\n');
  return `\u{1F336}\u{FE0F} SPICY SPECS LIBRARY\n\n${items}\n\n${specs.length} spec(s) total`;
}

/**
 * Format categories for output.
 * @param {string[]} categories
 * @param {'text'|'json'|'markdown'} format
 * @returns {string}
 */
export function formatCategories(categories, format) {
  if (format === 'json') {
    return JSON.stringify(categories, null, 2);
  }

  if (format === 'markdown') {
    return `# Categories\n\n${categories.map((c) => `- ${c}`).join('\n')}`;
  }

  // text format
  return `\u{1F336}\u{FE0F} AVAILABLE CATEGORIES\n\n${categories.map((c) => `  \u2022 ${c}`).join('\n')}`;
}
```

**Step 4: Run tests to verify they pass**

Run: `npx vitest run test/cli-format.test.js`
Expected: 12 tests PASS

**Step 5: Commit**

```bash
git add cli/format.js test/cli-format.test.js && git commit -m "feat(cli): add output formatter with text, JSON, and markdown support"
```

---

## Task 3: CLI API Client

**Files:**
- Create: `cli/api.js`
- Create: `test/cli-api.test.js`

**What this does:** A thin HTTP client that calls the Phase 1C Worker API. Every function takes an injectable `fetcher` parameter so tests never hit a real network.

**Step 1: Write the failing tests**

Create `test/cli-api.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { searchSpecs, getSpec, listSpecs } from '../cli/api.js';

function mockFetcher(responseBody, status = 200) {
  return async (url) => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => responseBody,
    text: async () => JSON.stringify(responseBody),
  });
}

describe('searchSpecs', () => {
  it('calls /api/search with query parameter', async () => {
    let capturedUrl;
    const fetcher = async (url) => {
      capturedUrl = url;
      return { ok: true, json: async () => ({ results: [], took_ms: 10 }) };
    };
    await searchSpecs({ query: 'error boundaries', apiBase: 'https://example.com', fetcher });
    expect(capturedUrl).toBe('https://example.com/api/search?q=error+boundaries');
  });

  it('includes category and limit when provided', async () => {
    let capturedUrl;
    const fetcher = async (url) => {
      capturedUrl = url;
      return { ok: true, json: async () => ({ results: [], took_ms: 5 }) };
    };
    await searchSpecs({ query: 'streaming', category: 'spec', limit: 3, apiBase: 'https://example.com', fetcher });
    expect(capturedUrl).toContain('category=spec');
    expect(capturedUrl).toContain('limit=3');
  });

  it('returns parsed results from API', async () => {
    const fetcher = mockFetcher({
      results: [{ slug: 'test', title: 'Test', category: 'spec', summary: 'A test', score: 0.9 }],
      took_ms: 20,
    });
    const data = await searchSpecs({ query: 'test', apiBase: 'https://example.com', fetcher });
    expect(data.results).toHaveLength(1);
    expect(data.results[0].slug).toBe('test');
  });

  it('throws on non-ok response', async () => {
    const fetcher = mockFetcher({ error: 'Bad request' }, 400);
    await expect(
      searchSpecs({ query: 'test', apiBase: 'https://example.com', fetcher })
    ).rejects.toThrow();
  });
});

describe('getSpec', () => {
  it('fetches spec content by slug from the search endpoint', async () => {
    let capturedUrl;
    const fetcher = async (url) => {
      capturedUrl = url;
      return {
        ok: true,
        json: async () => ({
          results: [{ slug: 'ruthless-simplicity', title: 'Ruthless Simplicity', category: 'philosophy', summary: 'Build the simplest thing' }],
          took_ms: 5,
        }),
      };
    };
    const spec = await getSpec({ slug: 'ruthless-simplicity', apiBase: 'https://example.com', fetcher });
    expect(spec.slug).toBe('ruthless-simplicity');
    expect(spec.title).toBe('Ruthless Simplicity');
  });

  it('fetches heat data for the spec', async () => {
    const fetcher = async (url) => {
      if (url.includes('/api/heat/')) {
        return { ok: true, json: async () => ({ heat: 42, chiliLevel: 4 }) };
      }
      return {
        ok: true,
        json: async () => ({
          results: [{ slug: 'test-spec', title: 'Test', category: 'spec', summary: 'A test' }],
          took_ms: 5,
        }),
      };
    };
    const spec = await getSpec({ slug: 'test-spec', apiBase: 'https://example.com', fetcher });
    expect(spec.heat).toBe(42);
    expect(spec.chiliLevel).toBe(4);
  });
});

describe('listSpecs', () => {
  it('calls /api/search with empty query and high limit', async () => {
    let capturedUrl;
    const fetcher = async (url) => {
      capturedUrl = url;
      return { ok: true, json: async () => ({ results: [], took_ms: 5 }) };
    };
    await listSpecs({ apiBase: 'https://example.com', fetcher });
    expect(capturedUrl).toContain('/api/search');
    expect(capturedUrl).toContain('limit=100');
  });

  it('passes category filter when provided', async () => {
    let capturedUrl;
    const fetcher = async (url) => {
      capturedUrl = url;
      return { ok: true, json: async () => ({ results: [], took_ms: 5 }) };
    };
    await listSpecs({ category: 'pattern', apiBase: 'https://example.com', fetcher });
    expect(capturedUrl).toContain('category=pattern');
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npx vitest run test/cli-api.test.js`
Expected: FAIL — `cli/api.js` doesn't exist yet

**Step 3: Write the implementation**

Create `cli/api.js`:

```js
/**
 * Search specs via the Worker API.
 * @param {object} params
 * @param {string} params.query - Search query
 * @param {string} [params.category] - Category filter
 * @param {number} [params.limit] - Max results
 * @param {string} params.apiBase - API base URL
 * @param {Function} [params.fetcher=fetch] - Injectable fetch (for testing)
 * @returns {Promise<{ results: Array, took_ms: number }>}
 */
export async function searchSpecs({ query, category, limit, apiBase, fetcher = fetch }) {
  const params = new URLSearchParams();
  params.set('q', query);
  if (category) params.set('category', category);
  if (limit) params.set('limit', String(limit));

  const url = `${apiBase}/api/search?${params.toString()}`;
  const res = await fetcher(url);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

/**
 * Get a specific spec by slug.
 * Fetches spec metadata via search and heat data from the heat endpoint.
 * @param {object} params
 * @param {string} params.slug - Spec slug
 * @param {string} params.apiBase - API base URL
 * @param {Function} [params.fetcher=fetch] - Injectable fetch (for testing)
 * @returns {Promise<object>}
 */
export async function getSpec({ slug, apiBase, fetcher = fetch }) {
  // Get spec metadata via search (the API indexes all specs)
  const searchRes = await fetcher(`${apiBase}/api/search?q=${encodeURIComponent(slug)}&limit=1`);
  if (!searchRes.ok) {
    throw new Error(`API error: ${searchRes.status}`);
  }
  const searchData = await searchRes.json();
  const spec = searchData.results.find((r) => r.slug === slug);
  if (!spec) {
    throw new Error(`Spec not found: ${slug}`);
  }

  // Get heat data
  let heat = 0;
  let chiliLevel = 0;
  try {
    const heatRes = await fetcher(`${apiBase}/api/heat/${slug}`);
    if (heatRes.ok) {
      const heatData = await heatRes.json();
      heat = heatData.heat;
      chiliLevel = heatData.chiliLevel;
    }
  } catch {
    // Heat data is non-critical — default to 0
  }

  return {
    ...spec,
    content: spec.summary,  // Full content would require a dedicated endpoint (Phase 2)
    heat,
    chiliLevel,
  };
}

/**
 * List all specs, optionally filtered by category.
 * Uses the search endpoint with a wildcard-style broad query.
 * @param {object} params
 * @param {string} [params.category] - Category filter
 * @param {string} params.apiBase - API base URL
 * @param {Function} [params.fetcher=fetch] - Injectable fetch (for testing)
 * @returns {Promise<{ results: Array, took_ms: number }>}
 */
export async function listSpecs({ category, apiBase, fetcher = fetch }) {
  const params = new URLSearchParams();
  params.set('q', 'spec');
  params.set('limit', '100');
  if (category) params.set('category', category);

  const url = `${apiBase}/api/search?${params.toString()}`;
  const res = await fetcher(url);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}
```

**Step 4: Run tests to verify they pass**

Run: `npx vitest run test/cli-api.test.js`
Expected: 7 tests PASS

**Step 5: Commit**

```bash
git add cli/api.js test/cli-api.test.js && git commit -m "feat(cli): add API client with injectable fetcher for search, get, and list"
```

---

## Task 4: CLI Entry Point — Search & Get Commands

**Files:**
- Create: `cli/spicy-specs.js`
- Create: `test/cli-commands.test.js`

**What this does:** The main CLI entry point using `commander`. Wires up `search` and `get` commands. The CLI is executable via `node cli/spicy-specs.js`.

**Step 1: Write the failing tests**

Create `test/cli-commands.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { createProgram } from '../cli/spicy-specs.js';

function mockDeps(overrides = {}) {
  return {
    apiBase: 'https://example.com',
    fetcher: async (url) => ({
      ok: true,
      json: async () => ({
        results: [{ slug: 'test-spec', title: 'Test Spec', category: 'spec', summary: 'A test', score: 0.9 }],
        took_ms: 10,
      }),
    }),
    output: [],
    print: (str) => { mockDeps._lastOutput.push(str); },
    ...overrides,
  };
}
// Store output reference for assertions
mockDeps._lastOutput = [];

describe('CLI search command', () => {
  it('calls search API and prints formatted results', async () => {
    const output = [];
    const deps = {
      apiBase: 'https://example.com',
      fetcher: async () => ({
        ok: true,
        json: async () => ({
          results: [{ slug: 'rs', title: 'Ruthless Simplicity', category: 'philosophy', summary: 'Keep it simple', score: 0.95 }],
          took_ms: 15,
        }),
      }),
      print: (str) => output.push(str),
    };
    const program = createProgram(deps);
    await program.parseAsync(['node', 'spicy-specs', 'search', 'simplicity']);
    expect(output.join('\n')).toContain('Ruthless Simplicity');
  });

  it('passes --category option to search', async () => {
    let capturedUrl;
    const deps = {
      apiBase: 'https://example.com',
      fetcher: async (url) => {
        capturedUrl = url;
        return { ok: true, json: async () => ({ results: [], took_ms: 5 }) };
      },
      print: () => {},
    };
    const program = createProgram(deps);
    await program.parseAsync(['node', 'spicy-specs', 'search', 'test', '--category', 'spec']);
    expect(capturedUrl).toContain('category=spec');
  });

  it('supports --json output format', async () => {
    const output = [];
    const deps = {
      apiBase: 'https://example.com',
      fetcher: async () => ({
        ok: true,
        json: async () => ({
          results: [{ slug: 'a', title: 'A', category: 'spec', summary: 'S', score: 0.9 }],
          took_ms: 5,
        }),
      }),
      print: (str) => output.push(str),
    };
    const program = createProgram(deps);
    await program.parseAsync(['node', 'spicy-specs', 'search', 'test', '--json']);
    const parsed = JSON.parse(output.join('\n'));
    expect(parsed.results).toBeDefined();
  });
});

describe('CLI get command', () => {
  it('fetches spec by slug and prints it', async () => {
    const output = [];
    const deps = {
      apiBase: 'https://example.com',
      fetcher: async (url) => {
        if (url.includes('/api/heat/')) {
          return { ok: true, json: async () => ({ heat: 10, chiliLevel: 1 }) };
        }
        return {
          ok: true,
          json: async () => ({
            results: [{ slug: 'ruthless-simplicity', title: 'Ruthless Simplicity', category: 'philosophy', summary: 'Keep it simple' }],
            took_ms: 5,
          }),
        };
      },
      print: (str) => output.push(str),
    };
    const program = createProgram(deps);
    await program.parseAsync(['node', 'spicy-specs', 'get', 'ruthless-simplicity']);
    expect(output.join('\n')).toContain('Ruthless Simplicity');
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npx vitest run test/cli-commands.test.js`
Expected: FAIL — `cli/spicy-specs.js` doesn't export `createProgram` yet

**Step 3: Write the implementation**

Create `cli/spicy-specs.js`:

```js
#!/usr/bin/env node

import { Command } from 'commander';
import { getApiBase } from './config.js';
import { searchSpecs, getSpec, listSpecs } from './api.js';
import { formatSearchResults, formatSpec, formatSpecList, formatCategories } from './format.js';

const VALID_CATEGORIES = ['spec', 'antipattern', 'reference-app', 'pattern', 'philosophy'];

/**
 * Determine output format from command options.
 * @param {{ json?: boolean, markdown?: boolean }} opts
 * @returns {'text'|'json'|'markdown'}
 */
function getFormat(opts) {
  if (opts.json) return 'json';
  if (opts.markdown) return 'markdown';
  return 'text';
}

/**
 * Create the CLI program. Dependencies are injectable for testing.
 * @param {{ apiBase?: string, fetcher?: Function, print?: Function }} [deps={}]
 * @returns {Command}
 */
export function createProgram(deps = {}) {
  const apiBase = deps.apiBase || getApiBase();
  const fetcher = deps.fetcher || fetch;
  const print = deps.print || console.log;

  const program = new Command();

  program
    .name('spicy-specs')
    .description('Search and browse the Spicy Specs library')
    .version('0.1.0');

  program
    .command('search <query>')
    .description('Search specs semantically')
    .option('--category <category>', 'Filter by category')
    .option('--limit <number>', 'Max results', '10')
    .option('--json', 'Output as JSON')
    .option('--markdown', 'Output as Markdown')
    .action(async (query, opts) => {
      const data = await searchSpecs({
        query,
        category: opts.category,
        limit: parseInt(opts.limit, 10),
        apiBase,
        fetcher,
      });
      print(formatSearchResults(data, getFormat(opts)));
    });

  program
    .command('get <slug>')
    .description('Fetch a specific spec by slug')
    .option('--json', 'Output as JSON')
    .option('--markdown', 'Output as Markdown')
    .action(async (slug, opts) => {
      const spec = await getSpec({ slug, apiBase, fetcher });
      print(formatSpec(spec, getFormat(opts)));
    });

  program
    .command('list')
    .description('List all specs')
    .option('--category <category>', 'Filter by category')
    .option('--json', 'Output as JSON')
    .option('--markdown', 'Output as Markdown')
    .action(async (opts) => {
      const data = await listSpecs({ category: opts.category, apiBase, fetcher });
      print(formatSpecList(data.results, getFormat(opts)));
    });

  program
    .command('categories')
    .description('List all available categories')
    .option('--json', 'Output as JSON')
    .option('--markdown', 'Output as Markdown')
    .action(async (opts) => {
      print(formatCategories(VALID_CATEGORIES, getFormat(opts)));
    });

  return program;
}

// Run if executed directly (not imported for testing)
const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/.*\//, ''));
if (isMain) {
  const program = createProgram();
  program.parseAsync(process.argv).catch((err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });
}
```

**Step 4: Run tests to verify they pass**

Run: `npx vitest run test/cli-commands.test.js`
Expected: 4 tests PASS

**Step 5: Commit**

```bash
git add cli/spicy-specs.js test/cli-commands.test.js && git commit -m "feat(cli): add CLI entry point with search, get, list, and categories commands"
```

---

## Task 5: CLI List & Categories Commands Tests

**Files:**
- Modify: `test/cli-commands.test.js` (add more tests)

**What this does:** Adds test coverage for the `list` and `categories` commands that were wired up in Task 4 but not yet tested.

**Step 1: Write the failing tests**

Append to `test/cli-commands.test.js` (after the existing `describe` blocks):

```js
describe('CLI list command', () => {
  it('lists all specs and prints formatted output', async () => {
    const output = [];
    const deps = {
      apiBase: 'https://example.com',
      fetcher: async () => ({
        ok: true,
        json: async () => ({
          results: [
            { slug: 'spec-a', title: 'Spec A', category: 'spec', summary: 'Summary A', score: 0.8 },
            { slug: 'pattern-b', title: 'Pattern B', category: 'pattern', summary: 'Summary B', score: 0.7 },
          ],
          took_ms: 10,
        }),
      }),
      print: (str) => output.push(str),
    };
    const program = createProgram(deps);
    await program.parseAsync(['node', 'spicy-specs', 'list']);
    const text = output.join('\n');
    expect(text).toContain('Spec A');
    expect(text).toContain('Pattern B');
  });

  it('passes --category filter to list', async () => {
    let capturedUrl;
    const deps = {
      apiBase: 'https://example.com',
      fetcher: async (url) => {
        capturedUrl = url;
        return { ok: true, json: async () => ({ results: [], took_ms: 5 }) };
      },
      print: () => {},
    };
    const program = createProgram(deps);
    await program.parseAsync(['node', 'spicy-specs', 'list', '--category', 'pattern']);
    expect(capturedUrl).toContain('category=pattern');
  });
});

describe('CLI categories command', () => {
  it('prints all available categories', async () => {
    const output = [];
    const deps = {
      apiBase: 'https://example.com',
      fetcher: async () => ({ ok: true, json: async () => ({}) }),
      print: (str) => output.push(str),
    };
    const program = createProgram(deps);
    await program.parseAsync(['node', 'spicy-specs', 'categories']);
    const text = output.join('\n');
    expect(text).toContain('spec');
    expect(text).toContain('antipattern');
    expect(text).toContain('pattern');
    expect(text).toContain('philosophy');
    expect(text).toContain('reference-app');
  });

  it('supports --json output for categories', async () => {
    const output = [];
    const deps = {
      apiBase: 'https://example.com',
      fetcher: async () => ({ ok: true, json: async () => ({}) }),
      print: (str) => output.push(str),
    };
    const program = createProgram(deps);
    await program.parseAsync(['node', 'spicy-specs', 'categories', '--json']);
    const parsed = JSON.parse(output.join('\n'));
    expect(parsed).toContain('spec');
    expect(parsed).toHaveLength(5);
  });
});
```

**Step 2: Run tests to verify new tests pass**

Run: `npx vitest run test/cli-commands.test.js`
Expected: 8 tests PASS (4 existing + 4 new)

**Step 3: Commit**

```bash
git add test/cli-commands.test.js && git commit -m "test(cli): add list and categories command tests"
```

---

## Task 6: MCP Server — JSON-RPC Handler

**Files:**
- Create: `mcp/server.js`
- Create: `test/mcp-server.test.js`

**What this does:** Implements a JSON-RPC 2.0 server that reads from stdin and writes to stdout. Handles `initialize`, `tools/list`, and `tools/call` methods. All API calls are injectable.

**Step 1: Write the failing tests**

Create `test/mcp-server.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { handleRequest, TOOLS } from '../mcp/server.js';

function mockFetcher(responseBody) {
  return async () => ({
    ok: true,
    json: async () => responseBody,
  });
}

describe('TOOLS', () => {
  it('exports exactly three tools', () => {
    expect(TOOLS).toHaveLength(3);
  });

  it('includes search_specs, get_spec, and list_specs', () => {
    const names = TOOLS.map((t) => t.name);
    expect(names).toContain('search_specs');
    expect(names).toContain('get_spec');
    expect(names).toContain('list_specs');
  });

  it('search_specs requires query parameter', () => {
    const tool = TOOLS.find((t) => t.name === 'search_specs');
    expect(tool.inputSchema.required).toContain('query');
  });

  it('get_spec requires slug parameter', () => {
    const tool = TOOLS.find((t) => t.name === 'get_spec');
    expect(tool.inputSchema.required).toContain('slug');
  });
});

describe('handleRequest — initialize', () => {
  it('returns server info and capabilities', async () => {
    const result = await handleRequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {},
    });
    expect(result.jsonrpc).toBe('2.0');
    expect(result.id).toBe(1);
    expect(result.result.serverInfo.name).toBe('spicy-specs-mcp');
    expect(result.result.capabilities.tools).toBeDefined();
  });
});

describe('handleRequest — tools/list', () => {
  it('returns all three tools', async () => {
    const result = await handleRequest({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
    });
    expect(result.result.tools).toHaveLength(3);
    expect(result.result.tools[0]).toHaveProperty('name');
    expect(result.result.tools[0]).toHaveProperty('inputSchema');
  });
});

describe('handleRequest — tools/call search_specs', () => {
  it('returns search results as text content', async () => {
    const fetcher = mockFetcher({
      results: [{ slug: 'test', title: 'Test Spec', category: 'spec', summary: 'A test spec', score: 0.9 }],
      took_ms: 10,
    });
    const result = await handleRequest(
      { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'search_specs', arguments: { query: 'test' } } },
      { fetcher },
    );
    expect(result.result.content).toHaveLength(1);
    expect(result.result.content[0].type).toBe('text');
    expect(result.result.content[0].text).toContain('Test Spec');
  });

  it('passes category and limit to search', async () => {
    let capturedUrl;
    const fetcher = async (url) => {
      capturedUrl = url;
      return { ok: true, json: async () => ({ results: [], took_ms: 5 }) };
    };
    await handleRequest(
      { jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'search_specs', arguments: { query: 'streaming', category: 'spec', limit: 3 } } },
      { fetcher },
    );
    expect(capturedUrl).toContain('category=spec');
    expect(capturedUrl).toContain('limit=3');
  });
});

describe('handleRequest — tools/call get_spec', () => {
  it('returns spec content as text', async () => {
    const fetcher = async (url) => {
      if (url.includes('/api/heat/')) {
        return { ok: true, json: async () => ({ heat: 10, chiliLevel: 1 }) };
      }
      return {
        ok: true,
        json: async () => ({
          results: [{ slug: 'ruthless-simplicity', title: 'Ruthless Simplicity', category: 'philosophy', summary: 'Keep it simple' }],
          took_ms: 5,
        }),
      };
    };
    const result = await handleRequest(
      { jsonrpc: '2.0', id: 5, method: 'tools/call', params: { name: 'get_spec', arguments: { slug: 'ruthless-simplicity' } } },
      { fetcher },
    );
    expect(result.result.content[0].text).toContain('Ruthless Simplicity');
  });
});

describe('handleRequest — tools/call list_specs', () => {
  it('returns list of specs as text', async () => {
    const fetcher = mockFetcher({
      results: [
        { slug: 'spec-a', title: 'Spec A', category: 'spec', summary: 'A', score: 0.8 },
        { slug: 'spec-b', title: 'Spec B', category: 'pattern', summary: 'B', score: 0.7 },
      ],
      took_ms: 10,
    });
    const result = await handleRequest(
      { jsonrpc: '2.0', id: 6, method: 'tools/call', params: { name: 'list_specs', arguments: {} } },
      { fetcher },
    );
    expect(result.result.content[0].text).toContain('Spec A');
    expect(result.result.content[0].text).toContain('Spec B');
  });
});

describe('handleRequest — error handling', () => {
  it('returns method not found for unknown methods', async () => {
    const result = await handleRequest({
      jsonrpc: '2.0',
      id: 7,
      method: 'unknown/method',
    });
    expect(result.error.code).toBe(-32601);
    expect(result.error.message).toContain('not found');
  });

  it('returns error for unknown tool name', async () => {
    const result = await handleRequest({
      jsonrpc: '2.0',
      id: 8,
      method: 'tools/call',
      params: { name: 'nonexistent_tool', arguments: {} },
    });
    expect(result.result.isError).toBe(true);
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npx vitest run test/mcp-server.test.js`
Expected: FAIL — `mcp/server.js` doesn't export anything yet

**Step 3: Write the implementation**

Create `mcp/server.js`:

```js
#!/usr/bin/env node

import { searchSpecs, getSpec, listSpecs } from '../cli/api.js';
import { formatSearchResults, formatSpec, formatSpecList } from '../cli/format.js';

const API_BASE = process.env.SPICY_SPECS_API_BASE || 'https://spicy-specs.com';

/**
 * MCP tool definitions following the MCP protocol spec.
 */
export const TOOLS = [
  {
    name: 'search_specs',
    description: 'Search Spicy Specs using semantic search. Returns relevant specifications, patterns, and anti-patterns.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query (semantic search enabled)' },
        category: { type: 'string', enum: ['spec', 'antipattern', 'reference-app', 'pattern', 'philosophy'], description: 'Filter by category' },
        limit: { type: 'number', default: 5, description: 'Max results to return' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_spec',
    description: 'Fetch full content of a specific spec by slug.',
    inputSchema: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: "Spec slug (e.g., 'ruthless-simplicity')" },
      },
      required: ['slug'],
    },
  },
  {
    name: 'list_specs',
    description: 'List all specs, optionally filtered by category.',
    inputSchema: {
      type: 'object',
      properties: {
        category: { type: 'string', enum: ['spec', 'antipattern', 'reference-app', 'pattern', 'philosophy'], description: 'Filter by category' },
      },
    },
  },
];

/**
 * Execute a tool call and return MCP-formatted content.
 * @param {string} name - Tool name
 * @param {object} args - Tool arguments
 * @param {{ fetcher?: Function }} [deps={}] - Injectable dependencies
 * @returns {Promise<{ content: Array<{ type: string, text: string }>, isError?: boolean }>}
 */
async function executeTool(name, args, deps = {}) {
  const fetcher = deps.fetcher || fetch;
  const apiBase = deps.apiBase || API_BASE;

  switch (name) {
    case 'search_specs': {
      const data = await searchSpecs({
        query: args.query,
        category: args.category,
        limit: args.limit,
        apiBase,
        fetcher,
      });
      return {
        content: [{ type: 'text', text: formatSearchResults(data, 'markdown') }],
      };
    }
    case 'get_spec': {
      const spec = await getSpec({ slug: args.slug, apiBase, fetcher });
      return {
        content: [{ type: 'text', text: formatSpec(spec, 'markdown') }],
      };
    }
    case 'list_specs': {
      const data = await listSpecs({ category: args.category, apiBase, fetcher });
      return {
        content: [{ type: 'text', text: formatSpecList(data.results, 'markdown') }],
      };
    }
    default:
      return {
        content: [{ type: 'text', text: `Unknown tool: ${name}` }],
        isError: true,
      };
  }
}

/**
 * Handle a single JSON-RPC 2.0 request.
 * @param {object} request - JSON-RPC request object
 * @param {{ fetcher?: Function }} [deps={}] - Injectable dependencies
 * @returns {Promise<object>} JSON-RPC response
 */
export async function handleRequest(request, deps = {}) {
  const { id, method, params } = request;

  switch (method) {
    case 'initialize':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          serverInfo: {
            name: 'spicy-specs-mcp',
            version: '0.1.0',
          },
          capabilities: {
            tools: {},
          },
        },
      };

    case 'tools/list':
      return {
        jsonrpc: '2.0',
        id,
        result: { tools: TOOLS },
      };

    case 'tools/call': {
      try {
        const toolResult = await executeTool(params.name, params.arguments || {}, deps);
        return {
          jsonrpc: '2.0',
          id,
          result: toolResult,
        };
      } catch (err) {
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: `Error: ${err.message}` }],
            isError: true,
          },
        };
      }
    }

    default:
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32601,
          message: `Method not found: ${method}`,
        },
      };
  }
}

/**
 * Start the MCP server — reads JSON-RPC from stdin, writes responses to stdout.
 * Uses newline-delimited JSON (ndjson) transport.
 */
function startServer() {
  let buffer = '';

  process.stdin.setEncoding('utf-8');
  process.stdin.on('data', async (chunk) => {
    buffer += chunk;
    const lines = buffer.split('\n');
    buffer = lines.pop(); // Keep incomplete line in buffer

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const request = JSON.parse(trimmed);
        const response = await handleRequest(request);
        process.stdout.write(JSON.stringify(response) + '\n');
      } catch (err) {
        const errorResponse = {
          jsonrpc: '2.0',
          id: null,
          error: { code: -32700, message: 'Parse error' },
        };
        process.stdout.write(JSON.stringify(errorResponse) + '\n');
      }
    }
  });
}

// Run if executed directly
const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/.*\//, ''));
if (isMain) {
  startServer();
}
```

**Step 4: Run tests to verify they pass**

Run: `npx vitest run test/mcp-server.test.js`
Expected: 11 tests PASS

**Step 5: Commit**

```bash
git add mcp/server.js test/mcp-server.test.js && git commit -m "feat(mcp): add MCP server with search_specs, get_spec, and list_specs tools"
```

---

## Task 7: Package.json Updates — bin, exports, scripts

**Files:**
- Modify: `package.json`
- Create: `test/cli-package.test.js`

**What this does:** Adds `bin` entry so CLI is installable via `npm link` or `npx`, adds MCP server to scripts, and adds `commander` dependency if missing.

**Step 1: Write the failing test**

Create `test/cli-package.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';

describe('package.json', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));

  it('has bin entry pointing to cli/spicy-specs.js', () => {
    expect(pkg.bin).toBeDefined();
    expect(pkg.bin['spicy-specs']).toBe('./cli/spicy-specs.js');
  });

  it('has mcp:start script', () => {
    expect(pkg.scripts['mcp:start']).toBe('node mcp/server.js');
  });

  it('has commander as a dependency', () => {
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    expect(allDeps.commander).toBeDefined();
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npx vitest run test/cli-package.test.js`
Expected: FAIL — `bin` entry and `mcp:start` script don't exist yet

**Step 3: Update package.json**

Add the following fields to `package.json`:

1. Add `"bin"` field after `"private"`:
```json
"bin": {
  "spicy-specs": "./cli/spicy-specs.js"
},
```

2. Add `"mcp:start"` to `"scripts"`:
```json
"mcp:start": "node mcp/server.js"
```

3. Add `"commander"` to `"dependencies"`:
```json
"commander": "^14.0.3"
```

The resulting `package.json` should look like this (changes marked):

```json
{
  "name": "spicy-specs",
  "version": "0.1.0",
  "description": "Curated library of specs, patterns, and anti-patterns for AI agents",
  "type": "module",
  "private": true,
  "bin": {
    "spicy-specs": "./cli/spicy-specs.js"
  },
  "scripts": {
    "build": "astro build",
    "dev": "astro dev",
    "preview": "astro preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "dev:workers": "wrangler dev workers/index.js",
    "embeddings": "node build/generate-embeddings.js",
    "mcp:start": "node mcp/server.js"
  },
  "keywords": [
    "specs",
    "patterns",
    "anti-patterns",
    "ai-agents"
  ],
  "license": "MIT",
  "engines": {
    "node": ">=20"
  },
  "dependencies": {
    "@astrojs/cloudflare": "^12.6.13",
    "astro": "^5.18.1",
    "commander": "^14.0.3",
    "gray-matter": "^4.0.3"
  },
  "devDependencies": {
    "vitest": "^4.1.1",
    "wrangler": "^4.77.0"
  }
}
```

**Step 4: Install the new dependency**

Run: `npm install`

**Step 5: Run tests to verify they pass**

Run: `npx vitest run test/cli-package.test.js`
Expected: 3 tests PASS

**Step 6: Commit**

```bash
git add package.json package-lock.json test/cli-package.test.js && git commit -m "feat: add CLI bin entry, MCP start script, and commander dependency"
```

---

## Task 8: Make CLI Executable + Smoke Test

**Files:**
- Modify: `cli/spicy-specs.js` (add executable permission)
- No new test files — this is a manual verification step

**What this does:** Makes the CLI file executable and verifies it works end-to-end with `--help`.

**Step 1: Make CLI executable**

Run: `chmod +x cli/spicy-specs.js`

**Step 2: Verify --help works**

Run: `node cli/spicy-specs.js --help`
Expected output should contain:
```
Usage: spicy-specs [options] [command]

Search and browse the Spicy Specs library

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  search <query>  Search specs semantically
  get <slug>      Fetch a specific spec by slug
  list            List all specs
  categories      List all available categories
  help [command]  display help for a command
```

**Step 3: Verify subcommand help**

Run: `node cli/spicy-specs.js search --help`
Expected: Shows search options including `--category`, `--limit`, `--json`, `--markdown`

**Step 4: Verify categories (no network needed)**

Run: `node cli/spicy-specs.js categories --json`
Expected: `["spec","antipattern","reference-app","pattern","philosophy"]`

**Step 5: Commit**

```bash
git add cli/spicy-specs.js && git commit -m "chore(cli): make CLI executable"
```

---

## Task 9: README Updates — CLI & MCP Documentation

**Files:**
- Modify: `README.md`

**What this does:** Adds CLI installation/usage instructions and MCP server setup documentation to the project README.

**Step 1: Read the current README**

Read `README.md` to understand the current structure.

**Step 2: Add CLI and MCP sections**

Append the following sections to `README.md` (before any existing "Development" or footer section):

```markdown
## CLI Tool

Search and browse the Spicy Specs library from your terminal.

### Usage

```bash
# Search specs semantically
node cli/spicy-specs.js search "error boundaries"

# Search with category filter
node cli/spicy-specs.js search "streaming" --category=spec

# Get a specific spec
node cli/spicy-specs.js get ruthless-simplicity

# List all specs
node cli/spicy-specs.js list
node cli/spicy-specs.js list --category=pattern

# List all categories
node cli/spicy-specs.js categories
```

### Output Formats

```bash
# Default: formatted text with chili emojis
node cli/spicy-specs.js search "websocket"

# JSON (for piping to other tools)
node cli/spicy-specs.js search "websocket" --json

# Markdown (for agent consumption)
node cli/spicy-specs.js search "websocket" --markdown
```

### Configuration

The CLI reads its API endpoint from `~/.spicy-specs/config.json`:

```json
{
  "apiBase": "https://spicy-specs.com"
}
```

If no config file exists, it defaults to `https://spicy-specs.com`.

## MCP Server

The MCP server exposes Spicy Specs tools for AI agent integration.

### Starting the Server

```bash
npm run mcp:start
```

### Available Tools

| Tool | Description |
|------|-------------|
| `search_specs` | Semantic search across the library. Params: `query` (required), `category`, `limit` |
| `get_spec` | Fetch a specific spec by slug. Params: `slug` (required) |
| `list_specs` | List all specs. Params: `category` (optional filter) |

### Protocol

The server uses JSON-RPC 2.0 over stdin/stdout (newline-delimited JSON).
```

**Step 3: Commit**

```bash
git add README.md && git commit -m "docs: add CLI and MCP server usage documentation"
```

---

## Task 10: Full Test Suite Regression + Final Verification

**Files:**
- No new files — verification only

**What this does:** Runs the entire test suite to confirm nothing is broken, verifies the git tree is clean, and reports final counts.

**Step 1: Run the full test suite**

Run: `npx vitest run`
Expected: All tests pass. Count should be 269 (existing) + 42 new = approximately **311 tests**.

**Step 2: Verify no lint/type issues**

Run: `node cli/spicy-specs.js categories` (quick sanity check that the CLI runs)
Expected: Prints the 5 categories

**Step 3: Check git status**

Run: `git status`
Expected: Clean working tree (nothing uncommitted)

**Step 4: Review git log for Phase 1D commits**

Run: `git log --oneline -10`
Expected: 8-9 clean commits from Phase 1D, each with a descriptive message.

**Step 5: Final commit if needed**

If any cleanup was required:
```bash
git add -A && git commit -m "chore: Phase 1D final cleanup"
```

---

## Summary

| Task | What It Builds | New Tests |
|------|----------------|-----------|
| 1 | `cli/config.js` — config file handling | 5 |
| 2 | `cli/format.js` — text/JSON/markdown formatters | 12 |
| 3 | `cli/api.js` — HTTP client for Worker API | 7 |
| 4 | `cli/spicy-specs.js` — CLI entry point (search + get) | 4 |
| 5 | Additional tests for list + categories commands | 4 |
| 6 | `mcp/server.js` — MCP server with 3 tools | 11 |
| 7 | `package.json` — bin, scripts, commander dep | 3 |
| 8 | Make CLI executable + smoke test | 0 (manual) |
| 9 | README — CLI & MCP documentation | 0 (docs) |
| 10 | Full regression test + final verification | 0 (verification) |

**Total new tests: ~46**
**Expected total after completion: ~315 tests**

### New Files Created
- `cli/config.js` — Config file reader
- `cli/format.js` — Output formatters (text, JSON, markdown)
- `cli/api.js` — Worker API HTTP client
- `cli/spicy-specs.js` — CLI entry point (commander)
- `mcp/server.js` — MCP server (JSON-RPC 2.0)
- `test/cli-config.test.js`
- `test/cli-format.test.js`
- `test/cli-api.test.js`
- `test/cli-commands.test.js`
- `test/mcp-server.test.js`
- `test/cli-package.test.js`

### Modified Files
- `package.json` — bin entry, mcp:start script, commander dep
- `README.md` — CLI and MCP docs