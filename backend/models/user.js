const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: "" },
  profilePic: { type: String, default: "" }, 
  interests: { type: [String], default: [] },
  moodHistory: [{
    mood: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }],
  journalEntries: [{
    title: { type: String, required: true },
    content: { type: String, required: true },
    visibility: { type: String, enum: ['Private', 'Public'], default: 'Private' },
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);