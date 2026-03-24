const VALID_CATEGORIES = ['spec', 'antipattern', 'reference-app', 'pattern', 'philosophy'];
const REQUIRED_FIELDS = ['title', 'slug', 'category', 'summary', 'created', 'updated', 'author'];

/**
 * Validate spec frontmatter against the content model schema.
 * @param {object} data - Parsed frontmatter object (from gray-matter)
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateFrontmatter(data) {
  const errors = [];

  for (const field of REQUIRED_FIELDS) {
    if (!data[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (data.category && !VALID_CATEGORIES.includes(data.category)) {
    errors.push(`Invalid category "${data.category}". Must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }

  if (data.spiceLevel != null && (data.spiceLevel < 0 || data.spiceLevel > 5)) {
    errors.push('spiceLevel must be between 0 and 5');
  }

  if (data.tags != null && !Array.isArray(data.tags)) {
    errors.push('tags must be an array');
  }

  return { valid: errors.length === 0, errors };
}
