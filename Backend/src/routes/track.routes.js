const { Router } = require('express');
const { publicLimiter } = require('../middleware/rateLimiter');
const trackController = require('../controllers/track.controller');

const router = Router();

router.get('/:internalTrackingId', publicLimiter, trackController.publicTrack);

module.exports = router;
