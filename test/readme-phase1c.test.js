import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;

describe('README Phase 1C section', () => {
  let readme;

  beforeAll(() => {
    readme = readFileSync(resolve(ROOT, 'README.md'), 'utf-8');
  });

  it('contains the "## API Layer (Phase 1C)" heading', () => {
    expect(readme).toContain('## API Layer (Phase 1C)');
  });

  it('contains Cloudflare Vectorize setup instructions', () => {
    expect(readme).toContain('Vectorize Index');
    expect(readme).toContain('wrangler vectorize create spicy-specs-index --dimensions=1536 --metric=cosine');
  });

  it('contains KV Namespace setup instructions', () => {
    expect(readme).toContain('KV Namespace');
    expect(readme).toContain('wrangler kv namespace create HEAT_STORE');
  });

  it('contains Worker Secrets setup instructions', () => {
    expect(readme).toContain('Worker Secrets');
    expect(readme).toContain('wrangler secret put OPENAI_API_KEY');
  });

  it('contains the API endpoints table', () => {
    expect(readme).toContain('/api/search');
    expect(readme).toContain('/api/heat/:slug');
    expect(readme).toContain('Semantic search across specs');
    expect(readme).toContain('Get current heat count and chili level');
    expect(readme).toContain('Increment heat (anonymous voting)');
  });

  it('contains the new npm commands', () => {
    expect(readme).toContain('npm run embeddings');
    expect(readme).toContain('npm run dev:workers');
  });

  it('contains environment variables documentation', () => {
    expect(readme).toContain('.env.example');
    expect(readme).toContain('OPENAI_API_KEY');
    expect(readme).toContain('CLOUDFLARE_ACCOUNT_ID');
    expect(readme).toContain('CLOUDFLARE_API_TOKEN');
    expect(readme).toContain('CLOUDFLARE_VECTORIZE_INDEX_ID');
  });
});
