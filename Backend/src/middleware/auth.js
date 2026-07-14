const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');
const AppError = require('../utils/AppError');

/**
 * Middleware: require a valid JWT access token.
 * Attaches the full user document to `req.user`.
 */
async function requireAuth(req, _res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication required. Provide a Bearer token.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.sub).lean();
    if (!user) {
      throw new AppError('User associated with this token no longer exists.', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(new AppError('Invalid or expired token.', 401));
    }
    next(err);
  }
}

/**
 * Middleware factory: restrict access to specific roles.
 *
 * @param {...string} roles  Allowed roles (e.g. 'admin', 'customer').
 * @returns {Function} Express middleware.
 *
 * @example
 *   router.get('/admin-only', requireAuth, requireRole('admin'), handler);
 */
function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
