const logger = require('../../utils/logger');
const { getAdapter } = require('../carriers/registry');
const { processEvents } = require('./processEvents');

/**
 * Fetch fresh tracking data from the carrier API, normalise it, and persist
 * via `processEvents`.
 *
 * This is the code path used by:
 *   - The FedEx polling job (for all active FedEx shipments).
 *   - The on-demand freshness-check in the shipment controller when a
 *     non-terminal shipment's `lastFetchedAt` is stale.
 *
 * The DHL webhook handler does **not** use this function — it calls
 * `processEvents` directly with the events already parsed from the push
 * payload, avoiding a redundant live API call.
 *
 * @param {import('mongoose').Document} shipment  Mongoose shipment document.
 * @param {{ legId?: string }} [options]
 *   - legId: if provided, fetch/update a specific leg's carrier tracking number.
 * @returns {Promise<import('mongoose').Document>} The updated shipment.
 */
async function fetchAndCache(shipment, options = {}) {
  const { legId } = options;

  let carrier;
  let carrierTrackingNumber;

  if (legId) {
    const leg = shipment.legs.id(legId);
    if (!leg) {
      logger.warn({ internalTrackingId: shipment.internalTrackingId, legId }, 'fetchAndCache: leg not found');
      return shipment;
    }
    carrier = leg.carrier;
    carrierTrackingNumber = leg.carrierTrackingNumber;
  } else {
    carrier = shipment.carrier;
    carrierTrackingNumber = shipment.carrierTrackingNumber;
  }

  const adapter = getAdapter(carrier);

  logger.info(
    { internalTrackingId: shipment.internalTrackingId, carrier, carrierTrackingNumber },
    'fetchAndCache: fetching from carrier API',
  );

  let normalizedEvents;
  let rawResponse;

  try {
    const result = await adapter.fetchTracking(carrierTrackingNumber);
    normalizedEvents = result.events || result;
    rawResponse = result.rawResponse || null;
  } catch (err) {
    logger.error(
      { err, internalTrackingId: shipment.internalTrackingId, carrier, carrierTrackingNumber },
      'fetchAndCache: carrier API call failed',
    );
    throw err;
  }

  return processEvents(shipment, normalizedEvents, {
    legId,
    carrierResponse: rawResponse,
  });
}

module.exports = { fetchAndCache };
