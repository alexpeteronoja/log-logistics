/**
 * CarrierAdapter — interface contract for all carrier adapters.
 *
 * Every carrier adapter in `services/carriers/<carrier>/` must implement
 * these methods.  This file serves as documentation; JavaScript doesn't
 * enforce interfaces at compile time, but the registry will throw if
 * a registered adapter is missing required methods.
 *
 * @interface CarrierAdapter
 */

/**
 * @method fetchTracking
 * @description  Fetch tracking events from the carrier's live API.
 * @param {string} carrierTrackingNumber  The carrier's own tracking number.
 * @returns {Promise<{ events: Array<NormalizedEvent>, rawResponse: object }>}
 *
 * Each NormalizedEvent:
 *   {
 *     timestamp: Date,
 *     location: string,
 *     description: string,
 *     normalizedStatus: string,   // value from STATUSES enum
 *     rawCarrierPayload: object,
 *     eventHash: string,          // deterministic dedup hash
 *   }
 */

/**
 * @method normalizeStatus
 * @description  Map a raw carrier-specific status code to the internal enum.
 * @param {string} rawStatus
 * @returns {string}  One of STATUSES enum values.
 */

/**
 * @method verifyWebhookSignature
 * @description  Verify the authenticity of an incoming webhook request.
 *   Return false if the carrier does not support push webhooks.
 * @param {import('express').Request} req
 * @returns {boolean}
 */

const REQUIRED_METHODS = ['fetchTracking', 'normalizeStatus', 'verifyWebhookSignature'];

/**
 * Validate that an adapter instance implements all required methods.
 * @param {object} adapter
 * @throws {Error} If any required method is missing.
 */
function validateAdapter(adapter) {
  for (const method of REQUIRED_METHODS) {
    if (typeof adapter[method] !== 'function') {
      throw new Error(
        `Carrier adapter "${adapter.name || 'unknown'}" is missing required method: ${method}`,
      );
    }
  }
}

module.exports = { validateAdapter, REQUIRED_METHODS };
