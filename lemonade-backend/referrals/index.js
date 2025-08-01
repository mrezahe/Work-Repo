const express = require('express');
const router = express.Router();
const Referral = require('../models/Referral');
const User = require('../models/User');
const Job = require('../models/Job');
const RewardTransaction = require('../models/RewardTransaction');
const { authenticateToken, authorizeRoles } = require('../middleware/auth'); // Import middleware

// Create a new referral (requires authentication)
router.post('/', authenticateToken, async (req, res) => {
  try {
    // TODO: Add input validation
    // Ensure the referrer is the authenticated user
    if (req.user._id.toString() !== req.body.referrer) {
        return res.status(403).json({ message: 'You can only create referrals as yourself' });
    }

    // Ensure referredUser exists
    const referredUser = await User.findById(req.body.referredUser);
    if (!referredUser) {
      return res.status(404).json({ message: 'Referred user not found' });
    }

    // Optional: Check if job exists if provided
    if (req.body.job) {
      const job = await Job.findById(req.body.job);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
    }

    // TODO: Add logic to prevent duplicate referrals for the same user/job

    const newReferral = new Referral(req.body);
    await newReferral.save();

    // TODO: Implement logic to update referrer's referral count or status if needed

    res.status(201).json(newReferral);
  } catch (error) {
    // TODO: Implement proper error handling middleware
    res.status(500).json({ error: error.message });
  }
});

// Get referrals for a specific user (either as referrer or referred) (requires authentication and authorization)
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    // Authorization: Ensure user can only view their own referrals or if they have admin/special permissions
    if (req.user._id.toString() !== req.params.userId) {
        // TODO: Implement admin/special role check here
        return res.status(403).json({ message: 'You can only view your own referrals' });
    }

    const referrals = await Referral.find({
      $or: [
        { referrer: req.params.userId },
        { referredUser: req.params.userId },
      ],
    })
      .populate('referrer', 'name')
      .populate('referredUser', 'name')
      .populate('job', 'title');

    res.status(200).json(referrals);
  } catch (error) {
    // TODO: Implement proper error handling middleware
    res.status(500).json({ error: error.message });
  }
});

// TODO: Add routes to update referral status (e.g., when referred user is hired for a job)

// Placeholder route to update referral status (e.g., when referred user is hired) (requires authentication and authorization)
router.put('/:referralId/status', authenticateToken, authorizeRoles('Company', 'Job Poster', 'Admin'), async (req, res) => {
  try {
    // TODO: Add authorization checks to ensure the user has permission to update THIS referral's status
    // (e.g., the user is the job poster for the linked job, or an admin)

    const referral = await Referral.findById(req.params.referralId);

    if (!referral) {
      return res.status(404).json({ message: 'Referral not found' });
    }

    // TODO: Add input validation for the new status
    const newStatus = req.body.status;

    // Prevent updating status if it's already successful or rejected
    if (referral.status === 'Successful' || referral.status === 'Rejected') {
        return res.status(400).json({ message: 'Referral status cannot be updated once finalized' });
    }

    referral.status = newStatus;
    await referral.save();

    // Trigger reward distribution if the status is 'Successful'
    if (newStatus === 'Successful') {
      // TODO: Implement actual reward calculation logic (tiered rewards, etc.)
      const rewardAmount = 100; // Placeholder amount
      const rewardCurrency = 'AUD'; // Placeholder currency
      const rewardType = 'Fiat'; // Placeholder type

      const rewardTransaction = new RewardTransaction({
        user: referral.referrer, // The referrer receives the reward
        referral: referral._id,
        amount: rewardAmount,
        currency: rewardCurrency,
        type: rewardType,
        status: 'Pending', // Initial status is pending
      });

      await rewardTransaction.save();

      // TODO: Implement logic to initiate payout via Stripe or WalletConnect
      console.log(`Reward transaction created for referral ${referral._id}`);
    }

    res.status(200).json({ message: 'Referral status updated successfully', referral });
  } catch (error) {
    // TODO: Implement proper error handling middleware
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;