const express = require('express');
const router = express.Router();
const ContactQuery = require('../models/ContactQuery');

router.post('/', async (req, res) => {
  try {
    const query = new ContactQuery(req.body);
    await query.save();
    res.status(201).json({ message: 'Message received!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;