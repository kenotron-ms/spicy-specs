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
  // Sequential to respect OpenAI rate limits — do not convert to Promise.all
  // Throws on first failure — caller is responsible for retry
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

/**
 * Main entry point: parse all specs, generate embeddings, upsert to Vectorize.
 * Requires environment variables: OPENAI_API_KEY, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_VECTORIZE_INDEX_ID
 * Run with: npm run embeddings
 */
async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('Error: OPENAI_API_KEY environment variable is required');
    process.exit(1);
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const indexId = process.env.CLOUDFLARE_VECTORIZE_INDEX_ID;
  if (!accountId || !indexId) {
    console.error('Error: CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_VECTORIZE_INDEX_ID are required');
    process.exit(1);
  }

  const cfApiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!cfApiToken) {
    console.error('Error: CLOUDFLARE_API_TOKEN environment variable is required');
    process.exit(1);
  }

  console.log('Parsing specs from specs/ directory...');
  const specs = parseAllSpecs('specs');
  console.log(`Found ${specs.length} spec(s)`);

  if (specs.length === 0) {
    console.log('No specs found. Exiting.');
    return;
  }

  console.log('Generating embeddings via OpenAI...');
  const embeddings = await generateEmbeddings(specs, apiKey);
  console.log(`Generated ${embeddings.length} embedding(s)`);

  console.log('Upserting to Cloudflare Vectorize...');
  const vectorizeUpsert = async (vectors) => {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/vectorize/v2/indexes/${indexId}/upsert`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cfApiToken}`,
          'Content-Type': 'application/x-ndjson',
        },
        body: vectors.map((v) => JSON.stringify(v)).join('\n'),
      }
    );
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Vectorize upsert failed (${res.status}): ${text}`);
    }
    const data = await res.json();
    console.log(`Vectorize upsert response: ${JSON.stringify(data)}`);
    return data;
  };

  await upsertToVectorize(embeddings, vectorizeUpsert);
  console.log('Done! All embeddings upserted to Vectorize.');
}

// Run main() if this file is executed directly (not imported)
const isMainModule = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/.*\//, ''));
if (isMainModule) {
  main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}
