const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { authenticateToken, authorizeRoles } = require('../middleware/auth'); // Import middleware

// Create a new job post (requires authentication and specific roles)
router.post('/', authenticateToken, authorizeRoles('Company', 'Job Poster'), async (req, res) => {
  try {
    // TODO: Add input validation
    // Ensure the job is posted by the authenticated user (company or job poster)
    if (req.user.role !== 'Company' && req.user.role !== 'Job Poster') {
        return res.status(403).json({ message: 'Only companies or job posters can create jobs' });
    }

    const newJob = new Job({
        ...req.body,
        postedBy: req.user._id, // Set the poster to the authenticated user
        company: req.user.role === 'Company' ? req.user._id : undefined, // Link to company if the user is a company
    });

    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    // TODO: Implement proper error handling middleware
    res.status(500).json({ error: error.message });
  }
});

// Get all job posts (does not require authentication for now)
router.get('/', async (req, res) => {
  try {
    // TODO: Implement filtering, sorting, and pagination
    const jobs = await Job.find().populate('postedBy', 'name companyName'); // Populate poster details
    res.status(200).json(jobs);
  } catch (error) {
    // TODO: Implement proper error handling middleware
    res.status(500).json({ error: error.message });
  }
});

// Get a single job post by ID (does not require authentication for now)
router.get('/:jobId', async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId).populate('postedBy', 'name companyName');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    // TODO: Implement proper error handling middleware
    res.status(500).json({ error: error.message });
  }
});

// TODO: Add routes for updating and deleting job posts (require authentication and authorization)

module.exports = router;