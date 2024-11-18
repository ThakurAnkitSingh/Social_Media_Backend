const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Send Friend Request
router.post('/request', authMiddleware, async (req, res) => {
  const { toUserId } = req.body;
  const fromUserId = req.user.id;

  try {
    const toUser = await User.findById(toUserId);
    const fromUser = await User.findById(fromUserId);

    if (!toUser || !fromUser) return res.status(404).json({ message: 'User not found' });

    if (!toUser.friendRequests.received.includes(fromUserId)) {
      toUser.friendRequests.received.push(fromUserId);
      fromUser.friendRequests.sent.push(toUserId);

      await toUser.save();
      await fromUser.save();
    }

    res.json({ message: 'Friend request sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;