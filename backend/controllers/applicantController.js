const Applicant = require('../models/Applicant');

exports.getAll = async (req, res) => {
  const { status, quotaType, academicYear } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (quotaType) filter.quotaType = quotaType;
  if (academicYear) filter.academicYear = academicYear;
  const applicants = await Applicant.find(filter).populate('program').sort('-createdAt');
  res.json(applicants);
};

exports.getOne = async (req, res) => {
  const applicant = await Applicant.findById(req.params.id).populate('program');
  if (!applicant) return res.status(404).json({ message: 'Applicant not found' });
  res.json(applicant);
};

exports.create = async (req, res) => {
  const applicant = await Applicant.create(req.body);
  res.status(201).json(applicant);
};

exports.update = async (req, res) => {
  const applicant = await Applicant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!applicant) return res.status(404).json({ message: 'Applicant not found' });
  res.json(applicant);
};

exports.updateDocumentStatus = async (req, res) => {
  const { documentStatus } = req.body;
  const applicant = await Applicant.findByIdAndUpdate(
    req.params.id,
    { documentStatus },
    { new: true }
  );
  if (!applicant) return res.status(404).json({ message: 'Applicant not found' });
  res.json(applicant);
};

exports.remove = async (req, res) => {
  const applicant = await Applicant.findByIdAndDelete(req.params.id);
  if (!applicant) return res.status(404).json({ message: 'Applicant not found' });
  res.json({ message: 'Deleted' });
};
