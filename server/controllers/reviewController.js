const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');

// @desc    Create a review
// @route   POST /api/reviews
exports.createReview = async (req, res) => {
  try {
    const { restaurant, rating, comment } = req.body;

    const existing = await Review.findOne({ user: req.user._id, restaurant });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this restaurant' });
    }

    const review = await Review.create({
      user: req.user._id,
      restaurant,
      rating,
      comment
    });

    // Update restaurant rating
    const reviews = await Review.find({ restaurant });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Restaurant.findByIdAndUpdate(restaurant, {
      rating: Math.round(avgRating * 10) / 10,
      numReviews: reviews.length
    });

    const populatedReview = await Review.findById(review._id).populate('user', 'name avatar');
    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for restaurant
// @route   GET /api/reviews/restaurant/:id
exports.getRestaurantReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ restaurant: req.params.id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
