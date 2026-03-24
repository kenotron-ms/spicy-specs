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
