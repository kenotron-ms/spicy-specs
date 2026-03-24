# Phase 1C: API Layer Implementation Plan

> **Execution:** Use the subagent-driven-development workflow to implement this plan.

**Goal:** Add semantic search (OpenAI + Vectorize) and anonymous voting (KV) to the Spicy Specs static site via Cloudflare Workers.

**Architecture:** A single Cloudflare Worker (`workers/index.js`) routes requests to handler modules for search (`workers/search.js`) and heat/voting (`workers/heat.js`). An offline embedding script (`build/generate-embeddings.js`) parses specs from disk, calls OpenAI to embed them, and upserts vectors to Cloudflare Vectorize. GitHub Actions ties it all together: embeddings → Astro build → deploy.

**Tech Stack:** Cloudflare Workers + KV + Vectorize, OpenAI `text-embedding-3-small` (1536 dims), Vitest + Miniflare for testing, GitHub Actions for CD.

---

## Current State

- **Branch:** `main` at `d110c99`
- **Tests:** 216 passing (`npm test` runs `vitest run`)
- **Test location:** `test/` directory (kebab-case filenames, vitest, `import { describe, it, expect } from 'vitest'`)
- **Build modules:** `build/validate-frontmatter.js` (ESM, `export function`)
- **Spec files:** 1 seed spec at `specs/philosophy/ruthless-simplicity.md`
- **Workers dir:** `workers/` exists with `.gitkeep`
- **Workflows dir:** `.github/workflows/` exists with `.gitkeep`
- **Dependencies already installed:** `wrangler@4.77.0`, `miniflare@4.20260317.2`, `vitest@4.1.1`, `gray-matter@4.0.3`
- **No vitest config file** — vitest runs with defaults
- **No wrangler.toml** — needs to be created
- **Package type:** `"type": "module"` (all files use ESM)

## Testing Strategy

Workers tests use **Miniflare** directly (not `@cloudflare/vitest-pool-workers`). This means:
- Tests import the handler functions directly and call them with mock `env` objects
- For integration tests, we spin up a `Miniflare` instance that loads the Worker script
- KV is simulated by Miniflare automatically
- Vectorize is **not** simulated by Miniflare — we mock it with a simple object in unit tests
- OpenAI calls are **always mocked** in tests (no real API calls)

---

### Task 1: Create `wrangler.toml` Configuration

**Files:**
- Create: `wrangler.toml`

This is the Cloudflare Workers configuration. It defines bindings for Vectorize and KV. The IDs are placeholders — the developer fills them in after running `wrangler` commands documented in the README.

**Step 1: Create `wrangler.toml`**

Create the file `wrangler.toml` with this exact content:

```toml
name = "spicy-specs-api"
main = "workers/index.js"
compatibility_date = "2024-01-01"

[vars]
ENVIRONMENT = "production"

[[kv_namespaces]]
binding = "HEAT_STORE"
id = "PLACEHOLDER_KV_NAMESPACE_ID"

[[vectorize]]
binding = "VECTORIZE"
index_name = "spicy-specs-index"
```

**Step 2: Verify wrangler can parse it**

Run: `npx wrangler whoami 2>&1 | head -3`

Expected: Some output (even if not logged in). The point is wrangler doesn't crash parsing the toml.

**Step 3: Commit**

```bash
git add wrangler.toml && git commit -m "feat: add wrangler.toml with KV and Vectorize bindings"
```

---

### Task 2: Heat Module — `calculateChiliLevel` Utility

**Files:**
- Create: `test/workers-heat.test.js`
- Create: `workers/heat.js`

Start with the pure calculation function. No Workers, no KV — just math.

**Step 1: Write the failing test**

Create file `test/workers-heat.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { calculateChiliLevel } from '../workers/heat.js';

describe('calculateChiliLevel', () => {
  it('returns 0 for heat count 0', () => {
    expect(calculateChiliLevel(0)).toBe(0);
  });

  it('returns 0 for heat count 9', () => {
    expect(calculateChiliLevel(9)).toBe(0);
  });

  it('returns 1 for heat count 10', () => {
    expect(calculateChiliLevel(10)).toBe(1);
  });

  it('returns 3 for heat count 35', () => {
    expect(calculateChiliLevel(35)).toBe(3);
  });

  it('caps at 5 for heat count 100', () => {
    expect(calculateChiliLevel(100)).toBe(5);
  });

  it('caps at 5 for heat count 999', () => {
    expect(calculateChiliLevel(999)).toBe(5);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run test/workers-heat.test.js`

Expected: FAIL — cannot import `calculateChiliLevel` because `workers/heat.js` doesn't export it yet.

**Step 3: Write minimal implementation**

Create file `workers/heat.js`:

```js
/**
 * Calculate chili level from raw heat count.
 * Formula: min(5, floor(heat / 10))
 * @param {number} heat - Raw vote count
 * @returns {number} Chili level 0-5
 */
export function calculateChiliLevel(heat) {
  return Math.min(5, Math.floor(heat / 10));
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run test/workers-heat.test.js`

Expected: All 6 tests PASS.

**Step 5: Commit**

```bash
git add test/workers-heat.test.js workers/heat.js && git commit -m "feat: add calculateChiliLevel utility"
```

---

### Task 3: Heat Module — GET and POST Handlers

**Files:**
- Modify: `test/workers-heat.test.js`
- Modify: `workers/heat.js`

Add the `handleHeatGet` and `handleHeatPost` functions. These take a slug and a mock KV env, read/write to KV, and return JSON response objects.

