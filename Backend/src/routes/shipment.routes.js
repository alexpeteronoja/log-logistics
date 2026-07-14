const { Router } = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { create, list, getById, manualPoll, getOverview, update, remove, addEvent } = require('../controllers/shipment.controller');

const router = Router();

router.use(requireAuth);

router.post('/', create);
router.get('/', list);
router.get('/overview', getOverview);
router.get('/:internalTrackingId', getById);
router.patch('/:internalTrackingId', update);
router.delete('/:internalTrackingId', remove);
router.patch('/:internalTrackingId/events', addEvent);
router.post('/:internalTrackingId/poll', requireRole('admin'), manualPoll);

module.exports = router;
