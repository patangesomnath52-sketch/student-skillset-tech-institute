const mongoose = require('mongoose');
const contactQuerySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  course: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('ContactQuery', contactQuerySchema);
