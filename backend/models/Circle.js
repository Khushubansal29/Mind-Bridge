const mongoose = require('mongoose');

const CircleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tags: [String],
  visibility: { type: String, enum: ['Public', 'Private'], default: 'Public' },
  posts: { type: Array, default: [] }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = Circle = mongoose.model('circle', CircleSchema);