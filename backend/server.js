require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

connectDB();

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/masters', require('./routes/masterRoutes'));
app.use('/api/programs', require('./routes/programRoutes'));
app.use('/api/applicants', require('./routes/applicantRoutes'));
app.use('/api/admissions', require('./routes/admissionRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
