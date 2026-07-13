const mongoose = require('mongoose');
const siteSettingsSchema = new mongoose.Schema({
  heroTitle: { type: String, default: 'Student Skillset Computer Academy' },
  heroSubtitle: { type: String, default: 'Learn. Build. Grow.' },
  heroDescription: { type: String, default: 'Practical Computer Education for Career Success' },
  studentsTrained: { type: Number, default: 1200 },
  certificatesIssued: { type: Number, default: 800 },
  projectsCompleted: { type: Number, default: 350 },
  vision: { type: String, default: 'To empower every student with digital skills for the future.' },
  mission: { type: String, default: 'Affordable, practical training that leads to employment.' },
  facilities: { type: String, default: 'Modern Computer Lab with high-speed internet, latest software, and air-conditioned classrooms.' },
  address: { type: String, default: '123, Skillset Marg, Near Tech Park, Mumbai – 400001' },
  phone: { type: String, default: '+91 98765 43210' },
  email: { type: String, default: 'info@studentskillset.com' },
  whatsapp: { type: String, default: '919876543210' },
  officeHours: { type: String, default: 'Mon–Sat: 8:00 AM – 8:00 PM' },
  googleMapsEmbed: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
