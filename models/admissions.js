const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  qualification: {
    type: String
  },
  course: {
    type: String
  },
  address: {
    type: String
  },
  message: {
    type: String
  },
  photo: {
    type: String   // Cloudinary URL or file path
  },
  aadhaar: {
    type: String
  },
  marksheet: {
    type: String
  },
  status: {
    type: String,
    default: 'pending'   // pending, reviewed, approved
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Admission', admissionSchema);