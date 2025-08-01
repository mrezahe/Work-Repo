const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Basic authentication details
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Hashed password for email/password auth
  googleId: { type: String }, // Google OAuth ID
  linkedinId: { type: String }, // LinkedIn OAuth ID

  // Role-based access control
  role: { type: String, enum: ['Worker', 'Company', 'Job Poster'], required: true },

  // Profile details (common for all roles)
  name: { type: String, required: true },
  // profilePicture: { type: String }, // TODO: Implement image upload
  // portfolio: [{ type: String }], // TODO: Implement media upload

  // Worker-specific details
  skills: [{ type: String }], // AI can help categorize and tag these
  licenses: [{ type: String }],
  abn: { type: String },
  experience: { type: String }, // Could be structured later

  // Company/Job Poster-specific details
  companyName: { type: String },
  companyDescription: { type: String },

  // Referral and rewards
  referralCode: { type: String, unique: true }, // Auto-generated
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' }, // TODO: Link to wallet model

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Generate a unique referral code before saving the user
userSchema.pre('save', async function(next) {
  if (this.isNew) {
    this.referralCode = Math.random().toString(36).substring(2, 8).toUpperCase(); // Basic random code generation
    // TODO: Add a check to ensure the generated code is unique in the database
  }
  next();
});

module.exports = mongoose.model('User', userSchema);