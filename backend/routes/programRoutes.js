const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/programController');

router.get('/seat-matrix', protect, ctrl.getSeatMatrix);
router.route('/').get(protect, ctrl.getAll).post(protect, authorize('admin'), ctrl.create);
router.route('/:id').get(protect, ctrl.getOne).put(protect, authorize('admin'), ctrl.update).delete(protect, authorize('admin'), ctrl.remove);

module.exports = router;
