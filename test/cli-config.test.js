import { describe, it, expect } from 'vitest';
import { loadConfig, getApiBase } from '../cli/config.js';

const DEFAULT_CONFIG = { apiBase: 'https://spicy-specs.com' };

describe('loadConfig', () => {
  it('returns default config when readFile returns null', () => {
    const mockFs = {
      readFileSync: () => null,
    };
    const result = loadConfig(mockFs);
    expect(result).toEqual(DEFAULT_CONFIG);
  });

  it('parses and merges valid JSON config from file', () => {
    const customConfig = { apiBase: 'https://custom.example.com' };
    const mockFs = {
      readFileSync: () => JSON.stringify(customConfig),
    };
    const result = loadConfig(mockFs);
    expect(result).toEqual({ apiBase: 'https://custom.example.com' });
  });

  it('returns default config when readFile throws', () => {
    const mockFs = {
      readFileSync: () => { throw new Error('ENOENT: file not found'); },
    };
    const result = loadConfig(mockFs);
    expect(result).toEqual(DEFAULT_CONFIG);
  });
});

describe('getApiBase', () => {
  it('returns apiBase from config when file exists', () => {
    const customConfig = { apiBase: 'https://my-server.com' };
    const mockFs = {
      readFileSync: () => JSON.stringify(customConfig),
    };
    const result = getApiBase(mockFs);
    expect(result).toBe('https://my-server.com');
  });

  it('returns default apiBase when no config file exists', () => {
    const mockFs = {
      readFileSync: () => { throw new Error('ENOENT: file not found'); },
    };
    const result = getApiBase(mockFs);
    expect(result).toBe('https://spicy-specs.com');
  });
});
