const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const GalleryImage = require('../models/GalleryImage');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Log Cloudinary config status (for debugging)
console.log('Cloudinary configured:', !!process.env.CLOUDINARY_CLOUD_NAME);

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'skillset-gallery',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// GET all images
router.get('/', async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ uploadedAt: -1 });
    res.json(images);
  } catch (err) {
    console.error('GET /api/gallery error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST upload image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    const img = new GalleryImage({
      url: req.file.path, // Cloudinary URL
      category: req.body.category || 'General',
    });
    await img.save();
    res.status(201).json(img);
  } catch (err) {
    console.error('POST /api/gallery error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE image
router.delete('/:id', async (req, res) => {
  try {
    await GalleryImage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('DELETE /api/gallery error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
