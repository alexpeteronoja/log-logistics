const { Router } = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { list, toggleStatus, remove } = require('../controllers/user.controller');

const router = Router();

router.use(requireAuth, requireRole('admin'));

router.get('/', list);
router.patch('/:id/toggle-status', toggleStatus);
router.delete('/:id', remove);

module.exports = router;
