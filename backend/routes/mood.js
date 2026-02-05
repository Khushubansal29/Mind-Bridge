const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Mood = require('../models/Mood');

router.post('/add', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const today = new Date().setHours(0, 0, 0, 0);

    await Mood.findOneAndUpdate(
      { user: req.user.id, date: { $gte: today } },
      { status },
      { new: true, upsert: true }
    );

    const moods = await Mood.find({ user: req.user.id }).sort({ date: 1 });

    const moodHistory = moods.map(m => ({
      mood: m.status.split(" ")[0], 
      date: m.date
    }));

    res.json({ msg: "Mood recorded! 🌈", moodHistory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id }).sort({ date: 1 });

    const moodHistory = moods.map(m => ({
      mood: m.status.split(" ")[0],
      date: m.date
    }));

    res.json({ moodHistory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
