const { normalizeStatus: normalizeDhl } = require('../services/carriers/dhl/dhl.statusMap');
const { normalizeStatus: normalizeFedEx } = require('../services/carriers/fedex/fedex.statusMap');
const { STATUSES } = require('../services/tracking/status.enum');

describe('DHL Status Normalization', () => {
  const cases = [
    ['pre-transit', STATUSES.CREATED],
    ['informationReceived', STATUSES.CREATED],
    ['picked-up', STATUSES.PICKED_UP],
    ['pickup', STATUSES.PICKED_UP],
    ['transit', STATUSES.IN_TRANSIT],
    ['in-transit', STATUSES.IN_TRANSIT],
    ['processing', STATUSES.IN_TRANSIT],
    ['clearance', STATUSES.IN_TRANSIT],
    ['customs', STATUSES.IN_TRANSIT],
    ['out-for-delivery', STATUSES.OUT_FOR_DELIVERY],
    ['delivered', STATUSES.DELIVERED],
    ['failure', STATUSES.EXCEPTION],
    ['exception', STATUSES.EXCEPTION],
    ['unknown', STATUSES.EXCEPTION],
    ['returned', STATUSES.RETURNED],
    ['return', STATUSES.RETURNED],
    ['destroyed', STATUSES.CANCELLED],
  ];

  test.each(cases)('maps DHL "%s" → %s', (raw, expected) => {
    expect(normalizeDhl(raw)).toBe(expected);
  });

  test('returns EXCEPTION for null/undefined input', () => {
    expect(normalizeDhl(null)).toBe(STATUSES.EXCEPTION);
    expect(normalizeDhl(undefined)).toBe(STATUSES.EXCEPTION);
  });

  test('falls back to IN_TRANSIT for unmapped codes', () => {
    expect(normalizeDhl('some-unknown-code')).toBe(STATUSES.IN_TRANSIT);
  });

  test('is case-insensitive', () => {
    expect(normalizeDhl('DELIVERED')).toBe(STATUSES.DELIVERED);
    expect(normalizeDhl('Transit')).toBe(STATUSES.IN_TRANSIT);
    expect(normalizeDhl('PRE-TRANSIT')).toBe(STATUSES.CREATED);
  });
});

describe('FedEx Status Normalization', () => {
  const cases = [
    ['OC', STATUSES.CREATED],
    ['LB', STATUSES.CREATED],
    ['PU', STATUSES.PICKED_UP],
    ['IT', STATUSES.IN_TRANSIT],
    ['AR', STATUSES.IN_TRANSIT],
    ['DP', STATUSES.IN_TRANSIT],
    ['OD', STATUSES.OUT_FOR_DELIVERY],
    ['DL', STATUSES.DELIVERED],
    ['DE', STATUSES.EXCEPTION],
    ['SE', STATUSES.EXCEPTION],
    ['HP', STATUSES.RETURNED],
    ['CX', STATUSES.CANCELLED],
  ];

  test.each(cases)('maps FedEx "%s" → %s', (raw, expected) => {
    expect(normalizeFedEx(raw)).toBe(expected);
  });

  test('returns EXCEPTION for null/undefined input', () => {
    expect(normalizeFedEx(null)).toBe(STATUSES.EXCEPTION);
    expect(normalizeFedEx(undefined)).toBe(STATUSES.EXCEPTION);
  });

  test('falls back to IN_TRANSIT for unmapped codes', () => {
    expect(normalizeFedEx('ZZ')).toBe(STATUSES.IN_TRANSIT);
  });

  test('is case-insensitive', () => {
    expect(normalizeFedEx('dl')).toBe(STATUSES.DELIVERED);
    expect(normalizeFedEx('od')).toBe(STATUSES.OUT_FOR_DELIVERY);
  });
});
