import { describe, it, expect } from 'vitest';
import { searchSpecs, getSpec, listSpecs } from '../cli/api.js';

const API_BASE = 'https://spicy-specs.com';

/**
 * Creates a mock fetcher that returns a response with the given body and status.
 * @param {object|string} responseBody - The response body to return
 * @param {number} [status=200] - HTTP status code
 * @returns {Function} Mock fetcher function
 */
function mockFetcher(responseBody, status = 200) {
  return async (url) => {
    const body = typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody);
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => (typeof responseBody === 'string' ? JSON.parse(responseBody) : responseBody),
      text: async () => body,
    };
  };
}

describe('searchSpecs', () => {
  it('constructs correct URL with required query param', async () => {
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

    await searchSpecs({ query: 'simplicity', apiBase: API_BASE, fetcher });

    expect(capturedUrl).toContain('/api/search');
    expect(capturedUrl).toContain('q=simplicity');
  });

  it('includes optional category and limit params when provided', async () => {
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

    await searchSpecs({ query: 'test', category: 'philosophy', limit: 5, apiBase: API_BASE, fetcher });

    expect(capturedUrl).toContain('q=test');
    expect(capturedUrl).toContain('category=philosophy');
    expect(capturedUrl).toContain('limit=5');
  });

  it('throws on non-ok response with status and body text', async () => {
    const fetcher = mockFetcher('Internal Server Error', 500);

    await expect(searchSpecs({ query: 'test', apiBase: API_BASE, fetcher })).rejects.toThrow('500');
  });
});

describe('getSpec', () => {
  it('fetches spec metadata and heat data, returns merged object', async () => {
    const specResult = {
      results: [
        {
          slug: 'ruthless-simplicity',
          title: 'Ruthless Simplicity',
          summary: 'Build the simplest thing that could possibly work',
          category: 'philosophy',
        },
      ],
    };
    const heatResult = { heat: 42, chiliLevel: 3 };

    let callCount = 0;
    const fetcher = async (url) => {
      callCount++;
      if (url.includes('/api/search')) {
        return {
          ok: true,
          status: 200,
          json: async () => specResult,
          text: async () => JSON.stringify(specResult),
        };
      }
      if (url.includes('/api/heat/')) {
        return {
          ok: true,
          status: 200,
          json: async () => heatResult,
          text: async () => JSON.stringify(heatResult),
        };
      }
    };

    const result = await getSpec({ slug: 'ruthless-simplicity', apiBase: API_BASE, fetcher });

    expect(callCount).toBe(2);
    expect(result.slug).toBe('ruthless-simplicity');
    expect(result.title).toBe('Ruthless Simplicity');
    expect(result.content).toBe('Build the simplest thing that could possibly work');
    expect(result.heat).toBe(42);
    expect(result.chiliLevel).toBe(3);
  });

  it('throws "Spec not found" when slug has no matching result', async () => {
    const fetcher = mockFetcher({ results: [] });

    await expect(getSpec({ slug: 'nonexistent', apiBase: API_BASE, fetcher })).rejects.toThrow(
      'Spec not found'
    );
  });

  it('defaults heat and chiliLevel to 0 when heat endpoint fails', async () => {
    const specResult = {
      results: [
        {
          slug: 'ruthless-simplicity',
          title: 'Ruthless Simplicity',
          summary: 'Build the simplest thing that could possibly work',
          category: 'philosophy',
        },
      ],
    };

    const fetcher = async (url) => {
      if (url.includes('/api/search')) {
        return {
          ok: true,
          status: 200,
          json: async () => specResult,
          text: async () => JSON.stringify(specResult),
        };
      }
      // Heat endpoint fails
      return {
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal Server Error' }),
        text: async () => 'Internal Server Error',
      };
    };

    const result = await getSpec({ slug: 'ruthless-simplicity', apiBase: API_BASE, fetcher });

    expect(result.heat).toBe(0);
    expect(result.chiliLevel).toBe(0);
  });
});

describe('listSpecs', () => {
  it('calls search with q=spec and limit=100', async () => {
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

    await listSpecs({ apiBase: API_BASE, fetcher });

    expect(capturedUrl).toContain('q=spec');
    expect(capturedUrl).toContain('limit=100');
  });

  it('includes category param when provided', async () => {
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

    await listSpecs({ category: 'philosophy', apiBase: API_BASE, fetcher });

    expect(capturedUrl).toContain('category=philosophy');
  });
});
