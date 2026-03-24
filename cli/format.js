const CHILI = '\u{1F336}\uFE0F';

/**
 * Repeats the chili emoji n times.
 * @param {number} level
 * @returns {string}
 */
function chilies(level) {
  return CHILI.repeat(Math.max(0, level ?? 0));
}

/**
 * Formats search results into text, json, or markdown.
 * @param {Array} data - Array of search result objects
 * @param {'text'|'json'|'markdown'} format
 * @returns {string}
 */
export function formatSearchResults(data, format) {
  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }

  if (format === 'markdown') {
    if (!data || data.length === 0) {
      return '# Search Results\n\n_No results found._';
    }
    const lines = ['# Search Results', ''];
    data.forEach((item, i) => {
      lines.push(`## ${i + 1}. ${item.title}`);
      if (item.category) lines.push(`**Category:** ${item.category}`);
      if (item.url) lines.push(`[View spec](${item.url})`);
      lines.push('');
    });
    return lines.join('\n').trimEnd();
  }

  // text format (default)
  if (!data || data.length === 0) {
    return `${CHILI} No results found`;
  }

  const lines = [`${CHILI} SPICY SPECS SEARCH RESULTS ${CHILI}`, ''];
  data.forEach((item, i) => {
    const category = item.category ? ` (${item.category.toUpperCase()})` : '';
    const arrow = item.url ? ` → ${item.url}` : '';
    lines.push(`${i + 1}. ${item.title}${category}${arrow}`);
  });
  return lines.join('\n');
}

/**
 * Formats a single spec into text, json, or markdown.
 * @param {Object} spec
 * @param {'text'|'json'|'markdown'} format
 * @returns {string}
 */
export function formatSpec(spec, format) {
  if (format === 'json') {
    return JSON.stringify(spec, null, 2);
  }

  if (format === 'markdown') {
    const lines = [`# ${spec.title}`, ''];
    if (spec.category) lines.push(`**Category:** ${spec.category}`);
    if (spec.heat) lines.push(`**Heat:** ${spec.heat}`);
    if (spec.chiliLevel !== undefined) lines.push(`**Spice:** ${chilies(spec.chiliLevel)} (${spec.chiliLevel})`);
    lines.push('');
    lines.push('---');
    lines.push('');
    if (spec.content) lines.push(spec.content);
    return lines.join('\n').trimEnd();
  }

  // text format
  const lines = [];
  lines.push(`${chilies(spec.chiliLevel || 0)} ${spec.title}`);
  lines.push('');
  if (spec.category) lines.push(`Category: ${spec.category.toUpperCase()}`);
  if (spec.heat) lines.push(`Heat: ${spec.heat}`);
  if (spec.chiliLevel !== undefined) lines.push(`Spice: ${chilies(spec.chiliLevel)}`);
  lines.push('');
  if (spec.content) lines.push(spec.content);
  return lines.join('\n');
}

/**
 * Formats a list of specs into text, json, or markdown.
 * @param {Array} specs - Array of spec objects (with title, slug, etc.)
 * @param {'text'|'json'|'markdown'} format
 * @returns {string}
 */
export function formatSpecList(specs, format) {
  if (format === 'json') {
    return JSON.stringify(specs, null, 2);
  }

  if (format === 'markdown') {
    const lines = ['# Specs', ''];
    specs.forEach((spec, i) => {
      lines.push(`${i + 1}. **${spec.title}**`);
    });
    return lines.join('\n').trimEnd();
  }

  // text format
  const lines = [`${CHILI} SPICY SPECS ${CHILI}`, ''];
  specs.forEach((spec, i) => {
    lines.push(`${i + 1}. ${spec.title}`);
  });
  return lines.join('\n');
}

/**
 * Formats a list of categories into text, json, or markdown.
 * @param {Array<string>} categories
 * @param {'text'|'json'|'markdown'} format
 * @returns {string}
 */
export function formatCategories(categories, format) {
  if (format === 'json') {
    return JSON.stringify(categories, null, 2);
  }

  if (format === 'markdown') {
    const lines = ['# Categories', ''];
    categories.forEach((cat) => {
      lines.push(`- ${cat}`);
    });
    return lines.join('\n').trimEnd();
  }

  // text format — bullet list
  const lines = [`${CHILI} Categories:`, ''];
  categories.forEach((cat) => {
    lines.push(`• ${cat}`);
  });
  return lines.join('\n');
}
