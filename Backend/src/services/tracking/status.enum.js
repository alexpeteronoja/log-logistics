/**
 * Canonical internal shipment status enum.
 * Every carrier adapter must map its raw statuses to one of these values.
 */
const STATUSES = Object.freeze({
  CREATED: 'CREATED',
  PICKED_UP: 'PICKED_UP',
  IN_TRANSIT: 'IN_TRANSIT',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  EXCEPTION: 'EXCEPTION',
  RETURNED: 'RETURNED',
  CANCELLED: 'CANCELLED',
});

/**
 * Terminal statuses — once a shipment reaches one of these,
 * we never re-fetch from the carrier API.
 */
const TERMINAL_STATUSES = new Set([
  STATUSES.DELIVERED,
  STATUSES.CANCELLED,
  STATUSES.RETURNED,
]);

module.exports = { STATUSES, TERMINAL_STATUSES };
