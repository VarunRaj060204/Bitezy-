const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  cuisine: [{
    type: String,
    trim: true
  }],
  image: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  deliveryTime: {
    type: String,
    default: '30-45 min'
  },
  deliveryFee: {
    type: Number,
    default: 2.99
  },
  minOrder: {
    type: Number,
    default: 10
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  openingHours: {
    type: String,
    default: '9:00 AM - 11:00 PM'
  },
  tags: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

restaurantSchema.index({ name: 'text', cuisine: 'text' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
