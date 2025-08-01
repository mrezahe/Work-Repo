const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  // User who created the post
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Content of the post
  text: { type: String },
  // media: [{ type: String }], // TODO: Implement media uploads (photos, videos)

  // Type of post (e.g., 'reel', 'story', 'update')
  type: { type: String, enum: ['reel', 'story', 'update', 'success_story'] },

  // Optional: Link to a related job or profile
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  // profile: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Engagement metrics
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // TODO: Create Comment model

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);