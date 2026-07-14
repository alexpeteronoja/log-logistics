const config = require('../../../config');
const logger = require('../../../utils/logger');

/**
 * FedEx OAuth2 token manager.
 * Uses the client_credentials grant to obtain a bearer token from
 * the FedEx Authorization API, then caches it until near-expiry.
 */

let cachedToken = null;
let tokenExpiresAt = 0; // Unix ms

/**
 * Obtain a valid FedEx OAuth2 access token.
 * Returns from cache if not expired (with 60s safety margin).
 *
 * @returns {Promise<string>} Bearer access token.
 */
async function getFedExToken() {
  const now = Date.now();

  if (cachedToken && now < tokenExpiresAt - 60_000) {
    return cachedToken;
  }

  logger.info('FedEx auth: requesting new OAuth2 token');

  const url = `${config.fedex.baseUrl}/oauth/token`;

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: config.fedex.apiKey,
    client_secret: config.fedex.secretKey,
  });

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    logger.error({ status: res.status, body: text }, 'FedEx auth: token request failed');
    throw new Error(`FedEx OAuth2 failed: ${res.status} — ${text}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  // FedEx typically returns expires_in in seconds
  tokenExpiresAt = now + (data.expires_in || 3600) * 1000;

  logger.info({ expiresIn: data.expires_in }, 'FedEx auth: token acquired');
  return cachedToken;
}

/**
 * Clear the cached token (useful for testing or forced re-auth).
 */
function clearTokenCache() {
  cachedToken = null;
  tokenExpiresAt = 0;
}

module.exports = { getFedExToken, clearTokenCache };
