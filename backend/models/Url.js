const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  clicks: {
    type: Number,
    default: 0
  },
  password: {
    type: String
  },
  isProtected: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date
  },
  visitHistory: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    device: {
      type: String,
      default: 'Unknown'
    }
  }]
});

module.exports = mongoose.model('Url', urlSchema);
