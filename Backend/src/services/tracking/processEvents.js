const logger = require('../../utils/logger');
const { calculateRollupStatus } = require('./rollup');

/**
 * Process an array of normalised tracking events for a shipment.
 *
 * This is the **shared, carrier-API-free** persistence path:
 *   1. Deduplicate events by eventHash against existing events on the shipment/leg.
 *   2. Append new (unseen) events.
 *   3. Update the leg status (if multi-leg) based on the latest event.
 *   4. Recalculate the shipment-level rollup status.
 *   5. Update `lastFetchedAt` timestamp.
 *   6. Save and return the updated shipment.
 *
 * Called directly by the DHL webhook handler (with events parsed from the push
 * payload) and internally by `fetchAndCache` (after fetching from the carrier API).
 *
 * @param {import('mongoose').Document} shipment  The Mongoose shipment document.
 * @param {Array<{
 *   timestamp: Date|string,
 *   location: string,
 *   description: string,
 *   normalizedStatus: string,
 *   rawCarrierPayload: object|null,
 *   eventHash: string
 * }>} normalizedEvents  Already-normalised events with hashes.
 * @param {{ legId?: string, carrierResponse?: object }} [options]
 *   - legId: if provided, events are appended to that specific leg.
 *   - carrierResponse: raw API response to store for debugging.
 * @returns {Promise<import('mongoose').Document>} The saved shipment.
 */
async function processEvents(shipment, normalizedEvents, options = {}) {
  const { legId, carrierResponse } = options;

  if (!normalizedEvents || normalizedEvents.length === 0) {
    logger.debug({ internalTrackingId: shipment.internalTrackingId }, 'processEvents: no events to process');
    return shipment;
  }

  // ── Determine target: leg or top-level ───────────
  let target; // the object whose .events array we append to
  let targetLabel;

  if (legId) {
    target = shipment.legs.id(legId);
    if (!target) {
      logger.warn({ internalTrackingId: shipment.internalTrackingId, legId }, 'processEvents: leg not found');
      return shipment;
    }
    targetLabel = `leg ${legId}`;
  } else {
    target = shipment;
    targetLabel = 'shipment';
  }

  // ── Collect existing hashes for dedup ────────────
  const existingHashes = new Set((target.events || []).map((e) => e.eventHash));

  // ── Filter to truly new events ───────────────────
  const newEvents = normalizedEvents.filter((e) => !existingHashes.has(e.eventHash));

  if (newEvents.length === 0) {
    logger.debug(
      { internalTrackingId: shipment.internalTrackingId, targetLabel },
      'processEvents: all events already exist (idempotent no-op)',
    );
    return shipment;
  }

  logger.info(
    { internalTrackingId: shipment.internalTrackingId, targetLabel, newCount: newEvents.length },
    'processEvents: appending new events',
  );

  // ── Append new events ───────────────────────────
  target.events.push(...newEvents);

  // ── Sort events chronologically ──────────────────
  target.events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  // ── Update the target's status to the latest event status ─
  const latestEvent = target.events[target.events.length - 1];
  target.status = latestEvent.normalizedStatus;

  // ── Update timestamps / raw response ─────────────
  const now = new Date();
  target.lastFetchedAt = now;
  if (!legId) {
    shipment.lastFetchedAt = now;
  } else {
    // Also bump shipment-level lastFetchedAt
    shipment.lastFetchedAt = now;
  }

  if (carrierResponse) {
    target.lastCarrierResponse = carrierResponse;
  }

  // ── Rollup status for multi-leg or single-leg ────
  shipment.status = calculateRollupStatus(shipment);

  // ── Persist ──────────────────────────────────────
  await shipment.save();

  return shipment;
}

module.exports = { processEvents };
