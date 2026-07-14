const { generateEventHash } = require('../services/tracking/eventHash');

describe('Event Deduplication — Hash Generation', () => {
  const carrier = 'dhl';
  const trackingNumber = '1234567890';
  const timestamp = '2024-06-15T10:30:00.000Z';
  const status = 'IN_TRANSIT';

  test('produces a 64-char hex SHA-256 hash', () => {
    const hash = generateEventHash(carrier, trackingNumber, timestamp, status);
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  test('same inputs produce the same hash (deterministic)', () => {
    const hash1 = generateEventHash(carrier, trackingNumber, timestamp, status);
    const hash2 = generateEventHash(carrier, trackingNumber, timestamp, status);
    expect(hash1).toBe(hash2);
  });

  test('different carriers produce different hashes', () => {
    const hashDhl = generateEventHash('dhl', trackingNumber, timestamp, status);
    const hashFedex = generateEventHash('fedex', trackingNumber, timestamp, status);
    expect(hashDhl).not.toBe(hashFedex);
  });

  test('different tracking numbers produce different hashes', () => {
    const hash1 = generateEventHash(carrier, '1111111111', timestamp, status);
    const hash2 = generateEventHash(carrier, '2222222222', timestamp, status);
    expect(hash1).not.toBe(hash2);
  });

  test('different timestamps produce different hashes', () => {
    const hash1 = generateEventHash(carrier, trackingNumber, '2024-06-15T10:30:00.000Z', status);
    const hash2 = generateEventHash(carrier, trackingNumber, '2024-06-15T11:00:00.000Z', status);
    expect(hash1).not.toBe(hash2);
  });

  test('different statuses produce different hashes', () => {
    const hash1 = generateEventHash(carrier, trackingNumber, timestamp, 'IN_TRANSIT');
    const hash2 = generateEventHash(carrier, trackingNumber, timestamp, 'DELIVERED');
    expect(hash1).not.toBe(hash2);
  });

  test('accepts Date objects for timestamp', () => {
    const dateObj = new Date('2024-06-15T10:30:00.000Z');
    const hashDate = generateEventHash(carrier, trackingNumber, dateObj, status);
    const hashString = generateEventHash(carrier, trackingNumber, '2024-06-15T10:30:00.000Z', status);
    expect(hashDate).toBe(hashString);
  });

  // ── Idempotency simulation ───────────────────────

  test('simulates idempotent event insertion', () => {
    const existingHashes = new Set();

    // First insertion
    const event1Hash = generateEventHash(carrier, trackingNumber, timestamp, status);
    expect(existingHashes.has(event1Hash)).toBe(false);
    existingHashes.add(event1Hash);

    // Duplicate insertion (same webhook delivered twice)
    const event1HashAgain = generateEventHash(carrier, trackingNumber, timestamp, status);
    expect(existingHashes.has(event1HashAgain)).toBe(true); // Should be rejected

    // New event (different timestamp)
    const event2Hash = generateEventHash(carrier, trackingNumber, '2024-06-16T08:00:00.000Z', 'DELIVERED');
    expect(existingHashes.has(event2Hash)).toBe(false);
    existingHashes.add(event2Hash);

    expect(existingHashes.size).toBe(2);
  });
});
