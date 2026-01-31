const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Password lock karne ke liye
const User = require('../models/user');

// --- SIGNUP ROUTE ---
router.post('/signup', async (req, res) => {
  try {
    const { displayName, email, password } = req.body;

    // 1. Check karo user pehle se toh nahi hai?
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists! 🧐" });

    // 2. Naya User object banao
    user = new User({ displayName, email, password });

    // 3. PASSWORD WALA KAAM (Hashing) 🔐
    const salt = await bcrypt.genSalt(10); // Ek random 'salt' generate karo
    user.password = await bcrypt.hash(password, salt); // Password ko lock kar do

    // 4. Database mein save karo
    await user.save();
    res.status(201).json({ msg: "Account created! Swagat hai MindBridge mein! 🎉" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const jwt = require('jsonwebtoken'); // Token banane ke liye

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check karo user database mein hai?
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User nahi mila! 🧐" });

    // 2. Password match karo (Asli vs Hashed)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Galat password! ❌" });

    // 3. Entry Pass (JWT Token) banao 🎫
    const token = jwt.sign(
      { id: user._id }, 
      'mindbridge_secret_key', // Ye tumhara secret code hai
      { expiresIn: '1d' } // Token 1 din tak valid rahega
    );

    res.json({
      token,
      user: { id: user._id, displayName: user.displayName, email: user.email }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});