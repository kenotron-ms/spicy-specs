import { describe, it, expect } from 'vitest';
import { createProgram } from '../cli/spicy-specs.js';

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

describe('CLI list command', () => {
  it('lists all specs and prints formatted output', async () => {
    const output = [];
    const deps = {
      apiBase: 'https://example.com',
      fetcher: async () => ({
        ok: true,
        json: async () => ({
          results: [
            { slug: 'ruthless-simplicity', title: 'Ruthless Simplicity', category: 'philosophy', summary: 'Keep it simple' },
            { slug: 'no-yagni', title: 'No YAGNI Violations', category: 'spec', summary: 'Build only what is needed' },
          ],
          took_ms: 10,
        }),
      }),
      print: (str) => output.push(str),
    };
    const program = createProgram(deps);
    await program.parseAsync(['node', 'spicy-specs', 'list']);
    const text = output.join('\n');
    expect(text).toContain('Ruthless Simplicity');
    expect(text).toContain('No YAGNI Violations');
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

describe('CLI --category validation', () => {
  it('rejects invalid --category value in search', async () => {
    const deps = {
      apiBase: 'https://example.com',
      fetcher: async () => { throw new Error('should not be called'); },
      print: () => {},
    };
    const program = createProgram(deps);
    await expect(
      program.parseAsync(['node', 'spicy-specs', 'search', 'test', '--category', 'bad-category'])
    ).rejects.toThrow(/invalid category/i);
  });

  it('rejects invalid --category value in list', async () => {
    const deps = {
      apiBase: 'https://example.com',
      fetcher: async () => { throw new Error('should not be called'); },
      print: () => {},
    };
    const program = createProgram(deps);
    await expect(
      program.parseAsync(['node', 'spicy-specs', 'list', '--category', 'bad-category'])
    ).rejects.toThrow(/invalid category/i);
  });

  it('accepts valid --category value in search', async () => {
    const deps = {
      apiBase: 'https://example.com',
      fetcher: async () => ({ ok: true, json: async () => ({ results: [], took_ms: 5 }) }),
      print: () => {},
    };
    const program = createProgram(deps);
    await expect(
      program.parseAsync(['node', 'spicy-specs', 'search', 'test', '--category', 'spec'])
    ).resolves.toBeDefined();
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
    expect(text).toContain('reference-app');
    expect(text).toContain('pattern');
    expect(text).toContain('philosophy');
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
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBe(5);
  });
});