**Step 1: Write the failing tests**

Append these tests to the bottom of `test/workers-heat.test.js` (inside the file, after the existing `describe` block):

```js
describe('handleHeatGet', () => {
  let mockKV;

  function createMockKV(store = {}) {
    return {
      get: async (key) => store[key] ?? null,
      put: async (key, value) => { store[key] = value; },
    };
  }

  it('returns heat 0 and chiliLevel 0 for unknown slug', async () => {
    mockKV = createMockKV();
    const { handleHeatGet } = await import('../workers/heat.js');
    const result = await handleHeatGet('unknown-slug', mockKV);
    expect(result).toEqual({ heat: 0, chiliLevel: 0 });
  });

  it('returns stored heat and calculated chiliLevel', async () => {
    mockKV = createMockKV({ 'spec:my-spec:heat': '42' });
    const { handleHeatGet } = await import('../workers/heat.js');
    const result = await handleHeatGet('my-spec', mockKV);
    expect(result).toEqual({ heat: 42, chiliLevel: 4 });
  });
});

describe('handleHeatPost', () => {
  function createMockKV(store = {}) {
    return {
      get: async (key) => store[key] ?? null,
      put: async (key, value) => { store[key] = value; },
    };
  }

  it('increments heat from 0 to 1 for new slug', async () => {
    const store = {};
    const mockKV = createMockKV(store);
    const { handleHeatPost } = await import('../workers/heat.js');
    const result = await handleHeatPost('new-spec', mockKV);
    expect(result).toEqual({ heat: 1, chiliLevel: 0, added: true });
    expect(store['spec:new-spec:heat']).toBe('1');
  });

  it('increments existing heat count', async () => {
    const store = { 'spec:popular:heat': '9' };
    const mockKV = createMockKV(store);
    const { handleHeatPost } = await import('../workers/heat.js');
    const result = await handleHeatPost('popular', mockKV);
    expect(result).toEqual({ heat: 10, chiliLevel: 1, added: true });
    expect(store['spec:popular:heat']).toBe('10');
  });
});
```

Also add the import at the top of the file (update the existing import line):

```js
import { describe, it, expect } from 'vitest';
import { calculateChiliLevel, handleHeatGet, handleHeatPost } from '../workers/heat.js';
```

**Step 2: Run test to verify new tests fail**

Run: `npx vitest run test/workers-heat.test.js`

Expected: The `calculateChiliLevel` tests still PASS. The new `handleHeatGet` and `handleHeatPost` tests FAIL because those functions don't exist yet.

**Step 3: Write minimal implementation**

Add these functions to `workers/heat.js` (append after `calculateChiliLevel`):

```js
/**
 * Get current heat count and chili level for a spec.
 * @param {string} slug - Spec slug
 * @param {object} kv - KV namespace binding
 * @returns {Promise<{heat: number, chiliLevel: number}>}
 */
export async function handleHeatGet(slug, kv) {
  const raw = await kv.get(`spec:${slug}:heat`);
  const heat = raw ? parseInt(raw, 10) : 0;
  return { heat, chiliLevel: calculateChiliLevel(heat) };
}

/**
 * Increment heat count for a spec and return updated values.
 * @param {string} slug - Spec slug
 * @param {object} kv - KV namespace binding
 * @returns {Promise<{heat: number, chiliLevel: number, added: boolean}>}
 */
export async function handleHeatPost(slug, kv) {
  const raw = await kv.get(`spec:${slug}:heat`);
  const current = raw ? parseInt(raw, 10) : 0;
  const heat = current + 1;
  await kv.put(`spec:${slug}:heat`, String(heat));
  return { heat, chiliLevel: calculateChiliLevel(heat), added: true };
}
```

**Step 4: Run test to verify all pass**

Run: `npx vitest run test/workers-heat.test.js`

Expected: All 10 tests PASS.

**Step 5: Commit**

```bash
git add test/workers-heat.test.js workers/heat.js && git commit -m "feat: add heat GET/POST handlers with KV storage"
```

---

### Task 4: Search Module — `handleSearch` Function

**Files:**
- Create: `test/workers-search.test.js`
- Create: `workers/search.js`

The search handler takes a query string, calls OpenAI to embed it, queries Vectorize for similar vectors, and returns ranked results. In tests, both OpenAI and Vectorize are mocked.

**Step 1: Write the failing test**

