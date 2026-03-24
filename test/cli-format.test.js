import { describe, it, expect } from 'vitest';
import {
  formatSearchResults,
  formatSpec,
  formatSpecList,
  formatCategories,
} from '../cli/format.js';

// Sample test data
const sampleResults = [
  { title: 'Test Spec One', category: 'patterns', url: 'https://spicy-specs.com/specs/test-one' },
  { title: 'Test Spec Two', category: 'anti-patterns', url: 'https://spicy-specs.com/specs/test-two' },
];

const sampleSpec = {
  title: 'My Test Spec',
  category: 'patterns',
  heat: 'mild',
  chiliLevel: 2,
  content: 'This is the spec content.',
};

const sampleSpecList = [
  { title: 'Alpha Spec', slug: 'alpha-spec' },
  { title: 'Beta Spec', slug: 'beta-spec' },
  { title: 'Gamma Spec', slug: 'gamma-spec' },
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
    // Should contain chili emoji
    expect(output).toContain('\u{1F336}\u{FE0F}');
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
});

describe('formatSpecList', () => {
  it('renders text format as numbered list', () => {
    const output = formatSpecList(sampleSpecList, 'text');
    expect(output).toContain('1.');
    expect(output).toContain('Alpha Spec');
    expect(output).toContain('2.');
    expect(output).toContain('Beta Spec');
    expect(output).toContain('3.');
    expect(output).toContain('Gamma Spec');
  });

  it('renders valid JSON for json format', () => {
    const output = formatSpecList(sampleSpecList, 'json');
    const parsed = JSON.parse(output);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(3);
    expect(parsed[0].title).toBe('Alpha Spec');
  });

  it('renders markdown with numbered bold items', () => {
    const output = formatSpecList(sampleSpecList, 'markdown');
    expect(output).toContain('1. **Alpha Spec**');
    expect(output).toContain('2. **Beta Spec**');
    expect(output).toContain('3. **Gamma Spec**');
  });
});

describe('formatCategories', () => {
  it('renders text format as bullet list', () => {
    const output = formatCategories(sampleCategories, 'text');
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
    expect(output).toContain('patterns');
    expect(output).toContain('anti-patterns');
    expect(output).toContain('primitives');
    // Should use markdown list syntax
    expect(output).toMatch(/[-*]|#{1,3}/);
  });
});
