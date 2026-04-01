const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const { institution, campus, department, academicYear } = require('../controllers/masterController');

const adminOnly = [protect, authorize('admin')];

// Institutions
router.route('/institutions').get(protect, institution.getAll).post(...adminOnly, institution.create);
router.route('/institutions/:id').get(protect, institution.getOne).put(...adminOnly, institution.update).delete(...adminOnly, institution.remove);

// Campuses
router.route('/campuses').get(protect, campus.getAll).post(...adminOnly, campus.create);
router.route('/campuses/:id').get(protect, campus.getOne).put(...adminOnly, campus.update).delete(...adminOnly, campus.remove);

// Departments
router.route('/departments').get(protect, department.getAll).post(...adminOnly, department.create);
router.route('/departments/:id').get(protect, department.getOne).put(...adminOnly, department.update).delete(...adminOnly, department.remove);

// Academic Years
router.route('/academic-years').get(protect, academicYear.getAll).post(...adminOnly, academicYear.create);
router.route('/academic-years/:id').get(protect, academicYear.getOne).put(...adminOnly, academicYear.update).delete(...adminOnly, academicYear.remove);

module.exports = router;
