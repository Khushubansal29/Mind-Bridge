const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Journal = require('../models/Journal');

// Nayi Journal Entry add karne ke liye
router.post('/add', auth, async (req, res) => {
  try {
    const { title, body, visibility } = req.body;
    
    const newJournal = new Journal({
      user: req.user,
      title,
      body,
      visibility
    });

    await newJournal.save();
    res.json({ msg: "Journal entry saved! 📓✨", journal: newJournal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User ke apne saare journals dekhne ke liye (Quick access to Journals [cite: 53])
router.get('/my-journals', auth, async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user }).sort({ date: -1 });
    res.json(journals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;