const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 12;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "customer", "coordinator", "operator"],
      default: "customer",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    phoneNumber: {
      type: String,
      default: "",
      trim: true,
    },
    refreshTokenHash: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

// // ── Index ──────────────────────────────────────────
// userSchema.index({ email: 1 });

// ── Static: hash a plain-text password ─────────────
userSchema.statics.hashPassword = async function (plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
};

// ── Instance: compare a plain-text password ────────
userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

// ── Serialisation guard ────────────────────────────
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.refreshTokenHash;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
