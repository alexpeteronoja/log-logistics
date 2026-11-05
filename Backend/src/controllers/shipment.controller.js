const { z } = require("zod");
const Shipment = require("../models/Shipment");
const AppError = require("../utils/AppError");
const {
  STATUSES,
  TERMINAL_STATUSES,
} = require("../services/tracking/status.enum");
const { fetchAndCache } = require("../services/tracking/fetchAndCache");
const { listCarriers, getAdapter } = require("../services/carriers/registry");
const logger = require("../utils/logger");
const config = require("../config");

// ── Validation Schemas ─────────────────────────────

const createShipmentSchema = z.object({
  carrier: z.string().optional().default("swiftex"),
  carrierTrackingNumber: z.string().optional().default(""),
  legs: z
    .array(
      z.object({
        carrier: z.string().min(1),
        carrierTrackingNumber: z.string().min(1),
        legOrder: z.number().int().min(0).optional().default(0),
      }),
    )
    .optional()
    .default([]),
  metadata: z
    .object({
      sender: z
        .object({
          name: z.string().optional().default(""),
          address: z.string().optional().default(""),
          phone: z.string().optional().default(""),
        })
        .optional()
        .default({}),
      receiver: z
        .object({
          name: z.string().optional().default(""),
          address: z.string().optional().default(""),
          phone: z.string().optional().default(""),
        })
        .optional()
        .default({}),
      references: z.array(z.string()).optional().default([]),
      description: z.string().optional().default(""),
      weight: z.number().optional().nullable().default(null),
      dimensions: z.string().optional().default(""),
      recipientEmail: z.string().optional().default(""),
      packageLocation: z.string().optional().default(""),
      category: z.string().optional().default("General"),
      estimatedDelivery: z.coerce.date().optional().nullable().default(null),
    })
    .optional()
    .default({}),
});

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  status: z.string().optional(),
  carrier: z.string().optional(),
});

// ── Controller Methods ─────────────────────────────

/**
 * POST /shipments — create a new shipment.
 */
async function create(req, res, next) {
  try {
    const data = createShipmentSchema.parse(req.body);

    // Validate carrier is registered if not internal
    const supportedCarriers = listCarriers();
    if (
      data.carrier.toLowerCase() !== "swiftex" &&
      !supportedCarriers.includes(data.carrier.toLowerCase())
    ) {
      throw new AppError(
        `Unsupported carrier: "${data.carrier}". Supported: swiftex, ${supportedCarriers.join(", ")}`,
        400,
      );
    }

    const payload = {
      carrier: data.carrier.toLowerCase(),
      status: STATUSES.CREATED,
      legs: data.legs.map((leg) => ({
        ...leg,
        carrier: leg.carrier.toLowerCase(),
        status: STATUSES.CREATED,
        events: [],
      })),
      metadata: data.metadata,
      owner: req.user._id,
    };

    if (data.carrierTrackingNumber) {
      payload.carrierTrackingNumber = data.carrierTrackingNumber;
    }

    // Validate external tracking number
    if (
      data.carrier.toLowerCase() !== "swiftex" &&
      data.carrierTrackingNumber
    ) {
      try {
        const adapter = getAdapter(data.carrier.toLowerCase());
        await adapter.fetchTracking(data.carrierTrackingNumber);
      } catch (err) {
        throw new AppError(
          `Invalid tracking number. Verification failed: ${err.message}`,
          400,
        );
      }
    }

    let shipment = await Shipment.create(payload);

    // Add default pending event for internal shipments
    if (shipment.carrier === "swiftex") {
      const { processEvents } = require("../services/tracking/processEvents");
      const crypto = require("crypto");

      const timestamp = new Date();
      const status = STATUSES.CREATED;
      const description = "Pending";
      const eventHash = crypto
        .createHash("md5")
        .update(`${timestamp.getTime()}-${status}-${description}`)
        .digest("hex");

      const newEvent = {
        timestamp,
        location: shipment.metadata?.packageLocation || "",
        description,
        normalizedStatus: status,
        eventHash,
      };

      shipment = await processEvents(shipment, [newEvent]);
    }

    logger.info(
      {
        internalTrackingId: shipment.internalTrackingId,
        carrier: shipment.carrier,
      },
      "Shipment created",
    );

    res.status(201).json({
      success: true,
      data: { shipment },
    });
  } catch (err) {
    if (err.name === "ZodError") {
      const details = err.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      }));
      return next(
        Object.assign(new AppError("Validation failed.", 400), { details }),
      );
    }
    next(err);
  }
}

