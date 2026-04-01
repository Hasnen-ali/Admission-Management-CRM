const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  admissionNumber: { type: String, unique: true, immutable: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'Applicant', required: true, unique: true },
  program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
  quotaName: { type: String, required: true },
  academicYear: { type: String, required: true },
  feeStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  isConfirmed: { type: Boolean, default: false },
  allocatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  confirmedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Admission', admissionSchema);
