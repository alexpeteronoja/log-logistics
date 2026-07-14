const logger = require('../utils/logger');

/**
 * Centralized error-handling middleware.
 *
 * Produces a consistent JSON error shape:
 * {
 *   "success": false,
 *   "error": {
 *     "code": 500,
 *     "message": "Something went wrong.",
 *     "details": [...]   // optional, e.g. validation errors
 *   }
 * }
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational || false;

  // Log non-operational (unexpected) errors at error level
  if (!isOperational) {
    logger.error({ err, stack: err.stack }, 'Unhandled error');
  } else {
    logger.warn({ err: err.message, statusCode }, 'Operational error');
  }

  const response = {
    success: false,
    error: {
      code: statusCode,
      message: isOperational ? err.message : 'Something went wrong.',
    },
  };

  // Attach validation details if present
  if (err.details) {
    response.error.details = err.details;
  }

  // In development, include the stack trace
  if (process.env.NODE_ENV !== 'production' && !isOperational) {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = errorHandler;
