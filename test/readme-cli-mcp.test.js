import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;

describe('README CLI Tool section', () => {
  let readme;

  beforeAll(() => {
    readme = readFileSync(resolve(ROOT, 'README.md'), 'utf-8');
  });

  it('contains the "## CLI Tool" heading', () => {
    expect(readme).toContain('## CLI Tool');
  });

  it('contains usage examples for search command', () => {
    expect(readme).toMatch(/spicy.*search/i);
  });

  it('contains usage example for search with category filter', () => {
    expect(readme).toMatch(/--category/);
  });

  it('contains usage example for get by slug command', () => {
    expect(readme).toMatch(/spicy.*get/i);
  });

  it('contains usage example for list all command', () => {
    expect(readme).toMatch(/spicy.*list/i);
  });

  it('contains usage example for categories command', () => {
    expect(readme).toMatch(/spicy.*categories/i);
  });

  it('contains output format documentation for text format', () => {
    expect(readme).toMatch(/text.*default|default.*text/i);
  });

  it('contains output format documentation for JSON format', () => {
    expect(readme).toContain('--json');
  });

  it('contains output format documentation for Markdown format', () => {
    expect(readme).toContain('--markdown');
  });

  it('contains configuration documentation', () => {
    expect(readme).toContain('~/.spicy-specs/config.json');
    expect(readme).toContain('apiBase');
  });

  it('contains default API base URL', () => {
    expect(readme).toContain('https://spicy-specs.com');
  });
});

describe('README MCP Server section', () => {
  let readme;

  beforeAll(() => {
    readme = readFileSync(resolve(ROOT, 'README.md'), 'utf-8');
  });

  it('contains the "## MCP Server" heading', () => {
    expect(readme).toContain('## MCP Server');
  });

  it('contains the start command', () => {
    expect(readme).toContain('npm run mcp:start');
  });

  it('contains search_specs tool documentation', () => {
    expect(readme).toContain('search_specs');
  });

  it('contains get_spec tool documentation', () => {
    expect(readme).toContain('get_spec');
  });

  it('contains list_specs tool documentation', () => {
    expect(readme).toContain('list_specs');
  });

  it('contains tools table with required/optional parameter info', () => {
    expect(readme).toMatch(/query.*required|required.*query/i);
    expect(readme).toMatch(/category.*optional|optional.*category/i);
    expect(readme).toMatch(/slug.*required|required.*slug/i);
  });

  it('contains protocol description', () => {
    expect(readme).toContain('JSON-RPC 2.0');
    expect(readme).toContain('stdin/stdout');
  });
});
