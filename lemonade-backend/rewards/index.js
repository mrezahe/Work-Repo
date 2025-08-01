const express = require('express');
const router = express.Router();
const RewardTransaction = require('../models/RewardTransaction');
// TODO: Add middleware for authentication and authorization

// Get reward transactions for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    // TODO: Add authorization check to ensure user can view their transactions
    const transactions = await RewardTransaction.find({ user: req.params.userId })
      .populate('referral'); // Populate referral details if needed

    res.status(200).json(transactions);
  } catch (error) {
    // TODO: Implement proper error handling middleware
    res.status(500).json({ error: error.message });
  }
});

// TODO: Add routes for viewing individual transactions, potentially filtering, etc.

module.exports = router;