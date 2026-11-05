const User = require('../models/User');
const AppError = require('../utils/AppError');

// ── Demo Accounts ──────────────────────────────────
const DEMO_EMAILS = [
  'admin@swiftex.local',
  'operator@swiftex.local',
  'coordinator@swiftex.local',
];

/**
 * GET /users — list all users (admin only)
 */
async function list(req, res, next) {
  try {
    const users = await User.find().select('-password -__v').sort({ createdAt: -1 });
    res.json({
      success: true,
      data: { users },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /users/:id/toggle-status — toggle active status of a user (admin only)
 */
async function toggleStatus(req, res, next) {
  try {
    const { id } = req.params;
    if (id === req.user._id.toString()) {
      throw new AppError('Cannot toggle your own status.', 400);
    }
    const user = await User.findById(id);
    if (!user) throw new AppError('User not found.', 404);

    if (DEMO_EMAILS.includes(user.email.toLowerCase())) {
      throw new AppError('Modifying demo account status is not allowed.', 403);
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ success: true, data: { user: { _id: user._id, email: user.email, isActive: user.isActive } } });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /users/:id — delete a user (admin only)
 */
async function remove(req, res, next) {
  try {
    const { id } = req.params;
    if (id === req.user._id.toString()) {
      throw new AppError('Cannot delete yourself.', 400);
    }
    const user = await User.findById(id);
    if (!user) throw new AppError('User not found.', 404);

    if (DEMO_EMAILS.includes(user.email.toLowerCase())) {
      throw new AppError('Deleting demo accounts is not allowed.', 403);
    }

    await User.findByIdAndDelete(id);

    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, toggleStatus, remove };
