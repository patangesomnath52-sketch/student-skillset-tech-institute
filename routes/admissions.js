const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Admission = require('../models/Admission');

// Cloudinary config (values come from environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'student-skillset',          // Cloudinary folder name
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// POST – submit admission
router.post('/', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'aadhaar', maxCount: 1 },
  { name: 'marksheet', maxCount: 1 }
]), async (req, res) => {
  try {
    const admission = new Admission({
      fullName: req.body.fullName,
      mobile: req.body.mobile,
      email: req.body.email,
      qualification: req.body.qualification,
      course: req.body.course,
      address: req.body.address,
      message: req.body.message,
      photo: req.files['photo']?.[0]?.path,        // Cloudinary URL
      aadhaar: req.files['aadhaar']?.[0]?.path,
      marksheet: req.files['marksheet']?.[0]?.path,
    });
    await admission.save();
    res.status(201).json({ message: 'Application submitted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET – all admissions (with search & status filter)
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

// PATCH – update status
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

// DELETE – remove admission
router.delete('/:id', async (req, res) => {
  try {
    await Admission.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Add this to routes/admissions.js
router.get('/student', async (req, res) => {
  try {
    const student = await Admission.findOne({ email: req.query.email });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch student data" });
  }
});
module.exports = router;