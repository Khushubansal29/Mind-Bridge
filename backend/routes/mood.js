const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Mood = require('../models/Mood');

// MOOD SAVE KARNE KA ROUTE
router.post('/add', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    // Check karo aaj ki entry pehle se toh nahi hai? [cite: 85]
    const today = new Date().setHours(0,0,0,0);
    const existingMood = await Mood.findOne({ 
        user: req.user, 
        date: { $gte: today } 
    });

    if (existingMood) return res.status(400).json({ msg: "Aaj ka mood pehle hi set hai! 😊" });

    const newMood = new Mood({ user: req.user, status });
    await newMood.save();
    res.json({ msg: "Mood recorded! 🌈" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;