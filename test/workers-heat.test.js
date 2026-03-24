import { describe, it, expect } from 'vitest';
import { calculateChiliLevel, handleHeatGet, handleHeatPost } from '../workers/heat.js';

describe('calculateChiliLevel', () => {
  it('returns 0 for heat count 0', () => {
    expect(calculateChiliLevel(0)).toBe(0);
  });

  it('returns 0 for heat count 9', () => {
    expect(calculateChiliLevel(9)).toBe(0);
  });

  it('returns 1 for heat count 10', () => {
    expect(calculateChiliLevel(10)).toBe(1);
  });

  it('returns 3 for heat count 35', () => {
    expect(calculateChiliLevel(35)).toBe(3);
  });

  it('caps at 5 for heat count 100', () => {
    expect(calculateChiliLevel(100)).toBe(5);
  });

  it('caps at 5 for heat count 999', () => {
    expect(calculateChiliLevel(999)).toBe(5);
  });
});

describe('handleHeatGet', () => {
  let mockKV;

  function createMockKV(store = {}) {
    return {
      get: async (key) => store[key] ?? null,
      put: async (key, value) => { store[key] = value; },
    };
  }

  it('returns heat 0 and chiliLevel 0 for unknown slug', async () => {
    mockKV = createMockKV();
    const { handleHeatGet } = await import('../workers/heat.js');
    const result = await handleHeatGet('unknown-slug', mockKV);
    expect(result).toEqual({ heat: 0, chiliLevel: 0 });
  });

  it('returns stored heat and calculated chiliLevel', async () => {
    mockKV = createMockKV({ 'spec:my-spec:heat': '42' });
    const { handleHeatGet } = await import('../workers/heat.js');
    const result = await handleHeatGet('my-spec', mockKV);
    expect(result).toEqual({ heat: 42, chiliLevel: 4 });
  });
});

describe('handleHeatPost', () => {
  function createMockKV(store = {}) {
    return {
      get: async (key) => store[key] ?? null,
      put: async (key, value) => { store[key] = value; },
    };
  }

  it('increments heat from 0 to 1 for new slug', async () => {
    const store = {};
    const mockKV = createMockKV(store);
    const { handleHeatPost } = await import('../workers/heat.js');
    const result = await handleHeatPost('new-spec', mockKV);
    expect(result).toEqual({ heat: 1, chiliLevel: 0, added: true });
    expect(store['spec:new-spec:heat']).toBe('1');
  });

  it('increments existing heat count', async () => {
    const store = { 'spec:popular:heat': '9' };
    const mockKV = createMockKV(store);
    const { handleHeatPost } = await import('../workers/heat.js');
    const result = await handleHeatPost('popular', mockKV);
    expect(result).toEqual({ heat: 10, chiliLevel: 1, added: true });
    expect(store['spec:popular:heat']).toBe('10');
  });
});
