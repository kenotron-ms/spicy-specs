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
