const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Referral = require('../models/Referral');
const bcrypt = require('bcrypt'); // TODO: Install bcrypt: npm install bcrypt
const jwt = require('jsonwebtoken'); // TODO: Install jsonwebtoken: npm install jsonwebtoken
const { authenticateToken } = require('../middleware/auth'); // Import middleware

// Basic user registration (email/password)
router.post('/register', async (req, res) => {
  try {
    // TODO: Add input validation

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // TODO: Configure salt rounds

    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    // Handle referral code if provided
    if (req.body.referredByCode) {
      const referrer = await User.findOne({ referralCode: req.body.referredByCode });
      if (referrer) {
        newUser.referredBy = referrer._id;
        // Create a new referral entry
        const newReferral = new Referral({
          referrer: referrer._id,
          referredUser: newUser._id, // Referred user's ID will be available after saving newUser
        });
        // Save the referral after the user is saved
        newUser.save().then(savedUser => {
          newReferral.referredUser = savedUser._id; // Set the referredUser ID
          newReferral.save();
        });

      } else {
        // TODO: Handle invalid referral code (e.g., return an error or ignore)
        console.log('Invalid referral code provided');
      }
    }

    if (!res.headersSent) { // Prevent sending multiple responses
      await newUser.save();
      // TODO: Implement JWT generation and return token
      // const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' }); // TODO: Configure expiresIn
      // res.status(201).json({ message: 'User registered successfully', token });
      res.status(201).json({ message: 'User registered successfully' });
    }

  } catch (error) {
    // TODO: Implement proper error handling middleware
    res.status(500).json({ error: error.message });
  }
});

// Basic user login (email/password)
router.post('/login', async (req, res) => {
  try {
    // TODO: Add input validation

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare provided password with hashed password in the database
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' }); // TODO: Configure expiresIn

    res.status(200).json({ token });

  } catch (error) {
    // TODO: Implement proper error handling middleware
    res.status(500).json({ error: error.message });
  }
});

// TODO: Add routes for Google and LinkedIn OAuth
// TODO: Implement refresh token logic

module.exports = router;