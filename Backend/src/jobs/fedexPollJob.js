const cron = require('node-cron');
const Shipment = require('../models/Shipment');
const { TERMINAL_STATUSES } = require('../services/tracking/status.enum');
const { processEvents } = require('../services/tracking/processEvents');
const FedExAdapter = require('../services/carriers/fedex/fedex.adapter');
const config = require('../config');
const logger = require('../utils/logger');

const fedexAdapter = new FedExAdapter();

/**
 * FedEx Polling Job
 *
 * Periodically queries the FedEx Track API for all shipments with a
 * non-terminal status and carrier='fedex'. Uses batch requests where
 * possible (FedEx supports up to 30 tracking numbers per API call).
 *
 * This is the primary refresh mechanism for FedEx shipments. The
 * freshness check in the shipment controller is a secondary safety net.
 */
async function pollFedExShipments() {
  const startTime = Date.now();
  logger.info('FedEx poll job: starting');

  try {
    // Find all active (non-terminal) FedEx shipments
    const terminalArray = Array.from(TERMINAL_STATUSES);

    const shipments = await Shipment.find({
      carrier: 'fedex',
      status: { $nin: terminalArray },
    });

    if (shipments.length === 0) {
      logger.info('FedEx poll job: no active shipments to poll');
      return;
    }

    logger.info({ count: shipments.length }, 'FedEx poll job: found active shipments');

    // Group shipments by tracking number for batch requests
    const batchSize = config.tracking.fedexPollBatchSize;
    const trackingNumbers = shipments.map((s) => s.carrierTrackingNumber);

    let processedCount = 0;
    let errorCount = 0;

    // Process in batches
    for (let i = 0; i < trackingNumbers.length; i += batchSize) {
      const batchTNs = trackingNumbers.slice(i, i + batchSize);

      try {
        const results = await fedexAdapter.fetchTrackingBatch(batchTNs);

        // Match results back to shipments and process
        for (const shipment of shipments) {
          const result = results.get(shipment.carrierTrackingNumber);
          if (!result || !result.events || result.events.length === 0) continue;

          try {
            await processEvents(shipment, result.events, {
              carrierResponse: result.rawResponse,
            });
            processedCount++;
          } catch (err) {
            errorCount++;
            logger.error(
              {
                err,
                internalTrackingId: shipment.internalTrackingId,
                carrierTrackingNumber: shipment.carrierTrackingNumber,
              },
              'FedEx poll job: failed to process events for shipment',
            );
          }
        }
      } catch (err) {
        errorCount += batchTNs.length;
        logger.error(
          { err, batchIndex: i, batchSize: batchTNs.length },
          'FedEx poll job: batch API call failed',
        );
      }
    }

    const durationMs = Date.now() - startTime;
    logger.info(
      { processedCount, errorCount, durationMs, totalShipments: shipments.length },
      'FedEx poll job: completed',
    );
  } catch (err) {
    logger.error({ err }, 'FedEx poll job: fatal error');
  }
}

/**
 * Start the FedEx polling cron job.
 * @returns {import('node-cron').ScheduledTask}
 */
function startFedExPollJob() {
  const cronExpression = config.tracking.fedexPollCron;

  logger.info({ cron: cronExpression }, 'FedEx poll job: scheduling');

  const task = cron.schedule(cronExpression, pollFedExShipments, {
    scheduled: true,
    timezone: 'UTC',
  });

  return task;
}

module.exports = { startFedExPollJob, pollFedExShipments };
