const Admission = require('../models/Admission');
const Program = require('../models/Program');
const Department = require('../models/Department');

/**
 * Generates admission number in format:
 * INST/{YEAR}/{COURSE_TYPE}/{BRANCH_CODE}/{QUOTA}/{RUNNING_NUMBER}
 * e.g. INST/2026/UG/CSE/KCET/0001
 */
const generateAdmissionNumber = async (programId, quotaName, academicYear) => {
  const program = await Program.findById(programId).populate('department');
  if (!program) throw new Error('Program not found');

  const year = academicYear.split('-')[0]; // "2025-26" -> "2025"
  const courseType = program.courseType;   // UG / PG
  const branchCode = program.code;         // CSE, ECE etc.
  const quota = quotaName.toUpperCase();

  // Count existing admissions for this combination to get running number
  const prefix = `INST/${year}/${courseType}/${branchCode}/${quota}/`;
  const count = await Admission.countDocuments({
    admissionNumber: { $regex: `^${prefix}` },
  });

  const running = String(count + 1).padStart(4, '0');
  return `${prefix}${running}`;
};

module.exports = { generateAdmissionNumber };
