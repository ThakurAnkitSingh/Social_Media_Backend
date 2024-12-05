const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req?.params?.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const friendPosts = await Post.find({ userId: { $in: user?.friends } });
    const commentedPosts = await Post.find({ "comments.userId": { $in: user?.friends } });

    const feed = [...friendPosts, ...commentedPosts].sort((a, b) => b.createdAt - a.createdAt);

    console.log(feed, "All about feed details");

    res.json(feed);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;