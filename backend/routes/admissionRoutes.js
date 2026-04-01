const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/admissionController');

const officers = [protect, authorize('admin', 'admission_officer')];

router.post('/allocate', ...officers, ctrl.allocate);
router.get('/', protect, ctrl.getAll);
router.get('/:id', protect, ctrl.getOne);
router.patch('/:id/fee', ...officers, ctrl.updateFee);
router.patch('/:id/confirm', ...officers, ctrl.confirm);

module.exports = router;
