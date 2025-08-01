const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken, authorizeRoles } = require('../middleware/auth'); // Import middleware

// Get user profile (requires authentication)
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    // TODO: Add authorization check to ensure user can view this profile (e.g., their own or a public profile)
    // For now, any authenticated user can view any profile by ID

    const user = await User.findById(req.params.userId).select('-password'); // Exclude password hash
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // TODO: Implement logic for private profiles or data based on roles
    res.status(200).json(user);
  } catch (error) {
    // TODO: Implement proper error handling middleware
    res.status(500).json({ error: error.message });
  }
});

// TODO: Add routes for profile creation/update (maybe handled in auth for initial creation)
// TODO: Add routes for portfolio media upload

module.exports = router;