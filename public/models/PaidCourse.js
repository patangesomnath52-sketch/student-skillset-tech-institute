const mongoose = require('mongoose');

const paidCourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  thumbnail: { type: String, default: '' },       // Cloudinary URL for image
  videoUrl: { type: String, default: '' },        // Cloudinary URL for video
  youtubeId: { type: String, default: '' },       // YouTube fallback
  isPublished: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PaidCourse', paidCourseSchema);