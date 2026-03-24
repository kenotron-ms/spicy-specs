import { describe, it, expect } from 'vitest';
import { existsSync, lstatSync, statSync, readdirSync } from 'fs';
import { resolve } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;

describe('Astro directory structure', () => {
  describe('required src/ directories', () => {
    it('src/content exists as a directory', () => {
      const dir = resolve(ROOT, 'src/content');
      expect(existsSync(dir)).toBe(true);
      expect(lstatSync(dir).isDirectory()).toBe(true);
    });

    it('src/layouts exists as a directory', () => {
      const dir = resolve(ROOT, 'src/layouts');
      expect(existsSync(dir)).toBe(true);
      expect(lstatSync(dir).isDirectory()).toBe(true);
    });

    it('src/pages exists as a directory', () => {
      const dir = resolve(ROOT, 'src/pages');
      expect(existsSync(dir)).toBe(true);
      expect(lstatSync(dir).isDirectory()).toBe(true);
    });

    it('src/styles exists as a directory', () => {
      const dir = resolve(ROOT, 'src/styles');
      expect(existsSync(dir)).toBe(true);
      expect(lstatSync(dir).isDirectory()).toBe(true);
    });
  });

  describe('specs symlink', () => {
    it('src/content/specs exists', () => {
      const symlinkPath = resolve(ROOT, 'src/content/specs');
      expect(existsSync(symlinkPath)).toBe(true);
    });

    it('src/content/specs is a symlink', () => {
      const symlinkPath = resolve(ROOT, 'src/content/specs');
      expect(lstatSync(symlinkPath).isSymbolicLink()).toBe(true);
    });

    it('src/content/specs resolves to a directory (symlink target exists)', () => {
      const symlinkPath = resolve(ROOT, 'src/content/specs');
      // statSync (not lstatSync) follows the symlink
      expect(statSync(symlinkPath).isDirectory()).toBe(true);
    });

    it('src/content/specs resolves to a non-empty directory', () => {
      const symlinkPath = resolve(ROOT, 'src/content/specs');
      const entries = readdirSync(symlinkPath);
      // Verify the symlink target is populated without coupling to specific subdirectory names
      expect(entries.length).toBeGreaterThan(0);
    });
  });
});
