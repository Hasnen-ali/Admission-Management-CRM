const mongoose = require('mongoose');

const quotaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalSeats: { type: Number, required: true, min: 0 },
  filledSeats: { type: Number, default: 0 },
  supernumerarySeats: { type: Number, default: 0 },
  supernumeraryFilled: { type: Number, default: 0 },
}, { _id: true });

const programSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, uppercase: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  courseType: { type: String, enum: ['UG', 'PG'], required: true },
  entryType: { type: String, enum: ['Regular', 'Lateral'], required: true },
  admissionMode: { type: String, enum: ['Government', 'Management'], required: true },
  academicYear: { type: String, required: true },
  totalIntake: { type: Number, required: true, min: 1 },
  quotas: [quotaSchema],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Validate quota sum equals totalIntake
programSchema.pre('save', function () {
  const quotaSum = this.quotas.reduce((sum, q) => sum + q.totalSeats, 0);
  if (quotaSum !== this.totalIntake) {
    throw new Error(`Quota seats (${quotaSum}) must equal total intake (${this.totalIntake})`);
  }
});

module.exports = mongoose.model('Program', programSchema);
