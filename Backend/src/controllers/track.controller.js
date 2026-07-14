const Shipment = require('../models/Shipment');
const AppError = require('../utils/AppError');

/**
 * GET /track/:internalTrackingId — public-facing, sanitised tracking view.
 *
 * Strips all internal/carrier-sensitive fields:
 *   - carrierTrackingNumber
 *   - rawCarrierPayload
 *   - lastCarrierResponse
 *   - owner
 *   - legs[].carrierTrackingNumber
 *   - legs[].lastCarrierResponse
 */
async function publicTrack(req, res, next) {
  try {
    const { internalTrackingId } = req.params;

    const shipment = await Shipment.findOne({ internalTrackingId }).lean();
    if (!shipment) {
      throw new AppError('Shipment not found.', 404);
    }

    // ── Sanitise events ────────────────────────────
    const sanitiseEvents = (events = []) =>
      events.map((e) => ({
        timestamp: e.timestamp,
        location: e.location,
        description: e.description,
        status: e.normalizedStatus,
      }));

    // ── Sanitise legs ──────────────────────────────
    const sanitiseLegs = (legs = []) =>
      legs.map((leg) => ({
        carrier: leg.carrier,
        status: leg.status,
        legOrder: leg.legOrder,
        events: sanitiseEvents(leg.events),
      }));

    // ── Build public response ──────────────────────
    const publicView = {
      internalTrackingId: shipment.internalTrackingId,
      trackingCode: shipment.internalTrackingId,
      status: shipment.status,
      carrier: shipment.carrier,
      events: sanitiseEvents(shipment.events),
      legs: sanitiseLegs(shipment.legs),
      senderName: shipment.metadata?.sender?.name || '',
      senderAddress: shipment.metadata?.sender?.address || '',
      senderPhoneNo: shipment.metadata?.sender?.phone || '',
      recipientName: shipment.metadata?.receiver?.name || '',
      recipientAddress: shipment.metadata?.receiver?.address || '',
      recipientPhoneNo: shipment.metadata?.receiver?.phone || '',
      recipientEmail: shipment.metadata?.recipientEmail || '',
      packageDescription: shipment.metadata?.description || '',
      packageLocation: shipment.metadata?.packageLocation || '',
      weight: shipment.metadata?.weight || null,
      category: shipment.metadata?.category || 'General',
      estimatedDelivery: shipment.metadata?.estimatedDelivery || null,
      createdAt: shipment.createdAt,
      updatedAt: shipment.updatedAt,
    };

    res.json({
      success: true,
      data: { shipment: publicView },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { publicTrack };
