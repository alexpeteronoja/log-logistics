const Shipment = require('../models/Shipment');
const { getAdapter } = require('../services/carriers/registry');
const { parseDhlWebhookPayload } = require('../services/carriers/dhl/dhl.webhook');
const { processEvents } = require('../services/tracking/processEvents');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * POST /webhooks/dhl — DHL UTAPI v2 push receiver.
 *
 * Flow:
 *   1. Verify webhook signature (via DHL adapter).
 *   2. Parse payload → extract carrierTrackingNumber + normalised events.
 *   3. Look up shipment by carrierTrackingNumber + carrier='dhl'.
 *   4. Call `processEvents()` directly — NO live API call to DHL.
 *   5. Return 200 OK immediately.
 *
 * The handler is fully idempotent: replaying the same payload produces
 * no duplicate events thanks to the eventHash dedup in processEvents.
 */
async function handleDhlWebhook(req, res, next) {
  try {
    // ── 1. Verify signature ────────────────────────
    const dhlAdapter = getAdapter('dhl');
    const isValid = dhlAdapter.verifyWebhookSignature(req);

    if (!isValid) {
      logger.warn('DHL webhook: signature verification failed — rejecting');
      throw new AppError('Invalid webhook signature.', 401);
    }

    // ── 2. Parse payload ───────────────────────────
    const { carrierTrackingNumber, normalizedEvents } = parseDhlWebhookPayload(req.body);

    if (!carrierTrackingNumber) {
      logger.warn({ body: req.body }, 'DHL webhook: missing tracking number in payload');
      // Return 200 to prevent DHL from retrying a fundamentally bad payload
      return res.status(200).json({ success: true, message: 'Acknowledged (no tracking number).' });
    }

    logger.info(
      { carrierTrackingNumber, eventCount: normalizedEvents.length },
      'DHL webhook: processing push',
    );

    // ── 3. Find matching shipment ──────────────────
    // Check both top-level and leg-level tracking numbers
    let shipment = await Shipment.findOne({
      carrier: 'dhl',
      carrierTrackingNumber,
    });

    let legId = null;

    if (!shipment) {
      // Try to find as a leg within a multi-carrier shipment
      shipment = await Shipment.findOne({
        'legs.carrier': 'dhl',
        'legs.carrierTrackingNumber': carrierTrackingNumber,
      });

      if (shipment) {
        const matchingLeg = shipment.legs.find(
          (l) => l.carrier === 'dhl' && l.carrierTrackingNumber === carrierTrackingNumber,
        );
        legId = matchingLeg?._id?.toString() || null;
      }
    }

    if (!shipment) {
      logger.warn(
        { carrierTrackingNumber },
        'DHL webhook: no matching shipment found — acknowledging',
      );
      // Return 200 so DHL doesn't retry — the shipment may not exist in our system
      return res.status(200).json({ success: true, message: 'Acknowledged (shipment not found).' });
    }

    // ── 4. Process events (NO carrier API call) ────
    await processEvents(shipment, normalizedEvents, { legId });

    logger.info(
      { internalTrackingId: shipment.internalTrackingId, carrierTrackingNumber },
      'DHL webhook: events processed successfully',
    );

    // ── 5. Respond ─────────────────────────────────
    res.status(200).json({ success: true, message: 'Webhook processed.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { handleDhlWebhook };
