/**
 * Custom operational error class for the application.
 * Carries an HTTP status code so the error handler can respond correctly.
 */
class AppError extends Error {
  /**
   * @param {string} message  Human-readable error message.
   * @param {number} statusCode  HTTP status code (default 500).
   */
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
