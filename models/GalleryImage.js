const mongoose = require('mongoose');
const galleryImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  category: { type: String, default: 'General' },
  uploadedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('GalleryImage', galleryImageSchema);
