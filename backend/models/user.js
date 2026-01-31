const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Unique Username ya Display Name [cite: 39, 42]
  displayName: { 
    type: String, 
    required: true 
  },
  // Login ke liye unique email 
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  // Password (jise hum baad mein hash karenge) 
  password: { 
    type: String, 
    required: true 
  },
  // User ki choti si description [cite: 43]
  bio: { 
    type: String, 
    default: "" 
  },
  // Profile picture ka URL ya default avatar [cite: 40]
  profilePicture: { 
    type: String, 
    default: "default-avatar.png" 
  },
  // Interests jaise anxiety, productivity, mindfulness [cite: 45]
  interests: {
    type: [String],
    default: []
  }
}, { timestamps: true }); // Isse pata chalega account kab bana

module.exports = mongoose.model('User', UserSchema);