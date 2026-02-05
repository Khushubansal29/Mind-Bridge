const mongoose = require('mongoose');

const JournalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true }, 
  body: { type: String, required: true }, 
  visibility: { 
    type: String, 
    enum: ['Private', 'Shared to Circles', 'Public'], 
    default: 'Private' 
  },
  date: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('Journal', JournalSchema);