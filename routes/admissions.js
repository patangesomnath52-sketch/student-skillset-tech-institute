const express = require('express');
const router = express.Router();
const multer = require('multer');
const Admission = require('../models/Admission');

// Use memory storage - no disk writing needed
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// POST - Handle file uploads
router.post('/', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'aadhaar', maxCount: 1 },
  { name: 'marksheet', maxCount: 1 }
]), async (req, res) => {
  try {
    // Convert uploaded files to base64 strings
    const photo = req.files['photo']?.[0] 
      ? `data:${req.files['photo'][0].mimetype};base64,${req.files['photo'][0].buffer.toString('base64')}` 
      : '';
    const aadhaar = req.files['aadhaar']?.[0] 
      ? `data:${req.files['aadhaar'][0].mimetype};base64,${req.files['aadhaar'][0].buffer.toString('base64')}` 
      : '';
    const marksheet = req.files['marksheet']?.[0] 
      ? `data:${req.files['marksheet'][0].mimetype};base64,${req.files['marksheet'][0].buffer.toString('base64')}` 
      : '';
    
    const admission = new Admission({
      fullName: req.body.fullName,
      mobile: req.body.mobile,
      email: req.body.email,
      qualification: req.body.qualification,
      course: req.body.course,
      address: req.body.address,
      photo,
      aadhaar,
      marksheet,
      status: 'pending',
      submittedAt: new Date()
    });
    
    await admission.save();
    res.status(201).json({ message: 'Application submitted successfully!' });
  } catch (err) {
    console.error('Admission POST error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET all admissions
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

// PATCH - Update status
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

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Admission.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
