const mongoose = require('mongoose');

const videoSessionSchema = new mongoose.Schema({
  // Users participating in the video session
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],

  // Optional: Link to a related job or chat session
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  // chatSession: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatSession' }, // TODO: Create ChatSession model

  // Session details (specific to WebRTC or Twilio)
  // sessionId: { type: String, required: true, unique: true }, // ID provided by the video service
  // token: { type: String }, // Token for joining the session
  // startTime: { type: Date },
  // endTime: { type: Date },

  // Status of the session (e.g., Pending, Active, Completed)
  status: { type: String, enum: ['Pending', 'Active', 'Completed', 'Cancelled'], default: 'Pending' },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('VideoSession', videoSessionSchema);