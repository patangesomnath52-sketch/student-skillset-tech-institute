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

// Routes
const admissionsRouter = require('./routes/admissions');
const coursesRouter = require('./routes/courses');
const galleryRouter = require('./routes/gallery');
const contactRouter = require('./routes/contact');

app.use('/api/admissions', admissionsRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/contact', contactRouter);

// Serve admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});