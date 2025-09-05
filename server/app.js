const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const applicationRoutes = require('./routes/applicationRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/applications', applicationRoutes);

// 404 handler for any unknown API route (must be AFTER all /api routes)
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Serve client static files
app.use(express.static(path.join(__dirname, '../client')));

// Catch-all to serve frontend SPA (index.html)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
