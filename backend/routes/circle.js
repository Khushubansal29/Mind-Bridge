const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Circle = require('../models/Circle');

router.post('/create', auth, async (req, res) => {
  try {
    if (!req.body.title || !req.body.description) {
        return res.status(400).json({ msg: "Title and description are required" });
    }

    const creatorId = req.user.id || req.user._id;

    const newCircle = new Circle({
      title: req.body.title,
      description: req.body.description,
      admin: creatorId,
      tags: req.body.tags || ["General"],
      visibility: req.body.visibility || "Public",
      members: [creatorId], 
      posts: [] 
    });

    const savedCircle = await newCircle.save();
    res.status(201).json(savedCircle);
  } catch (err) {
    console.error("Detailed Backend Error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/search', auth, async (req, res) => {
    try {
        const { query, tag } = req.query;
        let filter = {};
        if (query && query.trim() !== "") filter.title = { $regex: query, $options: 'i' };
        if (tag && tag !== 'All') filter.tags = tag;

        const circles = await Circle.find(filter).sort({ createdAt: -1 });
        res.json(circles); 
    } catch (err) {
      console.error("Search Error:", err);
        res.status(500).json([]); 
    }
});

router.post('/:id/post', auth, async (req, res) => {
    try {
        const circle = await Circle.findById(req.params.id);
        if (!circle) return res.status(404).json({ msg: "Not found" });

        if (!circle.posts) circle.posts = []; 

        const isMember = circle.members?.some(m => m.toString() === req.user.id);
        const isAdmin = circle.admin?.toString() === req.user.id;

        if (!isMember && !isAdmin) {
            return res.status(403).json({ msg: "Join first to post!" });
        }

        circle.posts.unshift({
            title: req.body.title,
            body: req.body.body,
            author: req.user.id,
            createdAt: new Date()
        });

        await circle.save();
        res.json(circle.posts);
    } catch (err) {
        console.error("Post Error:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

router.get('/:id/posts', auth, async (req, res) => {
  try {
    const circle = await Circle.findById(req.params.id);
    res.json(circle ? circle.posts : []);
  } catch (err) {
    res.status(500).json([]);
  }
});

module.exports = router;