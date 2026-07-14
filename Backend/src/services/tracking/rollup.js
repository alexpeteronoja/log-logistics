const { STATUSES } = require('./status.enum');

/**
 * Priority order — higher index = higher precedence for "worst" status.
 * Used to resolve the shipment-level status from individual leg statuses.
 */
const STATUS_PRIORITY = {
  [STATUSES.CREATED]: 0,
  [STATUSES.PICKED_UP]: 1,
  [STATUSES.IN_TRANSIT]: 2,
  [STATUSES.OUT_FOR_DELIVERY]: 3,
  [STATUSES.DELIVERED]: 4,
  [STATUSES.RETURNED]: 5,
  [STATUSES.CANCELLED]: 6,
  [STATUSES.EXCEPTION]: 7,
};

/**
 * Derive the shipment-level rollup status from the combined state of all legs.
 *
 * Rules (evaluated in order):
 *   1. Any leg is EXCEPTION        → shipment is EXCEPTION
 *   2. Any leg is CANCELLED        → shipment is CANCELLED
 *   3. Any leg is RETURNED         → shipment is RETURNED
 *   4. Final leg is DELIVERED       → shipment is DELIVERED
 *   5. Otherwise                    → status of the latest non-terminal (active) leg
 *
 * For single-leg / no-leg shipments, the shipment's own event history is used
 * to determine status (latest normalizedStatus from events).
 *
 * @param {{ legs: Array, events: Array, status: string }} shipment
 * @returns {string} The rolled-up internal status.
 */
function calculateRollupStatus(shipment) {
  const legs = shipment.legs || [];

  // ── No legs → use top-level events ───────────────
  if (legs.length === 0) {
    if (!shipment.events || shipment.events.length === 0) {
      return shipment.status || STATUSES.CREATED;
    }
    // Latest event determines status
    const sorted = [...shipment.events].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
    );
    return sorted[0].normalizedStatus;
  }

  // ── Multi-leg rollup ────────────────────────────
  const sortedLegs = [...legs].sort((a, b) => a.legOrder - b.legOrder);

  // Rule 1–3: escalation statuses
  for (const leg of sortedLegs) {
    if (leg.status === STATUSES.EXCEPTION) return STATUSES.EXCEPTION;
  }
  for (const leg of sortedLegs) {
    if (leg.status === STATUSES.CANCELLED) return STATUSES.CANCELLED;
  }
  for (const leg of sortedLegs) {
    if (leg.status === STATUSES.RETURNED) return STATUSES.RETURNED;
  }

  // Rule 4: final leg delivered
  const finalLeg = sortedLegs[sortedLegs.length - 1];
  if (finalLeg.status === STATUSES.DELIVERED) return STATUSES.DELIVERED;

  // Rule 5: status of the currently active leg.
  // Walk backwards to find the latest leg that has progressed beyond CREATED.
  // If no leg has progressed, fall back to the last leg's status.
  for (let i = sortedLegs.length - 1; i >= 0; i--) {
    const legStatus = sortedLegs[i].status;
    if (
      legStatus &&
      legStatus !== STATUSES.DELIVERED &&
      legStatus !== STATUSES.CREATED
    ) {
      return legStatus;
    }
  }

  // All legs are either DELIVERED or CREATED — return the last non-delivered leg's status
  for (let i = sortedLegs.length - 1; i >= 0; i--) {
    if (sortedLegs[i].status !== STATUSES.DELIVERED) {
      return sortedLegs[i].status;
    }
  }

  return STATUSES.CREATED;
}

module.exports = { calculateRollupStatus, STATUS_PRIORITY };
