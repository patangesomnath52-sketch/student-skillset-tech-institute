const express = require('express');
const router = express.Router();
const multer = require('multer');
const Admission = require('../models/Admission');

// Memory storage for file uploads (if any)
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// POST – JSON registration (no files) OR file upload
router.post('/', (req, res, next) => {
  // If it's JSON, handle immediately
  if (req.is('application/json')) {
    handleJson(req, res);
  } else {
    // Otherwise, use multer for file uploads
    upload.fields([
      { name: 'photo', maxCount: 1 },
      { name: 'aadhaar', maxCount: 1 },
      { name: 'marksheet', maxCount: 1 }
    ])(req, res, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      handleFiles(req, res);
    });
  }
});

async function handleJson(req, res) {
  try {
    const admission = new Admission(req.body);
    await admission.save();
    res.status(201).json({ message: 'Registration submitted successfully!' });
  } catch (err) {
    console.error('JSON save error:', err);
    res.status(500).json({ error: err.message });
  }
}

async function handleFiles(req, res) {
  try {
    const admission = new Admission({
      fullName: req.body.fullName,
      mobile: req.body.mobile,
      email: req.body.email,
      qualification: req.body.qualification,
      course: req.body.course,
      address: req.body.address,
      message: req.body.message,
      photo: req.files['photo']?.[0]?.buffer?.toString('base64') || '',
      aadhaar: req.files['aadhaar']?.[0]?.buffer?.toString('base64') || '',
      marksheet: req.files['marksheet']?.[0]?.buffer?.toString('base64') || '',
    });
    await admission.save();
    res.status(201).json({ message: 'Application submitted successfully!' });
  } catch (err) {
    console.error('File save error:', err);
    res.status(500).json({ error: err.message });
  }
}

// GET, PATCH, DELETE (keep as they were)
router.get('/', async (req, res) => {
  try {
    const { search, status } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    const admissions = await Admission.find(filter).sort({ submittedAt: -1 });
    res.json(admissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(admission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Admission.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
