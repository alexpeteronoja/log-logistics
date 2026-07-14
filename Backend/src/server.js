const mongoose = require('mongoose');
const config = require('./config');
const logger = require('./utils/logger');
const app = require('./app');
const { startFedExPollJob } = require('./jobs/fedexPollJob');

// ── Connect to MongoDB & start server ──────────────

async function start() {
  try {
    logger.info({ uri: config.mongoUri.replace(/\/\/.*@/, '//<credentials>@') }, 'Connecting to MongoDB…');

    await mongoose.connect(config.mongoUri);
    logger.info('MongoDB connected');

    // Start FedEx polling job
    startFedExPollJob();

    app.listen(config.port, () => {
      logger.info({ port: config.port, env: config.nodeEnv }, '🚀 SwiftEx API is running');
    });
  } catch (err) {
    logger.fatal({ err }, 'Failed to start server');
    process.exit(1);
  }
}

// ── Graceful Shutdown ──────────────────────────────

function gracefulShutdown(signal) {
  logger.info({ signal }, 'Received shutdown signal, closing gracefully…');
  mongoose.connection.close(false).then(() => {
    logger.info('MongoDB connection closed');
    process.exit(0);
  });
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled promise rejection');
});

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught exception — shutting down');
  process.exit(1);
});

start();
