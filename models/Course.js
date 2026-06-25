const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
  title: String,
  slug: String,
  duration: String,
  description: String,
  image: String,
  certificate: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Course', courseSchema);
