const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Admission = require('../models/Admission');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

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
      marksheet: req.files['marksheet']?.[0]?.path
    });
    await admission.save();
    res.status(201).json({ message: 'Application submitted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
    const admission = await Admission.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
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
