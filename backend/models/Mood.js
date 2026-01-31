const mongoose = require('mongoose');

const MoodSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User se link karne ke liye
  status: { 
    type: String, 
    enum: ['Good Day', 'Neutral Day', 'Bad Day'], // Sirf yahi 3 options allow honge 
    required: true 
  },
  date: { type: Date, default: Date.now } // Aaj ki date
});

module.exports = mongoose.model('Mood', MoodSchema);