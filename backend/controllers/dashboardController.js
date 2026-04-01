const Program = require('../models/Program');
const Applicant = require('../models/Applicant');
const Admission = require('../models/Admission');

exports.getSummary = async (req, res) => {
  const programs = await Program.find({ isActive: true });

  let totalIntake = 0;
  let totalAdmitted = 0;
  const quotaSummary = {};

  programs.forEach((p) => {
    totalIntake += p.totalIntake;
    p.quotas.forEach((q) => {
      totalAdmitted += q.filledSeats;
      if (!quotaSummary[q.name]) {
        quotaSummary[q.name] = { total: 0, filled: 0, remaining: 0 };
      }
      quotaSummary[q.name].total += q.totalSeats;
      quotaSummary[q.name].filled += q.filledSeats;
      quotaSummary[q.name].remaining += q.totalSeats - q.filledSeats;
    });
  });

  const pendingDocs = await Applicant.countDocuments({ documentStatus: 'Pending' });
  const pendingFees = await Admission.countDocuments({ feeStatus: 'Pending', isConfirmed: false });

  res.json({
    totalIntake,
    totalAdmitted,
    remainingSeats: totalIntake - totalAdmitted,
    quotaSummary,
    pendingDocuments: pendingDocs,
    pendingFees,
  });
};
