const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  qualification: String,
  course: String,
  address: String,
  message: String,
  photo: String,
  aadhaar: String,
  marksheet: String,
  status: { type: String, default: 'pending' },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admission', admissionSchema);