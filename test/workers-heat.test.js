import { describe, it, expect } from 'vitest';
import { calculateChiliLevel } from '../workers/heat.js';

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
