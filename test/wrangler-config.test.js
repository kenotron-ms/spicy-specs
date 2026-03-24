import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;

describe('wrangler.toml configuration', () => {
  const tomlPath = resolve(ROOT, 'wrangler.toml');

  it('wrangler.toml exists at project root', () => {
    expect(existsSync(tomlPath)).toBe(true);
  });

  it('has correct name field', () => {
    const content = readFileSync(tomlPath, 'utf-8');
    expect(content).toMatch(/name\s*=\s*"spicy-specs-api"/);
  });

  it('has correct main field pointing to workers/index.js', () => {
    const content = readFileSync(tomlPath, 'utf-8');
    expect(content).toMatch(/main\s*=\s*"workers\/index\.js"/);
  });

  it('has correct compatibility_date', () => {
    const content = readFileSync(tomlPath, 'utf-8');
    expect(content).toMatch(/compatibility_date\s*=\s*"2024-01-01"/);
  });

  it('has KV namespace binding HEAT_STORE', () => {
    const content = readFileSync(tomlPath, 'utf-8');
    expect(content).toMatch(/binding\s*=\s*"HEAT_STORE"/);
  });

  it('has Vectorize binding VECTORIZE', () => {
    const content = readFileSync(tomlPath, 'utf-8');
    expect(content).toMatch(/binding\s*=\s*"VECTORIZE"/);
  });

  it('has Vectorize index_name spicy-specs-index', () => {
    const content = readFileSync(tomlPath, 'utf-8');
    expect(content).toMatch(/index_name\s*=\s*"spicy-specs-index"/);
  });
});
