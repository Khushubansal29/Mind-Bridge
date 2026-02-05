const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Journal = require('../models/Journal');

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

router.get('/my-journals', auth, async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user }).sort({ date: -1 });
    res.json(journals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;