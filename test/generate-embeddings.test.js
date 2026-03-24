import { describe, it, expect } from 'vitest';
import { parseAllSpecs, generateEmbeddings, upsertToVectorize } from '../build/generate-embeddings.js';

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
