const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");

// ── Route imports ──────────────────────────────────
const authRoutes = require("./routes/auth.routes");
const shipmentRoutes = require("./routes/shipment.routes");
const trackRoutes = require("./routes/track.routes");
const webhookRoutes = require("./routes/webhook.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

// ── Global Middleware ──────────────────────────────

//  CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://log-logistics.vercel.app",
];

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(cookieParser());

// JSON body parser for everything EXCEPT webhook routes
// (webhooks handle their own parsing to preserve rawBody)
app.use((req, res, next) => {
  if (req.path.startsWith("/webhooks")) {
    return next();
  }
  express.json()(req, res, next);
});

// Request logging
app.use((req, _res, next) => {
  logger.debug({ method: req.method, url: req.url }, "Incoming request");
  next();
});

// ── Health check ───────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "SwiftEx API is running.",
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ─────────────────────────────────────────
app.use("/auth", authRoutes);
app.use("/shipments", shipmentRoutes);
app.use("/track", trackRoutes);
app.use("/webhooks", webhookRoutes);
app.use("/users", userRoutes);

// ── 404 catch-all ──────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 404, message: "Route not found." },
  });
});

// ── Error handler ──────────────────────────────────
app.use(errorHandler);

module.exports = app;
