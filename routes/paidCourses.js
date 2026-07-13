const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const PaidCourse = require('../models/PaidCourse');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'skillsetcloud',
  api_key: process.env.CLOUDINARY_API_KEY || '415767268281125',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'c9mPe0A8xTHCPQdQlpvK_DZgclw',
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'paid-courses', allowed_formats: ['jpg','jpeg','png','mp4','webm','mov'] },
});
const upload = multer({ storage, limits: { fileSize: 500 * 1024 * 1024 } });

router.get('/', async (req, res) => {
  try {
    const courses = await PaidCourse.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', upload.fields([{ name: 'thumbnail', maxCount:1 }, { name: 'video', maxCount:1 }]), async (req, res) => {
  try {
    const courseData = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      youtubeId: req.body.youtubeId,
      isPublished: req.body.isPublished === 'true'
    };
    if (req.files['thumbnail']?.[0]) courseData.thumbnail = req.files['thumbnail'][0].path;
    if (req.files['video']?.[0]) courseData.videoUrl = req.files['video'][0].path;
    const course = new PaidCourse(courseData);
    await course.save();
    res.status(201).json(course);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', upload.fields([{ name: 'thumbnail', maxCount:1 }, { name: 'video', maxCount:1 }]), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.files['thumbnail']?.[0]) updates.thumbnail = req.files['thumbnail'][0].path;
    if (req.files['video']?.[0]) updates.videoUrl = req.files['video'][0].path;
    const course = await PaidCourse.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(course);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await PaidCourse.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
