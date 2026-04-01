const Program = require('../models/Program');

exports.getAll = async (req, res) => {
  const programs = await Program.find().populate({ path: 'department', populate: { path: 'campus', populate: 'institution' } }).sort('-createdAt');
  res.json(programs);
};

exports.getOne = async (req, res) => {
  const program = await Program.findById(req.params.id).populate('department');
  if (!program) return res.status(404).json({ message: 'Program not found' });
  res.json(program);
};

exports.create = async (req, res) => {
  const program = await Program.create(req.body);
  res.status(201).json(program);
};

exports.update = async (req, res) => {
  // Recalculate quota validation via pre-save hook by using save()
  const program = await Program.findById(req.params.id);
  if (!program) return res.status(404).json({ message: 'Program not found' });
  Object.assign(program, req.body);
  await program.save();
  res.json(program);
};

exports.remove = async (req, res) => {
  const program = await Program.findByIdAndDelete(req.params.id);
  if (!program) return res.status(404).json({ message: 'Program not found' });
  res.json({ message: 'Deleted' });
};

exports.getSeatMatrix = async (req, res) => {
  const programs = await Program.find({ isActive: true }).populate('department');
  const matrix = programs.map((p) => ({
    program: p.name,
    code: p.code,
    totalIntake: p.totalIntake,
    quotas: p.quotas.map((q) => ({
      name: q.name,
      total: q.totalSeats,
      filled: q.filledSeats,
      remaining: q.totalSeats - q.filledSeats,
    })),
  }));
  res.json(matrix);
};
