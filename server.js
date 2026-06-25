require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const app = express();
const PORT = process.env.PORT || 5000;
const contactRouter = require('./routes/contact');
app.use('/api/contact', contactRouter);
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Important for form data

// Serve static frontend files
app.use(express.static('public'));

// Serve uploaded files publicly
app.use('/uploads', express.static(uploadDir));

// Routes
// Note: Ensure your './routes/admissions' file uses multer as shown previously
const admissionsRouter = require('./routes/admissions');
app.use('/api/admissions', admissionsRouter);

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillset')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Fallback for SPA (if using React/Vue/etc, otherwise remove)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});