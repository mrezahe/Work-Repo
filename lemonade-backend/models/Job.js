const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  // Job details
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String }, // AI can help categorize
  skillsRequired: [{ type: String }], // AI can help match
  location: { type: String },
  salary: { type: String },
  jobType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Temporary'] },

  // Employer/Job Poster details
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // If posted by a company user

  // Application and referral details
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Referral' }], // TODO: Link to referral model

  // Status and Timestamps
  status: { type: String, enum: ['Open', 'Closed', 'Archived'], default: 'Open' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Job', jobSchema);