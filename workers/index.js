import { handleHeatGet, handleHeatPost } from './heat.js';
import { handleSearch } from './search.js';

/**
 * Create a JSON response with CORS headers.
 * @param {object} body - Response body
 * @param {number} [status=200] - HTTP status code
 * @returns {Response}
 */
function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

/**
 * Extract the slug from a /api/heat/:slug path.
 * @param {string} pathname - URL pathname
 * @returns {string|null} The slug, or null if path doesn't match
 */
function extractHeatSlug(pathname) {
  const match = pathname.match(/^\/api\/heat\/([a-zA-Z0-9_-]+)$/);
  return match ? match[1] : null;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;
    const method = request.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    try {
      // Search route
      if (pathname === '/api/search' && method === 'GET') {
        const query = url.searchParams.get('q') || '';
        const category = url.searchParams.get('category') || undefined;
        const limit = parseInt(url.searchParams.get('limit') || '10', 10);
        const result = await handleSearch({ query, category, limit, env });
        return jsonResponse(result);
      }

      // Heat routes
      const slug = extractHeatSlug(pathname);
      if (slug) {
        if (method === 'GET') {
          const result = await handleHeatGet(slug, env.HEAT_STORE);
          return jsonResponse(result);
        }
        if (method === 'POST') {
          const result = await handleHeatPost(slug, env.HEAT_STORE);
          return jsonResponse(result);
        }
        return jsonResponse({ error: 'Method not allowed' }, 405);
      }

      // No route matched
      return jsonResponse({ error: 'Not found' }, 404);
    } catch (err) {
      return jsonResponse({ error: 'Internal server error' }, 500);
    }
  },
};
