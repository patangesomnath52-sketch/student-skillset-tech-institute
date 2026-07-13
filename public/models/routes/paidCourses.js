const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const PaidCourse = require('../models/PaidCourse');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Separate storages for thumbnail and video
const thumbnailStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'paid-courses/thumbnails', allowed_formats: ['jpg','jpeg','png'] },
});
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'paid-courses/videos', resource_type: 'video', allowed_formats: ['mp4','webm','mov'] },
});

const upload = multer({
  storage: multer.memoryStorage(), // we'll handle multiple files manually
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB for video
});

// GET all paid courses
router.get('/', async (req, res) => {
  try {
    const courses = await PaidCourse.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new paid course
router.post('/', upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, price, youtubeId, isPublished } = req.body;
    const courseData = { title, description, price, youtubeId, isPublished: isPublished === 'true' };

    // Upload thumbnail if provided
    if (req.files['thumbnail'] && req.files['thumbnail'][0]) {
      const result = await cloudinary.uploader.upload(req.files['thumbnail'][0].path, { folder: 'paid-courses/thumbnails' });
      courseData.thumbnail = result.secure_url;
    }
    // Upload video if provided
    if (req.files['video'] && req.files['video'][0]) {
      const result = await cloudinary.uploader.upload(req.files['video'][0].path, { resource_type: 'video', folder: 'paid-courses/videos' });
      courseData.videoUrl = result.secure_url;
    }

    const course = new PaidCourse(courseData);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update course
router.put('/:id', upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.files['thumbnail'] && req.files['thumbnail'][0]) {
      const result = await cloudinary.uploader.upload(req.files['thumbnail'][0].path, { folder: 'paid-courses/thumbnails' });
      updates.thumbnail = result.secure_url;
    }
    if (req.files['video'] && req.files['video'][0]) {
      const result = await cloudinary.uploader.upload(req.files['video'][0].path, { resource_type: 'video', folder: 'paid-courses/videos' });
      updates.videoUrl = result.secure_url;
    }
    const course = await PaidCourse.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE course
router.delete('/:id', async (req, res) => {
  try {
    await PaidCourse.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;