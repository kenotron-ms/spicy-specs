/**
 * CLI API Client — thin HTTP client for the spicy-specs Worker API.
 * All functions accept an injectable `fetcher` so tests never hit the network.
 */

const DEFAULT_API_BASE = 'https://spicy-specs.com';

/**
 * Search for specs via the Worker search API.
 *
 * @param {object} opts
 * @param {string} opts.query - Required search query (maps to `q` param)
 * @param {string} [opts.category] - Optional category filter
 * @param {number} [opts.limit] - Optional result limit
 * @param {string} [opts.apiBase] - API base URL (default: https://spicy-specs.com)
 * @param {Function} [opts.fetcher] - Injectable fetch implementation (default: global fetch)
 * @returns {Promise<Array>} Array of search results
 */
export async function searchSpecs({ query, category, limit, apiBase = DEFAULT_API_BASE, fetcher = fetch }) {
  const params = new URLSearchParams({ q: query });
  if (category !== undefined) params.set('category', category);
  if (limit !== undefined) params.set('limit', String(limit));

  const url = `${apiBase}/api/search?${params.toString()}`;
  const response = await fetcher(url);

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${response.status}: ${body}`);
  }

  const data = await response.json();
  return data.results ?? [];
}

/**
 * Get a single spec by slug, merged with heat data.
 *
 * @param {object} opts
 * @param {string} opts.slug - Spec slug to look up
 * @param {string} [opts.apiBase] - API base URL (default: https://spicy-specs.com)
 * @param {Function} [opts.fetcher] - Injectable fetch implementation (default: global fetch)
 * @returns {Promise<object>} Merged spec + heat object
 */
export async function getSpec({ slug, apiBase = DEFAULT_API_BASE, fetcher = fetch }) {
  const params = new URLSearchParams({ q: slug, limit: '1' });
  const searchUrl = `${apiBase}/api/search?${params.toString()}`;
  const searchResponse = await fetcher(searchUrl);

  if (!searchResponse.ok) {
    const body = await searchResponse.text();
    throw new Error(`${searchResponse.status}: ${body}`);
  }

  const searchData = await searchResponse.json();
  const results = searchData.results ?? [];
  const spec = results.find((r) => r.slug === slug);

  if (!spec) {
    throw new Error('Spec not found');
  }

  // Fetch heat data — defaults to 0 if the endpoint fails
  let heat = 0;
  let chiliLevel = 0;
  try {
    const heatUrl = `${apiBase}/api/heat/${slug}`;
    const heatResponse = await fetcher(heatUrl);
    if (heatResponse.ok) {
      const heatData = await heatResponse.json();
      heat = heatData.heat ?? 0;
      chiliLevel = heatData.chiliLevel ?? 0;
    }
  } catch {
    // Swallow error — heat data is non-critical
  }

  return {
    ...spec,
    content: spec.summary,
    heat,
    chiliLevel,
  };
}

/**
 * List all specs, optionally filtered by category.
 *
 * @param {object} opts
 * @param {string} [opts.category] - Optional category filter
 * @param {string} [opts.apiBase] - API base URL (default: https://spicy-specs.com)
 * @param {Function} [opts.fetcher] - Injectable fetch implementation (default: global fetch)
 * @returns {Promise<Array>} Array of spec results
 */
export async function listSpecs({ category, apiBase = DEFAULT_API_BASE, fetcher = fetch } = {}) {
  const params = new URLSearchParams({ q: 'spec', limit: '100' });
  if (category !== undefined) params.set('category', category);

  const url = `${apiBase}/api/search?${params.toString()}`;
  const response = await fetcher(url);

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${response.status}: ${body}`);
  }

  const data = await response.json();
  return data.results ?? [];
}
