const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Course = require('../models/Course');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'courses', allowed_formats: ['jpg', 'jpeg', 'png'] },
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const course = new Course({
      title: req.body.title,
      slug: req.body.slug,
      duration: req.body.duration,
      description: req.body.description,
      certificate: req.body.certificate === 'true',
      image: req.file ? req.file.path : '',
    });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updates = {
      title: req.body.title,
      slug: req.body.slug,
      duration: req.body.duration,
      description: req.body.description,
      certificate: req.body.certificate === 'true',
    };
    if (req.file) updates.image = req.file.path;
    const course = await Course.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