Create file `test/workers-search.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { handleSearch } from '../workers/search.js';

function createMockOpenAIFetch(embedding = new Array(1536).fill(0.1)) {
  return async (url, opts) => {
    const body = JSON.parse(opts.body);
    return new Response(JSON.stringify({
      data: [{ embedding }],
      usage: { prompt_tokens: 5, total_tokens: 5 },
    }));
  };
}

function createMockVectorize(matches = []) {
  return {
    query: async (vector, options) => ({
      count: matches.length,
      matches,
    }),
  };
}

describe('handleSearch', () => {
  it('returns empty results for empty query', async () => {
    const mockFetch = createMockOpenAIFetch();
    const mockVectorize = createMockVectorize();
    const result = await handleSearch({
      query: '',
      env: { OPENAI_API_KEY: 'test-key', VECTORIZE: mockVectorize },
      fetcher: mockFetch,
    });
    expect(result).toEqual({ results: [], took_ms: expect.any(Number) });
  });

  it('returns ranked results from Vectorize', async () => {
    const mockFetch = createMockOpenAIFetch();
    const mockVectorize = createMockVectorize([
      {
        id: 'ruthless-simplicity',
        score: 0.92,
        metadata: {
          title: 'Ruthless Simplicity',
          category: 'philosophy',
          summary: 'Build the simplest thing that could possibly work',
        },
      },
    ]);

    const result = await handleSearch({
      query: 'simplicity',
      env: { OPENAI_API_KEY: 'test-key', VECTORIZE: mockVectorize },
      fetcher: mockFetch,
    });

    expect(result.results).toHaveLength(1);
    expect(result.results[0]).toEqual({
      slug: 'ruthless-simplicity',
      title: 'Ruthless Simplicity',
      category: 'philosophy',
      summary: 'Build the simplest thing that could possibly work',
      score: 0.92,
    });
    expect(result.took_ms).toBeGreaterThanOrEqual(0);
  });

  it('passes category filter to Vectorize query', async () => {
    let capturedOptions;
    const mockVectorize = {
      query: async (vector, options) => {
        capturedOptions = options;
        return { count: 0, matches: [] };
      },
    };
    const mockFetch = createMockOpenAIFetch();

    await handleSearch({
      query: 'test',
      category: 'spec',
      env: { OPENAI_API_KEY: 'test-key', VECTORIZE: mockVectorize },
      fetcher: mockFetch,
    });

    expect(capturedOptions.filter).toEqual({ category: 'spec' });
  });

  it('respects limit parameter', async () => {
    let capturedOptions;
    const mockVectorize = {
      query: async (vector, options) => {
        capturedOptions = options;
        return { count: 0, matches: [] };
      },
    };
    const mockFetch = createMockOpenAIFetch();

    await handleSearch({
      query: 'test',
      limit: 3,
      env: { OPENAI_API_KEY: 'test-key', VECTORIZE: mockVectorize },
      fetcher: mockFetch,
    });

    expect(capturedOptions.topK).toBe(3);
  });

  it('defaults limit to 10', async () => {
    let capturedOptions;
    const mockVectorize = {
      query: async (vector, options) => {
        capturedOptions = options;
        return { count: 0, matches: [] };
      },
    };
    const mockFetch = createMockOpenAIFetch();

    await handleSearch({
      query: 'test',
      env: { OPENAI_API_KEY: 'test-key', VECTORIZE: mockVectorize },
      fetcher: mockFetch,
    });

    expect(capturedOptions.topK).toBe(10);
  });

  it('calls OpenAI with correct model and input', async () => {
    let capturedBody;
    const mockFetch = async (url, opts) => {
      capturedBody = JSON.parse(opts.body);
      return new Response(JSON.stringify({
        data: [{ embedding: new Array(1536).fill(0) }],
        usage: { prompt_tokens: 5, total_tokens: 5 },
      }));
    };
    const mockVectorize = createMockVectorize();

    await handleSearch({
      query: 'error boundaries',
      env: { OPENAI_API_KEY: 'test-key', VECTORIZE: mockVectorize },
      fetcher: mockFetch,
    });

    expect(capturedBody.model).toBe('text-embedding-3-small');
    expect(capturedBody.input).toBe('error boundaries');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run test/workers-search.test.js`

Expected: FAIL — `workers/search.js` doesn't exist yet.

**Step 3: Write minimal implementation**

Create file `workers/search.js`:

```js
/**
 * Embed a text string using OpenAI's embedding API.
 * @param {string} text - Text to embed
 * @param {string} apiKey - OpenAI API key
 * @param {Function} fetcher - Fetch function (injectable for testing)
 * @returns {Promise<number[]>} 1536-dimensional embedding vector
 */
export async function embedText(text, apiKey, fetcher = fetch) {
  const response = await fetcher('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  });

  const data = await response.json();
  return data.data[0].embedding;
}

/**
 * Handle a search request: embed query, search Vectorize, return results.
 * @param {object} params
 * @param {string} params.query - Search query text
 * @param {string} [params.category] - Optional category filter
 * @param {number} [params.limit=10] - Max results to return
 * @param {object} params.env - Worker env bindings (OPENAI_API_KEY, VECTORIZE)
 * @param {Function} [params.fetcher] - Fetch function (injectable for testing)
 * @returns {Promise<{results: Array, took_ms: number}>}
 */
export async function handleSearch({ query, category, limit = 10, env, fetcher = fetch }) {
  const start = Date.now();

  if (!query || query.trim() === '') {
    return { results: [], took_ms: Date.now() - start };
  }

  const vector = await embedText(query, env.OPENAI_API_KEY, fetcher);

  const queryOptions = {
    topK: limit,
    returnMetadata: 'all',
  };

  if (category) {
    queryOptions.filter = { category };
  }

  const vectorResults = await env.VECTORIZE.query(vector, queryOptions);

  const results = vectorResults.matches.map((match) => ({
    slug: match.id,
    title: match.metadata.title,
    category: match.metadata.category,
    summary: match.metadata.summary,
    score: match.score,
  }));

  return { results, took_ms: Date.now() - start };
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run test/workers-search.test.js`

Expected: All 6 tests PASS.

**Step 5: Commit**

```bash
git add test/workers-search.test.js workers/search.js && git commit -m "feat: add search handler with OpenAI embedding and Vectorize query"
```

---

### Task 5: Workers Router — CORS, Routing, Error Handling

**Files:**
- Create: `test/workers-router.test.js`
- Create: `workers/index.js`

The Workers entry point routes requests to the appropriate handler and adds CORS headers.

**Step 1: Write the failing test**

Create file `test/workers-router.test.js`:

