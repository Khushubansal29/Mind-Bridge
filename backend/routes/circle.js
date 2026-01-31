const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Circle = require('../models/Circle');

// 1. Naya Circle banana (Essential Feature 3a)
router.post('/create', auth, async (req, res) => {
  try {
    const { title, description, tags, visibility } = req.body;
    const newCircle = new Circle({
      title,
      description,
      tags,
      visibility,
      admin: req.user,
      members: [req.user] // Creator khud member ban jata hai
    });
    await newCircle.save();
    res.json({ msg: "Circle created! 🏛️", circle: newCircle });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Circle Join karna (Essential Feature 3a)
router.post('/join/:id', auth, async (req, res) => {
  try {
    const circle = await Circle.findById(req.params.id);
    if (!circle) return res.status(404).json({ msg: "Circle nahi mila!" });

    if (circle.visibility === 'Public') {
      circle.members.push(req.user);
      await circle.save();
      res.json({ msg: "Joined successfully! ✅" });
    } else {
      circle.pendingRequests.push(req.user);
      await circle.save();
      res.json({ msg: "Join request sent to admin! ⏳" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const Post = require('../models/Post');

// Circle ke andar Post banana
router.post('/:id/post', auth, async (req, res) => {
  try {
    const newPost = new Post({
      circle: req.params.id,
      author: req.user,
      title: req.body.title,
      body: req.body.body
    });
    await newPost.save();
    res.json({ msg: "Post created in circle! 📝", post: newPost });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Circle ka poora Feed dekhna (All posts)
router.get('/:id/posts', auth, async (req, res) => {
  try {
    const posts = await Post.find({ circle: req.params.id }).populate('author', 'displayName');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Search Circles by Tag (Essential Feature 6)
router.get('/search', async (req, res) => {
  try {
    const { tag } = req.query; // URL se tag pakdo
    let circles;
    
    if (tag) {
      // Agar tag diya hai toh wahi filter karo
      circles = await Circle.find({ tags: tag });
    } else {
      // Nahi toh saare dikha do
      circles = await Circle.find();
    }
    
    res.json(circles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});