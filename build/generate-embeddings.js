import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { embedText } from '../workers/search.js';

/**
 * Recursively find all .md files in a directory.
 * @param {string} dir - Directory to search
 * @returns {string[]} Array of file paths
 */
function findMarkdownFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...findMarkdownFiles(full));
    } else if (entry.endsWith('.md')) {
      files.push(full);
    }
  }
  return files;
}

/**
 * Parse all spec markdown files and extract data needed for embedding.
 * @param {string} specsDir - Path to specs directory
 * @returns {Array<{slug: string, title: string, category: string, summary: string, textToEmbed: string}>}
 */
export function parseAllSpecs(specsDir) {
  const files = findMarkdownFiles(specsDir);
  return files.map((filePath) => {
    const raw = readFileSync(filePath, 'utf-8');
    const { data } = matter(raw);
    return {
      slug: data.slug,
      title: data.title,
      category: data.category,
      summary: data.summary,
      textToEmbed: `${data.title}: ${data.summary}`,
    };
  });
}

/**
 * Generate embeddings for an array of parsed specs.
 * @param {Array} specs - Parsed spec objects from parseAllSpecs
 * @param {string} apiKey - OpenAI API key
 * @param {Function} [fetcher=fetch] - Fetch function (injectable for testing)
 * @returns {Promise<Array<{slug: string, vector: number[], metadata: object}>>}
 */
export async function generateEmbeddings(specs, apiKey, fetcher = fetch) {
  const results = [];
  for (const spec of specs) {
    const vector = await embedText(spec.textToEmbed, apiKey, fetcher);
    results.push({
      slug: spec.slug,
      vector,
      metadata: {
        title: spec.title,
        category: spec.category,
        summary: spec.summary,
      },
    });
  }
  return results;
}

/**
 * Upsert embedding vectors to Cloudflare Vectorize.
 * @param {Array} embeddings - Array of {slug, vector, metadata} objects
 * @param {Function} vectorizeUpsert - The Vectorize upsert function
 * @returns {Promise<void>}
 */
export async function upsertToVectorize(embeddings, vectorizeUpsert) {
  const vectors = embeddings.map((e) => ({
    id: e.slug,
    values: e.vector,
    metadata: e.metadata,
  }));
  await vectorizeUpsert(vectors);
}
