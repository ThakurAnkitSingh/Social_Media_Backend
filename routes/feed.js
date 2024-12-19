const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req?.params?.userId);

    const friendPosts = await Post.find({ userId: { $in: user?.friends } });
    const commentedPosts = await Post.find({ "comments.userId": { $in: user?.friends } });

    [...friendPosts, ...commentedPosts].sort((a, b) => b.createdAt - a.createdAt);


    res.json(feed);
  } catch (err) {
    console.log(err)
  }
});

module.exports = router;