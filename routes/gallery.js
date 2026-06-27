const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const GalleryImage = require('../models/GalleryImage');

// Hardcode Cloudinary config as fallback if env vars missing
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'skillsetcloud';
const apiKey = process.env.CLOUDINARY_API_KEY || '415767268281125';
const apiSecret = process.env.CLOUDINARY_API_SECRET || 'c9mPe0A8xTHCPQdQlpvK_DZgclw';

console.log('Gallery route - Cloudinary cloud_name:', cloudName ? 'SET' : 'MISSING');

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'skillset-gallery',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.get('/', async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ uploadedAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }
    const img = new GalleryImage({
      url: req.file.path,
      category: req.body.category || 'General',
    });
    await img.save();
    res.status(201).json(img);
  } catch (err) {
    console.error('Upload error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await GalleryImage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
