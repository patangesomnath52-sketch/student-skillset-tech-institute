const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  course: { type: String, required: true },
  address: String,
  message: String,
  // Store the filenames returned by Multer
  photo: String,
  aadhaar: String,
  marksheet: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admission', admissionSchema);