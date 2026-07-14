const crypto = require('crypto');

/**
 * Generate a unique internal tracking ID in the format SWX-XXXXXXXX.
 * Uses 4 random bytes → 8 hex chars, uppercased.
 * Collision probability is negligible at scale; the DB unique index is the final safety net.
 *
 * @returns {string} e.g. "SWX-A3F7C9B1"
 */
function generateTrackingId() {
  const hex = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `SWX-${hex}`;
}

module.exports = generateTrackingId;
