const { STATUSES } = require('../../tracking/status.enum');

/**
 * Maps DHL UTAPI v2 shipment status event codes to internal status enum.
 *
 * Reference: DHL Unified Tracking API v2 — status.statusCode values.
 * See: https://developer.dhl.com/api-reference/unified-tracking
 *
 * This map is intentionally broad; unmapped codes fall through to
 * IN_TRANSIT as a safe default.
 */
const DHL_STATUS_MAP = {
  // Pre-transit / creation
  'pre-transit': STATUSES.CREATED,
  'informationReceived': STATUSES.CREATED,
  'informationreceived': STATUSES.CREATED,

  // Picked up
  'picked-up': STATUSES.PICKED_UP,
  'pickup': STATUSES.PICKED_UP,

  // In transit
  'transit': STATUSES.IN_TRANSIT,
  'in-transit': STATUSES.IN_TRANSIT,
  'processing': STATUSES.IN_TRANSIT,
  'clearance': STATUSES.IN_TRANSIT,
  'customs': STATUSES.IN_TRANSIT,

  // Out for delivery
  'out-for-delivery': STATUSES.OUT_FOR_DELIVERY,

  // Delivered
  'delivered': STATUSES.DELIVERED,

  // Exceptions / failures
  'failure': STATUSES.EXCEPTION,
  'exception': STATUSES.EXCEPTION,
  'unknown': STATUSES.EXCEPTION,
  'notification': STATUSES.EXCEPTION,
  'addressIssue': STATUSES.EXCEPTION,

  // Returned
  'returned': STATUSES.RETURNED,
  'return': STATUSES.RETURNED,

  // Destroyed / cancelled (DHL rarely uses this but it exists)
  'destroyed': STATUSES.CANCELLED,
};

/**
 * Normalise a raw DHL status code string to an internal status.
 *
 * @param {string} rawStatus  The DHL statusCode or status.status string.
 * @returns {string} One of STATUSES values.
 */
function normalizeStatus(rawStatus) {
  if (!rawStatus) return STATUSES.EXCEPTION;
  const key = rawStatus.toLowerCase().trim();
  return DHL_STATUS_MAP[key] || STATUSES.IN_TRANSIT;
}

module.exports = { DHL_STATUS_MAP, normalizeStatus };
