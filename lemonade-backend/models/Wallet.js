const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  // User associated with the wallet
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Fiat balance (e.g., for Stripe payouts)
  fiatBalance: { type: Number, default: 0 },
  fiatCurrency: { type: String, default: 'AUD' },

  // Crypto wallet details (for WalletConnect/Metamask)
  cryptoAddress: { type: String }, // User's crypto wallet address
  // TODO: Consider storing more detailed wallet information or linking to a separate wallet service

  // Transaction history (could be a separate collection or linked here)
  // transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RewardTransaction' }], // Link to reward transactions

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Wallet', walletSchema);