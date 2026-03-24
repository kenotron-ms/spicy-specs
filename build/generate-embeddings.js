import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

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
