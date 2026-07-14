const mongoose = require('mongoose');
const generateTrackingId = require('../utils/generateTrackingId');
const { STATUSES } = require('../services/tracking/status.enum');

// ── Sub-schema: a single normalised tracking event ─
const trackingEventSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, required: true },
    location: { type: String, default: '' },
    description: { type: String, default: '' },
    normalizedStatus: { type: String, enum: Object.values(STATUSES), required: true },
    rawCarrierPayload: { type: mongoose.Schema.Types.Mixed, default: null },
    eventHash: { type: String, required: true },
  },
  { _id: false },
);

// ── Sub-schema: a single shipment leg ──────────────
const legSchema = new mongoose.Schema(
  {
    carrier: { type: String, required: true, lowercase: true },
    carrierTrackingNumber: { type: String, required: true },
    status: { type: String, enum: Object.values(STATUSES), default: STATUSES.CREATED },
    events: [trackingEventSchema],
    legOrder: { type: Number, required: true, default: 0 },
    lastFetchedAt: { type: Date, default: null },
    lastCarrierResponse: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { _id: true },
);

// ── Metadata sub-schema ────────────────────────────
const metadataSchema = new mongoose.Schema(
  {
    sender: {
      name: { type: String, default: '' },
      address: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    receiver: {
      name: { type: String, default: '' },
      address: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    references: { type: [String], default: [] },
    description: { type: String, default: '' },
    weight: { type: Number, default: null },
    dimensions: { type: String, default: '' },
    recipientEmail: { type: String, default: '' },
    packageLocation: { type: String, default: '' },
    category: { type: String, default: 'General' },
    estimatedDelivery: { type: Date, default: null },
  },
  { _id: false },
);

// ── Main Shipment schema ───────────────────────────
const shipmentSchema = new mongoose.Schema(
  {
    internalTrackingId: {
      type: String,
      unique: true,
      index: true,
    },
    carrier: {
      type: String,
      lowercase: true,
      default: 'swiftex',
    },
    carrierTrackingNumber: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(STATUSES),
      default: STATUSES.CREATED,
    },
    legs: [legSchema],
    events: [trackingEventSchema],
    metadata: { type: metadataSchema, default: () => ({}) },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastFetchedAt: { type: Date, default: null },
    lastCarrierResponse: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true },
);

// ── Indexes ────────────────────────────────────────
shipmentSchema.index({ carrier: 1, carrierTrackingNumber: 1 });
shipmentSchema.index({ owner: 1 });
shipmentSchema.index({ status: 1 });

// ── Pre-save: generate internal tracking ID ────────
shipmentSchema.pre('save', function (next) {
  if (!this.internalTrackingId) {
    this.internalTrackingId = generateTrackingId();
  }
  if (!this.carrierTrackingNumber) {
    this.carrierTrackingNumber = this.internalTrackingId;
  }
  next();
});

module.exports = mongoose.model('Shipment', shipmentSchema);
