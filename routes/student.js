const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const Student = require('../models/Student');

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

// GET student profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    let student = await Student.findOne({ uid: req.user.uid });
    if (!student) {
      student = new Student({
        uid: req.user.uid,
        fullName: req.user.name || 'Student',
        email: req.user.email
      });
      await student.save();
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { uid: req.user.uid },
      req.body,
      { new: true }
    );
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET enrollments
router.get('/enrollments', verifyToken, async (req, res) => {
  try {
    const student = await Student.findOne({ uid: req.user.uid });
    res.json(student ? student.enrolledCourses : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
