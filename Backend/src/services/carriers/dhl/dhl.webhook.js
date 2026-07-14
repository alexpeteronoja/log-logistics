const logger = require('../../../utils/logger');
const { normalizeStatus } = require('./dhl.statusMap');
const { generateEventHash } = require('../../tracking/eventHash');

/**
 * Parse a DHL UTAPI v2 push webhook payload into normalised tracking events.
 *
 * The push payload shape (simplified):
 * {
 *   "trackingNumber": "...",
 *   "events": [
 *     {
 *       "timestamp": "2024-...",
 *       "location": { "address": { "addressLocality": "..." } },
 *       "description": "...",
 *       "statusCode": "transit"
 *     }
 *   ]
 * }
 *
 * Some UTAPI push payloads wrap the above inside a top-level "shipment" key;
 * this parser handles both shapes.
 *
 * @param {object} payload  The raw JSON body from the DHL webhook POST.
 * @returns {{ carrierTrackingNumber: string, normalizedEvents: Array }}
 */
function parseDhlWebhookPayload(payload) {
  // Handle both nested and flat shapes
  const data = payload.shipment || payload;
  const carrierTrackingNumber = data.trackingNumber || data.id || '';

  if (!carrierTrackingNumber) {
    logger.warn({ payload }, 'DHL webhook: could not extract tracking number');
  }

  const rawEvents = data.events || [];

  const normalizedEvents = rawEvents.map((evt) => {
    const ts = evt.timestamp || evt.date || new Date().toISOString();
    const loc =
      evt.location?.address?.addressLocality ||
      evt.location?.addressLocality ||
      '';
    const desc = evt.description || '';
    const rawStatus = evt.statusCode || evt.status?.statusCode || '';
    const normalized = normalizeStatus(rawStatus);

    return {
      timestamp: new Date(ts),
      location: loc,
      description: desc,
      normalizedStatus: normalized,
      rawCarrierPayload: evt,
      eventHash: generateEventHash('dhl', carrierTrackingNumber, ts, normalized),
    };
  });

  return { carrierTrackingNumber, normalizedEvents };
}

module.exports = { parseDhlWebhookPayload };