```js
import { describe, it, expect } from 'vitest';

// We test the worker by importing and calling its fetch handler directly.
// The handler signature is: fetch(request, env, ctx)
import worker from '../workers/index.js';

function createMockEnv(overrides = {}) {
  return {
    OPENAI_API_KEY: 'test-key',
    HEAT_STORE: {
      get: async () => null,
      put: async () => {},
    },
    VECTORIZE: {
      query: async () => ({ count: 0, matches: [] }),
    },
    ...overrides,
  };
}

const mockCtx = { waitUntil: () => {} };

describe('Workers router', () => {
  describe('CORS', () => {
    it('responds to OPTIONS with CORS headers', async () => {
      const req = new Request('https://spicy-specs.com/api/search', { method: 'OPTIONS' });
      const res = await worker.fetch(req, createMockEnv(), mockCtx);
      expect(res.status).toBe(204);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(res.headers.get('Access-Control-Allow-Methods')).toContain('GET');
      expect(res.headers.get('Access-Control-Allow-Methods')).toContain('POST');
    });

    it('adds CORS headers to all responses', async () => {
      const req = new Request('https://spicy-specs.com/api/heat/test-slug');
      const res = await worker.fetch(req, createMockEnv(), mockCtx);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });
  });

  describe('routing', () => {
    it('routes GET /api/search to search handler', async () => {
      const req = new Request('https://spicy-specs.com/api/search?q=test');
      const res = await worker.fetch(req, createMockEnv(), mockCtx);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty('results');
      expect(body).toHaveProperty('took_ms');
    });

    it('routes GET /api/heat/:slug to heat GET handler', async () => {
      const req = new Request('https://spicy-specs.com/api/heat/ruthless-simplicity');
      const res = await worker.fetch(req, createMockEnv(), mockCtx);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty('heat');
      expect(body).toHaveProperty('chiliLevel');
    });

    it('routes POST /api/heat/:slug to heat POST handler', async () => {
      const req = new Request('https://spicy-specs.com/api/heat/ruthless-simplicity', {
        method: 'POST',
      });
      const res = await worker.fetch(req, createMockEnv(), mockCtx);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty('heat');
      expect(body).toHaveProperty('added', true);
    });

    it('returns 404 JSON for unknown routes', async () => {
      const req = new Request('https://spicy-specs.com/api/unknown');
      const res = await worker.fetch(req, createMockEnv(), mockCtx);
      expect(res.status).toBe(404);
      const body = await res.json();
      expect(body).toHaveProperty('error', 'Not found');
    });

    it('returns 404 for GET /api/heat with no slug', async () => {
      const req = new Request('https://spicy-specs.com/api/heat');
      const res = await worker.fetch(req, createMockEnv(), mockCtx);
      expect(res.status).toBe(404);
    });

    it('returns 405 for PUT /api/heat/:slug', async () => {
      const req = new Request('https://spicy-specs.com/api/heat/test', { method: 'PUT' });
      const res = await worker.fetch(req, createMockEnv(), mockCtx);
      expect(res.status).toBe(405);
      const body = await res.json();
      expect(body).toHaveProperty('error', 'Method not allowed');
    });
  });

  describe('error handling', () => {
    it('returns 500 JSON when handler throws', async () => {
      const brokenEnv = createMockEnv({
        HEAT_STORE: {
          get: async () => { throw new Error('KV exploded'); },
          put: async () => {},
        },
      });
      const req = new Request('https://spicy-specs.com/api/heat/test');
      const res = await worker.fetch(req, brokenEnv, mockCtx);
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body).toHaveProperty('error');
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run test/workers-router.test.js`

Expected: FAIL — `workers/index.js` doesn't export a Worker with a `fetch` handler.

**Step 3: Write minimal implementation**

Replace the contents of `workers/index.js` (delete the `.gitkeep` first if you need to — but the plan is to create this as a new JS file):

Create file `workers/index.js`:

```js
import { handleHeatGet, handleHeatPost } from './heat.js';
import { handleSearch } from './search.js';

/**
 * Create a JSON response with CORS headers.
 * @param {object} body - Response body
 * @param {number} [status=200] - HTTP status code
 * @returns {Response}
 */
function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

/**
 * Extract the slug from a /api/heat/:slug path.
 * @param {string} pathname - URL pathname
 * @returns {string|null} The slug, or null if path doesn't match
 */
function extractHeatSlug(pathname) {
  const match = pathname.match(/^\/api\/heat\/([a-zA-Z0-9_-]+)$/);
  return match ? match[1] : null;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;
    const method = request.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    try {
      // Search route
      if (pathname === '/api/search' && method === 'GET') {
        const query = url.searchParams.get('q') || '';
        const category = url.searchParams.get('category') || undefined;
        const limit = parseInt(url.searchParams.get('limit') || '10', 10);
        const result = await handleSearch({ query, category, limit, env });
        return jsonResponse(result);
      }

      // Heat routes
      const slug = extractHeatSlug(pathname);
      if (slug) {
        if (method === 'GET') {
          const result = await handleHeatGet(slug, env.HEAT_STORE);
          return jsonResponse(result);
        }
        if (method === 'POST') {
          const result = await handleHeatPost(slug, env.HEAT_STORE);
          return jsonResponse(result);
        }
        return jsonResponse({ error: 'Method not allowed' }, 405);
      }

      // No route matched
      return jsonResponse({ error: 'Not found' }, 404);
    } catch (err) {
      return jsonResponse({ error: 'Internal server error' }, 500);
    }
  },
};
```

