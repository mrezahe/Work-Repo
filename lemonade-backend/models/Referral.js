const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  // Referrer and referred user
  referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referredUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Job related to the referral (optional)
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },

  // Referral status (e.g., Pending, Successful, Rejected)
  status: { type: String, enum: ['Pending', 'Successful', 'Rejected'], default: 'Pending' },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Referral', referralSchema);