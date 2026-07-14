require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // MongoDB
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/swiftex',

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },

  // DHL
  dhl: {
    apiKey: process.env.DHL_API_KEY,
    webhookSecret: process.env.DHL_WEBHOOK_SECRET,
    baseUrl: process.env.DHL_BASE_URL || 'https://api-eu.dhl.com',
  },

  // FedEx
  fedex: {
    apiKey: process.env.FEDEX_API_KEY,
    secretKey: process.env.FEDEX_SECRET_KEY,
    baseUrl: process.env.FEDEX_BASE_URL || 'https://apis-sandbox.fedex.com',
  },

  // Tracking / Caching
  tracking: {
    freshnessThresholdMinutes: parseInt(process.env.TRACKING_FRESHNESS_THRESHOLD_MINUTES, 10) || 15,
    fedexPollCron: process.env.FEDEX_POLL_CRON || '*/10 * * * *',
    fedexPollBatchSize: parseInt(process.env.FEDEX_POLL_BATCH_SIZE, 10) || 30,
  },
};

module.exports = config;