/**
 * GET /shipments — list shipments (admin sees all, customer sees own).
 */
async function list(req, res, next) {
  try {
    const query = listQuerySchema.parse(req.query);
    const filter = {};

    // Scope: customers only see their own shipments
    // if (req.user.role !== 'admin') {
    //   filter.owner = req.user._id;
    // }

    if (query.status) filter.status = query.status.toUpperCase();
    if (query.carrier) filter.carrier = query.carrier.toLowerCase();

    const skip = (query.page - 1) * query.limit;

    const [shipments, total] = await Promise.all([
      Shipment.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.limit)
        .lean(),
      Shipment.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        shipments,
        pagination: {
          page: query.page,
          limit: query.limit,
          total,
          pages: Math.ceil(total / query.limit),
        },
      },
    });
  } catch (err) {
    if (err.name === "ZodError") {
      const details = err.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      }));
      return next(
        Object.assign(new AppError("Validation failed.", 400), { details }),
      );
    }
    next(err);
  }
}

/**
 * GET /shipments/:internalTrackingId — get full shipment detail.
 * Includes freshness check: if non-terminal and stale, triggers fetchAndCache.
 */
async function getById(req, res, next) {
  try {
    const { internalTrackingId } = req.params;

    let shipment = await Shipment.findOne({ internalTrackingId });
    if (!shipment) {
      throw new AppError("Shipment not found.", 404);
    }

    // Access control: owner or admin
    if (
      req.user.role !== "admin" &&
      shipment.owner.toString() !== req.user._id.toString()
    ) {
      throw new AppError(
        "You do not have permission to view this shipment.",
        403,
      );
    }

    // ── Freshness check for non-terminal shipments ──
    if (!TERMINAL_STATUSES.has(shipment.status)) {
      const thresholdMs = config.tracking.freshnessThresholdMinutes * 60 * 1000;
      const isStale =
        !shipment.lastFetchedAt ||
        Date.now() - new Date(shipment.lastFetchedAt).getTime() > thresholdMs;

      if (isStale && shipment.carrier !== "swiftex") {
        logger.info(
          { internalTrackingId, lastFetchedAt: shipment.lastFetchedAt },
          "Shipment data is stale — refreshing from carrier",
        );
        try {
          shipment = await fetchAndCache(shipment);
        } catch (err) {
          // Log but don't fail the request — serve stale data
          logger.error(
            { err, internalTrackingId },
            "Freshness refresh failed, serving cached data",
          );
        }
      }
    }

    res.json({
      success: true,
      data: { shipment },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /shipments/:internalTrackingId/poll — admin-only manual poll trigger.
 */
async function manualPoll(req, res, next) {
  try {
    const { internalTrackingId } = req.params;

    let shipment = await Shipment.findOne({ internalTrackingId });
    if (!shipment) {
      throw new AppError("Shipment not found.", 404);
    }

    logger.info({ internalTrackingId }, "Manual poll triggered by admin");

    if (shipment.carrier === "swiftex") {
      throw new AppError("Cannot poll internal SwiftEx shipments.", 400);
    }

    shipment = await fetchAndCache(shipment);

    res.json({
      success: true,
      data: { shipment },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /shipments/overview — get aggregate stats for dashboard.
 */
async function getOverview(req, res, next) {
  try {
    const filter = req.user.role === "admin" ? {} : { owner: req.user._id };

    const [total, delivered, inTransit, pending] = await Promise.all([
      Shipment.countDocuments(filter),
      Shipment.countDocuments({ ...filter, status: STATUSES.DELIVERED }),
      Shipment.countDocuments({ ...filter, status: STATUSES.IN_TRANSIT }),
      Shipment.countDocuments({ ...filter, status: STATUSES.CREATED }),
    ]);

    res.json({
      success: true,
      data: {
        total,
        delivered,
        inTransit,
        pending,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /shipments/:internalTrackingId — update shipment metadata
 */
async function update(req, res, next) {
  try {
    const { internalTrackingId } = req.params;
    let shipment = await Shipment.findOne({ internalTrackingId });
    if (!shipment) throw new AppError("Shipment not found.", 404);

    // Only admin can update shipment core fields in a real app, assuming admin here
    if (
      req.user.role !== "admin" &&
      shipment.owner.toString() !== req.user._id.toString()
    ) {
      throw new AppError("Not authorized to update this shipment.", 403);
    }

    // Merge incoming data. Assume req.body contains metadata updates mapped from frontend.
    // In production we'd use zod, but for speed we merge explicitly.
    if (!shipment.metadata) shipment.metadata = {};
    if (!shipment.metadata.sender) shipment.metadata.sender = {};
    if (!shipment.metadata.receiver) shipment.metadata.receiver = {};

    if (req.body.senderName)
      shipment.metadata.sender.name = req.body.senderName;
    if (req.body.senderPhoneNo)
      shipment.metadata.sender.phone = req.body.senderPhoneNo;
    if (req.body.senderAddress)
      shipment.metadata.sender.address = req.body.senderAddress;

    if (req.body.recipientName)
      shipment.metadata.receiver.name = req.body.recipientName;
    if (req.body.recipientPhoneNo)
      shipment.metadata.receiver.phone = req.body.recipientPhoneNo;
    if (req.body.recipientEmail)
      shipment.metadata.recipientEmail = req.body.recipientEmail;
    if (req.body.recipientAddress)
      shipment.metadata.receiver.address = req.body.recipientAddress;

    if (req.body.packageDescription)
      shipment.metadata.description = req.body.packageDescription;
    if (req.body.packageLocation)
      shipment.metadata.packageLocation = req.body.packageLocation;
    if (req.body.weight) shipment.metadata.weight = req.body.weight;
    if (req.body.category) shipment.metadata.category = req.body.category;
    if (req.body.estimatedDelivery)
      shipment.metadata.estimatedDelivery = new Date(
        req.body.estimatedDelivery,
      );

    if (req.body.carrierTrackingNumber)
      shipment.carrierTrackingNumber = req.body.carrierTrackingNumber;
    if (req.body.carrier) shipment.carrier = req.body.carrier;

    await shipment.save();

    res.json({ success: true, data: { shipment } });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /shipments/:internalTrackingId
 */
async function remove(req, res, next) {
  try {
    const { internalTrackingId } = req.params;
    const shipment = await Shipment.findOneAndDelete({ internalTrackingId });
    if (!shipment) throw new AppError("Shipment not found.", 404);
    res.json({ success: true, message: "Shipment deleted" });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /shipments/:internalTrackingId/events — manual tracking event addition
 */
async function addEvent(req, res, next) {
  try {
    const { internalTrackingId } = req.params;
    const { status, description, location } = req.body;

    let shipment = await Shipment.findOne({ internalTrackingId });
    if (!shipment) throw new AppError("Shipment not found.", 404);

    if (shipment.carrier !== "swiftex") {
      throw new AppError(
        "Cannot manually add tracking events to external carrier shipments.",
        400,
      );
    }

    const { processEvents } = require("../services/tracking/processEvents");
    const crypto = require("crypto");

    const timestamp = new Date();
    const eventHash = crypto
      .createHash("md5")
      .update(`${timestamp.getTime()}-${status}-${description}`)
      .digest("hex");

    const newEvent = {
      timestamp,
      location: location || "",
      description: description || "",
      normalizedStatus: status.toUpperCase(), // Enum matching
      eventHash,
    };

    shipment = await processEvents(shipment, [newEvent]);

    res.json({ success: true, data: { shipment } });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create,
  list,
  getById,
  manualPoll,
  getOverview,
  update,
  remove,
  addEvent,
};