**Step 4: Delete the old `.gitkeep`**

Run: `rm workers/.gitkeep`

**Step 5: Run test to verify it passes**

Run: `npx vitest run test/workers-router.test.js`

Expected: All 8 tests PASS.

**Step 6: Run ALL tests to verify nothing is broken**

Run: `npx vitest run`

Expected: All existing tests + new tests PASS.

**Step 7: Commit**

```bash
git add workers/index.js test/workers-router.test.js && git rm workers/.gitkeep 2>/dev/null; git add -A workers/ && git commit -m "feat: add Workers router with CORS, routing, and error handling"
```

---

### Task 6: Embedding Generation — Parse Specs from Disk

**Files:**
- Create: `test/generate-embeddings.test.js`
- Create: `build/generate-embeddings.js`

The embedding script needs to: (1) find all spec markdown files, (2) parse their frontmatter, (3) call OpenAI to embed them, (4) upsert to Vectorize. This task handles steps 1 and 2.

**Step 1: Write the failing test**

Create file `test/generate-embeddings.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { parseAllSpecs } from '../build/generate-embeddings.js';

describe('parseAllSpecs', () => {
  it('finds and parses all spec files from specs/ directory', () => {
    const specs = parseAllSpecs('specs');
    expect(specs.length).toBeGreaterThan(0);
  });

  it('returns objects with slug, title, category, summary, and textToEmbed', () => {
    const specs = parseAllSpecs('specs');
    const spec = specs[0];
    expect(spec).toHaveProperty('slug');
    expect(spec).toHaveProperty('title');
    expect(spec).toHaveProperty('category');
    expect(spec).toHaveProperty('summary');
    expect(spec).toHaveProperty('textToEmbed');
  });

  it('parses ruthless-simplicity spec correctly', () => {
    const specs = parseAllSpecs('specs');
    const rs = specs.find((s) => s.slug === 'ruthless-simplicity');
    expect(rs).toBeDefined();
    expect(rs.title).toBe('Ruthless Simplicity');
    expect(rs.category).toBe('philosophy');
    expect(rs.summary).toContain('simplest thing');
  });

  it('textToEmbed combines title and summary', () => {
    const specs = parseAllSpecs('specs');
    const rs = specs.find((s) => s.slug === 'ruthless-simplicity');
    expect(rs.textToEmbed).toContain('Ruthless Simplicity');
    expect(rs.textToEmbed).toContain('simplest thing');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run test/generate-embeddings.test.js`

Expected: FAIL — `build/generate-embeddings.js` doesn't export `parseAllSpecs`.

**Step 3: Write minimal implementation**

Create file `build/generate-embeddings.js`:

```js
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

/**
 * Recursively find all .md files in a directory.
 * @param {string} dir - Directory to search
 * @returns {string[]} Array of file paths
 */
function findMarkdownFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...findMarkdownFiles(full));
    } else if (entry.endsWith('.md')) {
      files.push(full);
    }
  }
  return files;
}

/**
 * Parse all spec markdown files and extract data needed for embedding.
 * @param {string} specsDir - Path to specs directory
 * @returns {Array<{slug: string, title: string, category: string, summary: string, textToEmbed: string}>}
 */
export function parseAllSpecs(specsDir) {
  const files = findMarkdownFiles(specsDir);
  return files.map((filePath) => {
    const raw = readFileSync(filePath, 'utf-8');
    const { data } = matter(raw);
    return {
      slug: data.slug,
      title: data.title,
      category: data.category,
      summary: data.summary,
      textToEmbed: `${data.title}: ${data.summary}`,
    };
  });
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run test/generate-embeddings.test.js`

Expected: All 4 tests PASS.

**Step 5: Commit**

```bash
git add test/generate-embeddings.test.js build/generate-embeddings.js && git commit -m "feat: add parseAllSpecs for embedding generation"
```

---

### Task 7: Embedding Generation — OpenAI + Vectorize Integration

**Files:**
- Modify: `test/generate-embeddings.test.js`
- Modify: `build/generate-embeddings.js`

Add the functions that call OpenAI for embeddings and upsert to Vectorize. Both are mocked in tests.

**Step 1: Write the failing tests**

Append to `test/generate-embeddings.test.js`:

