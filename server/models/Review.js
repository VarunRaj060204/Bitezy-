const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// One review per user per restaurant
reviewSchema.index({ user: 1, restaurant: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
