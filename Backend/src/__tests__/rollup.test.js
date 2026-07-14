const { calculateRollupStatus } = require('../services/tracking/rollup');
const { STATUSES } = require('../services/tracking/status.enum');

describe('Multi-Leg Rollup Logic', () => {
  // Helper to create a mock shipment with legs
  const makeShipment = (legs, opts = {}) => ({
    status: opts.status || STATUSES.CREATED,
    events: opts.events || [],
    legs: legs.map((leg, i) => ({
      carrier: leg.carrier || 'fedex',
      carrierTrackingNumber: `TN-${i}`,
      status: leg.status,
      events: leg.events || [],
      legOrder: leg.legOrder ?? i,
    })),
  });

  // ── No legs — uses events ────────────────────────

  test('no legs, no events → returns current status', () => {
    const shipment = { status: STATUSES.CREATED, events: [], legs: [] };
    expect(calculateRollupStatus(shipment)).toBe(STATUSES.CREATED);
  });

  test('no legs, with events → returns latest event status', () => {
    const shipment = {
      status: STATUSES.CREATED,
      legs: [],
      events: [
        { timestamp: new Date('2024-01-01'), normalizedStatus: STATUSES.PICKED_UP },
        { timestamp: new Date('2024-01-03'), normalizedStatus: STATUSES.IN_TRANSIT },
        { timestamp: new Date('2024-01-02'), normalizedStatus: STATUSES.PICKED_UP },
      ],
    };
    expect(calculateRollupStatus(shipment)).toBe(STATUSES.IN_TRANSIT);
  });

  // ── Single leg ──────────────────────────────────

  test('single leg IN_TRANSIT → shipment IN_TRANSIT', () => {
    const shipment = makeShipment([{ status: STATUSES.IN_TRANSIT }]);
    expect(calculateRollupStatus(shipment)).toBe(STATUSES.IN_TRANSIT);
  });

  test('single leg DELIVERED → shipment DELIVERED', () => {
    const shipment = makeShipment([{ status: STATUSES.DELIVERED }]);
    expect(calculateRollupStatus(shipment)).toBe(STATUSES.DELIVERED);
  });

  test('single leg EXCEPTION → shipment EXCEPTION', () => {
    const shipment = makeShipment([{ status: STATUSES.EXCEPTION }]);
    expect(calculateRollupStatus(shipment)).toBe(STATUSES.EXCEPTION);
  });

  // ── Multi-leg escalation ─────────────────────────

  test('any leg EXCEPTION → shipment EXCEPTION (overrides everything)', () => {
    const shipment = makeShipment([
      { status: STATUSES.DELIVERED, legOrder: 0 },
      { status: STATUSES.EXCEPTION, legOrder: 1 },
    ]);
    expect(calculateRollupStatus(shipment)).toBe(STATUSES.EXCEPTION);
  });

  test('any leg CANCELLED → shipment CANCELLED', () => {
    const shipment = makeShipment([
      { status: STATUSES.IN_TRANSIT, legOrder: 0 },
      { status: STATUSES.CANCELLED, legOrder: 1 },
    ]);
    expect(calculateRollupStatus(shipment)).toBe(STATUSES.CANCELLED);
  });

  test('any leg RETURNED → shipment RETURNED', () => {
    const shipment = makeShipment([
      { status: STATUSES.DELIVERED, legOrder: 0 },
      { status: STATUSES.RETURNED, legOrder: 1 },
    ]);
    expect(calculateRollupStatus(shipment)).toBe(STATUSES.RETURNED);
  });

  test('EXCEPTION takes precedence over CANCELLED', () => {
    const shipment = makeShipment([
      { status: STATUSES.CANCELLED, legOrder: 0 },
      { status: STATUSES.EXCEPTION, legOrder: 1 },
    ]);
    expect(calculateRollupStatus(shipment)).toBe(STATUSES.EXCEPTION);
  });

  // ── Final leg delivered ──────────────────────────

  test('all legs delivered → shipment DELIVERED', () => {
    const shipment = makeShipment([
      { status: STATUSES.DELIVERED, legOrder: 0 },
      { status: STATUSES.DELIVERED, legOrder: 1 },
    ]);
    expect(calculateRollupStatus(shipment)).toBe(STATUSES.DELIVERED);
  });

  test('first leg delivered, final leg IN_TRANSIT → shipment IN_TRANSIT', () => {
    const shipment = makeShipment([
      { status: STATUSES.DELIVERED, legOrder: 0 },
      { status: STATUSES.IN_TRANSIT, legOrder: 1 },
    ]);
    expect(calculateRollupStatus(shipment)).toBe(STATUSES.IN_TRANSIT);
  });

  test('final leg delivered (3 legs) → shipment DELIVERED', () => {
    const shipment = makeShipment([
      { status: STATUSES.DELIVERED, legOrder: 0 },
      { status: STATUSES.DELIVERED, legOrder: 1 },
      { status: STATUSES.DELIVERED, legOrder: 2 },
    ]);
    expect(calculateRollupStatus(shipment)).toBe(STATUSES.DELIVERED);
  });

  // ── Active leg resolution ────────────────────────

  test('3 legs: first delivered, second OUT_FOR_DELIVERY, third CREATED → OUT_FOR_DELIVERY', () => {
    const shipment = makeShipment([
      { status: STATUSES.DELIVERED, legOrder: 0 },
      { status: STATUSES.OUT_FOR_DELIVERY, legOrder: 1 },
      { status: STATUSES.CREATED, legOrder: 2 },
    ]);
    expect(calculateRollupStatus(shipment)).toBe(STATUSES.OUT_FOR_DELIVERY);
  });

  // ── Leg ordering ────────────────────────────────

  test('legs are sorted by legOrder regardless of array position', () => {
    const shipment = makeShipment([
      { status: STATUSES.IN_TRANSIT, legOrder: 2 },
      { status: STATUSES.DELIVERED, legOrder: 0 },
      { status: STATUSES.PICKED_UP, legOrder: 1 },
    ]);
    // Final leg (legOrder 2) is IN_TRANSIT → shipment is IN_TRANSIT
    expect(calculateRollupStatus(shipment)).toBe(STATUSES.IN_TRANSIT);
  });
});
