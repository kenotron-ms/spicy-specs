import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;

describe('Astro installation and configuration', () => {
  describe('package.json scripts', () => {
    let pkg;

    beforeAll(() => {
      const raw = readFileSync(resolve(ROOT, 'package.json'), 'utf-8');
      pkg = JSON.parse(raw);
    });

    it('has "build" script set to "astro build"', () => {
      expect(pkg.scripts.build).toBe('astro build');
    });

    it('has "dev" script set to "astro dev"', () => {
      expect(pkg.scripts.dev).toBe('astro dev');
    });

    it('has "preview" script set to "astro preview"', () => {
      expect(pkg.scripts.preview).toBe('astro preview');
    });

    it('has "test" script set to "vitest run"', () => {
      expect(pkg.scripts.test).toBe('vitest run');
    });

    it('has "test:watch" script set to "vitest"', () => {
      expect(pkg.scripts['test:watch']).toBe('vitest');
    });

    it('has "dev:workers" script preserved', () => {
      expect(pkg.scripts['dev:workers']).toBe('wrangler dev workers/index.js');
    });
  });

  describe('package.json dependencies', () => {
    let pkg;

    beforeAll(() => {
      const raw = readFileSync(resolve(ROOT, 'package.json'), 'utf-8');
      pkg = JSON.parse(raw);
    });

    it('does NOT include "marked" in dependencies', () => {
      expect(pkg.dependencies?.marked).toBeUndefined();
    });

    it('does NOT include "commander" in dependencies', () => {
      expect(pkg.dependencies?.commander).toBeUndefined();
    });

    it('retains "gray-matter" in dependencies', () => {
      expect(pkg.dependencies?.['gray-matter']).toBeDefined();
    });

    it('retains "vitest" in devDependencies', () => {
      expect(pkg.devDependencies?.vitest).toBeDefined();
    });

    it('has "astro" installed', () => {
      const hasAstroDep = pkg.dependencies?.astro ?? pkg.devDependencies?.astro;
      expect(hasAstroDep).toBeDefined();
    });

    it('has "@astrojs/cloudflare" installed', () => {
      const hasCloudflare =
        pkg.dependencies?.['@astrojs/cloudflare'] ?? pkg.devDependencies?.['@astrojs/cloudflare'];
      expect(hasCloudflare).toBeDefined();
    });
  });

  describe('astro.config.mjs', () => {
    const configPath = resolve(ROOT, 'astro.config.mjs');
    let configContent;

    beforeAll(() => {
      if (existsSync(configPath)) {
        configContent = readFileSync(configPath, 'utf-8');
      }
    });

    it('astro.config.mjs exists', () => {
      expect(existsSync(configPath)).toBe(true);
    });

    it('imports defineConfig from astro/config', () => {
      expect(configContent).toMatch(/from\s+['"]astro\/config['"]/);
    });

    it('imports cloudflare adapter', () => {
      expect(configContent).toMatch(/@astrojs\/cloudflare/);
    });

    it('sets output to "static"', () => {
      expect(configContent).toMatch(/output\s*:\s*['"]static['"]/);
    });

    it('sets site to "https://spicy-specs.com"', () => {
      expect(configContent).toMatch(/site\s*:\s*['"]https:\/\/spicy-specs\.com['"]/);
    });

    it('configures Shiki with github-light theme', () => {
      expect(configContent).toMatch(/github-light/);
    });

    it('sets shikiConfig wrap to false', () => {
      expect(configContent).toMatch(/wrap\s*:\s*false/);
    });

    it('uses cloudflare adapter in config', () => {
      expect(configContent).toMatch(/adapter\s*:\s*cloudflare\(\)/);
    });
  });
});