```js
import { generateEmbeddings, upsertToVectorize } from '../build/generate-embeddings.js';

describe('generateEmbeddings', () => {
  it('calls OpenAI for each spec and returns vectors', async () => {
    const specs = [
      { slug: 'test-1', title: 'Test 1', category: 'spec', summary: 'A test', textToEmbed: 'Test 1: A test' },
      { slug: 'test-2', title: 'Test 2', category: 'pattern', summary: 'Another', textToEmbed: 'Test 2: Another' },
    ];

    let callCount = 0;
    const mockFetch = async (url, opts) => {
      callCount++;
      return new Response(JSON.stringify({
        data: [{ embedding: new Array(1536).fill(callCount * 0.1) }],
        usage: { prompt_tokens: 5, total_tokens: 5 },
      }));
    };

    const result = await generateEmbeddings(specs, 'test-key', mockFetch);
    expect(result).toHaveLength(2);
    expect(result[0].slug).toBe('test-1');
    expect(result[0].vector).toHaveLength(1536);
    expect(result[1].slug).toBe('test-2');
    expect(callCount).toBe(2);
  });

  it('includes metadata in each result', async () => {
    const specs = [
      { slug: 's1', title: 'Title', category: 'spec', summary: 'Sum', textToEmbed: 'Title: Sum' },
    ];

    const mockFetch = async () => new Response(JSON.stringify({
      data: [{ embedding: new Array(1536).fill(0) }],
      usage: { prompt_tokens: 5, total_tokens: 5 },
    }));

    const result = await generateEmbeddings(specs, 'key', mockFetch);
    expect(result[0].metadata).toEqual({
      title: 'Title',
      category: 'spec',
      summary: 'Sum',
    });
  });
});

describe('upsertToVectorize', () => {
  it('calls Vectorize upsert with correctly shaped vectors', async () => {
    let capturedVectors;
    const mockVectorizeUpsert = async (vectors) => {
      capturedVectors = vectors;
      return { count: vectors.length };
    };

    const embeddings = [
      {
        slug: 'test-slug',
        vector: new Array(1536).fill(0.5),
        metadata: { title: 'Test', category: 'spec', summary: 'A test' },
      },
    ];

    await upsertToVectorize(embeddings, mockVectorizeUpsert);

    expect(capturedVectors).toHaveLength(1);
    expect(capturedVectors[0]).toEqual({
      id: 'test-slug',
      values: expect.any(Array),
      metadata: { title: 'Test', category: 'spec', summary: 'A test' },
    });
    expect(capturedVectors[0].values).toHaveLength(1536);
  });

  it('handles batch of multiple embeddings', async () => {
    let capturedVectors;
    const mockVectorizeUpsert = async (vectors) => {
      capturedVectors = vectors;
      return { count: vectors.length };
    };

    const embeddings = [
      { slug: 'a', vector: new Array(1536).fill(0), metadata: { title: 'A', category: 'spec', summary: 'A' } },
      { slug: 'b', vector: new Array(1536).fill(1), metadata: { title: 'B', category: 'pattern', summary: 'B' } },
    ];

    await upsertToVectorize(embeddings, mockVectorizeUpsert);
    expect(capturedVectors).toHaveLength(2);
  });
});
```

Update the existing import at the top of the file to include the new functions:

```js
import { describe, it, expect } from 'vitest';
import { parseAllSpecs, generateEmbeddings, upsertToVectorize } from '../build/generate-embeddings.js';
```

**Step 2: Run test to verify new tests fail**

Run: `npx vitest run test/generate-embeddings.test.js`

Expected: `parseAllSpecs` tests PASS. New tests FAIL — `generateEmbeddings` and `upsertToVectorize` don't exist yet.

**Step 3: Write minimal implementation**

Append to `build/generate-embeddings.js`:

```js
import { embedText } from '../workers/search.js';

/**
 * Generate embeddings for an array of parsed specs.
 * @param {Array} specs - Parsed spec objects from parseAllSpecs
 * @param {string} apiKey - OpenAI API key
 * @param {Function} [fetcher=fetch] - Fetch function (injectable for testing)
 * @returns {Promise<Array<{slug: string, vector: number[], metadata: object}>>}
 */
export async function generateEmbeddings(specs, apiKey, fetcher = fetch) {
  const results = [];
  for (const spec of specs) {
    const vector = await embedText(spec.textToEmbed, apiKey, fetcher);
    results.push({
      slug: spec.slug,
      vector,
      metadata: {
        title: spec.title,
        category: spec.category,
        summary: spec.summary,
      },
    });
  }
  return results;
}

/**
 * Upsert embedding vectors to Cloudflare Vectorize.
 * @param {Array} embeddings - Array of {slug, vector, metadata} objects
 * @param {Function} vectorizeUpsert - The Vectorize upsert function
 * @returns {Promise<void>}
 */
export async function upsertToVectorize(embeddings, vectorizeUpsert) {
  const vectors = embeddings.map((e) => ({
    id: e.slug,
    values: e.vector,
    metadata: e.metadata,
  }));
  await vectorizeUpsert(vectors);
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run test/generate-embeddings.test.js`

Expected: All 8 tests PASS.

**Step 5: Commit**

```bash
git add test/generate-embeddings.test.js build/generate-embeddings.js && git commit -m "feat: add embedding generation and Vectorize upsert"
```

---

### Task 8: Embedding Generation — CLI Entry Point

**Files:**
- Modify: `build/generate-embeddings.js`
- Modify: `package.json`

Add a `main()` function that ties everything together: parse specs → generate embeddings → upsert. This runs as `npm run embeddings`. We don't TDD the CLI entry point because it requires live API keys — we test the individual functions instead.

**Step 1: Add the `main()` function to `build/generate-embeddings.js`**

Append to the bottom of `build/generate-embeddings.js`:

```js
/**
 * Main entry point: parse all specs, generate embeddings, upsert to Vectorize.
 * Requires environment variables: OPENAI_API_KEY, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_VECTORIZE_INDEX_ID
 * Run with: npm run embeddings
 */
async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('Error: OPENAI_API_KEY environment variable is required');
    process.exit(1);
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const indexId = process.env.CLOUDFLARE_VECTORIZE_INDEX_ID;
  if (!accountId || !indexId) {
    console.error('Error: CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_VECTORIZE_INDEX_ID are required');
    process.exit(1);
  }

  console.log('Parsing specs from specs/ directory...');
  const specs = parseAllSpecs('specs');
  console.log(`Found ${specs.length} spec(s)`);

  if (specs.length === 0) {
    console.log('No specs found. Exiting.');
    return;
  }

  console.log('Generating embeddings via OpenAI...');
  const embeddings = await generateEmbeddings(specs, apiKey);
  console.log(`Generated ${embeddings.length} embedding(s)`);

  console.log('Upserting to Cloudflare Vectorize...');
  const cfApiToken = process.env.CLOUDFLARE_API_TOKEN;
  const vectorizeUpsert = async (vectors) => {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/vectorize/v2/indexes/${indexId}/upsert`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cfApiToken}`,
          'Content-Type': 'application/x-ndjson',
        },
        body: vectors.map((v) => JSON.stringify(v)).join('\n'),
      }
    );
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Vectorize upsert failed (${res.status}): ${text}`);
    }
    const data = await res.json();
    console.log(`Vectorize upsert response: ${JSON.stringify(data)}`);
    return data;
  };

  await upsertToVectorize(embeddings, vectorizeUpsert);
  console.log('Done! All embeddings upserted to Vectorize.');
}

