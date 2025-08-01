const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  // User who is giving the rating
  rater: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // User who is being rated
  ratedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Rating value (e.g., 1-5 stars)
  rating: { type: Number, required: true, min: 1, max: 5 },

  // Optional: Comment with the rating
  comment: { type: String },

  // Optional: Job or interaction related to the rating
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  // TODO: Link to other relevant interactions (e.g., chat session)

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Rating', ratingSchema);