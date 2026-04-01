const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/applicantController');

const officers = [protect, authorize('admin', 'admission_officer')];

router.route('/').get(protect, ctrl.getAll).post(...officers, ctrl.create);
router.route('/:id').get(protect, ctrl.getOne).put(...officers, ctrl.update).delete(protect, authorize('admin'), ctrl.remove);
router.patch('/:id/document-status', ...officers, ctrl.updateDocumentStatus);

module.exports = router;
