const config = require('../../../config');
const logger = require('../../../utils/logger');
const { getFedExToken } = require('./fedex.auth');
const { normalizeStatus } = require('./fedex.statusMap');
const { generateEventHash } = require('../../tracking/eventHash');

/**
 * FedEx Carrier Adapter — implements the CarrierAdapter interface.
 *
 * FedEx uses a polling model (no push webhooks), so `verifyWebhookSignature`
 * always returns false.
 */
class FedExAdapter {
  constructor() {
    this.name = 'fedex';
    this.baseUrl = config.fedex.baseUrl;
  }

  /**
   * Fetch tracking info from FedEx Track API v1.
   *
   * @param {string} carrierTrackingNumber
   * @returns {Promise<{ events: Array, rawResponse: object }>}
   */
  async fetchTracking(carrierTrackingNumber) {
    const token = await getFedExToken();

    const url = `${this.baseUrl}/track/v1/trackingnumbers`;

    const requestBody = {
      includeDetailedScans: true,
      trackingInfo: [
        {
          trackingNumberInfo: {
            trackingNumber: carrierTrackingNumber,
          },
        },
      ],
    };

    logger.debug({ carrierTrackingNumber, url }, 'FedEx: fetching tracking');

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-locale': 'en_US',
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const body = await res.text();
      logger.error({ status: res.status, body, carrierTrackingNumber }, 'FedEx: API error');
      throw new Error(`FedEx API returned ${res.status}: ${body}`);
    }

    const data = await res.json();
    const rawResponse = data;

    // Navigate FedEx response structure
    const trackResult =
      data?.output?.completeTrackResults?.[0]?.trackResults?.[0];

    if (!trackResult) {
      logger.warn({ carrierTrackingNumber }, 'FedEx: no track results found in response');
      return { events: [], rawResponse };
    }

    const scanEvents = trackResult.scanEvents || [];

    const events = scanEvents.map((evt) => {
      const ts = evt.date || new Date().toISOString();
      const loc = [
        evt.scanLocation?.city,
        evt.scanLocation?.stateOrProvinceCode,
        evt.scanLocation?.countryCode,
      ]
        .filter(Boolean)
        .join(', ');
      const desc = evt.eventDescription || '';
      const rawStatus = evt.derivedStatusCode || evt.eventType || '';
      const normalized = normalizeStatus(rawStatus);

      return {
        timestamp: new Date(ts),
        location: loc,
        description: desc,
        normalizedStatus: normalized,
        rawCarrierPayload: evt,
        eventHash: generateEventHash('fedex', carrierTrackingNumber, ts, normalized),
      };
    });

    return { events, rawResponse };
  }

  /**
   * Fetch tracking for multiple tracking numbers in a single API call.
   * FedEx Track API supports up to 30 tracking numbers per request.
   *
   * @param {string[]} trackingNumbers  Array of carrier tracking numbers.
   * @returns {Promise<Map<string, { events: Array, rawResponse: object }>>}
   */
  async fetchTrackingBatch(trackingNumbers) {
    const token = await getFedExToken();
    const url = `${this.baseUrl}/track/v1/trackingnumbers`;

    const requestBody = {
      includeDetailedScans: true,
      trackingInfo: trackingNumbers.map((tn) => ({
        trackingNumberInfo: { trackingNumber: tn },
      })),
    };

    logger.debug({ count: trackingNumbers.length }, 'FedEx: batch fetching tracking');

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-locale': 'en_US',
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const body = await res.text();
      logger.error({ status: res.status, count: trackingNumbers.length }, 'FedEx: batch API error');
      throw new Error(`FedEx batch API returned ${res.status}: ${body}`);
    }

    const data = await res.json();
    const results = new Map();

    const completeResults = data?.output?.completeTrackResults || [];

    for (const result of completeResults) {
      const trackResult = result?.trackResults?.[0];
      if (!trackResult) continue;

      const tn = trackResult.trackingNumberInfo?.trackingNumber || '';
      const scanEvents = trackResult.scanEvents || [];

      const events = scanEvents.map((evt) => {
        const ts = evt.date || new Date().toISOString();
        const loc = [
          evt.scanLocation?.city,
          evt.scanLocation?.stateOrProvinceCode,
          evt.scanLocation?.countryCode,
        ]
          .filter(Boolean)
          .join(', ');
        const desc = evt.eventDescription || '';
        const rawStatus = evt.derivedStatusCode || evt.eventType || '';
        const normalized = normalizeStatus(rawStatus);

        return {
          timestamp: new Date(ts),
          location: loc,
          description: desc,
          normalizedStatus: normalized,
          rawCarrierPayload: evt,
          eventHash: generateEventHash('fedex', tn, ts, normalized),
        };
      });

      results.set(tn, { events, rawResponse: result });
    }

    return results;
  }

  /**
   * Map a raw FedEx status code to the internal status enum.
   *
   * @param {string} rawStatus
   * @returns {string}
   */
  normalizeStatus(rawStatus) {
    return normalizeStatus(rawStatus);
  }

  /**
   * FedEx does not use push webhooks — always returns false.
   *
   * @returns {boolean}
   */
  verifyWebhookSignature() {
    return false;
  }
}

module.exports = FedExAdapter;
