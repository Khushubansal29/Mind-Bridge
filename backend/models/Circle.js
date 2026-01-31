const mongoose = require('mongoose');

const CircleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [String], // Jaise ['anxiety', 'productivity']
  visibility: { 
    type: String, 
    enum: ['Public', 'Private'], 
    default: 'Public' 
  },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Circle creator
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Circle', CircleSchema);