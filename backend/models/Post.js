const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    circle: { type: mongoose.Schema.Types.ObjectId, ref: 'Circle', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true }, 
    body: { type: String, required: true },  
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);