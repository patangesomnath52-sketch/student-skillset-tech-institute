const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');

// GET settings (creates default if none exist)
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

// PUT update settings
router.put('/', async (req, res) => {
  try {
    const settings = await SiteSettings.findOneAndUpdate(
      {},
      { ...req.body, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
