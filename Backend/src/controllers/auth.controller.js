const bcrypt = require('bcryptjs');
const { z } = require('zod');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../utils/jwt');
const logger = require('../utils/logger');

// ── Validation Schemas ─────────────────────────────

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'customer']).optional().default('customer'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// ── Helpers ────────────────────────────────────────

async function storeRefreshToken(user, refreshToken) {
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await user.save();
}

// ── Controller Methods ─────────────────────────────

/**
 * POST /auth/register
 */
async function register(req, res, next) {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await User.findOne({ email: data.email });
    if (existing) {
      throw new AppError('An account with this email already exists.', 409);
    }

    const passwordHash = await User.hashPassword(data.password);

    const user = await User.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role,
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await storeRefreshToken(user, refreshToken);

    logger.info({ userId: user._id, email: user.email }, 'User registered');

    res.status(201).json({
      success: true,
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    if (err.name === 'ZodError') {
      const details = err.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
      return next(Object.assign(new AppError('Validation failed.', 400), { details }));
    }
    next(err);
  }
}

/**
 * POST /auth/login
 */
async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);

    const user = await User.findOne({ email: data.email });
    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    const isMatch = await user.comparePassword(data.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password.', 401);
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await storeRefreshToken(user, refreshToken);

    logger.info({ userId: user._id }, 'User logged in');

    res.json({
      success: true,
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    if (err.name === 'ZodError') {
      const details = err.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
      return next(Object.assign(new AppError('Validation failed.', 400), { details }));
    }
    next(err);
  }
}

/**
 * POST /auth/refresh
 */
async function refresh(req, res, next) {
  try {
    const data = refreshSchema.parse(req.body);

    let decoded;
    try {
      decoded = verifyRefreshToken(data.refreshToken);
    } catch {
      throw new AppError('Invalid or expired refresh token.', 401);
    }

    const user = await User.findById(decoded.sub);
    if (!user || !user.refreshTokenHash) {
      throw new AppError('Invalid refresh token.', 401);
    }

    // Verify the refresh token matches the stored hash
    const isValid = await bcrypt.compare(data.refreshToken, user.refreshTokenHash);
    if (!isValid) {
      throw new AppError('Refresh token has been revoked.', 401);
    }

    // Rotate tokens
    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    await storeRefreshToken(user, newRefreshToken);

    logger.info({ userId: user._id }, 'Tokens refreshed');

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (err) {
    if (err.name === 'ZodError') {
      const details = err.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
      return next(Object.assign(new AppError('Validation failed.', 400), { details }));
    }
    next(err);
  }
}

/**
 * GET /auth/me
 */
async function me(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /auth/me
 */
async function updateMe(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) throw new AppError('User not found.', 404);

    if (req.body.name) user.name = req.body.name;
    // Note: updating email usually requires reverification in real app
    if (req.body.email) user.email = req.body.email;
    
    await user.save();
    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /auth/update-password
 */
async function updatePassword(req, res, next) {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      throw new AppError('oldPassword and newPassword are required.', 400);
    }
    const user = await User.findById(req.user._id);
    if (!user) throw new AppError('User not found.', 404);

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) throw new AppError('Incorrect old password.', 401);

    user.passwordHash = await User.hashPassword(newPassword);
    await user.save();

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, refresh, me, updateMe, updatePassword };
