/**
 * Embed a text string using OpenAI's embedding API.
 * @param {string} text - Text to embed
 * @param {string} apiKey - OpenAI API key
 * @param {Function} fetcher - Fetch function (injectable for testing)
 * @returns {Promise<number[]>} 1536-dimensional embedding vector
 */
export async function embedText(text, apiKey, fetcher = fetch) {
  const response = await fetcher('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  });

  const data = await response.json();
  return data.data[0].embedding;
}

/**
 * Handle a search request: embed query, search Vectorize, return results.
 * @param {object} params
 * @param {string} params.query - Search query text
 * @param {string} [params.category] - Optional category filter
 * @param {number} [params.limit=10] - Max results to return
 * @param {object} params.env - Worker env bindings (OPENAI_API_KEY, VECTORIZE)
 * @param {Function} [params.fetcher] - Fetch function (injectable for testing)
 * @returns {Promise<{results: Array, took_ms: number}>}
 */
export async function handleSearch({ query, category, limit = 10, env, fetcher = fetch }) {
  const start = Date.now();

  if (!query || query.trim() === '') {
    return { results: [], took_ms: Date.now() - start };
  }

  const vector = await embedText(query, env.OPENAI_API_KEY, fetcher);

  const queryOptions = {
    topK: limit,
    returnMetadata: 'all',
  };

  if (category) {
    queryOptions.filter = { category };
  }

  const vectorResults = await env.VECTORIZE.query(vector, queryOptions);

  const results = vectorResults.matches.map((match) => ({
    slug: match.id,
    title: match.metadata.title,
    category: match.metadata.category,
    summary: match.metadata.summary,
    score: match.score,
  }));

  return { results, took_ms: Date.now() - start };
}
