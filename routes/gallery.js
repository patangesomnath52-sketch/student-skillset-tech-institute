const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const GalleryImage = require('../models/GalleryImage');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'skillsetcloud',
  api_key: process.env.CLOUDINARY_API_KEY || '415767268281125',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'c9mPe0A8xTHCPQdQlpvK_DZgclw',
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'skillset-gallery',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// GET all gallery images
router.get('/', async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ uploadedAt: -1 });
    res.json(images);
  } catch (err) {
    console.error('Gallery GET error:', err.message);
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
      url: req.file.path,
      category: req.body.category || 'General',
    });
    await img.save();
    res.status(201).json(img);
  } catch (err) {
    console.error('Gallery POST error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE image
router.delete('/:id', async (req, res) => {
  try {
    await GalleryImage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Gallery DELETE error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
