require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes - load each one carefully
try {
  app.use('/api/admissions', require('./routes/admissions'));
  console.log('Admissions route loaded');
} catch(e) { console.error('Admissions route error:', e.message); }

try {
  app.use('/api/courses', require('./routes/courses'));
  console.log('Courses route loaded');
} catch(e) { console.error('Courses route error:', e.message); }

try {
  app.use('/api/gallery', require('./routes/gallery'));
  console.log('Gallery route loaded');
} catch(e) { console.error('Gallery route error:', e.message); }

try {
  app.use('/api/settings', require('./routes/settings'));
  console.log('Settings route loaded');
} catch(e) { console.error('Settings route error:', e.message); }

try {
  app.use('/api/contact', require('./routes/contact'));
  console.log('Contact route loaded');
} catch(e) { console.error('Contact route error:', e.message); }

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
