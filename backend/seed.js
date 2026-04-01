require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const User = require('./models/User');
const Institution = require('./models/Institution');
const Campus = require('./models/Campus');
const Department = require('./models/Department');
const Program = require('./models/Program');
const AcademicYear = require('./models/AcademicYear');
const Applicant = require('./models/Applicant');
const Admission = require('./models/Admission');

const seed = async () => {
  await connectDB();

  // Clear all
  await Promise.all([
    User.deleteMany({}),
    Institution.deleteMany({}),
    Campus.deleteMany({}),
    Department.deleteMany({}),
    Program.deleteMany({}),
    AcademicYear.deleteMany({}),
    Applicant.deleteMany({}),
    Admission.deleteMany({}),
  ]);

  // Users
  const users = await User.create([
    { name: 'Admin User', email: 'admin@crm.com', password: 'admin123', role: 'admin' },
    { name: 'Admission Officer', email: 'officer@crm.com', password: 'officer123', role: 'admission_officer' },
    { name: 'Management User', email: 'mgmt@crm.com', password: 'mgmt123', role: 'management' },
  ]);

  // Academic Years
  const years = await AcademicYear.create([
    { year: '2024-25', isActive: false },
    { year: '2025-26', isActive: true },
  ]);

  // Institution
  const institution = await Institution.create({
    name: 'RV Institute of Technology',
    code: 'RVIT',
    address: '123 College Road, Bangalore - 560059',
    phone: '080-12345678',
    email: 'info@rvit.edu.in',
  });

  // Campus
  const campus = await Campus.create({
    name: 'Main Campus',
    code: 'MAIN',
    institution: institution._id,
    address: '123 College Road, Bangalore',
  });

  // Departments
  const [csDept, ecDept, meDept] = await Department.create([
    { name: 'Computer Science', code: 'CS', campus: campus._id },
    { name: 'Electronics & Communication', code: 'EC', campus: campus._id },
    { name: 'Mechanical Engineering', code: 'ME', campus: campus._id },
  ]);

  // Programs
  const [cse, ece, mech] = await Program.create([
    {
      name: 'Computer Science & Engineering',
      code: 'CSE',
      department: csDept._id,
      courseType: 'UG',
      entryType: 'Regular',
      admissionMode: 'Government',
      academicYear: '2025-26',
      totalIntake: 60,
      quotas: [
        { name: 'KCET', totalSeats: 30, filledSeats: 18 },
        { name: 'COMEDK', totalSeats: 20, filledSeats: 12 },
        { name: 'Management', totalSeats: 10, filledSeats: 5 },
      ],
    },
    {
      name: 'Electronics & Communication Engineering',
      code: 'ECE',
      department: ecDept._id,
      courseType: 'UG',
      entryType: 'Regular',
      admissionMode: 'Government',
      academicYear: '2025-26',
      totalIntake: 60,
      quotas: [
        { name: 'KCET', totalSeats: 30, filledSeats: 10 },
        { name: 'COMEDK', totalSeats: 20, filledSeats: 8 },
        { name: 'Management', totalSeats: 10, filledSeats: 3 },
      ],
    },
    {
      name: 'Mechanical Engineering',
      code: 'MECH',
      department: meDept._id,
      courseType: 'UG',
      entryType: 'Regular',
      admissionMode: 'Government',
      academicYear: '2025-26',
      totalIntake: 40,
      quotas: [
        { name: 'KCET', totalSeats: 20, filledSeats: 6 },
        { name: 'COMEDK', totalSeats: 12, filledSeats: 4 },
        { name: 'Management', totalSeats: 8, filledSeats: 2 },
      ],
    },
  ]);

  // Applicants
  const applicants = await Applicant.create([
    { name: 'Rahul Sharma', email: 'rahul@gmail.com', phone: '9876543210', category: 'GM', entryType: 'Regular', quotaType: 'KCET', marks: 92.5, program: cse._id, academicYear: '2025-26', allotmentNumber: 'KCET2025001', documentStatus: 'Verified', status: 'Confirmed' },
    { name: 'Priya Nair', email: 'priya@gmail.com', phone: '9876543211', category: 'SC', entryType: 'Regular', quotaType: 'KCET', marks: 88.0, program: cse._id, academicYear: '2025-26', allotmentNumber: 'KCET2025002', documentStatus: 'Verified', status: 'Confirmed' },
    { name: 'Arjun Reddy', email: 'arjun@gmail.com', phone: '9876543212', category: 'GM', entryType: 'Regular', quotaType: 'COMEDK', marks: 85.5, program: cse._id, academicYear: '2025-26', documentStatus: 'Submitted', status: 'Allocated' },
    { name: 'Sneha Patel', email: 'sneha@gmail.com', phone: '9876543213', category: 'OBC', entryType: 'Regular', quotaType: 'Management', marks: 78.0, program: cse._id, academicYear: '2025-26', documentStatus: 'Pending', status: 'Allocated' },
    { name: 'Vikram Singh', email: 'vikram@gmail.com', phone: '9876543214', category: 'GM', entryType: 'Regular', quotaType: 'KCET', marks: 91.0, program: ece._id, academicYear: '2025-26', allotmentNumber: 'KCET2025010', documentStatus: 'Verified', status: 'Confirmed' },
    { name: 'Ananya Krishnan', email: 'ananya@gmail.com', phone: '9876543215', category: 'ST', entryType: 'Regular', quotaType: 'KCET', marks: 83.5, program: ece._id, academicYear: '2025-26', allotmentNumber: 'KCET2025011', documentStatus: 'Submitted', status: 'Allocated' },
    { name: 'Rohan Mehta', email: 'rohan@gmail.com', phone: '9876543216', category: 'GM', entryType: 'Regular', quotaType: 'COMEDK', marks: 79.0, program: mech._id, academicYear: '2025-26', documentStatus: 'Pending', status: 'Applied' },
    { name: 'Divya Rao', email: 'divya@gmail.com', phone: '9876543217', category: 'SC', entryType: 'Lateral', quotaType: 'Management', marks: 75.5, program: mech._id, academicYear: '2025-26', documentStatus: 'Pending', status: 'Applied' },
    { name: 'Karthik Iyer', email: 'karthik@gmail.com', phone: '9876543218', category: 'GM', entryType: 'Regular', quotaType: 'KCET', marks: 94.0, program: cse._id, academicYear: '2025-26', allotmentNumber: 'KCET2025020', documentStatus: 'Pending', status: 'Applied' },
    { name: 'Meera Joshi', email: 'meera@gmail.com', phone: '9876543219', category: 'OBC', entryType: 'Regular', quotaType: 'COMEDK', marks: 81.0, program: ece._id, academicYear: '2025-26', documentStatus: 'Submitted', status: 'Applied' },
  ]);

  // Admissions for confirmed/allocated applicants
  await Admission.create([
    {
      admissionNumber: 'INST/2025/UG/CSE/KCET/0001',
      applicant: applicants[0]._id,
      program: cse._id,
      quotaName: 'KCET',
      academicYear: '2025-26',
      feeStatus: 'Paid',
      isConfirmed: true,
      allocatedBy: users[1]._id,
      confirmedAt: new Date(),
    },
    {
      admissionNumber: 'INST/2025/UG/CSE/KCET/0002',
      applicant: applicants[1]._id,
      program: cse._id,
      quotaName: 'KCET',
      academicYear: '2025-26',
      feeStatus: 'Paid',
      isConfirmed: true,
      allocatedBy: users[1]._id,
      confirmedAt: new Date(),
    },
    {
      admissionNumber: 'INST/2025/UG/CSE/COMEDK/0001',
      applicant: applicants[2]._id,
      program: cse._id,
      quotaName: 'COMEDK',
      academicYear: '2025-26',
      feeStatus: 'Pending',
      isConfirmed: false,
      allocatedBy: users[1]._id,
    },
    {
      admissionNumber: 'INST/2025/UG/CSE/Management/0001',
      applicant: applicants[3]._id,
      program: cse._id,
      quotaName: 'Management',
      academicYear: '2025-26',
      feeStatus: 'Pending',
      isConfirmed: false,
      allocatedBy: users[1]._id,
    },
    {
      admissionNumber: 'INST/2025/UG/ECE/KCET/0001',
      applicant: applicants[4]._id,
      program: ece._id,
      quotaName: 'KCET',
      academicYear: '2025-26',
      feeStatus: 'Paid',
      isConfirmed: true,
      allocatedBy: users[1]._id,
      confirmedAt: new Date(),
    },
    {
      admissionNumber: 'INST/2025/UG/ECE/KCET/0002',
      applicant: applicants[5]._id,
      program: ece._id,
      quotaName: 'KCET',
      academicYear: '2025-26',
      feeStatus: 'Pending',
      isConfirmed: false,
      allocatedBy: users[1]._id,
    },
  ]);

  console.log('\n✅ Seed complete!\n');
  console.log('👤 Login Credentials:');
  console.log('   Admin          → admin@crm.com     / admin123');
  console.log('   Officer        → officer@crm.com   / officer123');
  console.log('   Management     → mgmt@crm.com      / mgmt123');
  console.log('\n📊 Seeded Data:');
  console.log('   1 Institution, 1 Campus, 3 Departments');
  console.log('   3 Programs (CSE 60, ECE 60, MECH 40 seats)');
  console.log('   10 Applicants, 6 Admissions');
  process.exit(0);
};

seed().catch((e) => { console.error(e); process.exit(1); });
