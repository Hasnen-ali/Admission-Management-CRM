const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, required: true },
  category: { type: String, enum: ['GM', 'SC', 'ST', 'OBC'], required: true },
  entryType: { type: String, enum: ['Regular', 'Lateral'], required: true },
  quotaType: { type: String, enum: ['KCET', 'COMEDK', 'Management'], required: true },
  marks: { type: Number, required: true, min: 0, max: 100 },
  program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
  academicYear: { type: String, required: true },
  allotmentNumber: { type: String }, // for govt flow
  documentStatus: { type: String, enum: ['Pending', 'Submitted', 'Verified'], default: 'Pending' },
  status: { type: String, enum: ['Applied', 'Allocated', 'Confirmed', 'Rejected'], default: 'Applied' },
}, { timestamps: true });

module.exports = mongoose.model('Applicant', applicantSchema);
