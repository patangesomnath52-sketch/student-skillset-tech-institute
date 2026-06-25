const mongoose = require('mongoose');
const galleryImageSchema = new mongoose.Schema({
  url: String,
  category: String,
  uploadedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('GalleryImage', galleryImageSchema);
