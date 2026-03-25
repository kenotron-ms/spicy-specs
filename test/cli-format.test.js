import { describe, it, expect } from 'vitest';
import {
  formatSearchResults,
  formatSpec,
  formatSpecList,
  formatCategories,
} from '../cli/format.js';

// Sample test data
const sampleResults = [
  { title: 'Test Spec One', category: 'patterns', url: 'https://spicy-specs.com/specs/test-one', score: 2 },
  { title: 'Test Spec Two', category: 'anti-patterns', url: 'https://spicy-specs.com/specs/test-two', score: 1 },
];

const sampleSpec = {
  title: 'My Test Spec',
  category: 'patterns',
  heat: 'mild',
  chiliLevel: 2,
  content: 'This is the spec content.',
};

const sampleSpecList = [
  { title: 'Alpha Spec', slug: 'alpha-spec', category: 'patterns' },
  { title: 'Beta Spec', slug: 'beta-spec', category: 'primitives' },
  { title: 'Gamma Spec', slug: 'gamma-spec', category: 'anti-patterns' },
];

const sampleCategories = ['patterns', 'anti-patterns', 'primitives'];

describe('formatSearchResults', () => {
  it('renders text format with header and numbered results', () => {
    const output = formatSearchResults(sampleResults, 'text');
    expect(output).toContain('SPICY SPECS SEARCH RESULTS');
    expect(output).toContain('1.');
    expect(output).toContain('Test Spec One');
    expect(output).toContain('(PATTERNS)');
    expect(output).toContain('2.');
    expect(output).toContain('Test Spec Two');
    // Should contain per-item chili emojis based on score (score: 2 → two consecutive chilies)
    expect(output).toContain('\u{1F336}\uFE0F\u{1F336}\uFE0F');
  });

  it('renders No results found for empty text format', () => {
    const empty = formatSearchResults([], 'text');
    expect(empty).toContain('No results found');
  });

  it('renders valid JSON for json format', () => {
    const output = formatSearchResults(sampleResults, 'json');
    const parsed = JSON.parse(output);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].title).toBe('Test Spec One');
  });

  it('renders markdown with heading hierarchy', () => {
    const output = formatSearchResults(sampleResults, 'markdown');
    expect(output).toContain('# Search Results');
    expect(output).toContain('## 1. Test Spec One');
    expect(output).toContain('## 2. Test Spec Two');
  });
});

describe('formatSpec', () => {
  it('renders text format with title, category, heat, chiliLevel, and content', () => {
    const output = formatSpec(sampleSpec, 'text');
    expect(output).toContain('My Test Spec');
    expect(output).toContain('PATTERNS');
    expect(output).toContain('mild');
    expect(output).toContain('This is the spec content.');
    // Should show chili emojis for chiliLevel 2
    expect(output).toContain('\u{1F336}\u{FE0F}\u{1F336}\u{FE0F}');
  });

  it('renders valid JSON for json format', () => {
    const output = formatSpec(sampleSpec, 'json');
    const parsed = JSON.parse(output);
    expect(parsed.title).toBe('My Test Spec');
    expect(parsed.category).toBe('patterns');
    expect(parsed.heat).toBe('mild');
    expect(parsed.chiliLevel).toBe(2);
  });

  it('renders markdown with header and bold labels', () => {
    const output = formatSpec(sampleSpec, 'markdown');
    expect(output).toContain('# My Test Spec');
    expect(output).toContain('**Category:** patterns');
    expect(output).toContain('**Heat:** mild');
    expect(output).toContain('This is the spec content.');
  });

  it('handles spec with no chiliLevel — text title has no leading space', () => {
    const out = formatSpec({ title: 'Bare Spec' }, 'text');
    expect(out.startsWith('Bare Spec')).toBe(true);
  });

  it('handles spec with null chiliLevel — text Spice line not emitted', () => {
    const out = formatSpec({ title: 'Null Chili', chiliLevel: null }, 'text');
    expect(out).not.toContain('Spice:');
  });
});

describe('formatSpecList', () => {
  it('renders text format as numbered list with UPPERCASE category', () => {
    const output = formatSpecList(sampleSpecList, 'text');
    expect(output).toContain('1. Alpha Spec (PATTERNS)');
    expect(output).toContain('2. Beta Spec (PRIMITIVES)');
    expect(output).toContain('3. Gamma Spec (ANTI-PATTERNS)');
  });

  it('renders valid JSON for json format', () => {
    const output = formatSpecList(sampleSpecList, 'json');
    const parsed = JSON.parse(output);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(3);
    expect(parsed[0].title).toBe('Alpha Spec');
  });

  it('renders markdown with ## N. Title heading per item', () => {
    const output = formatSpecList(sampleSpecList, 'markdown');
    expect(output).toContain('## 1. Alpha Spec');
    expect(output).toContain('## 2. Beta Spec');
    expect(output).toContain('## 3. Gamma Spec');
  });
});

describe('formatCategories', () => {
  it('renders text format as bullet list under AVAILABLE CATEGORIES header', () => {
    const output = formatCategories(sampleCategories, 'text');
    expect(output).toContain('AVAILABLE CATEGORIES');
    expect(output).toContain('•');
    expect(output).toContain('patterns');
    expect(output).toContain('anti-patterns');
    expect(output).toContain('primitives');
  });

  it('renders valid JSON array for json format', () => {
    const output = formatCategories(sampleCategories, 'json');
    const parsed = JSON.parse(output);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toEqual(['patterns', 'anti-patterns', 'primitives']);
  });

  it('renders markdown with list formatting', () => {
    const output = formatCategories(sampleCategories, 'markdown');
    expect(output).toContain('# Categories');
    expect(output).toContain('- patterns');
    expect(output).toContain('- anti-patterns');
    expect(output).toContain('- primitives');
  });
});
