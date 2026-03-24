/**
 * Calculate chili level from raw heat count.
 * Formula: min(5, floor(heat / 10))
 * @param {number} heat - Raw vote count
 * @returns {number} Chili level 0-5
 */
export function calculateChiliLevel(heat) {
  return Math.min(5, Math.floor(heat / 10));
}

/**
 * Get current heat count and chili level for a spec.
 * @param {string} slug - Spec slug
 * @param {object} kv - KV namespace binding
 * @returns {Promise<{heat: number, chiliLevel: number}>}
 */
export async function handleHeatGet(slug, kv) {
  const raw = await kv.get(`spec:${slug}:heat`);
  const heat = raw ? parseInt(raw, 10) : 0;
  return { heat, chiliLevel: calculateChiliLevel(heat) };
}

/**
 * Increment heat count for a spec and return updated values.
 * @param {string} slug - Spec slug
 * @param {object} kv - KV namespace binding
 * @returns {Promise<{heat: number, chiliLevel: number, added: boolean}>}
 */
export async function handleHeatPost(slug, kv) {
  const raw = await kv.get(`spec:${slug}:heat`);
  const current = raw ? parseInt(raw, 10) : 0;
  const heat = current + 1;
  await kv.put(`spec:${slug}:heat`, String(heat));
  return { heat, chiliLevel: calculateChiliLevel(heat), added: true };
}
