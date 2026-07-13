const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const SiteSettings = require('../models/SiteSettings');

// Configure Cloudinary (fallback to hardcoded values if env vars missing)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'skillsetcloud',
  api_key: process.env.CLOUDINARY_API_KEY || '415767268281125',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'c9mPe0A8xTHCPQdQlpvK_DZgclw',
});

// Storage for video (and optionally other files)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'skillset-videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'webm', 'mov'],
  },
});
const upload = multer({ storage, limits: { fileSize: 200 * 1024 * 1024 } }); // 200 MB limit

// GET settings
router.get('/', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT settings – smart handling of JSON vs file upload
router.put('/', (req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    // Use multer for file uploads
    upload.single('demoVideo')(req, res, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      next();
    });
  } else {
    // JSON request, no file
    next();
  }
}, async (req, res) => {
  try {
    const updates = { ...req.body, updatedAt: new Date() };

    // If a video file was uploaded, store its Cloudinary URL
    if (req.file) {
      updates.demoVideoUrl = req.file.path;
    }

    const settings = await SiteSettings.findOneAndUpdate({}, updates, { new: true, upsert: true });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;