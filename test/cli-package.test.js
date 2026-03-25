import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));

describe('package.json CLI and MCP configuration', () => {
  it('has bin entry pointing to cli/spicy-specs.js', () => {
    expect(pkg.bin).toBeDefined();
    expect(pkg.bin['spicy-specs']).toBe('./cli/spicy-specs.js');
  });

  it("has mcp:start script equal to 'node mcp/server.js'", () => {
    expect(pkg.scripts['mcp:start']).toBe('node mcp/server.js');
  });

  it('has commander as a dependency', () => {
    const inDeps = pkg.dependencies && pkg.dependencies['commander'];
    const inDevDeps = pkg.devDependencies && pkg.devDependencies['commander'];
    expect(inDeps || inDevDeps).toBeTruthy();
  });
});
