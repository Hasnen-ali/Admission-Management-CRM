const Admission = require('../models/Admission');
const Applicant = require('../models/Applicant');
const Program = require('../models/Program');
const { allocateSeat } = require('../services/seatAllocationService');

exports.allocate = async (req, res) => {
  const { applicantId, programId, quotaName } = req.body;

  // Prevent double allocation
  const existing = await Admission.findOne({ applicant: applicantId });
  if (existing) return res.status(400).json({ message: 'Applicant already has an admission record' });

  const result = await allocateSeat(applicantId, programId, quotaName, req.user._id);
  if (!result.success) return res.status(400).json({ message: result.message });

  res.status(201).json(result.admission);
};

exports.getAll = async (req, res) => {
  const admissions = await Admission.find()
    .populate({ path: 'applicant', select: 'name email phone category' })
    .populate({ path: 'program', select: 'name code courseType' })
    .sort('-createdAt');
  res.json(admissions);
};

exports.getOne = async (req, res) => {
  const admission = await Admission.findById(req.params.id)
    .populate('applicant')
    .populate('program');
  if (!admission) return res.status(404).json({ message: 'Admission not found' });
  res.json(admission);
};

exports.updateFee = async (req, res) => {
  const admission = await Admission.findByIdAndUpdate(
    req.params.id,
    { feeStatus: req.body.feeStatus },
    { new: true }
  );
  if (!admission) return res.status(404).json({ message: 'Admission not found' });
  res.json(admission);
};

exports.confirm = async (req, res) => {
  const admission = await Admission.findById(req.params.id);
  if (!admission) return res.status(404).json({ message: 'Admission not found' });
  if (admission.feeStatus !== 'Paid') {
    return res.status(400).json({ message: 'Cannot confirm admission: fee not paid' });
  }
  if (admission.isConfirmed) {
    return res.status(400).json({ message: 'Admission already confirmed' });
  }

  admission.isConfirmed = true;
  admission.confirmedAt = new Date();
  await admission.save();

  await Applicant.findByIdAndUpdate(admission.applicant, { status: 'Confirmed' });

  res.json(admission);
};
