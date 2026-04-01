const Institution = require('../models/Institution');
const Campus = require('../models/Campus');
const Department = require('../models/Department');
const AcademicYear = require('../models/AcademicYear');

// Generic CRUD factory
const crudFor = (Model, populateFields = '') => ({
  getAll: async (req, res) => {
    const docs = await Model.find().populate(populateFields).sort('-createdAt');
    res.json(docs);
  },
  getOne: async (req, res) => {
    const doc = await Model.findById(req.params.id).populate(populateFields);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  },
  create: async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json(doc);
  },
  update: async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  },
  remove: async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  },
});

exports.institution = crudFor(Institution);
exports.campus = crudFor(Campus, 'institution');
exports.department = crudFor(Department, 'campus');
exports.academicYear = crudFor(AcademicYear);