// Run main() if this file is executed directly (not imported)
const isMainModule = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/.*\//, ''));
if (isMainModule) {
  main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}
```

**Step 2: Add the `embeddings` script to `package.json`**

In `package.json`, add the `embeddings` script to the `"scripts"` section:

```json
"embeddings": "node build/generate-embeddings.js"
```

The full scripts section should be:

```json
"scripts": {
  "build": "astro build",
  "dev": "astro dev",
  "preview": "astro preview",
  "test": "vitest run",
  "test:watch": "vitest",
  "dev:workers": "wrangler dev workers/index.js",
  "embeddings": "node build/generate-embeddings.js"
}
```

**Step 3: Verify the script is registered**

Run: `npm run embeddings 2>&1 | head -3`

Expected: Error message about `OPENAI_API_KEY` being required (which proves the script runs and hits the guard clause).

**Step 4: Run ALL tests to verify nothing is broken**

Run: `npx vitest run`

Expected: All tests PASS.

**Step 5: Commit**

```bash
git add build/generate-embeddings.js package.json && git commit -m "feat: add embeddings CLI entry point and npm script"
```

---

### Task 9: GitHub Actions Deploy Workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

Create the CD pipeline that runs on push to main. No TDD for this — YAML config isn't unit-testable. We validate the syntax instead.

**Step 1: Create the workflow file**

Create file `.github/workflows/deploy.yml`:

```yaml
name: Deploy Spicy Specs

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Generate embeddings
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_VECTORIZE_INDEX_ID: ${{ secrets.CLOUDFLARE_VECTORIZE_INDEX_ID }}
        run: npm run embeddings

      - name: Build static site
        run: npm run build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: spicy-specs
          directory: dist

      - name: Deploy Workers
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        run: npx wrangler deploy
```

**Step 2: Delete the old `.gitkeep`**

Run: `rm .github/workflows/.gitkeep`

**Step 3: Validate YAML syntax**

Run: `node -e "const fs = require('fs'); const y = fs.readFileSync('.github/workflows/deploy.yml', 'utf-8'); console.log('YAML length:', y.length, 'bytes'); console.log('Has jobs:', y.includes('jobs:')); console.log('Has steps:', y.includes('steps:'));"`

Expected: Prints length, `Has jobs: true`, `Has steps: true`.

**Step 4: Commit**

```bash
git rm .github/workflows/.gitkeep 2>/dev/null; git add .github/workflows/deploy.yml && git commit -m "feat: add GitHub Actions deploy workflow"
```

---

### Task 10: Update `.env.example` and `package.json` Metadata

**Files:**
- Modify: `.env.example`
- Modify: `package.json`

Ensure all environment variables and scripts are documented.

**Step 1: Update `.env.example`**

Replace the contents of `.env.example` with:

```
# Required for embedding generation (build/generate-embeddings.js)
OPENAI_API_KEY=sk-your-key-here

# Required for Cloudflare deployment
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token

# Required for Vectorize integration
CLOUDFLARE_VECTORIZE_INDEX_ID=your-index-id
```

**Step 2: Run ALL tests one final time**

Run: `npx vitest run`

Expected: All tests PASS (216 existing + all new tests).

**Step 3: Commit**

```bash
git add .env.example package.json && git commit -m "chore: update env example and package metadata for Phase 1C"
```

---

### Task 11: Workers Integration Test with Miniflare

**Files:**
- Create: `test/workers-integration.test.js`

Spin up a real Miniflare instance, load the Worker, and make actual HTTP requests to validate the full routing + heat flow.

**Step 1: Write the integration test**

Create file `test/workers-integration.test.js`:

```js
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Miniflare } from 'miniflare';
import { readFileSync } from 'fs';

