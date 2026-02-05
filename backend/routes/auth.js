const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const User = require('../models/user');
const auth = require('../middleware/authMiddleware');

router.post('/signup', async (req, res) => {
  try {
    const { displayName, email, password, interests } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists! 🧐" });

    user = new User({ displayName, email, password, interests: interests || [] });

    const salt = await bcrypt.genSalt(10); 
    user.password = await bcrypt.hash(password, salt); 

    await user.save();
    res.status(201).json({ msg: "Account created! Welcome to MindBridge! 🎉" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found! 🧐" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Wrong password! ❌" });

    const secret = process.env.JWT_SECRET || 'mindbridge_secret_key';

    const token = jwt.sign(
        { id: user._id }, 
        secret, 
        { expiresIn: '1d' }
    );

    res.json({
      token,
      user: { 
        id: user._id, 
        displayName: user.displayName, 
        email: user.email, 
        interests: user.interests 
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user); 
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

router.post('/update-mood', auth, async (req, res) => {
    try {
        const { mood } = req.body;
        const user = await User.findById(req.user.id);

        const today = new Date().toDateString();

        const existingIndex = user.moodHistory.findIndex(m => 
            new Date(m.date).toDateString() === today
        );

        if (existingIndex > -1) {
            user.moodHistory[existingIndex].mood = mood;
            user.moodHistory[existingIndex].date = new Date(); 
            user.markModified('moodHistory');
        
        } else {
            user.moodHistory.push({ mood, date: new Date() });
        }    

        await user.save();
        res.json({ msg: "Mood updated!", moodHistory: user.moodHistory });
    } catch (err) {
        console.error("Backend Error:", err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/save-journal', auth, async (req, res) => {
    try {
        const { title, content, visibility } = req.body; 
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ msg: "User not found" });

        user.journalEntries.push({ 
            title: title || "Untitled", 
            content: content, 
            visibility: visibility || "Private" 
        });
        
        await user.save();
        res.status(200).json({ msg: "Journal entry saved! 📖" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.put('/update-profile', auth, async (req, res) => {
    try {
        const { displayName, bio, interests, profilePic } = req.body;
        
        const user = await User.findById(req.user.id);
        
        if (displayName) user.displayName = displayName;
        if (bio) user.bio = bio;
        if (interests) user.interests = interests;
        if (profilePic) user.profilePic = profilePic;

        await user.save();
        res.json({ msg: "Profile updated! ✨", profilePic: user.profilePic });
    } catch (err) {
        console.error("Error updating profile:", err.message);
        res.status(500).json({ error: "Server error during update" });
    }
});

router.get('/public-journals', async (req, res) => {
    try {
        const allUsers = await User.find({}, 'displayName journalEntries');
        let publicEntries = [];

        allUsers.forEach(user => {
            const userPublicJournals = user.journalEntries
                .filter(entry => entry.visibility === 'Public')
                .map(entry => ({
                    ...entry._doc,
                    author: user.displayName 
                }));
            publicEntries.push(...userPublicJournals);
        });

        publicEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json(publicEntries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;