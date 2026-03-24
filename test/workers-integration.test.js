import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Miniflare } from 'miniflare';
import { readFileSync } from 'fs';

describe('Workers integration (Miniflare)', () => {
  let mf;
  let url;

  beforeAll(async () => {
    // Read the worker source files and bundle them inline
    const heatSrc = readFileSync('workers/heat.js', 'utf-8');
    const searchSrc = readFileSync('workers/search.js', 'utf-8');
    const indexSrc = readFileSync('workers/index.js', 'utf-8');

    // Strip import lines and combine for single-script mode
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
    await mf.dispatchFetch(`${url}/api/heat/reflect-test`, { method: 'POST' });
    await mf.dispatchFetch(`${url}/api/heat/reflect-test`, { method: 'POST' });

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
