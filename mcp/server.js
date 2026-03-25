#!/usr/bin/env node

/**
 * MCP Server — JSON-RPC 2.0 handler with search_specs, get_spec, and list_specs tools.
 * Reads from stdin (ndjson) and writes responses to stdout.
 */

import { createInterface } from 'readline';
import { searchSpecs, getSpec, listSpecs } from '../cli/api.js';
import { formatSearchResults, formatSpec, formatSpecList } from '../cli/format.js';

export const API_BASE = process.env.SPICY_SPECS_API_BASE || 'https://spicy-specs.com';

const CATEGORY_ENUM = ['spec', 'antipattern', 'reference-app', 'pattern', 'philosophy'];

/**
 * The 3 MCP tool definitions exposed by this server.
 */
export const TOOLS = [
  {
    name: 'search_specs',
    description: 'Search Spicy Specs using semantic search.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        category: { type: 'string', enum: CATEGORY_ENUM },
        limit: { type: 'number', default: 5 },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_spec',
    description: 'Fetch full content of a specific spec by slug.',
    inputSchema: {
      type: 'object',
      properties: {
        slug: { type: 'string' },
      },
      required: ['slug'],
    },
  },
  {
    name: 'list_specs',
    description: 'List all specs, optionally filtered by category.',
    inputSchema: {
      type: 'object',
      properties: {
        category: { type: 'string', enum: CATEGORY_ENUM },
      },
    },
  },
];

/**
 * Execute a tool by name, calling the appropriate API function.
 *
 * @param {string} name - Tool name
 * @param {object} args - Tool arguments
 * @param {{ fetcher?: Function, apiBase?: string }} deps - Injectable dependencies
 * @returns {Promise<object>} MCP content response
 */
async function executeTool(name, args, deps) {
  const fetcher = deps.fetcher;
  const apiBase = deps.apiBase ?? API_BASE;

  if (name === 'search_specs') {
    const results = await searchSpecs({
      query: args.query,
      category: args.category,
      limit: args.limit,
      apiBase,
      ...(fetcher ? { fetcher } : {}),
    });
    return { content: [{ type: 'text', text: formatSearchResults(results, 'markdown') }] };
  }

  if (name === 'get_spec') {
    const spec = await getSpec({
      slug: args.slug,
      apiBase,
      ...(fetcher ? { fetcher } : {}),
    });
    return { content: [{ type: 'text', text: formatSpec(spec, 'markdown') }] };
  }

  if (name === 'list_specs') {
    const specs = await listSpecs({
      category: args.category,
      apiBase,
      ...(fetcher ? { fetcher } : {}),
    });
    return { content: [{ type: 'text', text: formatSpecList(specs, 'markdown') }] };
  }

  return { isError: true, content: [{ type: 'text', text: `Unknown tool: ${name}` }] };
}

/**
 * Handle a single JSON-RPC 2.0 request.
 *
 * @param {object} request - Parsed JSON-RPC request object
 * @param {{ fetcher?: Function, apiBase?: string }} deps - Injectable dependencies
 * @returns {Promise<object>} JSON-RPC response object
 */
export async function handleRequest(request, deps) {
  const { id, method } = request;
  const base = { jsonrpc: '2.0', id };

  if (method === 'initialize') {
    return {
      ...base,
      result: {
        protocolVersion: '2024-11-05',
        serverInfo: { name: 'spicy-specs-mcp', version: '0.1.0' },
        capabilities: { tools: {} },
      },
    };
  }

  if (method === 'tools/list') {
    return { ...base, result: { tools: TOOLS } };
  }

  if (method === 'tools/call') {
    const { name, arguments: args = {} } = request.params ?? {};
    try {
      const result = await executeTool(name, args, deps);
      return { ...base, result };
    } catch (err) {
      return {
        ...base,
        result: { isError: true, content: [{ type: 'text', text: err.message }] },
      };
    }
  }

  return {
    ...base,
    error: { code: -32601, message: 'Method not found' },
  };
}

/**
 * Start the MCP server: read ndjson from stdin, write responses to stdout.
 */
export function startServer() {
  const rl = createInterface({ input: process.stdin, terminal: false });

  rl.on('line', async (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    let request;
    try {
      request = JSON.parse(trimmed);
    } catch {
      const response = {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32700, message: 'Parse error' },
      };
      process.stdout.write(JSON.stringify(response) + '\n');
      return;
    }

    const response = await handleRequest(request, {});
    process.stdout.write(JSON.stringify(response) + '\n');
  });
}

// Auto-run detection: run if executed directly, not when imported for testing
const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/.*\//, ''));
if (isMain) {
  startServer();
}
