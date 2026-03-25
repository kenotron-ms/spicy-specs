import { describe, it, expect } from 'vitest';
import { TOOLS, handleRequest } from '../mcp/server.js';
import { formatSearchResults, formatSpec, formatSpecList } from '../cli/format.js';

// ── Helpers ────────────────────────────────────────────────────────────────

function mockFetcher(responseBody, status = 200) {
  return async () => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => (typeof responseBody === 'string' ? JSON.parse(responseBody) : responseBody),
    text: async () =>
      typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody),
  });
}

const API_BASE = 'https://test.spicy-specs.com';

// ── TOOLS ──────────────────────────────────────────────────────────────────

describe('TOOLS', () => {
  it('exports exactly 3 tools with correct names', () => {
    expect(TOOLS).toHaveLength(3);
    const names = TOOLS.map((t) => t.name);
    expect(names).toContain('search_specs');
    expect(names).toContain('get_spec');
    expect(names).toContain('list_specs');
  });

  it('search_specs inputSchema requires query', () => {
    const tool = TOOLS.find((t) => t.name === 'search_specs');
    expect(tool.inputSchema.required).toContain('query');
  });

  it('get_spec inputSchema requires slug', () => {
    const tool = TOOLS.find((t) => t.name === 'get_spec');
    expect(tool.inputSchema.required).toContain('slug');
  });
});

// ── initialize ─────────────────────────────────────────────────────────────

describe('initialize', () => {
  it('returns server info and capabilities', async () => {
    const response = await handleRequest({ jsonrpc: '2.0', id: 1, method: 'initialize' }, {});
    expect(response.result.protocolVersion).toBe('2024-11-05');
    expect(response.result.serverInfo.name).toBe('spicy-specs-mcp');
    expect(response.result.serverInfo.version).toBe('0.1.0');
    expect(response.result.capabilities).toEqual({ tools: {} });
  });
});

// ── tools/list ─────────────────────────────────────────────────────────────

describe('tools/list', () => {
  it('returns all 3 tools with schemas', async () => {
    const response = await handleRequest({ jsonrpc: '2.0', id: 2, method: 'tools/list' }, {});
    expect(response.result.tools).toHaveLength(3);
    expect(response.result.tools).toEqual(TOOLS);
  });
});

// ── tools/call search_specs ────────────────────────────────────────────────

describe('tools/call search_specs', () => {
  it('returns text content with search results', async () => {
    const results = [{ title: 'Ruthless Simplicity', slug: 'ruthless-simplicity', category: 'philosophy' }];
    const fetcher = mockFetcher({ results });

    const response = await handleRequest(
      {
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: { name: 'search_specs', arguments: { query: 'simplicity' } },
      },
      { fetcher, apiBase: API_BASE }
    );

    expect(response.result.content).toHaveLength(1);
    expect(response.result.content[0].type).toBe('text');
    expect(response.result.content[0].text).toBe(formatSearchResults(results, 'markdown'));
  });

  it('passes category and limit to the API', async () => {
    let capturedUrl;
    const fetcher = async (url) => {
      capturedUrl = url;
      return {
        ok: true,
        status: 200,
        json: async () => ({ results: [] }),
        text: async () => '{"results":[]}',
      };
    };

    await handleRequest(
      {
        jsonrpc: '2.0',
        id: 4,
        method: 'tools/call',
        params: { name: 'search_specs', arguments: { query: 'test', category: 'philosophy', limit: 3 } },
      },
      { fetcher, apiBase: API_BASE }
    );

    expect(capturedUrl).toContain('category=philosophy');
    expect(capturedUrl).toContain('limit=3');
  });
});

// ── tools/call get_spec ────────────────────────────────────────────────────

describe('tools/call get_spec', () => {
  it('returns spec content as text', async () => {
    const spec = {
      slug: 'ruthless-simplicity',
      title: 'Ruthless Simplicity',
      summary: 'Build the simplest thing',
      category: 'philosophy',
    };
    const fetcher = async (url) => {
      if (url.includes('/api/search')) {
        return {
          ok: true,
          json: async () => ({ results: [spec] }),
          text: async () => JSON.stringify({ results: [spec] }),
        };
      }
      return { ok: false, json: async () => ({}), text: async () => '' };
    };

    const response = await handleRequest(
      {
        jsonrpc: '2.0',
        id: 5,
        method: 'tools/call',
        params: { name: 'get_spec', arguments: { slug: 'ruthless-simplicity' } },
      },
      { fetcher, apiBase: API_BASE }
    );

    expect(response.result.content).toHaveLength(1);
    expect(response.result.content[0].type).toBe('text');
    const expectedSpec = { ...spec, content: spec.summary, heat: 0, chiliLevel: 0 };
    expect(response.result.content[0].text).toBe(formatSpec(expectedSpec, 'markdown'));
  });
});

// ── tools/call list_specs ──────────────────────────────────────────────────

describe('tools/call list_specs', () => {
  it('returns list as text', async () => {
    const results = [
      { title: 'Ruthless Simplicity', slug: 'ruthless-simplicity', category: 'philosophy' },
      { title: 'Fail Fast', slug: 'fail-fast', category: 'pattern' },
    ];
    const fetcher = mockFetcher({ results });

    const response = await handleRequest(
      {
        jsonrpc: '2.0',
        id: 6,
        method: 'tools/call',
        params: { name: 'list_specs', arguments: {} },
      },
      { fetcher, apiBase: API_BASE }
    );

    expect(response.result.content).toHaveLength(1);
    expect(response.result.content[0].type).toBe('text');
    expect(response.result.content[0].text).toBe(formatSpecList(results, 'markdown'));
  });
});

// ── error handling ─────────────────────────────────────────────────────────

describe('error handling', () => {
  it('returns method not found error for unknown method', async () => {
    const response = await handleRequest(
      { jsonrpc: '2.0', id: 7, method: 'unknown/method' },
      {}
    );
    expect(response.error.code).toBe(-32601);
    expect(response.error.message).toBe('Method not found');
  });

  it('returns isError true for unknown tool name', async () => {
    const response = await handleRequest(
      {
        jsonrpc: '2.0',
        id: 8,
        method: 'tools/call',
        params: { name: 'nonexistent_tool', arguments: {} },
      },
      {}
    );
    expect(response.result.isError).toBe(true);
  });
});
