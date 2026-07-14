const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Generate a short-lived access token.
 * @param {{ _id: string, email: string, role: string }} user
 * @returns {string}
 */
function generateAccessToken(user) {
  return jwt.sign(
    { sub: user._id, email: user.email, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.accessExpiry },
  );
}

/**
 * Generate a long-lived refresh token.
 * @param {{ _id: string }} user
 * @returns {string}
 */
function generateRefreshToken(user) {
  return jwt.sign(
    { sub: user._id },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiry },
  );
}

/**
 * Verify and decode an access token.
 * @param {string} token
 * @returns {object} decoded payload
 */
function verifyAccessToken(token) {
  return jwt.verify(token, config.jwt.secret);
}

/**
 * Verify and decode a refresh token.
 * @param {string} token
 * @returns {object} decoded payload
 */
function verifyRefreshToken(token) {
  return jwt.verify(token, config.jwt.refreshSecret);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
