const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Admission = require('../models/Admission');

// Cloudinary config (values come from .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'student-skillset',   // folder name in Cloudinary
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
      photo: req.files['photo']?.[0]?.path,
      aadhaar: req.files['aadhaar']?.[0]?.path,
      marksheet: req.files['marksheet']?.[0]?.path,
    });
    await admission.save();
    res.status(201).json({ message: 'Application submitted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET, PATCH, DELETE routes remain the same
router.get('/', async (req, res) => { /* … */ });
router.patch('/:id', async (req, res) => { /* … */ });
router.delete('/:id', async (req, res) => { /* … */ });

module.exports = router;