describe('Workers integration (Miniflare)', () => {
  let mf;
  let url;

  beforeAll(async () => {
    // Read the worker source files and bundle them inline
    // Miniflare needs a single script, so we create a combined module
    const heatSrc = readFileSync('workers/heat.js', 'utf-8');
    const searchSrc = readFileSync('workers/search.js', 'utf-8');
    const indexSrc = readFileSync('workers/index.js', 'utf-8');

    // We need to inline the imports for Miniflare's single-script mode
    // Strip the import lines and combine
    const heatCode = heatSrc;
    const searchCode = searchSrc;
    const routerCode = indexSrc
      .replace(/^import .* from '\.\/heat\.js';?\n?/m, '')
      .replace(/^import .* from '\.\/search\.js';?\n?/m, '');

    const combinedScript = `${heatCode}\n${searchCode}\n${routerCode}`;

    mf = new Miniflare({
      modules: true,
      script: combinedScript,
      kvNamespaces: ['HEAT_STORE'],
      bindings: {
        OPENAI_API_KEY: 'test-key',
      },
    });

    // Get the URL to make requests against
    url = await mf.ready;
  }, 15000);

  afterAll(async () => {
    if (mf) await mf.dispose();
  });

  it('GET /api/heat/:slug returns heat 0 for new slug', async () => {
    const res = await mf.dispatchFetch(`${url}/api/heat/test-spec`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.heat).toBe(0);
    expect(body.chiliLevel).toBe(0);
  });

  it('POST /api/heat/:slug increments heat', async () => {
    const res = await mf.dispatchFetch(`${url}/api/heat/vote-test`, {
      method: 'POST',
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.heat).toBe(1);
    expect(body.added).toBe(true);
  });

  it('GET /api/heat/:slug reflects POST increment', async () => {
    // POST first
    await mf.dispatchFetch(`${url}/api/heat/reflect-test`, { method: 'POST' });
    await mf.dispatchFetch(`${url}/api/heat/reflect-test`, { method: 'POST' });

    // GET should show 2
    const res = await mf.dispatchFetch(`${url}/api/heat/reflect-test`);
    const body = await res.json();
    expect(body.heat).toBe(2);
  });

  it('OPTIONS returns CORS headers', async () => {
    const res = await mf.dispatchFetch(`${url}/api/heat/test`, {
      method: 'OPTIONS',
    });
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('unknown route returns 404', async () => {
    const res = await mf.dispatchFetch(`${url}/api/nope`);
    expect(res.status).toBe(404);
  });

  it('all responses have CORS headers', async () => {
    const res = await mf.dispatchFetch(`${url}/api/heat/cors-check`);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });
});
```

**Step 2: Run the integration test**

Run: `npx vitest run test/workers-integration.test.js`

Expected: This test may need adjustment based on how Miniflare handles the combined script. If the inline bundling approach fails, the test should be refactored to use `scriptPath` with the index file and let Miniflare resolve modules. See step 3 below.

**Step 3: If the inline script approach doesn't work, use `scriptPath` instead**

Replace the `beforeAll` block with:

```js
beforeAll(async () => {
  mf = new Miniflare({
    modules: true,
    modulesRoot: '.',
    scriptPath: 'workers/index.js',
    kvNamespaces: ['HEAT_STORE'],
    bindings: {
      OPENAI_API_KEY: 'test-key',
    },
  });

  url = await mf.ready;
}, 15000);
```

And remove the `readFileSync` import and all the script-inlining code.

**Step 4: Run ALL tests**

Run: `npx vitest run`

Expected: All tests PASS.

**Step 5: Commit**

```bash
git add test/workers-integration.test.js && git commit -m "test: add Miniflare integration tests for Workers"
```

---

### Task 12: Update README with Cloudflare Setup Instructions

**Files:**
- Modify: `README.md`

Document the one-time Cloudflare resource setup and new commands.

**Step 1: Read the current README**

Read `README.md` to understand its current structure before modifying.

**Step 2: Add a new section after the existing content**

Add a section titled `## API Layer (Phase 1C)` to the README with this content:

```markdown
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
```

**Step 3: Commit**

```bash
git add README.md && git commit -m "docs: add Phase 1C API layer setup instructions"
```

---

### Task 13: Final Verification

**Files:** None (verification only)

**Step 1: Run the full test suite**

Run: `npx vitest run`

Expected: ALL tests pass — 216 existing + all new tests.

**Step 2: Verify Astro build still works**

Run: `npx astro build 2>&1 | tail -5`

Expected: Build completes successfully.

**Step 3: Verify the embeddings script errors gracefully without keys**

Run: `npm run embeddings 2>&1 | head -3`

Expected: `Error: OPENAI_API_KEY environment variable is required`

**Step 4: Check git status is clean**

Run: `git status`

Expected: Working tree clean (all changes committed).

**Step 5: List all commits from this phase**

Run: `git log --oneline HEAD~12..HEAD`

Expected: ~10-12 commits from Phase 1C tasks.

---

## File Summary

### New Files Created
| File | Purpose |
|------|---------|
| `wrangler.toml` | Cloudflare Workers config (Vectorize + KV bindings) |
| `workers/heat.js` | Heat/voting API handlers |
| `workers/search.js` | Search API handler (OpenAI embed + Vectorize query) |
| `workers/index.js` | Workers entry point (router, CORS, error handling) |
| `build/generate-embeddings.js` | Embedding generation script |
| `.github/workflows/deploy.yml` | GitHub Actions CD pipeline |
| `test/workers-heat.test.js` | Heat handler unit tests |
| `test/workers-search.test.js` | Search handler unit tests |
| `test/workers-router.test.js` | Router/CORS unit tests |
| `test/workers-integration.test.js` | Miniflare integration tests |

### Modified Files
| File | Change |
|------|--------|
| `package.json` | Add `embeddings` script |
| `.env.example` | Update comments for clarity |
| `README.md` | Add Phase 1C setup documentation |

### Deleted Files
| File | Reason |
|------|--------|
| `workers/.gitkeep` | Replaced by actual worker files |
| `.github/workflows/.gitkeep` | Replaced by deploy.yml |

## Success Criteria Checklist

- [ ] `npm run embeddings` generates vectors and upserts to Vectorize
- [ ] `GET /api/search?q=simplicity` returns semantic results
- [ ] `POST /api/heat/ruthless-simplicity` increments heat count
- [ ] Workers deployable via `wrangler deploy`
- [ ] GitHub Actions builds and deploys on push to main
- [ ] All tests passing (216 existing + new Worker tests)
- [ ] README documents Cloudflare resource setup