const mongoose = require('mongoose');
const Program = require('../models/Program');
const Admission = require('../models/Admission');
const Applicant = require('../models/Applicant');
const { generateAdmissionNumber } = require('./admissionNumberService');

/**
 * Atomically allocates a seat for an applicant.
 * Uses findOneAndUpdate with $inc to prevent race conditions.
 */
const allocateSeat = async (applicantId, programId, quotaName, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Lock and increment filledSeats atomically only if seats available
    const updated = await Program.findOneAndUpdate(
      {
        _id: programId,
        'quotas.name': quotaName,
        $expr: {
          $lt: [
            { $let: { vars: { q: { $arrayElemAt: [{ $filter: { input: '$quotas', cond: { $eq: ['$$this.name', quotaName] } } }, 0] } }, in: '$$q.filledSeats' } },
            { $let: { vars: { q: { $arrayElemAt: [{ $filter: { input: '$quotas', cond: { $eq: ['$$this.name', quotaName] } } }, 0] } }, in: '$$q.totalSeats' } },
          ],
        },
      },
      { $inc: { 'quotas.$.filledSeats': 1 } },
      { new: true, session }
    );

    if (!updated) {
      await session.abortTransaction();
      return { success: false, message: `No seats available in quota: ${quotaName}` };
    }

    const admissionNumber = await generateAdmissionNumber(programId, quotaName, updated.academicYear);

    const admission = await Admission.create([{
      admissionNumber,
      applicant: applicantId,
      program: programId,
      quotaName,
      academicYear: updated.academicYear,
      allocatedBy: userId,
    }], { session });

    await Applicant.findByIdAndUpdate(applicantId, { status: 'Allocated' }, { session });

    await session.commitTransaction();
    return { success: true, admission: admission[0] };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

module.exports = { allocateSeat };
