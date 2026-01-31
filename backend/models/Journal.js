const mongoose = require('mongoose');

const JournalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true }, // Entry ka title [cite: 97]
  body: { type: String, required: true }, // Ismein user markdown ya plain text likhega [cite: 98]
  visibility: { 
    type: String, 
    enum: ['Private', 'Shared to Circles', 'Public'], // Assignment requirements [cite: 100]
    default: 'Private' 
  },
  date: { type: Date, default: Date.now } // Auto-filled date [cite: 99]
});

module.exports = mongoose.model('Journal', JournalSchema);