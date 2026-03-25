#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { Command } from 'commander';
import { getApiBase } from './config.js';
import { searchSpecs, getSpec, listSpecs } from './api.js';
import { formatSearchResults, formatSpec, formatSpecList, formatCategories } from './format.js';

const VALID_CATEGORIES = ['spec', 'antipattern', 'reference-app', 'pattern', 'philosophy'];

/**
 * Determine output format from command options.
 * @param {{ json?: boolean, markdown?: boolean }} opts
 * @returns {'text'|'json'|'markdown'}
 */
function getFormat(opts) {
  if (opts.json) return 'json';
  if (opts.markdown) return 'markdown';
  return 'text';
}

/**
 * Create the CLI program. Dependencies are injectable for testing.
 * @param {{ apiBase?: string, fetcher?: Function, print?: Function }} [deps={}]
 * @returns {import('commander').Command}
 */
export function createProgram(deps = {}) {
  const apiBase = deps.apiBase ?? getApiBase();
  const fetcher = deps.fetcher ?? fetch;
  const print = deps.print ?? console.log;

  const program = new Command();

  program
    .name('spicy-specs')
    .description('Search and browse the Spicy Specs library')
    .version('0.1.0');

  program
    .command('search <query>')
    .description('Search specs semantically')
    .option('--category <category>', 'Filter by category')
    .option('--limit <number>', 'Max results', '10')
    .option('--json', 'Output as JSON')
    .option('--markdown', 'Output as Markdown')
    .action(async (query, opts) => {
      if (opts.category && !VALID_CATEGORIES.includes(opts.category)) {
        throw new Error(`Invalid category "${opts.category}". Valid categories: ${VALID_CATEGORIES.join(', ')}`);
      }
      const results = await searchSpecs({
        query,
        category: opts.category,
        limit: parseInt(opts.limit, 10),
        apiBase,
        fetcher,
      });
      const format = getFormat(opts);
      // For JSON format, wrap results in an object so consumers can access .results
      const dataForFormat = format === 'json' ? { results } : results;
      print(formatSearchResults(dataForFormat, format));
    });

  program
    .command('get <slug>')
    .description('Fetch a specific spec by slug')
    .option('--json', 'Output as JSON')
    .option('--markdown', 'Output as Markdown')
    .action(async (slug, opts) => {
      const spec = await getSpec({ slug, apiBase, fetcher });
      print(formatSpec(spec, getFormat(opts)));
    });

  program
    .command('list')
    .description('List all specs')
    .option('--category <category>', 'Filter by category')
    .option('--json', 'Output as JSON')
    .option('--markdown', 'Output as Markdown')
    .action(async (opts) => {
      if (opts.category && !VALID_CATEGORIES.includes(opts.category)) {
        throw new Error(`Invalid category "${opts.category}". Valid categories: ${VALID_CATEGORIES.join(', ')}`);
      }
      const results = await listSpecs({ category: opts.category, apiBase, fetcher });
      print(formatSpecList(results, getFormat(opts)));
    });

  program
    .command('categories')
    .description('List all available categories')
    .option('--json', 'Output as JSON')
    .option('--markdown', 'Output as Markdown')
    .action(async (opts) => {
      print(formatCategories(VALID_CATEGORIES, getFormat(opts)));
    });

  return program;
}

// Auto-run detection: run if executed directly, not when imported for testing
const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  const program = createProgram();
  program.parseAsync(process.argv).catch((err) => {
    console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  });
}
