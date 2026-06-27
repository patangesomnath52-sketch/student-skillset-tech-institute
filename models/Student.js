const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  qualification: String,
  address: String,
  photo: String,
  enrolledCourses: [{
    courseId: String,
    courseName: String,
    enrolledAt: { type: Date, default: Date.now },
    status: { type: String, default: 'active' }
  }],
  attendance: { type: Number, default: 0 },
  certificates: [{
    name: String,
    url: String,
    issuedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);
