const mongoose = require('mongoose');

const rewardTransactionSchema = new mongoose.Schema({
  // User who received the reward
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Referral that triggered the reward
  referral: { type: mongoose.Schema.Types.ObjectId, ref: 'Referral', required: true },

  // Reward details
  amount: { type: Number, required: true },
  currency: { type: String, required: true }, // e.g., 'AUD', 'ETH'
  type: { type: String, enum: ['Fiat', 'Crypto'], required: true },

  // Transaction status (e.g., Pending, Completed, Failed)
  status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },

  // Optional: Transaction ID from payment gateway (Stripe, WalletConnect)
  transactionId: { type: String },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('RewardTransaction', rewardTransactionSchema);