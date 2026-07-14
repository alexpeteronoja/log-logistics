const { Router } = require('express');
const express = require('express');
const webhookController = require('../controllers/webhook.controller');

const router = Router();

// DHL sends JSON with a signature header.
// We need the raw body for signature verification, so we use a custom
// JSON parser that preserves req.rawBody.
router.post(
  '/dhl',
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf.toString('utf-8');
    },
  }),
  webhookController.handleDhlWebhook,
);

module.exports = router;
