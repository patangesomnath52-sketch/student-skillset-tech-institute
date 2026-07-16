const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const Admission = require('../models/Admission');

// Middleware to verify Firebase token
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const token = await admin.auth().verifyIdToken(authHeader.split(' ')[1]);
    req.user = token;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// GET student profile (enrollments)
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const admissions = await Admission.find({ email: req.user.email });
    const enrollments = admissions.map(a => ({
      courseTitle: a.course,
      status: a.status || 'pending',
      submittedAt: a.submittedAt
    }));
    res.json({ email: req.user.email, name: req.user.name, enrollments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;