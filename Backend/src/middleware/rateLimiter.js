const rateLimit = require("express-rate-limit");

/**
 * Rate limiter for public-facing endpoints (tracking, auth).
 *
 * Defaults: 100 requests per 15-minute window per IP.
 * Adjust via options or env vars as needed.
 */
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true, // RateLimit-* headers
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 429,
      message: "Too many requests. Please try again later.",
    },
  },
});

/**
 * Stricter rate limiter for auth endpoints (login, register).
 * 200 requests per 10-minute window per IP.
 */
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 429,
      message: "Too many authentication attempts. Please try again later.",
    },
  },
});

module.exports = { publicLimiter, authLimiter };
