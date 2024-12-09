const express = require('express');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Create Post
router.post('/', authMiddleware, async (req, res) => {
  const { content } = req.body;
  try {
    const post = new Post({ userId: req.user.id, content });
    await post.save();
    // res.json({ message: 'Post created successfully' });
  } catch (err) {
    // res.status(500).json({ message: err.message });
  }
});

// Add Comment
router.post('/:postId/comments', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ userId: req.user.id, content });
    await post.save();
    res.json({ message: 'Comment added successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;