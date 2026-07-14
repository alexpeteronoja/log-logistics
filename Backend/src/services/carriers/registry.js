const { validateAdapter } = require('./adapter.interface');
const DhlAdapter = require('./dhl/dhl.adapter');
const FedExAdapter = require('./fedex/fedex.adapter');
const logger = require('../../utils/logger');

/**
 * Carrier adapter registry — factory/lookup pattern.
 *
 * Adding a new carrier:
 *   1. Create `services/carriers/<carrier>/<carrier>.adapter.js`
 *   2. Import and register it here.
 * No changes to core tracking logic required.
 */

const adapters = new Map();

/**
 * Register a carrier adapter instance.
 *
 * @param {string} carrierName  Lowercase carrier identifier (e.g. 'dhl').
 * @param {object} adapterInstance  Must implement CarrierAdapter interface.
 */
function registerAdapter(carrierName, adapterInstance) {
  validateAdapter(adapterInstance);
  adapters.set(carrierName.toLowerCase(), adapterInstance);
  logger.info({ carrier: carrierName }, 'Carrier adapter registered');
}

/**
 * Retrieve a carrier adapter by name.
 *
 * @param {string} carrierName
 * @returns {object} The adapter instance.
 * @throws {Error} If no adapter is registered for the given carrier.
 */
function getAdapter(carrierName) {
  const key = carrierName.toLowerCase();
  const adapter = adapters.get(key);
  if (!adapter) {
    throw new Error(`No carrier adapter registered for: "${carrierName}"`);
  }
  return adapter;
}

/**
 * List all registered carrier names.
 * @returns {string[]}
 */
function listCarriers() {
  return Array.from(adapters.keys());
}

// ── Auto-register built-in adapters ────────────────
registerAdapter('dhl', new DhlAdapter());
registerAdapter('fedex', new FedExAdapter());

module.exports = { registerAdapter, getAdapter, listCarriers };
