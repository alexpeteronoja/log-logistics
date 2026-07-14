const { STATUSES } = require('../../tracking/status.enum');

/**
 * Maps FedEx Track API v1 status codes to internal status enum.
 *
 * Reference: FedEx Track API — latestStatusDetail.code values.
 * See: https://developer.fedex.com/api/en-us/catalog/track/v1/docs.html
 */
const FEDEX_STATUS_MAP = {
  // Label created / info sent
  OC: STATUSES.CREATED,
  LB: STATUSES.CREATED,

  // Picked up
  PU: STATUSES.PICKED_UP,
  PX: STATUSES.PICKED_UP,

  // In transit
  IT: STATUSES.IN_TRANSIT,
  IX: STATUSES.IN_TRANSIT,
  AR: STATUSES.IN_TRANSIT,   // arrived at facility
  DP: STATUSES.IN_TRANSIT,   // departed facility
  AO: STATUSES.IN_TRANSIT,   // arrived at origin
  AD: STATUSES.IN_TRANSIT,   // arrived at destination city
  AF: STATUSES.IN_TRANSIT,   // at FedEx facility
  CC: STATUSES.IN_TRANSIT,   // cleared customs
  CD: STATUSES.IN_TRANSIT,   // clearance delay
  CH: STATUSES.IN_TRANSIT,   // location changed
  CP: STATUSES.IN_TRANSIT,   // cleared and progressing
  EA: STATUSES.IN_TRANSIT,   // enroute to airport
  ED: STATUSES.IN_TRANSIT,   // enroute to delivery
  EP: STATUSES.IN_TRANSIT,   // enroute to pickup
  FD: STATUSES.IN_TRANSIT,   // at FedEx destination
  HL: STATUSES.IN_TRANSIT,   // hold at location
  LP: STATUSES.IN_TRANSIT,   // departed FedEx location
  OF: STATUSES.IN_TRANSIT,   // at origin facility
  OX: STATUSES.IN_TRANSIT,   // shipment info sent
  PM: STATUSES.IN_TRANSIT,   // in progress
  RR: STATUSES.IN_TRANSIT,   // CDO requested
  RM: STATUSES.IN_TRANSIT,   // CDO modified
  RC: STATUSES.IN_TRANSIT,   // CDO cancelled
  SF: STATUSES.IN_TRANSIT,   // at sort facility
  SP: STATUSES.IN_TRANSIT,   // split status
  TR: STATUSES.IN_TRANSIT,   // transfer

  // Out for delivery
  OD: STATUSES.OUT_FOR_DELIVERY,

  // Delivered
  DL: STATUSES.DELIVERED,

  // Exceptions
  DE: STATUSES.EXCEPTION,   // delivery exception
  SE: STATUSES.EXCEPTION,   // shipment exception
  CA: STATUSES.EXCEPTION,   // carrier notification (exception context)
  RS: STATUSES.EXCEPTION,   // return to shipper started

  // Returned
  HP: STATUSES.RETURNED,    // returned / return to shipper complete

  // Cancelled (very rare in FedEx but possible)
  CX: STATUSES.CANCELLED,
};

/**
 * Normalise a raw FedEx status code to an internal status.
 *
 * @param {string} rawStatus  FedEx latestStatusDetail.code or scanEvent code.
 * @returns {string} One of STATUSES values.
 */
function normalizeStatus(rawStatus) {
  if (!rawStatus) return STATUSES.EXCEPTION;
  const key = rawStatus.toUpperCase().trim();
  return FEDEX_STATUS_MAP[key] || STATUSES.IN_TRANSIT;
}

module.exports = { FEDEX_STATUS_MAP, normalizeStatus };
