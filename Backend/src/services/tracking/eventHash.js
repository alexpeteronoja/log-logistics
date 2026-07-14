const crypto = require('crypto');

/**
 * Generate a deterministic SHA-256 hash for a tracking event.
 * Used to prevent duplicate event insertion from repeated webhook
 * deliveries or polling overlaps.
 *
 * @param {string} carrier             Carrier name (e.g. 'dhl', 'fedex').
 * @param {string} carrierTrackingNumber  Carrier's own tracking number.
 * @param {string|Date} eventTimestamp  Event timestamp (ISO string or Date).
 * @param {string} statusCode          The normalised (or raw) status code.
 * @returns {string} 64-char hex SHA-256 hash.
 */
function generateEventHash(carrier, carrierTrackingNumber, eventTimestamp, statusCode) {
  const ts = eventTimestamp instanceof Date ? eventTimestamp.toISOString() : eventTimestamp;
  const payload = [carrier, carrierTrackingNumber, ts, statusCode].join('|');
  return crypto.createHash('sha256').update(payload).digest('hex');
}

module.exports = { generateEventHash };
