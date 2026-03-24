/**
 * Calculate chili level from raw heat count.
 * Formula: min(5, floor(heat / 10))
 * @param {number} heat - Raw vote count
 * @returns {number} Chili level 0-5
 */
export function calculateChiliLevel(heat) {
  return Math.min(5, Math.floor(heat / 10));
}
