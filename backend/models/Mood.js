const mongoose = require('mongoose');

const MoodSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  status: { 
    type: String, 
    enum: ['Good Day', 'Neutral Day', 'Bad Day'], 
    required: true 
  },
  date: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('Mood', MoodSchema);