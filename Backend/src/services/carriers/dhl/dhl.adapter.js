const crypto = require('crypto');
const config = require('../../../config');
const logger = require('../../../utils/logger');
const { normalizeStatus } = require('./dhl.statusMap');
const { generateEventHash } = require('../../tracking/eventHash');

/**
 * DHL Carrier Adapter — implements the CarrierAdapter interface.
 *
 * Supports:
 *   - fetchTracking()  — live GET to DHL Unified Tracking API v2.
 *   - normalizeStatus() — maps DHL status codes to internal enum.
 *   - verifyWebhookSignature() — validates HMAC-SHA256 on UTAPI push.
 */
class DhlAdapter {
  constructor() {
    this.name = 'dhl';
    this.baseUrl = config.dhl.baseUrl;
    this.apiKey = config.dhl.apiKey;
    this.webhookSecret = config.dhl.webhookSecret;
  }

  /**
   * Fetch tracking info from DHL Unified Tracking API v2.
   *
   * @param {string} carrierTrackingNumber
   * @returns {Promise<{ events: Array, rawResponse: object }>}
   */
  async fetchTracking(carrierTrackingNumber) {
    const url = `${this.baseUrl}/track/shipments?trackingNumber=${encodeURIComponent(carrierTrackingNumber)}`;

    logger.debug({ carrierTrackingNumber, url }, 'DHL: fetching tracking');

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'DHL-API-Key': this.apiKey,
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      const body = await res.text();
      logger.error({ status: res.status, body, carrierTrackingNumber }, 'DHL: API error');
      throw new Error(`DHL API returned ${res.status}: ${body}`);
    }

    const data = await res.json();
    const rawResponse = data;

    // DHL returns shipments[0].events[]
    const shipment = (data.shipments || [])[0];
    if (!shipment || !shipment.events) {
      return { events: [], rawResponse };
    }

    const events = shipment.events.map((evt) => {
      const ts = evt.timestamp || evt.date || new Date().toISOString();
      const loc = evt.location?.address?.addressLocality || '';
      const desc = evt.description || evt.status?.description || '';
      const rawStatus = evt.status?.statusCode || evt.statusCode || '';
      const normalized = normalizeStatus(rawStatus);

      return {
        timestamp: new Date(ts),
        location: loc,
        description: desc,
        normalizedStatus: normalized,
        rawCarrierPayload: evt,
        eventHash: generateEventHash('dhl', carrierTrackingNumber, ts, normalized),
      };
    });

    return { events, rawResponse };
  }

  /**
   * Map a raw DHL status code to the internal status enum.
   *
   * @param {string} rawStatus
   * @returns {string}
   */
  normalizeStatus(rawStatus) {
    return normalizeStatus(rawStatus);
  }

  /**
   * Verify the HMAC-SHA256 signature on a DHL UTAPI push webhook request.
   *
   * DHL sends the signature in the `x-dhl-signature` header, computed
   * over the raw request body using the shared webhook secret.
   *
   * @param {import('express').Request} req  Express request (must have rawBody).
   * @returns {boolean}
   */
  verifyWebhookSignature(req) {
    const signature = req.headers['x-dhl-signature'];
    if (!signature || !this.webhookSecret) {
      logger.warn('DHL webhook: missing signature header or webhook secret');
      return false;
    }

    const rawBody = req.rawBody || JSON.stringify(req.body);
    const expected = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(rawBody)
      .digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expected, 'hex'),
    );

    if (!isValid) {
      logger.warn('DHL webhook: signature verification failed');
    }

    return isValid;
  }
}

module.exports = DhlAdapter;
