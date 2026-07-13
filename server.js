// 1. Environment variables
require('dotenv').config();

// 2. Dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// 3. App setup
const app = express();
const PORT = process.env.PORT || 5000;

// 4. Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 5. Firebase Admin (optional – if credentials exist)
try {
  const admin = require('firebase-admin');
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    });
    console.log('Firebase Admin initialized');
  } else {
    console.log('FIREBASE_SERVICE_ACCOUNT not set – skipping Firebase initialization');
  }
} catch (e) {
  console.log('Firebase Admin not available:', e.message);
}

// 6. Routes – each loaded safely so a missing file won't crash the server
try {
  app.use('/api/admissions', require('./routes/admissions'));
  console.log('Admissions route loaded');
} catch (e) { console.error('Admissions route error:', e.message); }

try {
  app.use('/api/courses', require('./routes/courses'));
  console.log('Courses route loaded');
} catch (e) { console.error('Courses route error:', e.message); }

try {
  app.use('/api/paid-courses', require('./routes/paidCourses'));
  console.log('Paid Courses route loaded');
} catch (e) { console.error('Paid Courses route error:', e.message); }
try {
  app.use('/api/settings', require('./routes/settings'));
  console.log('Settings route loaded');
} catch (e) { console.error('Settings route error:', e.message); }
try {
  app.use('/api/gallery', require('./routes/gallery'));
  console.log('Gallery route loaded');
} catch (e) { console.error('Gallery route error:', e.message); }

try {
  app.use('/api/settings', require('./routes/settings'));
  console.log('Settings route loaded');
} catch (e) { console.error('Settings route error:', e.message); }

try {
  app.use('/api/contact', require('./routes/contact'));
  console.log('Contact route loaded');
} catch (e) { console.error('Contact route error:', e.message); }

try {
  app.use('/api/student', require('./routes/student'));
  console.log('Student route loaded');
} catch (e) { console.error('Student route error:', e.message); }

// 7. MongoDB connection + start server
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://sailesh_magre:sailesh123@cluster0.wannuem.mongodb.net/skillset?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });